import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AppDatabase,
  BusinessInfo,
  Branding,
  HomepageConfig,
  Service,
  PortfolioItem,
  Review,
  QuoteRequest,
  SocialLinks,
  SeoSettings,
  AdminUser,
  SupportedLanguage,
} from './schema';
import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const BUNDLED_DB_FILE = path.join(DATA_DIR, 'store.json');
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const ACTIVE_DB_FILE = IS_SERVERLESS ? path.join('/tmp', 'store.json') : BUNDLED_DB_FILE;

// Security helper: hash password with salt (100,000 iterations of PBKDF2 SHA-512)
export function hashPassword(password: string, salt?: string, iterations = 100000): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, iterations, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const hashBuf = Buffer.from(hash, 'hex');
    // Check 100,000 iterations first
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    if (hashBuf.length === testHash.length && crypto.timingSafeEqual(hashBuf, testHash)) {
      return true;
    }
    // Fallback check for legacy 10,000 iterations
    const legacyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    if (hashBuf.length === legacyHash.length && crypto.timingSafeEqual(hashBuf, legacyHash)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

const defaultAdminPassword = hashPassword('Chintamani@1999', undefined, 100000);

export const initialBusinessInfo: BusinessInfo = {
  name: 'NEW CHINTAMANI PRINTING PRESS',
  owner: 'Mr. Prakash Devendra Jain',
  establishedYear: 1999,
  tagline_en: 'Quality Printing. Trusted Since 1999.',
  tagline_mr: 'उत्कृष्ट मुद्रण. १९९९ पासून विश्वासार्ह सेवा.',
  tagline_hi: 'उत्कृष्ट छपाई. १९९९ से भरोसेमंद सेवा.',
  address: 'Shrikant Talkies Road, Bus Stand',
  taluka: 'Mehekar',
  district: 'Buldhana',
  state: 'Maharashtra',
  pincode: '443303',
  phone1: '9421396905',
  phone2: '9834853851',
  whatsapp: '9421396905',
  email: 'chintamanidongaon@gmail.com',
  businessHours_en: '8:00 AM – 8:30 PM (All Days)',
  businessHours_mr: 'सकाळी ८:०० ते रात्री ८:३० (सर्व दिवस)',
  businessHours_hi: 'सुबह ८:०० से रात ८:३० (सभी दिन)',
  googleMapsUrl: '',
  ownerTitle_en: 'Founder & Proprietor',
  ownerTitle_mr: 'संस्थापक व संचालक',
  ownerTitle_hi: 'संस्थापक व संचालक',
  ownerBio_en: 'Since founding New Chintamani Printing Press in 1999, our commitment has always been simple: treat every print job—whether a family wedding invitation, business visiting cards, or local event banners—with utmost care, honest pricing, and personal dedication. For over 25 years, our shop on Shrikant Talkies Road has been a trusted partner to families and businesses across Dongaon, Mehekar, and Buldhana.',
  ownerBio_mr: '१९९९ मध्ये न्यू चिंतामणी प्रिंटिंग प्रेसची स्थापना केल्यापासून आमचा एकच ध्यास राहिला आहे: लग्नपत्रिका असो, व्हिजिटिंग कार्ड असो की सार्वजनिक फ्लेक्स बॅनर — प्रत्येक काम पूर्ण विश्वासाने, वाजवी दरात आणि वेळेत देणे. श्रीकांत टॉकीज रोडवरील आमचे मुद्रणालय गेल्या २५ वर्षांहून अधिक काळ डोणगाव व परिसरातील जनतेच्या विश्वासास पात्र ठरले आहे.',
  ownerBio_hi: '१९९९ में न्यू चिंतामणी प्रिंटिंग प्रेस की स्थापना के समय से हमारा यही संकल्प रहा है कि हर काम—चाहे शादी के कार्ड हों, विज़िटिंग कार्ड्स या फ्लेक्स बैनर—पूरी ईमानदारी, उचित मूल्य और व्यक्तिगत समर्पण के साथ समय पर पूरा किया जाए। २५ से अधिक वर्षों से डोणगांव और मेहकर की जनता का यह अटूट विश्वास ही हमारी सबसे बड़ी पूँजी है।',
  ownerPhotoUrl: '/assets/owner-prakash-jain.jpg',
};

export const initialBranding: Branding = {
  logoUrl: null,
  darkLogoUrl: null,
  useDefaultVectorLogo: true,
  altText: 'New Chintamani Printing Press Logo',
};

export const initialHomepage: HomepageConfig = {
  hero: {
    badge_en: '✦ 25+ Years of Printing Excellence in Dongaon',
    badge_mr: '✦ डोणगावमध्ये २५+ वर्षांचा मुद्रण अनुभव व विश्वास',
    badge_hi: '✦ डोणगांव में २५+ वर्षों का मुद्रण अनुभव और विश्वास',
    title_en: 'Quality Printing. Trusted Craftsmanship Since 1999.',
    title_mr: 'उत्कृष्ट मुद्रण. १९९९ पासून विश्वासार्ह सेवा आणि आधुनिक डिझायनिंग.',
    title_hi: 'उत्कृष्ट छपाई. १९९९ से भरोसेमंद सेवा और आधुनिक डिज़ाइनिंग.',
    subtitle_en: 'Providing premium offset, digital, flex printing and creative designing services in Dongaon, Mehekar and across Buldhana district.',
    subtitle_mr: 'डोणगाव, मेहकर आणि संपूर्ण बुलढाणा जिल्ह्यासाठी दर्जेदार ऑफसेट, डिजिटल, फ्लेक्स प्रिंटिंग आणि नाविन्यपूर्ण डिझायनिंग सेवा.',
    subtitle_hi: 'डोणगांव, मेहकर और पूरे बुलढाणा जिले के लिए उच्च कोटि की ऑफसेट, डिजिटल, फ्लेक्स प्रिंटिंग और डिज़ाइनिंग सेवाएं.',
    primaryCtaText_en: 'Get a Free Quote',
    primaryCtaText_mr: 'कोटेशन मिळवा',
    primaryCtaText_hi: 'कोटेशन प्राप्त करें',
    primaryCtaLink: '/quote',
    secondaryCtaText_en: 'WhatsApp Us',
    secondaryCtaText_mr: 'व्हॉट्सॲप करा',
    secondaryCtaText_hi: 'व्हाट्सएप करें',
    secondaryCtaLink: 'https://wa.me/919421396905',
    heroImageUrl: '/assets/hero-printing-showcase.jpg',
  },
  stats: [
    {
      id: 'stat-1',
      value: '25+',
      label_en: 'Years Experience',
      label_mr: 'वर्षांचा अनुभव',
      label_hi: 'वर्षों का अनुभव',
      description_en: 'Serving since 1999 with dedication',
      description_mr: '१९९९ पासून अखंड व विश्वासू सेवा',
      description_hi: '१९९९ से निरंतर समर्पित सेवा',
    },
    {
      id: 'stat-2',
      value: '1999',
      label_en: 'Established Year',
      label_mr: 'स्थापना वर्ष',
      label_hi: 'स्थापना वर्ष',
      description_en: 'Founded by Mr. Prakash Devendra Jain',
      description_mr: 'श्री प्रकाश देवेंद्र जैन यांच्या हस्ते स्थापित',
      description_hi: 'श्री प्रकाश देवेंद्र जैन द्वारा स्थापित',
    },
    {
      id: 'stat-3',
      value: '30+',
      label_en: 'Printing Solutions',
      label_mr: 'प्रिंटिंग सोल्यूशन्स',
      label_hi: 'प्रिंटिंग सॉल्यूशंस',
      description_en: 'Cards, books, banners, bags & more',
      description_mr: 'कार्ड्स, पुस्तके, बॅनर, पिशव्या व बरेच काही',
      description_hi: 'कार्ड, पुस्तकें, बैनर, बैग और अन्य',
    },
    {
      id: 'stat-4',
      value: '100%',
      label_en: 'Customer Focus',
      label_mr: 'ग्राहक समाधान',
      label_hi: 'ग्राहक संतुष्टि',
      description_en: 'Quality, accuracy & transparent pricing',
      description_mr: 'दर्जेदार काम, अचूकता आणि परवडणारे दर',
      description_hi: 'गुणवत्ता, सटीकता और किफायती मूल्य',
    },
  ],
  timeline: [
    {
      year: '1999',
      title_en: 'Foundation in Dongaon',
      title_mr: 'डोणगाव येथे स्थापना',
      title_hi: 'डोणगांव में स्थापना',
      desc_en: 'Established by Mr. Prakash Devendra Jain on Shrikant Talkies Road with a mission to deliver trustworthy printing for the local community.',
      desc_mr: 'श्री प्रकाश देवेंद्र जैन यांनी स्थानिक नागरिकांना विश्वासार्ह मुद्रण सेवा देण्याच्या उद्देशाने श्रीकांत टॉकीज रोडवर सुरुवात केली.',
      desc_hi: 'श्री प्रकाश देवेंद्र जैन द्वारा स्थानीय लोगों को विश्वसनीय मुद्रण सेवा प्रदान करने के उद्देश्य से शुरुआत हुई.',
    },
    {
      year: '2008',
      title_en: 'Expansion into Commercial & Wedding Printing',
      title_mr: 'व्यावसायिक व लग्नपत्रिका मुद्रण विस्तार',
      title_hi: 'व्यावसायिक और विवाह पत्रिका विस्तार',
      desc_en: 'Introduced specialized wedding card collections, multi-color visiting cards, bill books, and educational certificates.',
      desc_mr: 'लग्नपत्रिकांचे खास संग्रह, मल्टी-कलर व्हिजिटिंग कार्ड्स, बिल बुक्स आणि प्रमाणपत्र मुद्रण सुरू केले.',
      desc_hi: 'विवाह पत्रिकाओं का विशेष संग्रह, मल्टी-कलर कार्ड, बिल बुक्स और प्रमाणपत्र मुद्रण शुरू किया.',
    },
    {
      year: '2016',
      title_en: 'Modern Digital & Flex Infrastructure',
      title_mr: 'आधुनिक डिजिटल व फ्लेक्स सुविधा',
      title_hi: 'आधुनिक डिजिटल और फ्लेक्स सुविधाएं',
      desc_en: 'Upgraded with high-speed digital printing, flex banners, lamination, and graphic designing workstations.',
      desc_mr: 'हाय-स्पीड डिजिटल प्रिंटिंग, फ्लेक्स बॅनर, लॅमिनेशन आणि ग्राफिक डिझायनिंग प्रणाली सज्ज केली.',
      desc_hi: 'हाई-स्पीड डिजिटल प्रिंटिंग, फ्लेक्स बैनर, लेमिनेशन और ग्राफिक डिज़ाइनिंग प्रणाली शामिल की.',
    },
    {
      year: 'Today',
      title_en: 'A Trusted Digital & Offset Benchmark',
      title_mr: 'विश्वासार्ह आधुनिक मुद्रण केंद्र',
      title_hi: 'भरोसेमंद आधुनिक मुद्रण केंद्र',
      desc_en: 'Combining over two decades of heritage with contemporary digital precision, personalized service, and fast delivery.',
      desc_mr: 'दोन दशकांहून अधिक अनुभव आणि आधुनिक तंत्रज्ञानाचा सुरेख संगम, जलद सेवा आणि उत्कृष्ट दर्जा.',
      desc_hi: 'दो दशकों से अधिक का अनुभव और आधुनिक तकनीक का संगम, त्वरित सेवा और श्रेष्ठ गुणवत्ता.',
    },
  ],
  showStats: true,
  showTimeline: true,
  showFeaturedServices: true,
  showWhyChooseUs: true,
  showTopWorks: true,
  showReviews: true,
  showQuoteBanner: true,
};

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    slug: 'visiting-cards',
    name_en: 'Visiting Cards / Business Cards',
    name_mr: 'व्हिजिटिंग कार्ड्स / व्यवसाय कार्ड',
    name_hi: 'विज़िटिंग कार्ड्स / बिज़नेस कार्ड्स',
    desc_en: 'High-quality matt, gloss, velvet touch, and textured visiting cards that make an indelible professional impression.',
    desc_mr: 'मॅट, ग्लॉस, टेक्सचर्ड आणि दर्जेदार व्हिजिटिंग कार्ड्स, ज्यामुळे तुमच्या व्यवसायाची वेगळी ओळख निर्माण होते.',
    desc_hi: 'मैट, ग्लॉस, टेक्सचर्ड और उच्च गुणवत्ता वाले बिज़नेस कार्ड्स जो आपके व्यवसाय को अलग पहचान देते हैं.',
    category: 'printing',
    icon: 'credit-card',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'srv-2',
    slug: 'wedding-invitations',
    name_en: 'Wedding Invitation Cards (लग्नपत्रिका)',
    name_mr: 'लग्नपत्रिका मुद्रण (पारंपरिक व आधुनिक)',
    name_hi: 'विवाह निमंत्रण पत्र (शादी के कार्ड)',
    desc_en: 'Elegant traditional, royal, laser-cut, and designer wedding cards with personalized typography in Marathi, Hindi & English.',
    desc_mr: 'पारंपरिक, रॉयल, लेझर-कट आणि आकर्षक डिझायनर लग्नपत्रिका, मराठी, हिंदी व इंग्रजी अक्षरांमध्ये सुंदर मांडणी.',
    desc_hi: 'पारंपरिक, शाही, लेज़र-कट और आकर्षक डिज़ाइनर शादी के कार्ड, सुंदर अक्षरों और डिज़ाइन के साथ.',
    category: 'printing',
    icon: 'heart',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'srv-3',
    slug: 'birthday-invitations',
    name_en: 'Birthday & Anniversary Invitations',
    name_mr: 'वाढदिवस व शुभकार्यांचे निमंत्रण पत्र',
    name_hi: 'जन्मदिन व शुभ प्रसंग निमंत्रण पत्र',
    desc_en: 'Vibrant custom invitations for birthdays, housewarming (वास्तुशांती), naming ceremonies, and family celebrations.',
    desc_mr: 'वाढदिवस, वास्तुशांती, नामकरण सोहळा आणि सर्व कौटुंबिक शुभकार्यांसाठी आकर्षक निमंत्रण पत्रिका.',
    desc_hi: 'जन्मदिन, वास्तुशांति, नामकरण संस्कार और पारिवारिक उत्सवों के लिए आकर्षक निमंत्रण पत्र.',
    category: 'printing',
    icon: 'gift',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'srv-4',
    slug: 'brochures-flyers',
    name_en: 'Brochures, Pamphlets & Flyers',
    name_mr: 'माहितीपत्रके, पॅम्प्लेट्स आणि फ्लायर्स',
    name_hi: 'विवरणिका, पैम्फलेट्स और प्रचार पत्रक',
    desc_en: 'Single & multi-fold promotional brochures, newspaper inserts, and vibrant pamphlets for business marketing.',
    desc_mr: 'व्यवसाय जाहिरातीसाठी सिंगल व मल्टी-फोल्ड माहितीपत्रके, वर्तमानपत्र इन्सर्ट्स आणि रंगीबेरंगी पॅम्प्लेट्स.',
    desc_hi: 'व्यापार प्रचार के लिए सिंगल व मल्टी-फोल्ड ब्रोशर, अखबार के पर्चे और रंगीन पैम्फलेट्स.',
    category: 'printing',
    icon: 'file-text',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 4,
  },
  {
    id: 'srv-5',
    slug: 'flex-banners',
    name_en: 'Flex Banners & Hoardings',
    name_mr: 'फ्लेक्स बॅनर आणि होर्डिंग्स',
    name_hi: 'फ्लेक्स बैनर और होर्डिंग्स',
    desc_en: 'Durable weather-resistant flex banners for events, shop boards, political rallies, festivals, and business advertising.',
    desc_mr: 'दुकान फलक, उत्सव, राजकीय सभा आणि जाहिरातींसाठी उत्कृष्ट दर्जाचे व टिकाऊ फ्लेक्स बॅनर्स.',
    desc_hi: 'दुकानों के बोर्ड, उत्सव, आयोजनों और प्रचार के लिए टिकाऊ और स्पष्ट फ्लेक्स बैनर.',
    category: 'printing',
    icon: 'layout',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 5,
  },
  {
    id: 'srv-6',
    slug: 'bill-books',
    name_en: 'Bill Books, Receipt Books & Challans',
    name_mr: 'बिल बुक्स, पावती पुस्तके व चलान',
    name_hi: 'बिल बुक्स, रसीद कट्टे और चालान',
    desc_en: 'Numbered, carbonless duplicate/triplicate bill books, tax invoices, and payment receipts with clean binding.',
    desc_mr: 'क्रमांकित, कार्बनलेस डुप्लिकेट/ट्रिप्लिकेट बिल बुक्स, टॅक्स इनव्हॉइस आणि मजबूत बाईंडिंगसह पावत्या.',
    desc_hi: 'क्रमांकित, कार्बनलेस डुप्लिकेट/ट्रिप्लिकेट बिल बुक्स, टैक्स इनवॉइस और मजबूत बाइंडिंग.',
    category: 'printing',
    icon: 'book',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 6,
  },
  {
    id: 'srv-7',
    slug: 'carry-bags',
    name_en: 'Non-Woven Carry Bag Printing',
    name_mr: 'नॉन-वोव्हन कापडी कॅरी बॅग प्रिंटिंग',
    name_hi: 'नॉन-वोवन कैरी बैग प्रिंटिंग',
    desc_en: 'Eco-friendly printed shopping and boutique carry bags customized with your shop branding and contact info.',
    desc_mr: 'पर्यावरणपूरक कापडी पिशव्यांवर दुकानाचे नाव, लोगो आणि संपर्क क्रमांकासह सुंदर छपाई.',
    desc_hi: 'पर्यावरण अनुकूल थैलों पर दुकान का नाम, लोगो और विवरण की आकर्षक छपाई.',
    category: 'printing',
    icon: 'shopping-bag',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 7,
  },
  {
    id: 'srv-8',
    slug: 'stickers-labels',
    name_en: 'Stickers & Product Labels',
    name_mr: 'स्टिकर्स आणि प्रॉडक्ट लेबल्स',
    name_hi: 'स्टिकर्स और प्रोडक्ट लेबल्स',
    desc_en: 'Die-cut paper and vinyl adhesive stickers for packaging, jars, bottles, address labels, and promotional branding.',
    desc_mr: 'पॅकेजिंग, बाटल्या, पत्ता लेबल्स आणि जाहिरातींसाठी मजबूत चिकटणारे दर्जेदार स्टिकर्स.',
    desc_hi: 'पैकेजिंग, बोतलों, डिब्बों और ब्रांडिंग के लिए उच्च गुणवत्ता वाले स्टीकर्स.',
    category: 'printing',
    icon: 'tag',
    featured: true,
    comingSoon: false,
    visible: true,
    sortOrder: 8,
  },
  {
    id: 'srv-9',
    slug: 'graphic-designing',
    name_en: 'Creative Graphic Designing',
    name_mr: 'नाविन्यपूर्ण ग्राफिक डिझायनिंग',
    name_hi: 'रचनात्मक ग्राफिक डिज़ाइनिंग',
    desc_en: 'Logo creation, brand layouts, social media posters, typography arrangement, and custom artwork.',
    desc_mr: 'लोगो निर्मिती, ब्रँड लेआउट, सोशल मीडिया पोस्टर्स आणि सुबक अक्षरांची कलात्मक मांडणी.',
    desc_hi: 'लोगो निर्माण, ब्रांड लेआउट, सोशल मीडिया पोस्टर्स और कलात्मक डिज़ाइनिंग.',
    category: 'designing',
    icon: 'pen-tool',
    featured: false,
    comingSoon: false,
    visible: true,
    sortOrder: 9,
  },
  {
    id: 'srv-10',
    slug: 'dtp-typing',
    name_en: 'DTP / Marathi & Hindi Typing',
    name_mr: 'डीटीपी / मराठी, हिंदी व इंग्रजी टायपिंग',
    name_hi: 'डीटीपी / मराठी, हिंदी व अंग्रेजी टाइपिंग',
    desc_en: 'Fast, accurate typing for agreements, project reports, notices, government forms, and publication manuscripts.',
    desc_mr: 'करारपत्रे, प्रकल्प अहवाल, जाहीर नोटीस, अर्ज आणि पुस्तकांसाठी अचूक व जलद टायपिंग.',
    desc_hi: 'अनुबंध पत्र, प्रोजेक्ट रिपोर्ट्स, सार्वजनिक सूचना और पुस्तकों की सटीक टाइपिंग.',
    category: 'designing',
    icon: 'type',
    featured: false,
    comingSoon: false,
    visible: true,
    sortOrder: 10,
  },
  {
    id: 'srv-11',
    slug: 'xerox-binding-lamination',
    name_en: 'Color Xerox, Spiral Binding & Lamination',
    name_mr: 'कलर झेरॉक्स, स्पायरलबाइंडिंग व लॅमिनेशन',
    name_hi: 'कलर ज़ेरॉक्स, स्पाइरल बाइंडिंग और लेमिनेशन',
    desc_en: 'Crisp color & black/white photocopy, document scanning, document thermal lamination, and heavy-duty spiral binding.',
    desc_mr: 'उत्कृष्ट कलर व ब्लॅक/व्हाईट झेरॉक्स, स्कॅनिंग, सुरक्षित लॅमिनेशन आणि मजबूत स्पायरल बाईंडिंग.',
    desc_hi: 'स्पष्ट कलर व ब्लैक/व्हाइट ज़ेरॉक्स, स्कैनिंग, लेमिनेशन और स्पाइरल बाइंडिंग.',
    category: 'other',
    icon: 'printer',
    featured: false,
    comingSoon: false,
    visible: true,
    sortOrder: 11,
  },
  {
    id: 'srv-12',
    slug: 'custom-tshirt-mug',
    name_en: 'T-Shirt & Mug Sublimation Printing',
    name_mr: 'टी-शर्ट व मग प्रिंटिंग (लवकरच उपलब्ध)',
    name_hi: 'टी-शर्ट और मग प्रिंटिंग (शीघ्र उपलब्ध)',
    desc_en: 'Personalized gift mug printing, corporate branded t-shirts, and team uniforms coming soon to New Chintamani Printing Press.',
    desc_mr: 'भेटवस्तूंसाठी पर्सनलाईझ्ड मग, टी-शर्ट्स आणि युनिफॉर्म प्रिंटिंग सेवा लवकरच सुरू होत आहे.',
    desc_hi: 'उपहार हेतु मग प्रिंटिंग, टी-शर्ट्स और यूनिफॉर्म प्रिंटिंग सेवा शीघ्र उपलब्ध होगी.',
    category: 'coming-soon',
    icon: 'sparkles',
    featured: false,
    comingSoon: true,
    visible: true,
    sortOrder: 12,
  },
];

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title_en: 'Royal Gold Foil Wedding Invitation',
    title_mr: 'शाही सुवर्ण फॉइल लग्नपत्रिका',
    title_hi: 'शाही स्वर्ण फॉइल विवाह पत्रिका',
    desc_en: 'Exquisite embossed maroon cardstock with metallic gold foil stamping and Devanagari calligraphy.',
    desc_mr: 'मॅरून कार्डस्टॉकवर सोनेरी फॉइल अक्षरांसह नक्षीकाम केलेली शाही लग्नपत्रिका.',
    desc_hi: 'मैरून कार्डस्टॉक पर सुनहरी फॉइल और सुंदर अक्षरों से सजी शाही विवाह पत्रिका.',
    category: 'wedding',
    imageUrl: '/assets/portfolio/wedding-card-sample-1.jpg',
    featured: true,
    topWork: true,
    visible: true,
    sortOrder: 1,
  },
  {
    id: 'port-2',
    title_en: 'Premium Velvet Finish Business Card',
    title_mr: 'प्रीमियम मखमली फिनिश व्हिजिटिंग कार्ड',
    title_hi: 'प्रीमियम वेलवेट फिनिश विज़िटिंग कार्ड',
    desc_en: '400 GSM heavy board with soft-touch velvet lamination and spot UV logo detailing.',
    desc_mr: '४०० जीएसएम बोर्डवर मखमली स्पर्श लॅमिनेशन व स्पॉट यूव्ही लोगो चमक.',
    desc_hi: '४०० जीएसएम बोर्ड पर सॉफ्ट-टच लेमिनेशन और स्पॉट यूवी लोगो डिटेलिंग.',
    category: 'visiting-cards',
    imageUrl: '/assets/portfolio/visiting-card-sample-1.svg',
    featured: true,
    topWork: true,
    visible: true,
    sortOrder: 2,
  },
  {
    id: 'port-3',
    title_en: 'Multi-Color Event Banner & Hoarding',
    title_mr: 'मल्टी-कलर महोत्सव व जाहिरात बॅनर',
    title_hi: 'मल्टी-कलर महोत्सव और प्रचार बैनर',
    desc_en: 'High-resolution all-weather star flex banner with vibrant color saturation for local festival.',
    desc_mr: 'स्थानिक उत्सवासाठी उच्च दर्जाचे, उन्हा-पावसात टिकणारे चमकदार स्टार फ्लेक्स बॅनर.',
    desc_hi: 'स्थानीय उत्सव हेतु उच्च गुणवत्ता वाला मौसम-प्रतिरोधी स्टार फ्लेक्स बैनर.',
    category: 'promotional',
    imageUrl: '/assets/portfolio/banner-sample-1.svg',
    featured: true,
    topWork: true,
    visible: true,
    sortOrder: 3,
  },
  {
    id: 'port-4',
    title_en: 'Numbered Duplicate Tax Invoice Book',
    title_mr: 'क्रमांकित डुप्लिकेट टॅक्स इनव्हॉइस बुक',
    title_hi: 'क्रमांकित डुप्लिकेट टैक्स इनवॉइस बुक',
    desc_en: 'Carbonless NCR paper with clean perforation and foil stamped durable protective cover.',
    desc_mr: 'कार्बनलेस कागद, स्वच्छ छिद्रण (perforation) आणि मजबूत संरक्षणात्मक बांधणी.',
    desc_hi: 'कार्बनलेस कागज़, स्पष्ट परफोरशन और टिकाऊ जिल्द के साथ बिल बुक.',
    category: 'business-printing',
    imageUrl: '/assets/portfolio/bill-book-sample-1.svg',
    featured: true,
    topWork: true,
    visible: true,
    sortOrder: 4,
  },
  {
    id: 'port-5',
    title_en: 'Custom Branded Non-Woven Carry Bags',
    title_mr: 'दुकानाचे नाव मुद्रित कापडी पिशव्या',
    title_hi: 'कस्टम ब्रांडेड कपड़े के कैरी बैग',
    desc_en: 'D-cut eco-friendly fabric shopping bags screen-printed with shop details in Dongaon.',
    desc_mr: 'डोणगाव परिसरातील कापड व किराणा दुकानांसाठी स्क्रीन-प्रिंटेड मजबूत पर्यावरणपूरक पिशव्या.',
    desc_hi: 'दुकानों के लिए स्क्रीन-प्रिंटेड टिकाऊ और पर्यावरण अनुकूल थैले.',
    category: 'packaging',
    imageUrl: '/assets/portfolio/carry-bag-sample-1.svg',
    featured: true,
    topWork: false,
    visible: true,
    sortOrder: 5,
  },
  {
    id: 'port-6',
    title_en: 'Trifold Corporate Product Brochure',
    title_mr: 'त्रि-घडी उत्पादन माहितीपत्रक',
    title_hi: 'त्रि-फोल्ड उत्पाद विवरणिका ब्रोशर',
    desc_en: '170 GSM art paper with gloss coating showcasing agricultural equipment and services.',
    desc_mr: 'कृषी उपकरणे आणि सेवांसाठी १७० जीएसएम आर्ट पेपरवरील चमकदार माहितीपत्रक.',
    desc_hi: 'कृषि उपकरणों और सेवाओं के लिए १७० जीएसएम आर्ट पेपर पर ग्लॉस ब्रोशर.',
    category: 'promotional',
    imageUrl: '/assets/portfolio/brochure-sample-1.svg',
    featured: false,
    topWork: false,
    visible: true,
    sortOrder: 6,
  },
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Sanjay Deshmukh',
    location: 'Dongaon',
    rating: 5,
    reviewText: 'We got our family wedding invitation cards printed from New Chintamani Printing Press. Mr. Prakash Jain gave us personal attention, suggested beautiful Marathi wordings, and delivered 500 cards well before the scheduled date. Superb print clarity and very reasonable rates!',
    language: 'en',
    status: 'approved',
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'rev-2',
    customerName: 'गजानन बोरकर',
    location: 'मेहकर',
    rating: 5,
    reviewText: 'गेल्या १० वर्षांपासून आमच्या दुकानाचे बिल बुक्स, व्हिजिटिंग कार्ड्स आणि फ्लेक्स बॅनर आम्ही चिंतामणी प्रिंटिंग प्रेसकडूनच करून घेतो. काम नेहमी वेळेत आणि दर्जेदार असते. प्रकाश काकांचा स्वभाव अतिशय सहकार्याचा आहे.',
    language: 'mr',
    status: 'approved',
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'rev-3',
    customerName: 'राजेश शर्मा',
    location: 'डोणगांव',
    rating: 5,
    reviewText: 'बहुत ही भरोसेमंद प्रिंटिंग शॉप है। यहाँ कार्ड्स की डिज़ाइनिंग और प्रिंट क्वालिटी बहुत शानदार मिलती है। दाम भी बाजार से काफी वाजिब हैं।',
    language: 'hi',
    status: 'approved',
    featured: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
];

