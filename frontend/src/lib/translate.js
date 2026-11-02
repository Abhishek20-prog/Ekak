// Comprehensive natural Hindi translation dictionary & translation engine for Ekak
// Provides natural, grammatically correct, respectful conversational Hindi + English SAPI Phonetics

export const COMMON_TRANSLATIONS = {
  // Greetings & Courtesies
  "hello": "नमस्ते",
  "namaste": "नमस्ते",
  "hi": "नमस्ते",
  "thank you": "आपका बहुत धन्यवाद",
  "thank you very much": "आपका बहुत-बहुत धन्यवाद",
  "thanks": "धन्यवाद",
  "please": "कृपया",
  "yes": "हाँ",
  "no": "नहीं",
  "okay": "ठीक है",
  "good morning": "सुप्रभात",
  "good afternoon": "शुभ दोपहर",
  "good evening": "शुभ संध्या",
  "good night": "शुभ रात्रि",
  "how are you": "आप कैसे हैं?",
  "i am fine": "मैं बिल्कुल ठीक हूँ",
  "sorry": "माफ़ कीजिए",
  "excuse me": "सुनिए, माफ़ कीजिए",
  "welcome": "आपका स्वागत है",

  // Emergency & Help
  "help": "सहायता / मदद",
  "i need help": "कृपया मेरी सहायता करें",
  "please help me": "कृपया मेरी मदद कीजिए",
  "emergency": "आपातकालीन स्थिति है",
  "call an ambulance": "तुरंत एम्बुलेंस बुलाएं",
  "call police": "पुलिस को फोन करें",
  "call my family": "कृपया मेरे परिवार को फोन करें",
  "i am lost": "मैं रास्ता भूल गया हूँ",
  "danger": "खतरा",

  // Healthcare, Clinic & Hospital
  "doctor": "डॉक्टर साहब",
  "i need a doctor": "मुझे डॉक्टर से मिलना है",
  "where is the doctor": "डॉक्टर साहब कहाँ मिलेंगे?",
  "hospital": "अस्पताल",
  "where is the hospital": "अस्पताल किस तरफ है?",
  "medicine": "दवाई",
  "where is the medicine": "दवाई की दुकान कहाँ है?",
  "prescription": "दवाई का पर्चा",
  "pain": "दर्द",
  "i am in pain": "मुझे बहुत दर्द हो रहा है",
  "chest pain": "मेरे सीने में दर्द हो रहा है",
  "headache": "मेरे सिर में तेज दर्द है",
  "stomach pain": "मेरे पेट में दर्द है",
  "fever": "मुझे बुखार है",
  "i feel dizzy": "मुझे चक्कर आ रहे हैं",
  "i feel sick": "मेरी तबीयत ठीक नहीं लग रही है",
  "blood pressure": "मेरा रक्तचाप (बीपी) जांच लीजिए",
  "diabetes": "शुगर (मधुमेह) की जांच करनी है",
  "injection": "सुई / इंजेक्शन",
  "nurse": "नर्स / स्वास्थ्य कर्मी",
  "wheelchair": "व्हीलचेयर",
  "i need a wheelchair": "मुझे चलने के लिए व्हीलचेयर की आवश्यकता है",
  "stretcher": "स्ट्रेचर",

  // Accessibility & Communication Needs
  "i cannot speak": "मैं बोल नहीं पाता हूँ, कृपया स्क्रीन पर लिखा हुआ पढ़ें",
  "i cannot hear": "मुझे सुनाई नहीं देता, कृपया लिखकर बात करें",
  "i am deaf": "मैं सुन नहीं सकता, कृपया धीरे या लिखकर बताएं",
  "i am blind": "मुझे दिखाई नहीं देता, कृपया बोलकर मार्गदर्शन करें",
  "i have low vision": "मेरी नजर कमजोर है",
  "please write it down": "कृपया इसे कागज़ या स्क्रीन पर लिख दीजिए",
  "please repeat that": "कृपया इसे एक बार फिर से दोहरा दीजिए",
  "please speak slowly": "कृपया थोड़ा धीरे बोलिए",
  "sign language": "सांकेतिक भाषा (साइन लैंग्वेज)",
  "interpreter": "साइन लैंग्वेज दुभाषिया",

  // Daily Essentials & Living
  "water": "पानी",
  "water please": "कृपया मुझे पीने का पानी चाहिए",
  "i am thirsty": "मुझे प्यास लगी है",
  "food": "खाना / भोजन",
  "food please": "मुझे भोजन चाहिए",
  "i am hungry": "मुझे भूख लगी है",
  "toilet": "शौचालय",
  "washroom": "शौचालय किस तरफ है?",
  "restroom": "शौचालय कहाँ है?",
  "home": "घर",
  "i want to go home": "मुझे घर जाना है",
  "where is the exit": "बाहर जाने का रास्ता (Exit) कहाँ है?",
  "where is the entrance": "अंदर आने का मुख्य द्वार कहाँ है?",
  "lift": "लिफ्ट / एलिवेटर",
  "elevator": "लिफ्ट कहाँ है?",
  "stairs": "सीढ़ियां",
  "ramp": "दिव्यांग व्हीलचेयर रैंप कहाँ है?",

  // Banking & Government Offices
  "bank": "बैंक",
  "money": "पैसे",
  "cash": "नकद पैसे",
  "account": "बैंक खाता",
  "open account": "नया बैंक खाता खोलना है",
  "withdraw money": "खाते से पैसे निकालने हैं",
  "deposit money": "खाते में पैसे जमा करने हैं",
  "passbook": "पासबुक एंट्री करनी है",
  "atm": "एटीएम मशीन कहाँ है?",
  "signature": "हस्ताक्षर / दस्तखत",
  "thumb impression": "अंगूठे का निशान लगाना है",
  "udid card": "यूडीआईडी (दिव्यांग स्वावलंबन) कार्ड",
  "disability certificate": "दिव्यांगता प्रमाण पत्र",
  "pension": "दिव्यांग पेंशन योजना",
  "government scheme": "सरकारी कल्याणकारी योजनाएं",
};

