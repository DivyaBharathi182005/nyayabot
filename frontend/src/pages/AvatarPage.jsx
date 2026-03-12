// AvatarPage.jsx — Legal Voice Chatbot (converted from lc.zip)
// Photo avatars (lawyer/haritha/divya) + mouth animation + multilingual STT/TTS
// Connects to NyayaBot backend via queryLegal()

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, Loader2, RefreshCw } from 'lucide-react';
import { queryLegal } from '../utils/api';
import useStore from '../store/useStore';

// ── Avatar image imports (place these 3 images in src/assets/avatars/)
import lawyerImg from '../assests/avatars/lawyer.png';
const AVATARS = [
  { label: 'Lawyer', value: 'lawyer', src: lawyerImg },
];

const LANG_OPTIONS = [
  { value: 'en', label: 'English',   locale: 'en-IN' },
  { value: 'ta', label: 'Tamil',     locale: 'ta-IN' },
  { value: 'hi', label: 'Hindi',     locale: 'hi-IN' },
  { value: 'te', label: 'Telugu',    locale: 'te-IN' },
  { value: 'ml', label: 'Malayalam', locale: 'ml-IN' },
  { value: 'bn', label: 'Bengali',   locale: 'bn-IN' },
  { value: 'mr', label: 'Marathi',   locale: 'mr-IN' },
  { value: 'gu', label: 'Gujarati',  locale: 'gu-IN' },
  { value: 'kn', label: 'Kannada',   locale: 'kn-IN' },
];

const GREETINGS = {
  en: "Hello! I am your AI Legal Assistant. Ask me anything about Indian law — FIR filing, rights on arrest, bail, IPC/BNS sections, or any legal situation.",
  hi: "नमस्ते! मैं आपका AI कानूनी सहायक हूँ। FIR, गिरफ्तारी के अधिकार, जमानत, IPC/BNS — कुछ भी पूछें।",
  ta: "வணக்கம்! நான் உங்கள் AI சட்ட உதவியாளர். FIR, கைது உரிமைகள், பிணை, IPC/BNS — எதையும் கேளுங்கள்.",
  te: "నమస్కారం! నేను మీ AI న్యాయ సహాయకుడు. FIR, హక్కులు, బెయిల్, IPC/BNS — ఏదైనా అడగండి.",
  bn: "নমস্কার! আমি আপনার AI আইনি সহকারী। FIR, গ্রেপ্তারের অধিকার, জামিন, IPC/BNS — যেকোনো প্রশ্ন করুন।",
  mr: "नमस्कार! मी तुमचा AI कायदेशीर सहाय्यक. FIR, अटक अधिकार, जामीन, IPC/BNS — काहीही विचारा.",
  gu: "નમસ્તે! હું તમારો AI કાનૂની સહાયક. FIR, ધરપકડ અધિકારો, જામીન, IPC/BNS — કંઈ પણ પૂછો.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕಾನೂನು ಸಹಾಯಕ. FIR, ಬಂಧನ ಹಕ್ಕುಗಳು, ಜಾಮೀನು — ಏನಾದರೂ ಕೇಳಿ.",
  ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI നിയമ സഹായി. FIR, അറസ്റ്റ് അവകാശങ്ങൾ, ജാമ്യം — ഏതും ചോദിക്കൂ.",
};

