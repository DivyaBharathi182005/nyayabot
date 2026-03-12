// QueryPage.jsx — AI Legal Query Engine v2 (IPC + BNS 2023)
// Enhanced: real-time analysis panel, IPC/BNS side-by-side view, voice, trauma detection
import { useState, useRef, useEffect } from 'react';
import {
  Search, Mic, MicOff, Send, Lock, Loader2, X, History,
  Volume2, VolumeX, AlertTriangle, Scale, Gavel, Shield,
  TrendingUp, BookOpen, ChevronDown, ChevronUp, Copy, CheckCircle, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { queryLegal, detectDistress } from '../utils/api';
import { useVoice } from '../hooks/useVoice';
import useStore from '../store/useStore';
import LegalResult from '../components/LegalResult';
import { useT, t } from '../utils/i18n';

const G = '#c9a84c', GL = '#f0d080', MUTED = '#6b6880', TEXT = '#e8e4d8';
const DANGER = '#e85c5c', GREEN = '#4ade80', BLUE = '#60a5fa', PURPLE = '#a78bfa';

const LANG_LABELS = { en:'English', hi:'हिंदी', ta:'தமிழ்', te:'తెలుగు', bn:'বাংলা', mr:'मराठी', gu:'ગુજరાતી', kn:'ಕನ್ನಡ', ml:'മലയാളം' };

const EXAMPLES = [
  { label: '💰 Unpaid salary', q: 'My employer has not paid salary for 3 months' },
  { label: '🏠 Landlord trespass', q: 'My landlord forcefully entered my house without permission' },
  { label: '📱 Blackmail online', q: 'Someone is blackmailing me with my photos online' },
  { label: '👰 Dowry harassment', q: 'My husband is harassing me for dowry' },
  { label: '🔪 Neighbour assault', q: 'I was physically assaulted by my neighbor' },
  { label: '📋 FIR refused', q: 'Police refusing to file my FIR' },
  { label: '⚰️ Accidental death', q: 'My friend accidentally killed someone in a fight' },
  { label: '✍️ Forged signature', q: 'Someone forged my signature on bank documents' },
  { label: '🚫 Illegal arrest', q: 'I was falsely accused and illegally arrested by police' },
  { label: '💻 OTP fraud', q: 'Someone stole my bank OTP and transferred money — cybercrime' },
  { label: '🔫 Threat to life', q: 'I received death threats from my neighbour' },
  { label: '📦 Property dispute', q: 'My brother is illegally occupying my inherited property' },
];

// ── Compact IPC/BNS Comparison Card ──────────────────────────────
function SectionComparisonCard({ section }) {
  const [open, setOpen] = useState(false);
  if (!section) return null;
  return (
    <div style={{ background: '#0f0f1e', border: `1px solid ${open ? G+'40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 11, marginBottom: 8, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, color: G, fontWeight: 800, background: `${G}15`, padding: '2px 9px', borderRadius: 6, flexShrink: 0 }}>§{section.sectionNumber || section.section}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: TEXT, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{section.offense}</div>
          {section.bns && <div style={{ fontSize: 10.5, color: BLUE, marginTop: 2 }}>→ BNS §{section.bns.bns}</div>}
        </div>
        {section.relevanceScore != null && (
          <span style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono,monospace', padding: '2px 7px', borderRadius: 6, background: `${G}15`, border: `1px solid ${G}30`, color: G, flexShrink: 0 }}>
            {Math.round(section.relevanceScore * 100)}%
          </span>
        )}
        {open ? <ChevronUp size={12} color={MUTED} style={{ flexShrink: 0 }} /> : <ChevronDown size={12} color={MUTED} style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 14px 13px' }}>
          {/* IPC vs BNS side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: section.bns ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 10 }}>
            <div style={{ padding: '10px 12px', background: `${G}0a`, border: `1px solid ${G}25`, borderRadius: 9 }}>
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: G, marginBottom: 6, fontWeight: 700 }}>IPC (OLD)</div>
              <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>{section.punishment}</div>
            </div>
            {section.bns && (
              <div style={{ padding: '10px 12px', background: `${BLUE}0a`, border: `1px solid ${BLUE}25`, borderRadius: 9 }}>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: BLUE, marginBottom: 6, fontWeight: 700 }}>BNS 2023 (NEW)</div>
                <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.6 }}>{section.bns.punishment || 'Refer BNS §' + section.bns.bns}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Case Strength Meter ───────────────────────────────────────────
function CaseStrengthMeter({ caseStrength }) {
  if (!caseStrength) return null;
  const { verdict, score, reasons, challenges, recommendation } = caseStrength;
  const color = { STRONG: GREEN, MODERATE: G, WEAK: DANGER }[verdict] || G;
  const pct = Math.max(0, Math.min(100, score || 50));

  return (
    <div style={{ padding: '16px 18px', background: '#0f0f1e', border: `1px solid ${color}30`, borderRadius: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <TrendingUp size={15} color={color} />
        <span style={{ fontSize: 13, fontWeight: 700, color }}>Case Strength: {verdict}</span>
        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 3, transition: 'width 0.8s ease' }} />
        </div>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: 'JetBrains Mono,monospace' }}>{score}/100</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: recommendation ? 10 : 0 }}>
        {reasons?.slice(0, 3).length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: GREEN, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>✓ Strengths</div>
            {reasons.slice(0, 3).map((r, i) => <div key={i} style={{ fontSize: 11.5, color: MUTED, marginBottom: 4, lineHeight: 1.5 }}>• {r}</div>)}
          </div>
        )}
        {challenges?.slice(0, 3).length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: DANGER, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>⚠ Challenges</div>
            {challenges.slice(0, 3).map((c, i) => <div key={i} style={{ fontSize: 11.5, color: MUTED, marginBottom: 4, lineHeight: 1.5 }}>• {c}</div>)}
          </div>
        )}
      </div>
      {recommendation && (
        <div style={{ padding: '9px 12px', background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 9, fontSize: 12, color: TEXT }}>
          <Zap size={11} color={color} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          {recommendation}
        </div>
      )}
    </div>
  );
}

// ── Landmark Cases Panel ──────────────────────────────────────────
function PrecedentsPanel({ precedents }) {
  if (!precedents?.length) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Gavel size={13} color={PURPLE} />
        <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Landmark Cases</span>
      </div>
      {precedents.slice(0, 3).map((p, i) => (
        <div key={i} style={{ padding: '12px 14px', background: '#0f0f1e', border: '1px solid rgba(167,139,250,0.15)', borderRadius: 11, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{p.case}</span>
            <span style={{ fontSize: 10, color: PURPLE, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>{p.year}</span>
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 4, lineHeight: 1.5 }}>{p.principle}</div>
          <div style={{ fontSize: 11, color: PURPLE, opacity: 0.7 }}>{p.court} · {p.citation}</div>
        </div>
      ))}
    </div>
  );
}

// ── Emergency Numbers ─────────────────────────────────────────────
function EmergencyNumbers({ numbers }) {
  if (!numbers) return null;
  const items = [
    { label: 'Police', num: numbers.police, color: BLUE },
    { label: 'Emergency', num: numbers.national_emergency, color: DANGER },
    { label: 'Women', num: numbers.women_helpline, color: '#f472b6' },
    { label: 'Cyber', num: numbers.cyber_crime, color: PURPLE },
    { label: 'Child', num: numbers.child_helpline, color: GREEN },
    { label: 'Mental Health', num: numbers.mental_health, color: G },
  ];
  return (
    <div style={{ padding: '14px 16px', background: 'rgba(232,92,92,0.07)', border: `1px solid ${DANGER}35`, borderRadius: 13, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <AlertTriangle size={13} color={DANGER} />
        <span style={{ fontSize: 12, fontWeight: 700, color: DANGER, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Emergency Contacts</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 12px', background: `${it.color}12`, border: `1px solid ${it.color}30`, borderRadius: 10, minWidth: 70 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: it.color, fontFamily: 'JetBrains Mono,monospace' }}>{it.num}</span>
            <span style={{ fontSize: 9.5, color: MUTED, marginTop: 2, textAlign: 'center' }}>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compact query stats ───────────────────────────────────────────
function QueryStats({ result }) {
  if (!result) return null;
  const secs = result.retrievedSections || [];
  const strength = result.caseStrength?.verdict;
  const sColor = { STRONG: GREEN, MODERATE: G, WEAK: DANGER }[strength] || MUTED;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
      {[
        { icon: <Scale size={11} color={G} />, label: `${secs.length} sections matched`, color: G },
        strength && { icon: <TrendingUp size={11} color={sColor} />, label: `Case: ${strength}`, color: sColor },
        result.precedents?.length && { icon: <Gavel size={11} color={PURPLE} />, label: `${result.precedents.length} precedents`, color: PURPLE },
        result.isDistress && { icon: <AlertTriangle size={11} color={DANGER} />, label: 'Emergency detected', color: DANGER },
      ].filter(Boolean).map((stat, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: stat.color, padding: '4px 10px', background: `${stat.color}10`, border: `1px solid ${stat.color}25`, borderRadius: 20 }}>
          {stat.icon} {stat.label}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function QueryPage() {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [hasDistress, setHasDistress] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis'); // analysis | sections | cases
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const {
    language, setLanguage,
    anonymousMode, setAnonymousMode,
    isLoading, queryResult, queryError,
    setLoading, setQueryResult, setQueryError, clearResult, addToHistory, queryHistory,
  } = useStore();

  const T = useT();
  const EXAMPLES = t(language, 'queryExamples') || t('en', 'queryExamples');

  const { isListening, transcript, isSpeaking, startListening, stopListening, speak, stopSpeaking, voiceError } = useVoice(language);

  // Update query box with live transcript while speaking
  useEffect(() => { if (transcript) setQuery(transcript); }, [transcript]);

  // Auto-submit when voice recognition stops and we have a transcript
  const prevListening = useRef(false);
  useEffect(() => {
    if (prevListening.current && !isListening && transcript && transcript.trim().length > 3) {
      // Small delay to ensure state is settled
      setTimeout(() => {
        handleSubmit(transcript.trim());
      }, 300);
    }
    prevListening.current = isListening;
  }, [isListening]);

  useEffect(() => { if (query.length > 4) setHasDistress(detectDistress(query)); else setHasDistress(false); }, [query]);

  const handleSubmit = async (q = query) => {
    const text = (typeof q === 'string' ? q : query).trim();
    if (!text || text.length < 5) { toast.error('Please describe your legal situation in more detail.'); return; }
    setLoading(true); clearResult(); setActiveTab('analysis');
    try {
      const result = await queryLegal(text, language, anonymousMode);
      setQueryResult(result);
      addToHistory(text, result);
      if (result.isDistress) toast.error('⚠️ Emergency situation — help numbers shown.', { duration: 5000 });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to process query';
      setQueryError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (queryResult?.analysis) {
      navigator.clipboard.writeText(queryResult.analysis).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  const TABS = [
    { id: 'analysis', label: 'AI Analysis', icon: <BookOpen size={12} /> },
    { id: 'sections', label: `Sections (${queryResult?.retrievedSections?.length || 0})`, icon: <Scale size={12} /> },
    { id: 'cases', label: `Precedents (${queryResult?.precedents?.length || 0})`, icon: <Gavel size={12} /> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes qSpin{to{transform:rotate(360deg)}} @keyframes qBounce{from{transform:scaleY(0.5)}to{transform:scaleY(1.3)}}
        @keyframes qFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        textarea:focus,select:focus{outline:none} button:active{transform:scale(0.97)}
        textarea::placeholder{color:${MUTED};opacity:0.6}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.2);border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>⚖️ {T('queryTitle')}</h1>
            <p style={{ fontSize: 13, color: MUTED }}>{T('querySubtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 9, color: TEXT, padding: '7px 10px', fontSize: 12, cursor: 'pointer' }}>
              {Object.entries(LANG_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={() => setAnonymousMode(!anonymousMode)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, background: anonymousMode ? `${G}18` : 'none', border: `1px solid ${anonymousMode ? G+'40' : 'rgba(255,255,255,0.1)'}`, color: anonymousMode ? G : MUTED, fontSize: 12, cursor: 'pointer' }}>
              <Lock size={12} /> {anonymousMode ? 'Anon ON' : T('queryAnonymous')}
            </button>
            {queryHistory.length > 0 && (
              <button onClick={() => setShowHistory(!showHistory)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 12, cursor: 'pointer' }}>
                <History size={12} /> ({queryHistory.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Distress alert */}
      {hasDistress && !queryResult && (
        <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(232,92,92,0.07)', border: `1px solid ${DANGER}30`, animation: 'qFadeUp 0.3s ease' }}>
          <AlertTriangle size={14} color={DANGER} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13 }}>
            <span style={{ color: DANGER, fontWeight: 700 }}>Emergency detected — </span>
            <span style={{ color: MUTED }}>Police: </span><strong style={{ color: DANGER }}>100</strong>
            <span style={{ color: MUTED }}> · Emergency: </span><strong style={{ color: DANGER }}>112</strong>
            <span style={{ color: MUTED }}> · Women: </span><strong style={{ color: DANGER }}>1091</strong>
            <span style={{ color: MUTED }}> · iCall: </span><strong style={{ color: DANGER }}>9152987821</strong>
          </div>
        </div>
      )}

      {/* Input card */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
        {anonymousMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: G, marginBottom: 10, fontFamily: 'JetBrains Mono,monospace' }}>
            <Lock size={10} /> Anonymous mode — query not stored
          </div>
        )}
        <textarea ref={textareaRef} value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
          placeholder={T('queryPlaceholder')}
          style={{ width: '100%', background: 'none', border: 'none', color: TEXT, fontFamily: 'DM Sans,sans-serif', fontSize: 14, lineHeight: 1.75, resize: 'none', minHeight: 120 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 11, color: MUTED }}>
            {query.length}/2000
            {voiceError && <span style={{ color: DANGER }}> · {voiceError}</span>}
            {isListening && <span style={{ color: DANGER }}> · 🎤 {T('queryListening')}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => isListening ? stopListening() : startListening()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: isListening ? 'rgba(232,92,92,0.14)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isListening ? DANGER+'40' : 'rgba(255,255,255,0.1)'}`, color: isListening ? DANGER : MUTED, fontSize: 13, cursor: 'pointer' }}>
              {isListening ? <MicOff size={13} /> : <Mic size={13} />} {isListening ? T('queryAnalyse') : T('queryVoice')}
            </button>
            {queryResult?.analysis && (
              <button onClick={() => isSpeaking ? stopSpeaking() : speak(queryResult.analysis)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: isSpeaking ? `${G}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${isSpeaking ? G+'40' : 'rgba(255,255,255,0.1)'}`, color: isSpeaking ? G : MUTED, fontSize: 13, cursor: 'pointer' }}>
                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />} {isSpeaking ? 'Stop' : 'Read Aloud'}
              </button>
            )}
            {queryResult?.analysis && (
              <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? GREEN : MUTED, fontSize: 13, cursor: 'pointer' }}>
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />} {copied ? T('queryCopied') : T('queryCopy')}
              </button>
            )}
            {(query || queryResult) && (
              <button onClick={() => { setQuery(''); clearResult(); }} style={{ padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 13, cursor: 'pointer' }}>
                <X size={13} />
              </button>
            )}
            <button onClick={() => handleSubmit()} disabled={isLoading || !query.trim()} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 20px', borderRadius: 10, background: query.trim() && !isLoading ? `linear-gradient(135deg,${G},${GL})` : 'rgba(255,255,255,0.04)', border: 'none', color: query.trim() && !isLoading ? '#0a0808' : MUTED, fontSize: 13, fontWeight: 700, cursor: query.trim() && !isLoading ? 'pointer' : 'default', opacity: (isLoading || !query.trim()) ? 0.6 : 1 }}>
              {isLoading ? <Loader2 size={13} style={{ animation: 'qSpin 0.8s linear infinite' }} /> : <Search size={13} />}
              {isLoading ? 'Analyzing...' : T('queryAnalyse')}
            </button>
          </div>
        </div>
      </div>

      {/* Example queries */}
      {!queryResult && !isLoading && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{T('queryTryExample')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setQuery(ex.q); handleSubmit(ex.q); }}
                style={{ fontSize: 12, padding: '5px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, color: 'rgba(232,228,216,0.55)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderColor = `${G}35`; e.currentTarget.style.background = `${G}0a`; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,228,216,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 16, padding: '40px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'flex-end', height: 28, marginBottom: 16 }}>
            {[8,14,20,14,8].map((h,i) => (
              <div key={i} style={{ width: 5, height: h, background: G, borderRadius: 3, animation: `qBounce ${0.6+i*0.1}s ${i*0.12}s ease-in-out infinite alternate` }} />
            ))}
          </div>
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{T('queryAnalysing')}</div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['RAG retrieval', 'AI analysis', 'Case strength', 'Precedents'].map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: G, animation: `qBounce 0.6s ${i*0.15}s ease-in-out infinite alternate` }} /> {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {queryError && (
        <div style={{ background: '#111120', border: `1px solid ${DANGER}30`, borderRadius: 14, padding: '16px 20px', marginBottom: 14 }}>
          <div style={{ color: DANGER, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Error</div>
          <div style={{ color: MUTED, fontSize: 13 }}>{queryError}</div>
        </div>
      )}

      {/* Results */}
      {queryResult && (
        <div style={{ animation: 'qFadeUp 0.3s ease' }}>
          {/* Emergency numbers */}
          {queryResult.isDistress && <EmergencyNumbers numbers={queryResult.emergencyNumbers} />}

          {/* Stats strip */}
          <QueryStats result={queryResult} />

          {/* Case strength meter */}
          <CaseStrengthMeter caseStrength={queryResult.caseStrength} />

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#0f0f1e', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 9, background: activeTab === tab.id ? `linear-gradient(135deg,${G}22,${G}15)` : 'none', border: `1px solid ${activeTab === tab.id ? G+'35' : 'transparent'}`, color: activeTab === tab.id ? G : MUTED, fontSize: 12.5, fontWeight: activeTab === tab.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'analysis' && <LegalResult result={queryResult} />}

          {activeTab === 'sections' && (
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Matched IPC / BNS 2023 Sections (ranked by relevance)</div>
              {queryResult.retrievedSections?.length > 0
                ? queryResult.retrievedSections.map((s, i) => <SectionComparisonCard key={i} section={s} />)
                : <div style={{ color: MUTED, fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No sections retrieved for this query.</div>
              }
            </div>
          )}

          {activeTab === 'cases' && (
            <div>
              {queryResult.precedents?.length > 0
                ? <PrecedentsPanel precedents={queryResult.precedents} />
                : <div style={{ color: MUTED, fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No landmark cases found for this query.</div>
              }
            </div>
          )}
        </div>
      )}

      {/* History modal */}
      {showHistory && queryHistory.length > 0 && (
        <div onClick={() => setShowHistory(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111120', border: `1px solid ${G}25`, borderRadius: 18, padding: 24, maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: TEXT }}>{T('queryHistoryTitle')}</span>
              <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            {queryHistory.map((h, i) => (
              <button key={i} onClick={() => { setQuery(h.query); setQueryResult(h.result); setShowHistory(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', marginBottom: 6, color: TEXT }}>
                <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 3 }}>{h.query}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{new Date(h.timestamp).toLocaleString('en-IN')}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