export const initialQuotes: QuoteRequest[] = [
  {
    id: 'CP-2026-001',
    customerName: 'Ramesh Patil',
    phone: '9822001122',
    whatsapp: '9822001122',
    email: 'ramesh.patil@example.com',
    service: 'Visiting Cards / Business Cards',
    quantity: '1000 Cards',
    sizeSpecification: 'Standard 3.5 x 2 inch, Matt lamination',
    requirements: 'Need two-sided printing with company logo and QR code. Please provide best pricing for 1000 qty.',
    preferredContact: 'WhatsApp',
    status: 'New',
    internalNotes: 'Customer inquired about fast delivery in Dongaon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

export const initialSocialLinks: SocialLinks = {
  instagram: '',
  facebook: '',
  youtube: '',
  whatsappChannel: 'https://wa.me/919421396905',
};

export const initialSeo: SeoSettings = {
  siteTitle_en: 'New Chintamani Printing Press | Trusted Printing Since 1999 | Dongaon',
  siteTitle_mr: 'न्यू चिंतामणी प्रिंटिंग प्रेस | १९९९ पासून विश्वासार्ह मुद्रण | डोणगाव',
  siteTitle_hi: 'न्यू चिंतामणी प्रिंटिंग प्रेस | १९९९ से भरोसेमंद मुद्रण | डोणगांव',
  metaDescription_en: 'New Chintamani Printing Press in Dongaon (Mehekar, Buldhana) offers quality visiting cards, wedding invitations, flex banners, bill books, and creative designing since 1999.',
  metaDescription_mr: 'न्यू चिंतामणी प्रिंटिंग प्रेस, डोणगाव (ता. मेहकर, जि. बुलढाणा). व्हिजिटिंग कार्ड, लग्नपत्रिका, फ्लेक्स बॅनर, बिल बुक्स व डिझायनिंगची १९९९ पासूनची दर्जेदार सेवा.',
  metaDescription_hi: 'न्यू चिंतामणी प्रिंटिंग प्रेस, डोणगांव (तहसील मेहकर, जिला बुलढाणा). विज़िटिंग कार्ड, शादी के कार्ड, फ्लेक्स बैनर और डिज़ाइनिंग की १९९९ से विश्वसनीय सेवा.',
  keywords_en: 'Printing Press in Dongaon, Printing Shop Dongaon, Visiting Card Printing Dongaon, Wedding Card Printing Dongaon, Flex Printing Mehekar, Printing Buldhana',
  keywords_mr: 'चिंतामणी प्रिंटिंग प्रेस डोणगाव, लग्नपत्रिका मुद्रण डोणगाव, व्हिजिटिंग कार्ड प्रिंटिंग मेहकर, फ्लेक्स प्रिंटिंग बुलढाणा',
  keywords_hi: 'प्रिंटिंग प्रेस डोणगांव, शादी के कार्ड प्रिंटिंग डोणगांव, विज़िटिंग कार्ड मेहकर, फ्लेक्स प्रिंटिंग बुलढाणा',
  ogImage: '/assets/og-image.png',
};

export const initialAdmin: AdminUser = {
  id: 'admin-1',
  email: 'chintamanidongaon@gmail.com',
  passwordHash: defaultAdminPassword.hash,
  salt: defaultAdminPassword.salt,
  tokenVersion: 1,
};

export const initialTranslations: Record<string, Record<SupportedLanguage, string>> = {
  navHome: { en: 'Home', mr: 'मुख्यपृष्ठ', hi: 'होम' },
  navAbout: { en: 'About Us', mr: 'आमच्याबद्दल', hi: 'हमारे बारे में' },
  navServices: { en: 'Services', mr: 'सेवा', hi: 'सेवाएं' },
  navPortfolio: { en: 'Our Work', mr: 'आमचे काम', hi: 'हमारा कार्य' },
  navReviews: { en: 'Reviews', mr: 'अभिप्राय', hi: 'प्रतिक्रियाएं' },
  navContact: { en: 'Contact', mr: 'संपर्क', hi: 'संपर्क' },
  navQuote: { en: 'Get a Quote', mr: 'कोटेशन मिळवा', hi: 'कोटेशन प्राप्त करें' },
  btnCallNow: { en: 'Call Now', mr: 'कॉल करा', hi: 'कॉल करें' },
  btnWhatsApp: { en: 'WhatsApp Us', mr: 'व्हॉट्सॲप करा', hi: 'व्हाट्सएप करें' },
  btnSubmit: { en: 'Submit Request', mr: 'विनंती पाठवा', hi: 'अनुरोध भेजें' },
  footerRights: { en: 'All rights reserved.', mr: 'सर्व हक्क राखीव.', hi: 'सर्वाधिकार सुरक्षित.' },
};

export function getDefaultDatabase(): AppDatabase {
  return {
    businessInfo: initialBusinessInfo,
    branding: initialBranding,
    homepage: initialHomepage,
    services: initialServices,
    portfolio: initialPortfolio,
    reviews: initialReviews,
    quotes: initialQuotes,
    socialLinks: initialSocialLinks,
    seo: initialSeo,
    admin: initialAdmin,
    translations: initialTranslations,
  };
}

let memoryDb: AppDatabase | null = null;

// ============================================================================
// SUPABASE ROW TRANSFORMERS
// ============================================================================

export function rowToService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_mr: row.name_mr,
    name_hi: row.name_hi,
    desc_en: row.desc_en,
    desc_mr: row.desc_mr,
    desc_hi: row.desc_hi,
    category: row.category,
    icon: row.icon,
    imageUrl: row.image_url || undefined,
    featured: Boolean(row.featured),
    comingSoon: Boolean(row.coming_soon),
    visible: Boolean(row.visible),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export function serviceToRow(item: Service): Record<string, any> {
  return {
    id: item.id,
    slug: item.slug,
    name_en: item.name_en,
    name_mr: item.name_mr,
    name_hi: item.name_hi,
    desc_en: item.desc_en,
    desc_mr: item.desc_mr,
    desc_hi: item.desc_hi,
    category: item.category,
    icon: item.icon,
    image_url: item.imageUrl || null,
    featured: item.featured,
    coming_soon: item.comingSoon,
    visible: item.visible,
    sort_order: item.sortOrder,
  };
}

export function rowToPortfolio(row: any): PortfolioItem {
  return {
    id: row.id,
    title_en: row.title_en,
    title_mr: row.title_mr,
    title_hi: row.title_hi,
    desc_en: row.desc_en,
    desc_mr: row.desc_mr,
    desc_hi: row.desc_hi,
    category: row.category,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url || undefined,
    featured: Boolean(row.featured),
    topWork: Boolean(row.top_work),
    visible: Boolean(row.visible),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export function portfolioToRow(item: PortfolioItem): Record<string, any> {
  return {
    id: item.id,
    title_en: item.title_en,
    title_mr: item.title_mr,
    title_hi: item.title_hi,
    desc_en: item.desc_en,
    desc_mr: item.desc_mr,
    desc_hi: item.desc_hi,
    category: item.category,
    image_url: item.imageUrl,
    thumbnail_url: item.thumbnailUrl || null,
    featured: item.featured,
    top_work: item.topWork,
    visible: item.visible,
    sort_order: item.sortOrder,
  };
}

export function rowToReview(row: any): Review {
  return {
    id: row.id,
    customerName: row.customer_name,
    location: row.location || undefined,
    rating: Number(row.rating),
    reviewText: row.review_text,
    language: row.language as SupportedLanguage,
    customerPhoto: row.customer_photo || undefined,
    status: row.status,
    featured: Boolean(row.featured),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function reviewToRow(item: Review): Record<string, any> {
  return {
    id: item.id,
    customer_name: item.customerName,
    location: item.location || null,
    rating: item.rating,
    review_text: item.reviewText,
    language: item.language,
    customer_photo: item.customerPhoto || null,
    status: item.status,
    featured: item.featured,
    created_at: item.createdAt,
  };
}

export function rowToQuote(row: any): QuoteRequest {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    whatsapp: row.whatsapp || undefined,
    email: row.email || undefined,
    service: row.service,
    quantity: row.quantity || undefined,
    sizeSpecification: row.size_specification || undefined,
    requirements: row.requirements,
    preferredContact: row.preferred_contact,
    status: row.status,
    internalNotes: row.internal_notes || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export function quoteToRow(item: QuoteRequest): Record<string, any> {
  return {
    id: item.id,
    customer_name: item.customerName,
    phone: item.phone,
    whatsapp: item.whatsapp || null,
    email: item.email || null,
    service: item.service,
    quantity: item.quantity || null,
    size_specification: item.sizeSpecification || null,
    requirements: item.requirements,
    preferred_contact: item.preferredContact,
    status: item.status,
    internal_notes: item.internalNotes || null,
    created_at: item.createdAt,
  };
}

export function rowToAdmin(row: any): AdminUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    salt: row.salt,
    tokenVersion: row.token_version ?? 1,
    resetTokenHash: row.reset_token_hash || undefined,
    resetExpires: row.reset_expires || undefined,
  };
}

// ============================================================================
// ASYNC SUPABASE DATA RETRIEVAL & CRUD HELPERS
// ============================================================================

/**
 * Loads the complete database state asynchronously from Supabase PostgreSQL.
 * Falls back safely to bundled defaults if Supabase is unavailable.
 */
export async function getDatabaseAsync(): Promise<AppDatabase> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) {
    return getDatabase();
  }

  try {
    const [servicesRes, portfolioRes, reviewsRes, quotesRes, settingsRes, translationsRes, adminRes] =
      await Promise.all([
        client.from('services').select('*').order('sort_order', { ascending: true }),
        client.from('portfolio').select('*').order('sort_order', { ascending: true }),
        client.from('reviews').select('*').order('created_at', { ascending: false }),
        client.from('quotes').select('*').order('created_at', { ascending: false }),
        client.from('site_settings').select('*'),
        client.from('translations').select('*'),
        client.from('admin_users').select('*').limit(1).maybeSingle(),
      ]);

    // Parse site_settings key-value entries
    const settingsMap: Record<string, any> = {};
    if (settingsRes.data) {
      for (const row of settingsRes.data) {
        settingsMap[row.key] = row.data;
      }
    }

    // Parse translations key-value entries
    const translationsMap: Record<string, Record<SupportedLanguage, string>> = { ...initialTranslations };
    if (translationsRes.data && translationsRes.data.length > 0) {
      for (const row of translationsRes.data) {
        translationsMap[row.key] = {
          en: row.en,
          mr: row.mr,
          hi: row.hi,
        };
      }
    }

    const defaultDb = getDefaultDatabase();

    const db: AppDatabase = {
      businessInfo: settingsMap['business_info'] || defaultDb.businessInfo,
      branding: settingsMap['branding'] || defaultDb.branding,
      homepage: settingsMap['homepage_config'] || defaultDb.homepage,
      socialLinks: settingsMap['social_links'] || defaultDb.socialLinks,
      seo: settingsMap['seo_settings'] || defaultDb.seo,
      services: servicesRes.data && servicesRes.data.length > 0
        ? servicesRes.data.map(rowToService)
        : defaultDb.services,
      portfolio: portfolioRes.data && portfolioRes.data.length > 0
        ? portfolioRes.data.map(rowToPortfolio)
        : defaultDb.portfolio,
      reviews: reviewsRes.data && reviewsRes.data.length > 0
        ? reviewsRes.data.map(rowToReview)
        : defaultDb.reviews,
      quotes: quotesRes.data && quotesRes.data.length > 0
        ? quotesRes.data.map(rowToQuote)
        : defaultDb.quotes,
      admin: adminRes.data ? rowToAdmin(adminRes.data) : defaultDb.admin,
      translations: translationsMap,
    };

    memoryDb = db;
    return db;
  } catch (error) {
    console.error('[DB] Error querying Supabase database, using local fallback:', error);
    return getDatabase();
  }
}

// ----------------------------------------------------------------------------
// Entity: Services
// ----------------------------------------------------------------------------
export async function fetchServicesAsync(): Promise<Service[]> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) return getDatabase().services;

  const { data, error } = await client.from('services').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.warn('[DB] fetchServicesAsync error:', error?.message);
    return getDatabase().services;
  }
  return data.map(rowToService);
}

