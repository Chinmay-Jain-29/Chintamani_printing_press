import { SupportedLanguage } from './schema';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    mr: string;
    hi: string;
  };
}

export const uiTranslations: TranslationDictionary = {
  // Navigation
  navHome: { en: 'Home', mr: 'मुख्यपृष्ठ', hi: 'होम' },
  navAbout: { en: 'About Us', mr: 'आमच्याबद्दल', hi: 'हमारे बारे में' },
  navServices: { en: 'Services', mr: 'सेवा', hi: 'सेवाएं' },
  navPortfolio: { en: 'Our Work', mr: 'आमचे काम', hi: 'हमारा कार्य' },
  navReviews: { en: 'Reviews', mr: 'अभिप्राय', hi: 'प्रतिक्रियाएं' },
  navQuote: { en: 'Get a Quote', mr: 'कोटेशन मिळवा', hi: 'कोटेशन प्राप्त करें' },
  navContact: { en: 'Contact', mr: 'संपर्क', hi: 'संपर्क' },
  navAdmin: { en: 'Admin', mr: 'प्रशासक', hi: 'व्यवस्थापक' },
  footerQuickLinks: { en: 'Quick Links', mr: 'महत्त्वाचे दुवे', hi: 'महत्वपूर्ण लिंक' },
  footerServices: { en: 'Printing Services', mr: 'मुद्रण सेवा', hi: 'मुद्रण सेवाएं' },
  footerContact: { en: 'Shop & Contact', mr: 'पत्ता व संपर्क', hi: 'पता व संपर्क' },

  // Common CTAs & Badges
  btnCallNow: { en: 'Call Now', mr: 'कॉल करा', hi: 'कॉल करें' },
  btnWhatsApp: { en: 'WhatsApp Us', mr: 'व्हॉट्सॲप करा', hi: 'व्हाट्सएप करें' },
  btnGetQuote: { en: 'Get a Free Quote', mr: 'मोफत कोटेशन मिळवा', hi: 'निःशुल्क कोटेशन प्राप्त करें' },
  btnViewAllServices: { en: 'View All Services', mr: 'सर्व सेवा पहा', hi: 'सभी सेवाएं देखें' },
  btnViewPortfolio: { en: 'View Work Gallery', mr: 'काम गॅलरी पहा', hi: 'कार्य गैलरी देखें' },
  btnSubmit: { en: 'Submit Request', mr: 'विनंती पाठवा', hi: 'अनुरोध भेजें' },
  btnSubmitting: { en: 'Submitting...', mr: 'पाठवत आहे...', hi: 'भेज रहे हैं...' },
  btnShareReview: { en: 'Share Your Experience', mr: 'तुमचा अनुभव सांगा', hi: 'अपना अनुभव साझा करें' },
  btnFilterAll: { en: 'All', mr: 'सर्व', hi: 'सभी' },
  badgeEstablished: { en: 'Trusted Since 1999', mr: '१९९९ पासून विश्वासार्ह', hi: '१९९९ से भरोसेमंद' },
  badgeFeatured: { en: 'Featured', mr: 'विशेष', hi: 'विशेष' },
  badgeTopWork: { en: 'Top Work', mr: 'उत्कृष्ट काम', hi: 'प्रमुख कार्य' },
  badgeComingSoon: { en: 'Coming Soon', mr: 'लवकरच उपलब्ध', hi: 'शीघ्र उपलब्ध' },

  // Sections Headings
  sectionServicesTitle: { en: 'Our Printing & Designing Services', mr: 'आमच्या मुद्रण व डिझायनिंग सेवा', hi: 'हमारी मुद्रण व डिज़ाइनिंग सेवाएं' },
  sectionServicesSubtitle: { en: 'Precision offset, vibrant digital printing and tailored graphic design under one roof.', mr: 'एकाच छताखाली अचूक ऑफसेट, चमकदार डिजिटल प्रिंटिंग आणि सुबक डिझायनिंग.', hi: 'एक ही स्थान पर सटीक ऑफसेट, डिजिटल प्रिंटिंग और सुंदर डिज़ाइनिंग.' },
  sectionHeritageTitle: { en: 'Decades of Dedication', mr: '२५ वर्षांची सेवा व विश्वास', hi: '२५ वर्षों का विश्वास और सेवा' },
  sectionHeritageSubtitle: { en: 'From humble beginnings in 1999 to becoming Dongaon’s foremost printing benchmark.', mr: '१९९९ च्या छोट्या सुरुवातीपासून ते डोणगावमधील सर्वात विश्वासू प्रिंटिंग प्रेसपर्यंतचा प्रवास.', hi: '१९९९ की शुरुआत से लेकर डोणगांव के सबसे विश्वसनीय प्रिंटिंग संस्थान बनने का सफर.' },
  sectionWhyTitle: { en: 'Why Customers Trust Us', mr: 'ग्राहक आमच्यावर का विश्वास ठेवतात?', hi: 'ग्राहक हम पर क्यों भरोसा करते हैं?' },
  sectionWhySubtitle: { en: 'Six core commitments that guide every job we print.', mr: 'प्रत्येक मुद्रण कामात आम्ही जपत असलेली ६ मूल्ये.', hi: 'प्रत्येक कार्य में हमारी ओर से दी जाने वाली ६ प्रमुख प्रतिबद्धताएं.' },
  sectionTopWorksTitle: { en: 'Our Featured Craftsmanship', mr: 'आमचे विशेष मुद्रित काम', hi: 'हमारा उत्कृष्ट मुद्रित कार्य' },
  sectionTopWorksSubtitle: { en: 'A curated selection of real work printed for businesses, weddings, and local events.', mr: 'स्थानिक व्यवसाय, लग्नसोहळे आणि कार्यक्रमांसाठी तयार केलेल्या कामांची झलक.', hi: 'स्थानीय व्यापार, विवाह और आयोजनों के लिए तैयार किए गए कार्यों की झलक.' },
  sectionReviewsTitle: { en: 'What Our Customers Say', mr: 'ग्राहकांचे मनोगत', hi: 'ग्राहकों के विचार' },
  sectionReviewsSubtitle: { en: 'Honest reviews from clients across Dongaon, Mehekar and Buldhana.', mr: 'डोणगाव, मेहकर आणि बुलढाणा परिसरातील ग्राहकांचे खरे अभिप्राय.', hi: 'डोणगांव, मेहकर और बुलढाणा क्षेत्र के ग्राहकों की वास्तविक प्रतिक्रियाएं.' },
  sectionContactTitle: { en: 'Get In Touch', mr: 'आमच्याशी संपर्क साधा', hi: 'हमसे संपर्क करें' },
  sectionContactSubtitle: { en: 'Visit our shop on Shrikant Talkies Road or reach out via phone or WhatsApp.', mr: 'श्रीकांत टॉकीज रोडवरील आमच्या दुकानाला भेट द्या किंवा फोन/व्हॉट्सॲपवर संपर्क करा.', hi: 'श्रीकांत टॉकीज रोड स्थित हमारी दुकान पर पधारें या फोन/व्हाट्सएप से संपर्क करें.' },

  // Why Choose Us Cards
  why1Title: { en: 'Established Experience', mr: 'दीर्घ अनुभव (१९९९ पासून)', hi: 'दीर्घ अनुभव (१९९९ से)' },
  why1Desc: { en: 'Over 25 continuous years serving Dongaon and surrounding talukas with deep printing expertise.', mr: 'डोणगाव व आसपासच्या तालुक्यांमध्ये २५ वर्षांहून अधिक काळ अविरत दर्जेदार सेवा.', hi: 'डोणगांव और आसपास के क्षेत्रों में २५ वर्षों से अधिक का गहन मुद्रण अनुभव.' },
  why2Title: { en: 'Uncompromising Quality', mr: 'उत्कृष्ट दर्जा व अचूकता', hi: 'उत्कृष्ट गुणवत्ता और सटीकता' },
  why2Desc: { en: 'Vibrant inks, heavy paper stocks, sharp letter registration, and durable finishes on every piece.', mr: 'दर्जेदार शाई, उत्कृष्ट कागद, सुस्पष्ट अक्षरे आणि प्रत्येक कामात टिकाऊ फिनिशिंग.', hi: 'उच्च कोटि की स्याही, उत्तम कागज़, स्पष्ट छपाई और टिकाऊ फिनिशिंग.' },
  why3Title: { en: 'Affordable & Honest Pricing', mr: 'किफायतशीर व पारदर्शक दर', hi: 'किफायती और पारदर्शी मूल्य' },
  why3Desc: { en: 'Competitive rates designed specifically to support local businesses, farmers, families, and organizations.', mr: 'स्थानिक व्यापारी, शेतकरी, कुटुंबे आणि संस्थांना परवडणारे अत्यंत रास्त दर.', hi: 'स्थानीय व्यापारियों, किसानों और परिवारों के अनुकूल किफायती मूल्य.' },
  why4Title: { en: 'Creative Designing Under One Roof', mr: 'प्रिंटिंग व डिझायनिंग एकत्र', hi: 'प्रिंटिंग और डिज़ाइनिंग एक साथ' },
  why4Desc: { en: 'No need to hire outside designers. We handle drafting, Marathi/Hindi typesetting, and final print in-house.', mr: 'बाहेरून डिझायनर शोधण्याची गरज नाही; टाईपिंग, डिझायनिंग आणि प्रिंटिंग सर्व एकाच ठिकाणी.', hi: 'अलग से डिज़ाइनर की जरूरत नहीं; टाइपिंग, डिज़ाइनिंग और प्रिंटिंग सभी एक ही छत के नीचे.' },
  why5Title: { en: 'Deep Community Trust', mr: 'स्थानिक लोकांचा विश्वास', hi: 'स्थानीय लोगों का विश्वास' },
  why5Desc: { en: 'Built on personal relationships, timely commitments, and the goodwill of Mr. Prakash Devendra Jain.', mr: 'श्री प्रकाश देवेंद्र जैन यांच्या विश्वासार्हतेवर आणि वेळेत काम देण्याच्या शब्दावर टिकून असलेला विश्वास.', hi: 'श्री प्रकाश देवेंद्र जैन की विश्वसनीयता और समय पर कार्य पूर्ण करने के वादे पर टिका विश्वास.' },
  why6Title: { en: 'Instant WhatsApp & Phone Support', mr: 'सुलभ व्हॉट्सॲप व फोन संपर्क', hi: 'त्वरित व्हाट्सएप और फोन सहायता' },
  why6Desc: { en: 'Easily discuss requirements, share drafts, request estimates, and confirm proofs without unnecessary visits.', mr: 'घरबसल्या व्हॉट्सॲपवर कामाची माहिती द्या, प्रूफ तपासा आणि सहज ऑर्डर पूर्ण करा.', hi: 'घर बैठे व्हाट्सएप पर काम की चर्चा करें, प्रूफ जांचें और सरलता से ऑर्डर दें.' },

  // Forms
  formName: { en: 'Full Name', mr: 'पूर्ण नाव', hi: 'पूरा नाम' },
  formPhone: { en: 'Phone Number', mr: 'फोन नंबर', hi: 'फोन नंबर' },
  formWhatsApp: { en: 'WhatsApp Number (Optional)', mr: 'व्हॉट्सॲप नंबर (पर्यायी)', hi: 'व्हाट्सएप नंबर (वैकल्पिक)' },
  formEmail: { en: 'Email Address (Optional)', mr: 'ईमेल पत्ता (पर्यायी)', hi: 'ईमेल (वैकल्पिक)' },
  formService: { en: 'Select Service', mr: 'सेवा निवडा', hi: 'सेवा चुनें' },
  formQuantity: { en: 'Approximate Quantity (Optional)', mr: 'अंदाजे संख्या (पर्यायी)', hi: 'अनुमानित संख्या (वैकल्पिक)' },
  formSpecs: { en: 'Size or Paper Specifications (Optional)', mr: 'आकार किंवा कागदाचा प्रकार (पर्यायी)', hi: 'आकार या कागज़ का प्रकार (वैकल्पिक)' },
  formRequirements: { en: 'Details & Requirements', mr: 'कामाचा तपशील व आवश्यकता', hi: 'कार्य का विवरण व आवश्यकताएं' },
  formContactPref: { en: 'Preferred Contact Method', mr: 'संपर्काची पसंती पद्धत', hi: 'संपर्क का पसंदीदा माध्यम' },
  formRating: { en: 'Rating', mr: 'रेटिंग', hi: 'रेटिंग' },
  formReview: { en: 'Your Experience & Feedback', mr: 'तुमचा अनुभव व अभिप्राय', hi: 'आपका अनुभव और प्रतिक्रिया' },
  formLocation: { en: 'Your Town / Village (Optional)', mr: 'तुमचे गाव / शहर (पर्यायी)', hi: 'आपका गांव / शहर (वैकल्पिक)' },
  quoteSuccessTitle: { en: 'Quote Request Received!', mr: 'कोटेशन विनंती यशस्वीरित्या प्राप्त झाली!', hi: 'कोटेशन अनुरोध सफलतापूर्वक प्राप्त हुआ!' },
  quoteSuccessDesc: { en: 'Thank you for reaching out to New Chintamani Printing Press. We will review your details and contact you shortly with the best pricing.', mr: 'न्यू चिंतामणी प्रिंटिंग प्रेसशी संपर्क साधल्याबद्दल धन्यवाद. आम्ही लवकरच तुमच्याशी संपर्क साधून योग्य दर देऊ.', hi: 'न्यू चिंतामणी प्रिंटिंग प्रेस से संपर्क करने के लिए धन्यवाद. हम शीघ्र ही आपसे संपर्क करके सर्वोत्तम मूल्य बताएंगे.' },
  reviewSuccessTitle: { en: 'Thank You for Your Review!', mr: 'अभिप्राय दिल्याबद्दल मनापासून धन्यवाद!', hi: 'प्रतिक्रिया देने के लिए बहुत धन्यवाद!' },
  reviewSuccessDesc: { en: 'Your feedback has been submitted to our team for verification and will appear on the website shortly.', mr: 'तुमचा अभिप्राय प्रशासकीय पडताळणीसाठी पाठवला आहे, लवकरच तो वेबसाइटवर दिसेल.', hi: 'आपकी प्रतिक्रिया सत्यापन के लिए भेज दी गई है, शीघ्र ही वेबसाइट पर प्रदर्शित होगी.' },

  // Business Info
  ownerLabel: { en: 'Owner', mr: 'संचालक', hi: 'संचालक' },
  establishedLabel: { en: 'Established', mr: 'स्थापना', hi: 'स्थापना' },
  hoursLabel: { en: 'Business Hours', mr: 'कामाची वेळ', hi: 'कार्य समय' },
  addressLabel: { en: 'Shop Address', mr: 'दुकानाचा पत्ता', hi: 'दुकान का पता' },
  phoneLabel: { en: 'Phone Numbers', mr: 'दूरध्वनी क्रमांक', hi: 'फोन नंबर' },
  locationDongaon: { en: 'Dongaon, Taluka Mehekar, Dist. Buldhana, Maharashtra - 443303', mr: 'डोणगाव, ता. मेहकर, जि. बुलढाणा, महाराष्ट्र - ४४३३०३', hi: 'डोणगांव, तहसील मेहकर, जिला बुलढाणा, महाराष्ट्र - ४४३३०३' },
};

export function getTranslation(key: string, lang: SupportedLanguage): string {
  const item = uiTranslations[key];
  if (!item) return key;
  return item[lang] || item['en'] || key;
}
