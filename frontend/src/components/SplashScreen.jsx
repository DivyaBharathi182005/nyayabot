// SplashScreen.jsx — Language Selection First, then Splash
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const G = '#c9a84c', GL = '#f0d080', MUTED = 'rgba(201,168,76,0.4)';

const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English',    flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',     native: 'हिंदी',       flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada',   native: 'ಕನ್ನಡ',       flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം',      flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',   native: 'मराठी',       flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',   native: 'বাংলা',       flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',  native: 'ગુજરાતી',     flag: '🇮🇳' },
];

// Per-language welcome text
const WELCOME = {
  en: { title: 'NyayaBot', sub: "India's AI Legal Guardian", btn: 'Enter NyayaBot' },
  hi: { title: 'न्यायबॉट', sub: 'भारत का AI कानूनी सहायक', btn: 'न्यायबॉट में जाएं' },
  ta: { title: 'நியாயபாட்', sub: 'இந்தியாவின் AI சட்ட உதவியாளர்', btn: 'நியாயபாட்டில் நுழைக' },
  te: { title: 'న్యాయబాట్', sub: 'భారతదేశ AI న్యాయ సహాయకుడు', btn: 'న్యాయబాట్ లోకి వెళ్ళు' },
  kn: { title: 'ನ್ಯಾಯಬಾಟ್', sub: 'ಭಾರತದ AI ಕಾನೂನು ಸಹಾಯಕ', btn: 'ನ್ಯಾಯಬಾಟ್ ನಮೂದಿಸಿ' },
  ml: { title: 'ന്യായബോട്ട്', sub: 'ഇന്ത്യയുടെ AI നിയമ സഹായി', btn: 'ന്യായബോട്ടിൽ പ്രവേശിക്കൂ' },
  mr: { title: 'न्यायबॉट', sub: 'भारताचा AI कायदेशीर सहाय्यक', btn: 'न्यायबॉटमध्ये प्रवेश करा' },
  bn: { title: 'ন্যায়াবট', sub: 'ভারতের AI আইনি সহায়ক', btn: 'ন্যায়াবটে প্রবেশ করুন' },
  gu: { title: 'ન્યાયબૉટ', sub: 'ભારતનો AI કાનૂની સહાયક', btn: 'ન્યાયબૉટમાં પ્રવેશ કરો' },
};

const SPLASH_MSGS = {
  en: ['Loading IPC Database...', 'Building Legal Index...', 'Mapping BNS 2023...', 'Ready — Nyaya Prapth Ho! ⚖️'],
  hi: ['IPC डेटाबेस लोड हो रहा है...', 'कानूनी सूचकांक बन रहा है...', 'BNS 2023 मैपिंग...', 'तैयार — न्याय प्राप्त हो! ⚖️'],
  ta: ['IPC தரவுத்தளம் ஏற்றுகிறது...', 'சட்ட குறியீடு உருவாக்குகிறது...', 'BNS 2023 மேப்பிங்...', 'தயார் — நியாயம் கிடைக்கட்டும்! ⚖️'],
  te: ['IPC డేటాబేస్ లోడ్...', 'చట్ట సూచిక నిర్మాణం...', 'BNS 2023 మ్యాపింగ్...', 'సిద్ధం — న్యాయం లభించుగాక! ⚖️'],
  kn: ['IPC ದತ್ತಾಂಶ ಲೋಡ್...', 'ಕಾನೂನು ಸೂಚ್ಯಂಕ ನಿರ್ಮಾಣ...', 'BNS 2023 ಮ್ಯಾಪಿಂಗ್...', 'ಸಿದ್ಧ — ನ್ಯಾಯ ದೊರೆಯಲಿ! ⚖️'],
  ml: ['IPC ഡാറ്റാബേസ് ലോഡ്...', 'നിയമ സൂചിക നിർമ്മാണം...', 'BNS 2023 മാപ്പിംഗ്...', 'തയ്യാർ — നീതി ലഭിക്കട്ടെ! ⚖️'],
  mr: ['IPC डेटाबेस लोड होत आहे...', 'कायदेशीर निर्देशांक तयार...', 'BNS 2023 मॅपिंग...', 'तयार — न्याय मिळो! ⚖️'],
  bn: ['IPC ডেটাবেস লোড হচ্ছে...', 'আইনি সূচক তৈরি হচ্ছে...', 'BNS 2023 ম্যাপিং...', 'প্রস্তুত — ন্যায় পাওয়া যাক! ⚖️'],
  gu: ['IPC ડેટાબેઝ લોડ થઈ રહ્યો છે...', 'કાનૂની અનુક્રમણિકા...', 'BNS 2023 મેપિંગ...', 'તૈયાર — ન્યાય મળો! ⚖️'],
};