export async function upsertServiceAsync(service: Service): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    const idx = db.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) db.services[idx] = service;
    else db.services.push(service);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('services').upsert(serviceToRow(service));
  if (error) {
    console.error('[DB] upsertServiceAsync error:', error);
    return false;
  }
  return true;
}

export async function deleteServiceAsync(id: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.services = db.services.filter((s) => s.id !== id);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('services').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteServiceAsync error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Portfolio
// ----------------------------------------------------------------------------
export async function fetchPortfolioAsync(): Promise<PortfolioItem[]> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) return getDatabase().portfolio;

  const { data, error } = await client.from('portfolio').select('*').order('sort_order', { ascending: true });
  if (error || !data) {
    console.warn('[DB] fetchPortfolioAsync error:', error?.message);
    return getDatabase().portfolio;
  }
  return data.map(rowToPortfolio);
}

export async function upsertPortfolioAsync(item: PortfolioItem): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    const idx = db.portfolio.findIndex((p) => p.id === item.id);
    if (idx >= 0) db.portfolio[idx] = item;
    else db.portfolio.push(item);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('portfolio').upsert(portfolioToRow(item));
  if (error) {
    console.error('[DB] upsertPortfolioAsync error:', error);
    return false;
  }
  return true;
}

export async function deletePortfolioAsync(id: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.portfolio = db.portfolio.filter((p) => p.id !== id);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('portfolio').delete().eq('id', id);
  if (error) {
    console.error('[DB] deletePortfolioAsync error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Quotes
// ----------------------------------------------------------------------------
export async function fetchQuotesAsync(): Promise<QuoteRequest[]> {
  const client = getSupabaseAdmin();
  if (!client) return getDatabase().quotes;

  const { data, error } = await client.from('quotes').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    console.warn('[DB] fetchQuotesAsync error:', error?.message);
    return getDatabase().quotes;
  }
  return data.map(rowToQuote);
}

export async function insertQuoteAsync(quote: QuoteRequest): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) {
    const db = getDatabase();
    db.quotes.unshift(quote);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('quotes').insert(quoteToRow(quote));
  if (error) {
    console.error('[DB] insertQuoteAsync error:', error);
    return false;
  }
  return true;
}

export async function updateQuoteAsync(id: string, updates: Partial<QuoteRequest>): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    const idx = db.quotes.findIndex((q) => q.id === id);
    if (idx >= 0) {
      db.quotes[idx] = { ...db.quotes[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase(db);
      return true;
    }
    return false;
  }

  const payload: Record<string, any> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.internalNotes !== undefined) payload.internal_notes = updates.internalNotes;
  if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.whatsapp !== undefined) payload.whatsapp = updates.whatsapp;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.service !== undefined) payload.service = updates.service;
  if (updates.quantity !== undefined) payload.quantity = updates.quantity;
  if (updates.sizeSpecification !== undefined) payload.size_specification = updates.sizeSpecification;
  if (updates.requirements !== undefined) payload.requirements = updates.requirements;
  if (updates.preferredContact !== undefined) payload.preferred_contact = updates.preferredContact;

  const { error } = await client.from('quotes').update(payload).eq('id', id);
  if (error) {
    console.error('[DB] updateQuoteAsync error:', error);
    return false;
  }
  return true;
}

