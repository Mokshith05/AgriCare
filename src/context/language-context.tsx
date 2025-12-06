'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, any>> = {
  en: {
    keyMapping: {
        dashboard: 'Dashboard',
        encyclopedia: 'Encyclopedia',
        preventiveCare: 'Preventive Care',
        fieldLogbook: 'Field Logbook',
    },
    dashboard: {
      quickGuide: 'Quick Guide',
      guideStep1: '1. Upload a clear photo of the affected crop.',
      guideStep2: '2. Let our AI analyze for diseases or pests.',
      guideStep3: '3. Receive instant organic treatment advice.',
      dragAndDrop: 'Drag & drop an image here',
      or: 'or',
      browseFiles: 'Browse files',
      analyzing: 'Analyzing...',
      analyzeCrop: 'Analyze Crop',
      analysisReport: 'Analysis Report',
      newAnalysis: 'New Analysis',
      aiAnalysis: 'AI Analysis',
      treatmentSuggestions: 'Treatment Suggestions',
      localWeather: 'Local Weather',
      selectCity: 'Select a city',
      weatherError: 'Could not fetch weather data.',
      weatherDescription: 'Real-time conditions for your crops',
      sunny: 'Sunny',
      humidity: 'Humidity',
      uvIndex: 'UV Index',
      high: 'High',
      highAlert: 'High Alert!',
      alertDescription: 'High humidity and temperature increase the risk of Powdery Mildew. Consider preventive spraying.',
      analysisFailed: 'Analysis Failed',
      analysisError: 'Could not analyze image. Please try again.'
    },
    encyclopedia: {
      title: 'Encyclopedia',
      symptoms: 'Symptoms',
      prevention: 'Prevention',
      organicTreatment: 'Organic Treatment'
    },
    preventiveCare: {
      title: 'Preventive Care',
      pageTitle: 'Crop Care Guide',
      pageDescription: 'Proactive tips to keep your crops healthy and thriving.'
    },
    logbook: {
      title: 'Field Logbook',
      addLog: 'Add New Log',
      addLogDescription: 'Record a new activity for your field.',
      activity: 'Activity',
      activityPlaceholder: 'e.g., Applied neem oil',
      notes: 'Notes (optional)',
      notesPlaceholder: 'e.g., On the north field',
      addLogButton: 'Add Log',
      recentActivities: 'Recent Activities',
      noActivities: 'No activities logged yet.'
    },
    chatbot: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything about farming...',
    }
  },
  hi: {
    keyMapping: {
        dashboard: 'डैशबोर्ड',
        encyclopedia: 'विश्वकोश',
        preventiveCare: 'निवारक देखभाल',
        fieldLogbook: 'फील्ड लॉगबुक',
    },
    dashboard: {
      quickGuide: 'त्वरित गाइड',
      guideStep1: '1. प्रभावित फसल का एक स्पष्ट फोटो अपलोड करें।',
      guideStep2: '2. हमारे AI को बीमारियों या कीटों का विश्लेषण करने दें।',
      guideStep3: '3. तुरंत जैविक उपचार सलाह प्राप्त करें।',
      dragAndDrop: 'यहां एक छवि खींचें और छोड़ें',
      or: 'या',
      browseFiles: 'फ़ाइलें ब्राउज़ करें',
      analyzing: 'विश्लेषण हो रहा है...',
      analyzeCrop: 'फसल का विश्लेषण करें',
      analysisReport: 'विश्लेषण रिपोर्ट',
      newAnalysis: 'नया विश्लेषण',
      aiAnalysis: 'एआई विश्लेषण',
      treatmentSuggestions: 'उपचार सुझाव',
      localWeather: 'स्थानीय मौसम',
      selectCity: 'एक शहर चुनें',
      weatherError: 'मौसम डेटा प्राप्त नहीं हो सका।',
      weatherDescription: 'आपकी फसलों के लिए वास्तविक समय की स्थितियाँ',
      sunny: 'धूप',
      humidity: 'नमी',
      uvIndex: 'यूवी इंडेक्स',
      high: 'उच्च',
      highAlert: 'उच्च चेतावनी!',
      alertDescription: 'उच्च नमी और तापमान पाउडरी मिल्ड्यू के खतरे को बढ़ाते हैं। निवारक छिड़काव पर विचार करें।',
      analysisFailed: 'विश्लेषण विफल',
      analysisError: 'छवि का विश्लेषण नहीं हो सका। कृपया पुनः प्रयास करें।'
    },
    encyclopedia: {
      title: 'विश्वकोश',
      symptoms: 'लक्षण',
      prevention: 'निवारण',
      organicTreatment: 'जैविक उपचार'
    },
    preventiveCare: {
      title: 'निवारक देखभाल',
      pageTitle: 'फसल देखभाल गाइड',
      pageDescription: 'आपकी फसलों को स्वस्थ और समृद्ध रखने के लिए सक्रिय सुझाव।'
    },
    logbook: {
      title: 'फील्ड लॉगबुक',
      addLog: 'नया लॉग जोड़ें',
      addLogDescription: 'अपने क्षेत्र के लिए एक नई गतिविधि रिकॉर्ड करें।',
      activity: 'गतिविधि',
      activityPlaceholder: 'उदा., नीम का तेल लगाया',
      notes: 'नोट्स (वैकल्पिक)',
      notesPlaceholder: 'उदा., उत्तरी क्षेत्र पर',
      addLogButton: 'लॉग जोड़ें',
      recentActivities: 'हाल की गतिविधियाँ',
      noActivities: 'अभी तक कोई गतिविधि लॉग नहीं की गई है।'
    },
    chatbot: {
      title: 'एआई सहायक',
      placeholder: 'खेती के बारे में कुछ भी पूछें...',
    }
  },
  te: {
    keyMapping: {
        dashboard: 'డాష్‌బోర్డ్',
        encyclopedia: 'ఎన్సైక్లోపీడియా',
        preventiveCare: 'నివారణ సంరక్షణ',
        fieldLogbook: 'ఫీల్డ్ లాగ్‌బుక్',
    },
    dashboard: {
      quickGuide: 'త్వరిత గైడ్',
      guideStep1: '1. ప్రభావిత పంట యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.',
      guideStep2: '2. మా AI వ్యాధులు లేదా తెగుళ్ళను విశ్లేషించనివ్వండి.',
      guideStep3: '3. తక్షణ సేంద్రీయ చికిత్స సలహాలను స్వీకరించండి.',
      dragAndDrop: 'ఇక్కడ చిత్రాన్ని లాగండి మరియు వదలండి',
      or: 'లేదా',
      browseFiles: 'ఫైల్‌లను బ్రౌజ్ చేయండి',
      analyzing: 'విశ్లేషిస్తోంది...',
      analyzeCrop: 'పంటను విశ్లేషించండి',
      analysisReport: 'విశ్లేషణ నివేదిక',
      newAnalysis: 'కొత్త విశ్లేషణ',
      aiAnalysis: 'AI విశ్లేషణ',
      treatmentSuggestions: 'చికిత్స సూచనలు',
      localWeather: 'స్థానిక వాతావరణం',
      selectCity: 'ఒక నగరాన్ని ఎంచుకోండి',
      weatherError: 'వాతావరణ డేటాను పొందడం సాధ్యం కాలేదు.',
      weatherDescription: 'మీ పంటల కోసం నిజ-సమయ పరిస్థితులు',
      sunny: 'ఎండ',
      humidity: 'తేమ',
      uvIndex: 'UV సూచిక',
      high: 'అధిక',
      highAlert: 'అధిక హెచ్చరిక!',
      alertDescription: 'అధిక తేమ మరియు ఉష్ణోగ్రత బూజు తెగులు ప్రమాదాన్ని పెంచుతాయి. నివారణ స్ప్రేయింగ్ పరిగణించండి.',
      analysisFailed: 'విశ్లేషణ విఫలమైంది',
      analysisError: 'చిత్రాన్ని విశ్లేషించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
    },
    encyclopedia: {
      title: 'ఎన్సైక్లోపీడియా',
      symptoms: 'లక్షణాలు',
      prevention: 'నివారణ',
      organicTreatment: 'సేంద్రీయ చికిత్స'
    },
    preventiveCare: {
      title: 'నివారణ సంరక్షణ',
      pageTitle: 'పంట సంరక్షణ గైడ్',
      pageDescription: 'మీ పంటలను ఆరోగ్యంగా మరియు అభివృద్ధి చెందడానికి చురుకైన చిట్కాలు.'
    },
    logbook: {
      title: 'ఫీల్డ్ లాగ్‌బుక్',
      addLog: 'కొత్త లాగ్ జోడించండి',
      addLogDescription: 'మీ ఫీల్డ్ కోసం కొత్త కార్యాచరణను రికార్డ్ చేయండి.',
      activity: 'కార్యాచరణ',
      activityPlaceholder: 'ఉదా., వేప నూనె పూయబడింది',
      notes: 'గమనికలు (ఐచ్ఛికం)',
      notesPlaceholder: 'ఉదా., ఉత్తర క్షేత్రంలో',
      addLogButton: 'లాగ్ జోడించండి',
      recentActivities: 'ఇటీవలి కార్యకలాపాలు',
      noActivities: 'ఇంకా కార్యకలాపాలు లాగ్ చేయబడలేదు.'
    },
    chatbot: {
      title: 'AI సహాయకుడు',
      placeholder: 'వ్యవసాయం గురించి ఏదైనా అడగండి...',
    }
  },
  ta: {
    keyMapping: {
        dashboard: 'முதன்மைப் பக்கம்',
        encyclopedia: 'களஞ்சியம்',
        preventiveCare: 'தடுப்பு பராமரிப்பு',
        fieldLogbook: 'புல பதிவு புத்தகம்',
    },
    dashboard: {
      quickGuide: 'விரைவு வழிகாட்டி',
      guideStep1: '1. பாதிக்கப்பட்ட பயிரின் தெளிவான புகைப்படத்தைப் பதிவேற்றவும்.',
      guideStep2: '2. எங்கள் AI நோய்கள் அல்லது பூச்சிகளை பகுப்பாய்வு செய்யட்டும்.',
      guideStep3: '3. உடனடி கரிம சிகிச்சை ஆலோசனையைப் பெறுங்கள்.',
      dragAndDrop: 'படத்தை இங்கே இழுத்து விடவும்',
      or: 'அல்லது',
      browseFiles: 'கோப்புகளை உலாவுக',
      analyzing: 'பகுப்பாய்வு செய்யப்படுகிறது...',
      analyzeCrop: 'பயிரை பகுப்பாய்வு செய்',
      analysisReport: 'பகுப்பாய்வு அறிக்கை',
      newAnalysis: 'புதிய பகுப்பாய்வு',
      aiAnalysis: 'AI பகுப்பாய்வு',
      treatmentSuggestions: 'சிகிச்சை பரிந்துரைகள்',
      localWeather: 'உள்ளூர் வானிலை',
      selectCity: 'ஒரு நகரத்தைத் தேர்ந்தெடுக்கவும்',
      weatherError: 'வானிலை தரவைப் பெற முடியவில்லை.',
      weatherDescription: 'உங்கள் பயிர்களுக்கான நிகழ்நேர நிலைமைகள்',
      sunny: 'வெயில்',
      humidity: 'ஈரப்பதம்',
      uvIndex: 'புற ஊதா குறியீடு',
      high: 'அதிகம்',
      highAlert: 'உயர் எச்சரிக்கை!',
      alertDescription: 'அதிக ஈரப்பதம் மற்றும் வெப்பநிலை சாம்பல் நோய் அபாயத்தை αυξάνει. தடுப்பு தெளிப்பைக் கவனியுங்கள்.',
      analysisFailed: 'பகுப்பாய்வு தோல்வியுற்றது',
      analysisError: 'படத்தை பகுப்பாய்வு செய்ய முடியவில்லை. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
    },
    encyclopedia: {
      title: 'களஞ்சியம்',
      symptoms: 'அறிகுறிகள்',
      prevention: 'தடுப்பு',
      organicTreatment: 'கரிம சிகிச்சை'
    },
    preventiveCare: {
      title: 'தடுப்பு பராமரிப்பு',
      pageTitle: 'பயிர் பராமரிப்பு வழிகாட்டி',
      pageDescription: 'உங்கள் பயிர்களை ஆரோக்கியமாகவும் செழிப்பாகவும் வைத்திருக்க செயல்திட்ட குறிப்புகள்.'
    },
    logbook: {
      title: 'புல பதிவு புத்தகம்',
      addLog: 'புதிய பதிவைச் சேர்',
      addLogDescription: 'உங்கள் புலத்திற்கான புதிய செயல்பாட்டைப் பதிவுசெய்க.',
      activity: 'செயல்பாடு',
      activityPlaceholder: 'எ.கா., வேப்ப எண்ணெய் பயன்படுத்தப்பட்டது',
      notes: 'குறிப்புகள் (விருப்பத்தேர்வு)',
      notesPlaceholder: 'எ.கா., வடக்கு புலத்தில்',
      addLogButton: 'பதிவைச் சேர்',
      recentActivities: 'சமீபத்திய செயல்பாடுகள்',
      noActivities: 'செயல்பாடுகள் எதுவும்まだ பதிவு செய்யப்படவில்லை.'
    },
    chatbot: {
        title: 'AI உதவியாளர்',
        placeholder: 'விவசாயம் பற்றி எதுவும் கேளுங்கள்...',
    }
  },
};


function getNestedTranslation(translations: Record<string, any>, key: string, lang: Language): string {
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            const enResult = translations['en'];
            let fallbackResult = enResult;
            for (const fk of keys) {
                if (fallbackResult && typeof fallbackResult === 'object' && fk in fallbackResult) {
                    fallbackResult = fallbackResult[fk];
                } else {
                    return key;
                }
            }
            return typeof fallbackResult === 'string' ? fallbackResult : key;
        }
    }
    return typeof result === 'string' ? result : key;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const getTranslation = useCallback((key: string) => {
    if(!key) return '';
    return getNestedTranslation(translations, key, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