// Reverse dictionary (Hindi to English)
const REVERSE_TRANSLATIONS = {};
for (const [en, hi] of Object.entries(COMMON_TRANSLATIONS)) {
  REVERSE_TRANSLATIONS[hi.toLowerCase()] = en;
}

// 2. High-accuracy English-SAPI Phonetic map
// This allows English synthesizers (like Microsoft David/Zira on Windows) to audibly speak natural Hindi!
export const HINDI_PHONETICS_MAP = {
  "नमस्ते": "Num-us-tay",
  "नमस्ते! एकाक में आपका स्वागत है": "Num-us-tay! Ekak may aap-kaa swaa-gut hai",
  "नमस्ते! एकाक में आपका स्वागत है। यह शुद्ध और स्पष्ट हिंदी आवाज है।": "Num-us-tay! Ekak may aap-kaa swaa-gut hai. Yeh shuddh aur sup-usht Hindi aa-vaaz hai.",
  "कृपया मेरी सहायता करें": "Krip-yaa may-ree suh-haa-yuh-taa ku-rein",
  "मुझे डॉक्टर से मिलना है": "Moo-jhay doc-tur say mil-naa hai",
  "मुझे बहुत दर्द हो रहा है": "Moo-jhay buh-hut durd ho ra-haa hai",
  "मुझे दवाई की आवश्यकता है": "Moo-jhay duh-vaa-ee kee aa-vush-yuk-taa hai",
  "कृपया पीने का पानी दीजिए": "Krip-yaa pee-nay kaa paa-nee dee-jee-yay",
  "मुझे भोजन चाहिए": "Moo-jhay bho-jun chaah-hee-yay",
  "शौचालय किस तरफ है?": "Show-chaa-luy kis tu-ruf hai?",
  "मुझे घर जाना है": "Moo-jhay ghur jaa-naa hai",
  "बैंक खाते में सहायता चाहिए": "Bank khaa-tay mein suh-haa-yuh-taa chaah-hee-ay",
  "कृपया मेरे परिवार को फोन करें": "Krip-yaa may-ray pu-ree-vaar ko fone ku-rein",
  "हाँ, बिल्कुल": "Haan, bil-kool",
  "नहीं, माफ़ कीजिए": "Na-hee, maaf kee-jee-yay",
  "धन्यवाद": "Dhun-yuh-vaad",
  "आपका बहुत धन्यवाद": "Aap-kaa buh-hut dhun-yuh-vaad",
  "कृपया": "Krip-yaa",
  "हाँ": "Haan",
  "नहीं": "Nahi",
  "पानी": "Paa-nee",
  "दवाई": "Duh-vaa-ee",
  "दर्द": "Durd",
  "खाना": "Khaa-naa",
  "घर": "Ghur",
  "बैंक": "Bank",
  "डॉक्टर": "Doc-tur",
  "सहायता": "Suh-haa-yuh-taa",
  "मदद": "Muh-dud",
  "मुझे मदद चाहिए": "Moo-jhay muh-dud chaah-hee-ay",
};

