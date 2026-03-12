// DictionaryPage.jsx — Legal Dictionary with proper multilingual support
import { useState } from 'react';
import { BookMarked, Search, Volume2, VolumeX, Loader2, Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';

const G = '#c9a84c', GL = '#f0d080', MUTED = '#6b6880', TEXT = '#e8e4d8';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧', native: 'English' },
  { code: 'hi', label: 'हिंदी',      flag: '🇮🇳', native: 'Hindi' },
  { code: 'ta', label: 'தமிழ்',      flag: '🇮🇳', native: 'Tamil' },
  { code: 'te', label: 'తెలుగు',     flag: '🇮🇳', native: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ',      flag: '🇮🇳', native: 'Kannada' },
  { code: 'ml', label: 'മലയാളം',     flag: '🇮🇳', native: 'Malayalam' },
  { code: 'mr', label: 'मराठी',      flag: '🇮🇳', native: 'Marathi' },
  { code: 'bn', label: 'বাংলা',      flag: '🇮🇳', native: 'Bengali' },
  { code: 'gu', label: 'ગુજરાતી',    flag: '🇮🇳', native: 'Gujarati' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ',     flag: '🇮🇳', native: 'Punjabi' },
  { code: 'ur', label: 'اردو',       flag: '🇮🇳', native: 'Urdu' },
];

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
  kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali',
  gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu',
};

const COMMON_TERMS = [
  'Bail', 'FIR', 'Chargesheet', 'Cognizance', 'Remand', 'Anticipatory Bail',
  'Habeas Corpus', 'Writ Petition', 'Summons', 'Warrant', 'Acquittal', 'Conviction',
  'Affidavit', 'Injunction', 'Stay Order', 'Lok Adalat', 'PIL', 'CrPC',
  'BNS', 'Vakalatnama', 'Deposition', 'Chargesheet', 'Arbitration', 'Contempt of Court',
];

// Always call API so language is respected
async function lookupTerm(term, lang) {
  const res = await fetch(`${API_URL}/api/legal/explain-term`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term, language: lang }),
  });
  if (!res.ok) throw new Error('API error');
  const d = await res.json();
  if (!d.explanation) throw new Error('No explanation');
  return d.explanation;
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm]   = useState('');
  const [targetLang, setTargetLang]   = useState('hi');
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [speakingId, setSpeakingId]   = useState(null);
  const { speak, stopSpeaking }       = useVoice(targetLang);

  const currentLang = LANGUAGES.find(l => l.code === targetLang);

  const handleLookup = async (term) => {
    const t = (term || searchTerm).trim();
    if (!t) { toast.error('Enter a legal term'); return; }
    setLoading(true);
    try {
      const explanation = await lookupTerm(t, targetLang);
      setResults(prev => [
        { term: t, explanation, lang: targetLang, id: Date.now() },
        ...prev.filter(r => !(r.term.toLowerCase() === t.toLowerCase() && r.lang === targetLang)).slice(0, 9),
      ]);
      setSearchTerm('');
    } catch {
      toast.error('Could not look up term. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (result) => {
    if (speakingId === result.id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      stopSpeaking();
      setSpeakingId(result.id);
      speak(result.explanation);
    }
  };

  const handleLangChange = (code) => {
    setTargetLang(code);
    // Clear results so user re-searches in new language
    setResults([]);
    stopSpeaking();
    setSpeakingId(null);
    toast(`Language changed to ${LANG_NAMES[code]} — search a term to see results`, { icon: '🌐', duration: 2500 });
  };

  return (
    <div>
      <PageHeader icon="📖" title="Legal Dictionary" subtitle="Legal jargon explained in your language — AI-powered" />

      {/* Language Selector — PROMINENT at top */}
      <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))', border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 16, padding: 20, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Globe size={18} color={G} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Choose Your Language</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>
              Explanation will appear in <strong style={{ color: G }}>{currentLang?.label} ({currentLang?.native})</strong>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLangChange(lang.code)}
              style={{
                padding: '9px 16px',
                borderRadius: 11,
                fontSize: 14,
                fontWeight: targetLang === lang.code ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: targetLang === lang.code
                  ? `linear-gradient(135deg,${G},${GL})`
                  : '#16162a',
                border: `1.5px solid ${targetLang === lang.code ? G : 'rgba(255,255,255,0.08)'}`,
                color: targetLang === lang.code ? '#0a0808' : TEXT,
                boxShadow: targetLang === lang.code ? `0 4px 14px rgba(201,168,76,0.3)` : 'none',
                transform: targetLang === lang.code ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (targetLang !== lang.code) { e.currentTarget.style.borderColor = `${G}60`; e.currentTarget.style.color = G; }}}
              onMouseLeave={e => { if (targetLang !== lang.code) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = TEXT; }}}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Box */}
      <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: G, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
          Search Legal Term → Get explanation in {currentLang?.label}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder={`Type any legal term... e.g. Bail, FIR, Habeas Corpus`}
            style={{
              flex: 1,
              background: '#0a0a12',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              color: TEXT,
              fontFamily: 'DM Sans,sans-serif',
              fontSize: 14,
              padding: '12px 14px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '12px 22px', borderRadius: 10,
              background: `linear-gradient(135deg,${G},${GL})`,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              color: '#0a0808', fontWeight: 700, fontSize: 14,
              opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
            }}
          >
            {loading
              ? <Loader2 size={15} style={{ animation: 'dictSpin 0.8s linear infinite' }} />
              : <Search size={15} />}
            {loading ? `Translating...` : `Look Up in ${currentLang?.label}`}
          </button>
        </div>
      </div>

      {/* Common Terms */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: MUTED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Tap any term — explained instantly in <span style={{ color: G }}>{currentLang?.label}</span>:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {COMMON_TERMS.map(term => (
            <button
              key={term}
              onClick={() => handleLookup(term)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                transition: 'all 0.15s', background: '#16162a',
                border: '1px solid rgba(42,42,62,1)', color: MUTED,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${G}50`; e.currentTarget.style.color = G; e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,62,1)'; e.currentTarget.style.color = MUTED; e.currentTarget.style.background = '#16162a'; }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dictSpin { to { transform: rotate(360deg); } }
        @keyframes dictSlideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: MUTED }}>
          <div style={{ width: 30, height: 30, border: `2px solid rgba(201,168,76,0.2)`, borderTopColor: G, borderRadius: '50%', animation: 'dictSpin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13 }}>Getting explanation in <strong style={{ color: G }}>{currentLang?.label}</strong>...</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(result => {
            const resLang = LANGUAGES.find(l => l.code === result.lang);
            const isThisSpeaking = speakingId === result.id;
            return (
              <div
                key={result.id}
                style={{
                  background: '#111120',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: 20,
                  animation: 'dictSlideUp 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: G, marginBottom: 4 }}>
                      {result.term}
                    </h3>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(201,168,76,0.12)', color: G,
                      border: `1px solid rgba(201,168,76,0.3)`,
                      fontFamily: 'JetBrains Mono,monospace',
                    }}>
                      {resLang?.flag} {resLang?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSpeak(result)}
                    title={isThisSpeaking ? 'Stop speaking' : `Listen in ${resLang?.label}`}
                    style={{
                      padding: '8px 14px', borderRadius: 9, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                      background: isThisSpeaking ? 'rgba(232,92,92,0.12)' : 'rgba(201,168,76,0.08)',
                      border: `1px solid ${isThisSpeaking ? 'rgba(232,92,92,0.4)' : 'rgba(201,168,76,0.25)'}`,
                      color: isThisSpeaking ? '#e85c5c' : G,
                      flexShrink: 0,
                    }}
                  >
                    {isThisSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    {isThisSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(232,228,216,0.88)', lineHeight: 1.8 }}>
                  {result.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: MUTED }}>
          <BookMarked size={44} style={{ margin: '0 auto 14px', opacity: 0.2, display: 'block' }} />
          <p style={{ fontSize: 14, marginBottom: 6 }}>
            Select a language above, then search any legal term
          </p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            Currently set to: <strong style={{ color: G }}>{currentLang?.flag} {currentLang?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