export async function deleteQuoteAsync(id: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.quotes = db.quotes.filter((q) => q.id !== id);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('quotes').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteQuoteAsync error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Reviews
// ----------------------------------------------------------------------------
export async function fetchReviewsAsync(adminMode = false): Promise<Review[]> {
  const client = adminMode ? getSupabaseAdmin() : (getSupabaseClient() || getSupabaseAdmin());
  if (!client) {
    const all = getDatabase().reviews;
    return adminMode ? all : all.filter((r) => r.status === 'approved');
  }

  let query = client.from('reviews').select('*').order('created_at', { ascending: false });
  if (!adminMode) {
    query = query.eq('status', 'approved');
  }

  const { data, error } = await query;
  if (error || !data) {
    console.warn('[DB] fetchReviewsAsync error:', error?.message);
    const all = getDatabase().reviews;
    return adminMode ? all : all.filter((r) => r.status === 'approved');
  }
  return data.map(rowToReview);
}

export async function insertReviewAsync(review: Review): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) {
    const db = getDatabase();
    db.reviews.unshift(review);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('reviews').insert(reviewToRow(review));
  if (error) {
    console.error('[DB] insertReviewAsync error:', error);
    return false;
  }
  return true;
}

export async function updateReviewAsync(id: string, updates: Partial<Review>): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx >= 0) {
      db.reviews[idx] = { ...db.reviews[idx], ...updates };
      saveDatabase(db);
      return true;
    }
    return false;
  }

  const payload: Record<string, any> = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.featured !== undefined) payload.featured = updates.featured;
  if (updates.customerName !== undefined) payload.customer_name = updates.customerName;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.rating !== undefined) payload.rating = updates.rating;
  if (updates.reviewText !== undefined) payload.review_text = updates.reviewText;
  if (updates.language !== undefined) payload.language = updates.language;
  if (updates.customerPhoto !== undefined) payload.customer_photo = updates.customerPhoto;

  const { error } = await client.from('reviews').update(payload).eq('id', id);
  if (error) {
    console.error('[DB] updateReviewAsync error:', error);
    return false;
  }
  return true;
}

