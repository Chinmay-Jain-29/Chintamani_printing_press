import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AppDatabase, BusinessInfo, Branding, HomepageConfig, Service, PortfolioItem, Review, QuoteRequest, SocialLinks, SeoSettings, AdminUser } from './schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

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

const initialBusinessInfo: BusinessInfo = {
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
  googleMapsUrl: '', // Editable in Admin
  ownerTitle_en: 'Founder & Proprietor',
  ownerTitle_mr: 'संस्थापक व संचालक',
  ownerTitle_hi: 'संस्थापक व संचालक',
  ownerBio_en: 'Since founding New Chintamani Printing Press in 1999, our commitment has always been simple: treat every print job—whether a family wedding invitation, business visiting cards, or local event banners—with utmost care, honest pricing, and personal dedication. For over 25 years, our shop on Shrikant Talkies Road has been a trusted partner to families and businesses across Dongaon, Mehekar, and Buldhana.',
  ownerBio_mr: '१९९९ मध्ये न्यू चिंतामणी प्रिंटिंग प्रेसची स्थापना केल्यापासून आमचा एकच ध्यास राहिला आहे: लग्नपत्रिका असो, व्हिजिटिंग कार्ड असो की सार्वजनिक फ्लेक्स बॅनर — प्रत्येक काम पूर्ण विश्वासाने, वाजवी दरात आणि वेळेत देणे. श्रीकांत टॉकीज रोडवरील आमचे मुद्रणालय गेल्या २५ वर्षांहून अधिक काळ डोणगाव व परिसरातील जनतेच्या विश्वासास पात्र ठरले आहे.',
  ownerBio_hi: '१९९९ में न्यू चिंतामणी प्रिंटिंग प्रेस की स्थापना के समय से हमारा यही संकल्प रहा है कि हर काम—चाहे शादी के कार्ड हों, विज़िटिंग कार्ड्स या फ्लेक्स बैनर—पूरी ईमानदारी, उचित मूल्य और व्यक्तिगत समर्पण के साथ समय पर पूरा किया जाए। २५ से अधिक वर्षों से डोणगांव और मेहकर की जनता का यह अटूट विश्वास ही हमारी सबसे बड़ी पूँजी है।',
  ownerPhotoUrl: '/assets/owner-prakash-jain.jpg',
};

const initialBranding: Branding = {
  logoUrl: null,
  darkLogoUrl: null,
  useDefaultVectorLogo: true,
  altText: 'New Chintamani Printing Press Logo',
};

const initialHomepage: HomepageConfig = {
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

const initialServices: Service[] = [
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

const initialPortfolio: PortfolioItem[] = [
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

const initialReviews: Review[] = [
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

const initialQuotes: QuoteRequest[] = [
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

const initialSocialLinks: SocialLinks = {
  instagram: '',
  facebook: '',
  youtube: '',
  whatsappChannel: 'https://wa.me/919421396905',
};

const initialSeo: SeoSettings = {
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

const initialAdmin: AdminUser = {
  id: 'admin-1',
  email: 'chintamanidongaon@gmail.com',
  passwordHash: defaultAdminPassword.hash,
  salt: defaultAdminPassword.salt,
  tokenVersion: 1,
};

const initialTranslations: Record<string, Record<string, string>> = {
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

function getDefaultDatabase(): AppDatabase {
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
    translations: initialTranslations as any,
  };
}

export function getDatabase(): AppDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb = getDefaultDatabase();
      saveDatabase(initialDb);
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...getDefaultDatabase(), ...parsed };
  } catch (error) {
    console.error('Error reading database, falling back to default:', error);
    return getDefaultDatabase();
  }
}

export function saveDatabase(data: AppDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
}
