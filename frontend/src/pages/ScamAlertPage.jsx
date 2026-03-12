// src/pages/ScamAlertPage.jsx - Fixed Scam & Fraud Alert
import { useState, useEffect } from 'react';
import { AlertCircle, Search, Loader2, ExternalLink, ChevronDown, ChevronUp, ShieldAlert, ShieldCheck } from 'lucide-react';

// ── Mock API (replace with your real imports) ──────────────────────────────
async function detectScam(description) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are an expert on scams and fraud in India. Analyze the described situation and respond ONLY with a JSON object (no markdown, no backticks):
{
  "isScam": boolean,
  "confidence": number (0-100),
  "scamType": string or null,
  "explanation": string (2-3 sentences),
  "immediateActions": [string] (3-5 actions),
  "reportTo": [string]
}`,
      messages: [{ role: 'user', content: description }],
    }),
  });
  const data = await response.json();
  const text = data.content.map(i => i.text || '').join('');
  const clean = text.replace(/```json|```/g, '').trim();
  return { aiAnalysis: JSON.parse(clean) };
}

const MOCK_PATTERNS = [
  {
    name: 'CBI / Police Impersonation',
    severity: 'HIGH',
    description: 'Fraudsters pose as CBI, ED, or police officers and threaten arrest unless you pay a fine immediately.',
    redFlags: ['Unexpected call from "CBI/ED/Police"', 'Threatens arrest over phone', 'Demands immediate payment', 'Asks to keep call secret'],
    immediateActions: ['Hang up immediately', 'Real agencies never arrest over phone calls', 'Report to 1930 (Cyber Crime Helpline)', 'Block the number'],
  },
  {
    name: 'Lottery / Prize Scam',
    severity: 'HIGH',
    description: 'Victim is told they won a lottery or prize but must pay "taxes/fees" upfront to claim winnings.',
    redFlags: ['You won a lottery you never entered', 'Pay fees to claim prize', 'Urgency / time pressure', 'Request for bank details'],
    immediateActions: ['Do not pay anything', 'Legitimate lotteries never charge upfront', 'Report to cybercrime.gov.in', 'Warn family members'],
  },
  {
    name: 'Matrimonial / Romance Scam',
    severity: 'HIGH',
    description: 'Fake profiles on matrimonial sites build emotional relationships then request money for emergencies.',
    redFlags: ['Never meets in person', 'Claims to be army/doctor abroad', 'Asks for money for visa/emergency', 'Avoids video calls'],
    immediateActions: ['Never send money to strangers online', 'Reverse-image-search their photos', 'Report profile to the platform', 'Talk to a trusted person'],
  },
  {
    name: 'KYC / Bank Fraud',
    severity: 'MEDIUM',
    description: 'Caller claims your bank account/SIM will be blocked if you don\'t complete KYC immediately via a link.',
    redFlags: ['Urgent KYC update required', 'Click a link to avoid suspension', 'Asks for OTP', 'Bank logos in WhatsApp messages'],
    immediateActions: ['Never share OTP with anyone', 'Call your bank\'s official number', 'Do not click unsolicited links', 'Report to your bank immediately'],
  },
];

const PORTALS = [
  { name: 'National Cyber Crime Helpline', helpline: '1930', url: 'cybercrime.gov.in' },
  { name: 'Cyber Crime Portal', helpline: null, url: 'cybercrime.gov.in' },
  { name: 'National Consumer Helpline', helpline: '1800-11-4000', url: 'consumerhelpline.gov.in' },
  { name: 'RBI Ombudsman', helpline: '14440', url: 'rbi.org.in' },
];

const SEV_STYLE = {
  HIGH:   { bg: 'rgba(248,113,113,0.15)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  MEDIUM: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  LOW:    { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
};

export default function ScamAlertPage() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleCheck = async () => {
    if (!description.trim() || description.trim().length < 10) {
      setError('Please describe the suspicious situation in at least 10 characters.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await detectScam(description.trim());
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const G = '#c9a84c';
  const TEXT = '#e8e4d8';
  const MUTED = '#6b6880';
  const BG_CARD = '#111120';
  const BG_INNER = '#0a0a0f';

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: TEXT }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚠️</div>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: TEXT, margin: 0 }}>Scam & Fraud Alert</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>AI detects fake arrest warrants, CBI impersonation &amp; cyber fraud</p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Describe the suspicious situation
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={"Examples:\n• Someone called claiming to be CBI about a money laundering case\n• Received WhatsApp saying I won ₹50 lakh lottery\n• Army officer on matrimonial site asking me to send money for visa"}
          style={{
            width: '100%', minHeight: 110, background: BG_INNER, border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 14, color: TEXT, fontSize: 13, lineHeight: 1.7,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            fontFamily: '"DM Sans", sans-serif',
          }}
        />
        {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>⚠ {error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={handleCheck}
            disabled={loading || !description.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              background: loading || !description.trim() ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.15)',
              border: `1px solid ${G}`, borderRadius: 10, color: G,
              fontWeight: 600, fontSize: 13, cursor: loading || !description.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
            {loading ? 'Analyzing...' : 'Check for Scam'}
          </button>
        </div>
      </div>

      {/* Result */}
      {result?.aiAnalysis && !loading && (() => {
        const ai = result.aiAnalysis;
        const isScam = ai.isScam;
        return (
          <div style={{ marginBottom: 28, animation: 'fadeIn 0.35s ease' }}>
            {/* Verdict */}
            <div style={{
              background: BG_CARD,
              border: `1px solid ${isScam ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.25)'}`,
              borderRadius: 16, padding: 22, marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                {isScam
                  ? <ShieldAlert size={32} color="#f87171" />
                  : <ShieldCheck size={32} color="#4ade80" />
                }
                <div>
                  <div style={{ fontSize: 20, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: isScam ? '#f87171' : '#4ade80' }}>
                    {isScam ? '⚠️ Likely Scam Detected' : '✅ Probably Legitimate'}
                  </div>
                  {ai.confidence !== undefined && (
                    <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: isScam ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)', color: isScam ? '#f87171' : '#4ade80', border: `1px solid ${isScam ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)'}` }}>
                      {ai.confidence}% confidence
                    </span>
                  )}
                </div>
              </div>
              {ai.scamType && <div style={{ fontSize: 13, color: '#fbbf24', marginBottom: 8 }}>Type: <strong>{ai.scamType}</strong></div>}
              <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.8)', lineHeight: 1.75, margin: 0 }}>{ai.explanation}</p>

              {ai.immediateActions?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Immediate Actions</div>
                  {ai.immediateActions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(232,228,216,0.8)', marginBottom: 6 }}>
                      <span style={{ color: '#4ade80', flexShrink: 0 }}>→</span> {a}
                    </div>
                  ))}
                </div>
              )}

              {ai.reportTo?.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Report To</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ai.reportTo.map((r, i) => (
                      <span key={i} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(201,168,76,0.1)', color: G, border: `1px solid rgba(201,168,76,0.25)` }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reporting Portals */}
            <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Official Reporting Portals</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {PORTALS.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: BG_INNER, border: '1px solid rgba(42,42,62,1)' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: TEXT }}>{p.name}</div>
                      {p.helpline && <div style={{ fontSize: 13, color: G, fontFamily: 'monospace', marginTop: 2, fontWeight: 700 }}>{p.helpline}</div>}
                    </div>
                    {p.url && (
                      <a href={`https://${p.url}`} target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Known Patterns */}
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: TEXT, marginBottom: 16 }}>Known Scam Patterns in India</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MOCK_PATTERNS.map((p, i) => {
          const sev = SEV_STYLE[p.severity] || SEV_STYLE.LOW;
          return (
            <div key={i} style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`, fontWeight: 700, flexShrink: 0 }}>{p.severity}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: TEXT }}>{p.name}</span>
                {expanded === i ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
              </button>
              {expanded === i && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(42,42,62,0.7)' }}>
                  <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.75)', lineHeight: 1.7, marginTop: 12, marginBottom: 14 }}>{p.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>🚩 Red Flags</div>
                      {p.redFlags.map((f, j) => <div key={j} style={{ fontSize: 12, color: MUTED, marginBottom: 5 }}>• {f}</div>)}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>✅ Protect Yourself</div>
                      {p.immediateActions.map((a, j) => <div key={j} style={{ fontSize: 12, color: MUTED, marginBottom: 5 }}>• {a}</div>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}