export async function deleteReviewAsync(id: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.reviews = db.reviews.filter((r) => r.id !== id);
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('reviews').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteReviewAsync error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Site Settings (Singletons: business_info, branding, homepage_config, social_links, seo_settings)
// ----------------------------------------------------------------------------
export async function fetchSiteSettingAsync<T>(key: string, fallback: T): Promise<T> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) return fallback;

  const { data, error } = await client.from('site_settings').select('data').eq('key', key).maybeSingle();
  if (error || !data || !data.data) {
    return fallback;
  }
  return data.data as T;
}

export async function saveSiteSettingAsync<T>(key: string, data: T): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    if (key === 'business_info') db.businessInfo = data as any;
    else if (key === 'branding') db.branding = data as any;
    else if (key === 'homepage_config') db.homepage = data as any;
    else if (key === 'social_links') db.socialLinks = data as any;
    else if (key === 'seo_settings') db.seo = data as any;
    saveDatabase(db);
    return true;
  }

  const { error } = await client.from('site_settings').upsert({ key, data });
  if (error) {
    console.error(`[DB] saveSiteSettingAsync for ${key} error:`, error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Translations
// ----------------------------------------------------------------------------
export async function fetchTranslationsAsync(): Promise<Record<string, Record<SupportedLanguage, string>>> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) return getDatabase().translations;

  const { data, error } = await client.from('translations').select('*');
  if (error || !data || data.length === 0) {
    return getDatabase().translations;
  }

  const map: Record<string, Record<SupportedLanguage, string>> = {};
  for (const row of data) {
    map[row.key] = { en: row.en, mr: row.mr, hi: row.hi };
  }
  return map;
}

