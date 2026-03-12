import { useState, useRef, useCallback, useEffect } from 'react';

// ── Complete BCP-47 locale codes for Indian languages ─────────────
const LANG_LOCALE = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

// Fallback chain: if exact locale not found, try these in order
const LANG_FALLBACKS = {
  hi: ['hi-IN', 'hi'],
  ta: ['ta-IN', 'ta'],
  te: ['te-IN', 'te'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  mr: ['mr-IN', 'mr'],
  gu: ['gu-IN', 'gu'],
  kn: ['kn-IN', 'kn'],
  ml: ['ml-IN', 'ml'],
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
};

// ── Pick best available TTS voice ─────────────────────────────────
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const fallbacks = LANG_FALLBACKS[lang] || [LANG_LOCALE[lang] || 'en-IN'];

  for (const locale of fallbacks) {
    // Exact locale match
    const exact = voices.find(v => v.lang === locale);
    if (exact) return exact;
    // Prefix match (e.g. 'hi' matches 'hi-IN')
    const prefix = voices.find(v => v.lang.startsWith(locale.split('-')[0] + '-'));
    if (prefix) return prefix;
    // Partial match
    const partial = voices.find(v => v.lang.toLowerCase().includes(locale.split('-')[0].toLowerCase()));
    if (partial) return partial;
  }

  // For Indian languages, try Google voices specifically (available in Chrome)
  if (lang !== 'en') {
    const langCode = (LANG_LOCALE[lang] || lang).split('-')[0];
    const googleVoice = voices.find(v => v.name.toLowerCase().includes(langCode) || v.lang.startsWith(langCode));
    if (googleVoice) return googleVoice;
  }

  // Last resort: any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

// ── Clean text for TTS (strip markdown, legal symbols) ────────────
function cleanForSpeech(text) {
  return text
    .replace(/\*\*/g, '').replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/<[^>]*>/g, '')
    .replace(/§/g, 'Section ')
    .replace(/IPC/g, 'I P C')
    .replace(/BNS/g, 'B N S')
    .replace(/FIR/g, 'F I R')
    .replace(/CrPC/g, 'Cr P C')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .substring(0, 3500);
}

export function useVoice(language = 'en') {
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [transcript, setTranscript]     = useState('');
  const [voiceError, setVoiceError]     = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const recogRef  = useRef(null);
  const uttRef    = useRef(null);
  const langRef   = useRef(language);

  // Keep langRef in sync so callbacks always have current language
  useEffect(() => { langRef.current = language; }, [language]);

  // Load voices — Chrome loads them async, fire event when ready
  useEffect(() => {
    const load = () => setVoicesLoaded(true);
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', load);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
    }
  }, []);

  // ── Speech Recognition (STT) ──────────────────────────────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError('Voice input needs Chrome or Edge browser.');
      return;
    }

    // Stop any existing session
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch {}
    }

    const r = new SR();
    const locale = LANG_LOCALE[langRef.current] || 'en-IN';
    r.lang = locale;
    r.interimResults = true;    // show partial results while speaking
    r.continuous = false;        // stop after silence
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
      setTranscript('');
    };

    r.onresult = (e) => {
      // Collect all results (interim + final)
      let full = '';
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript;
      }
      setTranscript(full);
    };

    r.onspeechend = () => {
      try { r.stop(); } catch {}
    };

    r.onend = () => {
      setIsListening(false);
    };

    r.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'not-allowed') {
        setVoiceError('Microphone blocked. Allow mic permission in browser settings.');
      } else if (e.error === 'no-speech') {
        setVoiceError('No speech detected. Try again.');
      } else if (e.error === 'network') {
        setVoiceError('Voice recognition needs internet (Google servers).');
      } else {
        setVoiceError(`Voice error: ${e.error}`);
      }
    };

    recogRef.current = r;
    try {
      r.start();
    } catch (err) {
      setVoiceError('Could not start microphone: ' + err.message);
    }
  }, []); // no deps — uses langRef

  const stopListening = useCallback(() => {
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  // ── Text-to-Speech (TTS) ──────────────────────────────────────
  const speak = useCallback((text, overrideLang) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel anything currently speaking
    window.speechSynthesis.cancel();

    const lang = overrideLang || langRef.current;
    const clean = cleanForSpeech(text);
    if (!clean) return;

    // Chrome has a bug where speech stops after ~15s on long text
    // Split into sentences and chain utterances
    const sentences = clean.match(/[^।.!?\n]+[।.!?\n]*/g) || [clean];
    let idx = 0;

    const speakNext = () => {
      if (idx >= sentences.length) {
        setIsSpeaking(false);
        return;
      }
      const chunk = sentences[idx++].trim();
      if (!chunk) { speakNext(); return; }

      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = LANG_LOCALE[lang] || 'en-IN';
      u.rate = lang === 'en' ? 0.88 : 0.82;  // slightly slower for Indian languages
      u.pitch = 1.05;
      u.volume = 1;

      // Pick best voice for this language
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;

      u.onstart = () => setIsSpeaking(true);
      u.onend = speakNext;
      u.onerror = (e) => {
        // On error try next sentence
        if (e.error !== 'interrupted') speakNext();
        else setIsSpeaking(false);
      };

      uttRef.current = u;
      window.speechSynthesis.speak(u);
    };

    speakNext();
  }, []); // no deps — uses langRef

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    uttRef.current = null;
  }, []);

  // Stop speaking when language changes
  useEffect(() => {
    if (isSpeaking) stopSpeaking();
  }, [language]);

  return {
    isListening,
    isSpeaking,
    transcript,
    voiceError,
    voicesLoaded,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