// ── Animated photo avatar with mouth ─────────────────────────────
function PhotoAvatar({ src, isSpeaking, isListening, isLoading }) {
  const [mouthH, setMouthH] = useState(4);

  useEffect(() => {
    let iv;
    if (isSpeaking) {
      iv = setInterval(() => setMouthH(4 + Math.random() * 12), 110);
    } else {
      setMouthH(4);
    }
    return () => clearInterval(iv);
  }, [isSpeaking]);

  const borderColor = isListening ? '#e85c5c'
    : isSpeaking ? '#c9a84c'
    : isLoading  ? '#60a5fa'
    : 'rgba(255,255,255,0.15)';

  const glowColor = isListening ? 'rgba(232,92,92,0.35)'
    : isSpeaking ? 'rgba(201,168,76,0.35)'
    : isLoading  ? 'rgba(96,165,250,0.25)'
    : 'transparent';

  return (
    <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: -4, borderRadius: '50%',
        boxShadow: `0 0 20px 6px ${glowColor}`,
        transition: 'box-shadow 0.3s',
      }} />
      <img
        src={src}
        alt="avatar"
        style={{
          width: 110, height: 110, borderRadius: '50%',
          objectFit: 'cover', objectPosition: 'top',
          border: `3px solid ${borderColor}`,
          transition: 'border-color 0.3s',
          display: 'block',
        }}
      />
      <div style={{
        position: 'absolute', bottom: 14, left: '50%',
        transform: 'translateX(-50%)',
        width: 22, height: mouthH,
        background: isSpeaking ? '#e85c5c' : 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        transition: 'height 0.08s ease, background 0.3s',
        border: '1.5px solid rgba(255,255,255,0.3)',
      }} />
      <div style={{
        position: 'absolute', bottom: 4, right: 4,
        width: 14, height: 14, borderRadius: '50%',
        background: isListening ? '#e85c5c' : isSpeaking ? '#c9a84c' : isLoading ? '#60a5fa' : '#4ade80',
        border: '2px solid #07070f',
        boxShadow: `0 0 6px ${isListening ? '#e85c5c' : isSpeaking ? '#c9a84c' : isLoading ? '#60a5fa' : '#4ade80'}`,
        animation: (isListening || isSpeaking || isLoading) ? 'dotPulse 0.7s ease-in-out infinite alternate' : 'none',
      }} />
      <style>{`@keyframes dotPulse{from{opacity:0.5}to{opacity:1}}`}</style>
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10,
      animation: 'slideIn 0.2s ease',
    }}>
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        background: isUser ? 'rgba(201,168,76,0.12)' : msg.isError ? 'rgba(232,92,92,0.08)' : '#111128',
        border: `1px solid ${isUser ? 'rgba(201,168,76,0.25)' : msg.isError ? 'rgba(232,92,92,0.3)' : 'rgba(255,255,255,0.07)'}`,
        fontSize: 13.5,
        color: msg.isError ? '#e87070' : '#e8e4d8',
        lineHeight: 1.75,
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function AvatarPage() {
  const { language, setLanguage } = useStore();

  const [avatar, setAvatar]           = useState('lawyer');
  const [query, setQuery]             = useState('');
  const [messages, setMessages]       = useState([{ role: 'bot', text: GREETINGS[language] || GREETINGS.en }]);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);

  const chatRef   = useRef(null);
  const recogRef  = useRef(null);
  const sendRef   = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([{ role: 'bot', text: GREETINGS[language] || GREETINGS.en }]);
  }, [language]);

  const currentLocale = LANG_OPTIONS.find(l => l.value === language)?.locale || 'en-IN';

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text
      .replace(/[#*`>\-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 3000);
    if (!clean) return;
    const sentences = clean.match(/[^।.!?\n]+[।.!?\n]*/g) || [clean];
    let idx = 0;
    const next = () => {
      if (idx >= sentences.length) { setIsSpeaking(false); return; }
      const chunk = sentences[idx++].trim();
      if (!chunk) { next(); return; }
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = currentLocale;
      u.rate = language === 'en' ? 0.9 : 0.82;
      u.pitch = 1.05;
      const voices = voicesRef.current;
      const voice = voices.find(v => v.lang === currentLocale)
        || voices.find(v => v.lang.startsWith(language))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
      if (voice) u.voice = voice;
      u.onstart = () => setIsSpeaking(true);
      u.onend   = next;
      u.onerror = (e) => { if (e.error !== 'interrupted') next(); else setIsSpeaking(false); };
      window.speechSynthesis.speak(u);
    };
    next();
  }, [language, currentLocale]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input needs Chrome or Edge.'); return; }
    if (recogRef.current) { try { recogRef.current.stop(); } catch {} }
    const r = new SR();
    r.lang = currentLocale;
    r.interimResults = true;
    r.continuous = false;
    let final = '';
    r.onstart  = () => { setIsListening(true); setQuery(''); };
    r.onresult = (e) => {
      let interim = '';
      final = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setQuery(final || interim);
    };
    r.onspeechend = () => { try { r.stop(); } catch {} };
    r.onend = () => {
      setIsListening(false);
      if (final.trim()) setTimeout(() => sendRef.current?.(final.trim()), 150);
    };
    r.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed') alert('Microphone blocked — allow mic in browser settings.');
      else if (e.error !== 'no-speech') alert(`Voice error: ${e.error}`);
    };
    recogRef.current = r;
    try { r.start(); } catch (err) { alert('Cannot start mic: ' + err.message); }
  }, [currentLocale]);

  const stopListening = useCallback(() => {
    if (recogRef.current) recogRef.current.stop();
    setIsListening(false);
  }, []);

  const handleSend = useCallback(async (q = query) => {
    const text = (typeof q === 'string' ? q : query).trim();
    if (!text || isLoading) return;
    stopSpeaking();
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsLoading(true);
    try {
      const result = await queryLegal(text, language);
      const reply = (result.analysis || '').replace(/^#+\s*/gm, '').trim();
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      speak(reply);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Connection error. Please try again.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  }, [query, isLoading, language, speak, stopSpeaking]);

  sendRef.current = handleSend;

  const currentAvatar = AVATARS.find(a => a.value === avatar) || AVATARS[0];
  const statusText  = isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Ready';
  const statusColor = isListening ? '#e85c5c' : isSpeaking ? '#c9a84c' : isLoading ? '#60a5fa' : '#4ade80';

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px', fontFamily: 'DM Sans, Arial, sans-serif', color: '#e8e4d8' }}>
      <style>{`
        select { appearance: none; }
        textarea:focus, select:focus, button:focus { outline: none; }
        button:active { transform: scale(0.96); }
        textarea::placeholder { color: #6b6880; opacity: 0.7; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 28 }}>⚖️</div>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, background: 'linear-gradient(135deg,#c9a84c,#f0d080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Legal Voice Assistant
          </div>
          <div style={{ fontSize: 11, color: '#6b6880' }}>IPC · BNS 2023 · Voice-Enabled · 9 Languages</div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: '#0d0d1e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

        {/* Avatar + controls row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 18 }}>

          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <PhotoAvatar src={currentAvatar.src} isSpeaking={isSpeaking} isListening={isListening} isLoading={isLoading} />
            <div style={{ fontSize: 10, color: statusColor, fontFamily: 'monospace', transition: 'color 0.3s' }}>● {statusText}</div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: '#6b6880', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avatar</div>
              <select value={avatar} onChange={e => setAvatar(e.target.value)}
                style={{ width: '100%', background: '#16162a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#e8e4d8', padding: '7px 10px', fontSize: 13, cursor: 'pointer' }}>
                {AVATARS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#6b6880', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Language</div>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                style={{ width: '100%', background: '#16162a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: '#e8e4d8', padding: '7px 10px', fontSize: 13, cursor: 'pointer' }}>
                {LANG_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => isListening ? stopListening() : startListening()}
                style={{ flex: 1, padding: '8px 0', borderRadius: 9, background: isListening ? 'rgba(232,92,92,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isListening ? '#e85c5c55' : 'rgba(255,255,255,0.09)'}`, cursor: 'pointer', color: isListening ? '#e85c5c' : '#6b6880', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                {isListening ? 'Stop' : '🎤 Voice'}
              </button>
              <button onClick={() => { stopSpeaking(); setMessages([{ role: 'bot', text: GREETINGS[language] || GREETINGS.en }]); }}
                style={{ padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer', color: '#6b6880', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={11} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div ref={chatRef} style={{ height: 360, overflowY: 'auto', background: '#07070f', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '12px 10px', marginBottom: 14, display: 'flex', flexDirection: 'column' }}>
          {messages.map((m, i) => <Bubble key={i} msg={m} />)}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b6880', fontSize: 12.5, padding: '8px 4px' }}>
              <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
              Consulting legal database...
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={`Ask in ${LANG_OPTIONS.find(l => l.value === language)?.label || 'English'}... (Enter to send)`}
            rows={2}
            style={{ flex: 1, background: '#10101f', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 11, color: '#e8e4d8', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '10px 13px', resize: 'none', lineHeight: 1.65 }}
          />
          <button onClick={() => handleSend()} disabled={!query.trim() || isLoading}
            style={{ width: 44, height: 44, borderRadius: 11, border: 'none', cursor: query.trim() && !isLoading ? 'pointer' : 'default', background: query.trim() && !isLoading ? 'linear-gradient(135deg,#c9a84c,#f0d080)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !query.trim() || isLoading ? 0.45 : 1 }}>
            {isLoading ? <Loader2 size={15} color="#6b6880" style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={15} color={query.trim() ? '#0a0808' : '#6b6880'} />}
          </button>
        </div>

        <div style={{ fontSize: 10.5, color: '#6b6880', marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>🎤 Click Voice or type</span>
          <span>⚖️ IPC + BNS 2023</span>
          <span>🔊 Auto speaks reply</span>
          <span>🌐 9 Indian languages</span>
        </div>
      </div>
    </div>
  );
}