export async function saveTranslationsAsync(
  translations: Record<string, Record<SupportedLanguage, string>>
): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.translations = translations;
    saveDatabase(db);
    return true;
  }

  const rows = Object.entries(translations).map(([key, value]) => ({
    key,
    en: value.en || '',
    mr: value.mr || '',
    hi: value.hi || '',
  }));

  const { error } = await client.from('translations').upsert(rows);
  if (error) {
    console.error('[DB] saveTranslationsAsync error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Entity: Admin User
// ----------------------------------------------------------------------------
export async function fetchAdminUserAsync(): Promise<AdminUser> {
  const client = getSupabaseAdmin();
  if (!client) return getDatabase().admin;

  const { data, error } = await client.from('admin_users').select('*').limit(1).maybeSingle();
  if (error || !data) {
    return getDatabase().admin;
  }
  return rowToAdmin(data);
}

export async function updateAdminUserAsync(updates: Partial<AdminUser>): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) {
    const db = getDatabase();
    db.admin = { ...db.admin, ...updates };
    saveDatabase(db);
    return true;
  }

  const payload: Record<string, any> = {};
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.passwordHash !== undefined) payload.password_hash = updates.passwordHash;
  if (updates.salt !== undefined) payload.salt = updates.salt;
  if (updates.tokenVersion !== undefined) payload.token_version = updates.tokenVersion;
  if (updates.resetTokenHash !== undefined) payload.reset_token_hash = updates.resetTokenHash;
  if (updates.resetExpires !== undefined) payload.reset_expires = updates.resetExpires;

  const { error } = await client.from('admin_users').update(payload).eq('id', updates.id || 'admin-1');
  if (error) {
    console.error('[DB] updateAdminUserAsync error:', error);
    return false;
  }
  return true;
}