// Language selection screen
function LanguageSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#04040c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`
        @keyframes lgFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lgPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: 8, animation: 'lgFadeUp 0.6s ease' }}>
        <div style={{ fontSize: 52, textAlign: 'center', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }}>⚖️</div>
      </div>
      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(36px,6vw,56px)', fontWeight: 900, background: `linear-gradient(135deg,${G},${GL},${G})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4, animation: 'lgFadeUp 0.7s ease' }}>
        NyayaBot
      </h1>
      <p style={{ color: 'rgba(201,168,76,0.5)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'JetBrains Mono,monospace', marginBottom: 32, animation: 'lgFadeUp 0.8s ease' }}>
        India's AI Legal Guardian
      </p>

      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: '14px 20px', marginBottom: 24, textAlign: 'center', animation: 'lgFadeUp 0.9s ease', maxWidth: 460 }}>
        <p style={{ fontSize: 15, color: '#e8e4d8', fontWeight: 600, marginBottom: 4 }}>Select Your Language / अपनी भाषा चुनें</p>
        <p style={{ fontSize: 12, color: MUTED }}>The entire app will work in your chosen language</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 500, width: '100%', animation: 'lgFadeUp 1s ease' }}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            onMouseEnter={() => setHovered(lang.code)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === lang.code ? `linear-gradient(135deg,${G},${GL})` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${hovered === lang.code ? G : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '14px 10px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
              transform: hovered === lang.code ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hovered === lang.code ? `0 8px 24px rgba(201,168,76,0.3)` : 'none',
            }}
          >
            <span style={{ fontSize: 22 }}>{lang.flag}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: hovered === lang.code ? '#0a0808' : '#e8e4d8', fontFamily: lang.code === 'en' ? 'DM Sans,sans-serif' : 'inherit' }}>{lang.native}</span>
            <span style={{ fontSize: 10, color: hovered === lang.code ? '#0a0808' : MUTED, fontFamily: 'JetBrains Mono,monospace', letterSpacing: 1 }}>{lang.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Loading splash after language is selected
function LoadingSplash({ lang, onDone }) {
  const msgs = SPLASH_MSGS[lang] || SPLASH_MSGS.en;
  const welcome = WELCOME[lang] || WELCOME.en;
  const [msg, setMsg] = useState(msgs[0]);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { if (++i < msgs.length) setMsg(msgs[i]); }, 600);
    const t = setTimeout(() => { clearInterval(iv); setHiding(true); setTimeout(onDone, 600); }, 2800);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#04040c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.6s, transform 0.6s', opacity: hiding ? 0 : 1, transform: hiding ? 'scale(1.03)' : 'scale(1)' }}>
      <div style={{ width: 100, height: 100, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.6))' }}>
        <svg viewBox="0 0 140 140" fill="none">
          <defs><linearGradient id="sg2" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse"><stop stopColor="#c9a84c"/><stop offset=".5" stopColor="#f0d080"/><stop offset="1" stopColor="#8b6914"/></linearGradient></defs>
          <circle cx="70" cy="70" r="66" stroke="url(#sg2)" strokeWidth="1.5" strokeDasharray="7 4" opacity=".5"/>
          <rect x="68.5" y="30" width="3" height="78" rx="1.5" fill="url(#sg2)"/>
          <rect x="48" y="106" width="44" height="4" rx="2" fill="url(#sg2)"/>
          <rect x="35" y="47" width="70" height="3" rx="1.5" fill="url(#sg2)" style={{animation:'sway2 3s ease-in-out infinite',transformOrigin:'70px 47px'}}/>
          <line x1="43" y1="50" x2="37" y2="80" stroke="url(#sg2)" strokeWidth="1.5"/>
          <path d="M26 80 Q37 86 48 80" stroke="url(#sg2)" strokeWidth="2" fill="none"/>
          <line x1="97" y1="50" x2="103" y2="80" stroke="url(#sg2)" strokeWidth="1.5"/>
          <path d="M92 80 Q103 86 114 80" stroke="url(#sg2)" strokeWidth="2" fill="none"/>
          <circle cx="70" cy="30" r="5" fill="url(#sg2)"/>
        </svg>
      </div>
      <style>{`@keyframes sway2{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}`}</style>
      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(44px,7vw,72px)', fontWeight: 900, background: `linear-gradient(135deg,${G},${GL},${G})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
        {welcome.title}
      </h1>
      <p style={{ color: 'rgba(201,168,76,0.55)', fontSize: 14, marginTop: 8, fontFamily: 'Playfair Display,serif', fontStyle: 'italic' }}>{welcome.sub}</p>
      <div style={{ marginTop: 36, width: 200, height: 2, background: 'rgba(201,168,76,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg,${G},${GL})`, animation: 'loadbar2 2.4s ease-out forwards', width: 0 }} />
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: '#4a4760', fontFamily: 'JetBrains Mono,monospace', minHeight: 18 }}>{msg}</p>
      <style>{`@keyframes loadbar2{to{width:100%}}`}</style>
    </div>
  );
}

export default function SplashScreen({ onDone }) {
  const [step, setStep] = useState('language'); // 'language' | 'loading'
  const [selectedLang, setSelectedLang] = useState('en');
  const setLanguage = useStore(s => s.setLanguage);

  const handleLangSelect = (code) => {
    setSelectedLang(code);
    setLanguage(code); // set globally immediately
    setStep('loading');
  };

  if (step === 'language') return <LanguageSelect onSelect={handleLangSelect} />;
  return <LoadingSplash lang={selectedLang} onDone={onDone} />;
}