// General Phonetic converter for any Hindi text when running on English-only Windows SAPI
export function toPhoneticHindi(hindiText) {
  if (!hindiText) return "";
  const trimmed = hindiText.trim();
  if (HINDI_PHONETICS_MAP[trimmed]) {
    return HINDI_PHONETICS_MAP[trimmed];
  }

  const charMap = {
    'अ': 'uh', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'oo', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'ay', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'un', 'अः': 'uh',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'oo', 'ू': 'oo', 'ृ': 'ri',
    'े': 'ay', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', '्': '', '़': '',
    '।': '.',
  };

  let result = "";
  for (let i = 0; i < hindiText.length; i++) {
    const char = hindiText[i];
    result += charMap[char] || char;
  }
  return result.replace(/\s+/g, ' ').trim();
}

// Bidirectional Translation Function with API route + Local Dictionary Fallback
export async function translateText(text, fromLang = "en", toLang = "hi") {
  if (!text || !text.trim()) return "";
  const cleaned = text.trim();
  const from = fromLang.slice(0, 2);
  const to = toLang.slice(0, 2);

  // 1. Instant offline dictionary lookup for immediate latency-free response
  const lower = cleaned.toLowerCase();
  if (from === "en" && to === "hi") {
    if (COMMON_TRANSLATIONS[lower]) return COMMON_TRANSLATIONS[lower];
    const stripped = lower.replace(/[?.!,]/g, "").trim();
    if (COMMON_TRANSLATIONS[stripped]) return COMMON_TRANSLATIONS[stripped];
  } else if (from === "hi" && to === "en") {
    if (REVERSE_TRANSLATIONS[lower]) return REVERSE_TRANSLATIONS[lower];
  }

  // 2. Next.js Internal API Route (Bypasses all client CORS and adblocker issues)
  try {
    const res = await fetch(`/api/translate?text=${encodeURIComponent(cleaned)}&from=${from}&to=${to}`, {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.translated && data.translated.trim()) {
        return data.translated.trim();
      }
    }
  } catch (_) {
    // API route fetch skipped or offline, continue to client direct
  }

  // 3. Client Direct GTX Fallback
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(cleaned)}`;
    const res = await fetch(gUrl, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const trans = data[0].map((item) => (Array.isArray(item) ? item[0] : "")).join("").trim();
        if (trans) return trans;
      }
    }
  } catch (_) {}

  // 4. Client Direct MyMemory Fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleaned)}&langpair=${from}|${to}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText && !data.responseData.translatedText.startsWith("MYMEMORY WARNING")) {
        return data.responseData.translatedText.trim();
      }
    }
  } catch (_) {}

  return cleaned;
}