// ============================================================================
// SYNCHRONOUS FALLBACK & BACKWARD COMPATIBILITY BRIDGE
// ============================================================================

export function getDatabase(): AppDatabase {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (IS_SERVERLESS && !fs.existsSync(ACTIVE_DB_FILE)) {
      if (fs.existsSync(BUNDLED_DB_FILE)) {
        try {
          const bundledContent = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
          fs.writeFileSync(ACTIVE_DB_FILE, bundledContent, 'utf-8');
        } catch (copyErr) {
          console.warn('[DB] Could not initialize /tmp/store.json from bundled file:', copyErr);
        }
      }
    }

    if (fs.existsSync(ACTIVE_DB_FILE)) {
      const raw = fs.readFileSync(ACTIVE_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const db = { ...getDefaultDatabase(), ...parsed };
      memoryDb = db;
      return db;
    }

    if (fs.existsSync(BUNDLED_DB_FILE)) {
      const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const db = { ...getDefaultDatabase(), ...parsed };
      memoryDb = db;
      return db;
    }

    const initialDb = getDefaultDatabase();
    memoryDb = initialDb;
    saveDatabase(initialDb);
    return initialDb;
  } catch (error) {
    console.error('Error reading database, falling back to memory/default:', error);
    if (memoryDb) return memoryDb;
    return getDefaultDatabase();
  }
}

export function saveDatabase(data: AppDatabase): void {
  memoryDb = data;

  try {
    const payload = JSON.stringify(data, null, 2);

    if (IS_SERVERLESS) {
      try {
        fs.writeFileSync(ACTIVE_DB_FILE, payload, 'utf-8');
      } catch (err) {
        console.warn('[DB] Warning: Could not write to /tmp/store.json:', err);
      }
    } else {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      try {
        fs.writeFileSync(BUNDLED_DB_FILE, payload, 'utf-8');
      } catch {
        const tempFile = `${BUNDLED_DB_FILE}.tmp.${Date.now()}`;
        fs.writeFileSync(tempFile, payload, 'utf-8');
        try {
          fs.copyFileSync(tempFile, BUNDLED_DB_FILE);
          try { fs.unlinkSync(tempFile); } catch {}
        } catch (copyErr) {
          console.warn('[DB] Could not copy temp file to DB_FILE:', copyErr);
        }
      }
    }
  } catch (error) {
    console.warn('[DB] Warning: Could not persist database to disk:', error);
  }
}

export async function syncDatabaseFromCloud(): Promise<AppDatabase | null> {
  if (isSupabaseConfigured()) {
    return getDatabaseAsync();
  }
  return null;
}
