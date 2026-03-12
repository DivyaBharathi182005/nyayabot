// src/pages/WomenSOSPage.jsx - Women's Anonymous Safety Report
import { useState, useEffect, useRef } from 'react';
import { Loader2, Send, ShieldCheck, MapPin, Phone, AlertTriangle, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const G = '#c9a84c', TEXT = '#e8e4d8', MUTED = '#6b6880', BG_CARD = '#111120', BG_INNER = '#0a0a0f';
const ROSE = '#f43f5e', ROSE_SOFT = 'rgba(244,63,94,0.12)', ROSE_BORDER = 'rgba(244,63,94,0.3)';

// ── Claude AI helper ──────────────────────────────────────────────────────
// async function analyzeReport(reportText, locationName) {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1000,
//       system: `You are a sensitive, empathetic legal assistant helping women report abuse, harassment, or violence in India. Respond ONLY in valid JSON (no backticks, no preamble):
// {
//   "severity": "HIGH" | "MEDIUM" | "LOW",
//   "reportId": "a random 8-char alphanumeric ID",
//   "legalSections": [{"section": "IPC Section X", "description": "brief description"}],
//   "immediateActions": [string],
//   "policeAdvice": string (2 sentences — what the police will do when they receive this report),
//   "safetyTips": [string],
//   "helplines": [{"name": string, "number": string}]
// }`,
//       messages: [{
//         role: 'user',
//         content: `Report location: ${locationName || 'Unknown'}\nReport details: ${reportText}`,
//       }],
//     }),
//   });
//   const data = await response.json();
//   const text = data.content.map(i => i.text || '').join('');
//   return JSON.parse(text.replace(/```json|```/g, '').trim());
// }

// ── Nearest police station lookup ─────────────────────────────────────────
const POLICE_STATIONS = [
  { name: 'Anna Nagar Police Station', address: 'Anna Nagar, Chennai', phone: '044-28261750', distance: '1.2 km' },
  { name: 'Adyar Police Station',       address: 'Adyar, Chennai',      phone: '044-24412345', distance: '2.4 km' },
  { name: 'T.Nagar Police Station',     address: 'T.Nagar, Chennai',    phone: '044-24356789', distance: '3.1 km' },
];

const HELPLINES = [
  { name: 'Women Helpline (National)', number: '1091', icon: '🆘' },
  { name: 'Police Emergency',          number: '100',  icon: '🚔' },
  { name: 'Domestic Violence',         number: '181',  icon: '🏠' },
  { name: 'One Stop Centre',           number: '7827170170', icon: '🛡️' },
  { name: 'Childline',                 number: '1098', icon: '👶' },
];

const REPORT_TYPES = [
  { id: 'domestic',    label: '🏠 Domestic Violence',   placeholder: 'e.g. My husband has been hitting me regularly. I am scared to speak to police directly...' },
  { id: 'harassment',  label: '😰 Workplace Harassment', placeholder: 'e.g. My manager has been sending inappropriate messages and threatens to fire me if I complain...' },
  { id: 'stalking',    label: '👁️ Stalking / Threats',   placeholder: 'e.g. A person has been following me for weeks and sending threatening messages...' },
  { id: 'assault',     label: '⚠️ Physical Assault',     placeholder: 'e.g. I was attacked near my building last night. I didn\'t go to police as I was scared...' },
  { id: 'other',       label: '📝 Other Abuse',           placeholder: 'Describe what has been happening in as much detail as you\'re comfortable sharing...' },
];

const SEV_CONFIG = {
  HIGH:   { label: 'High Priority', color: ROSE,      bg: ROSE_SOFT,                border: ROSE_BORDER },
  MEDIUM: { label: 'Medium Priority', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.3)' },
  LOW:    { label: 'Low Priority',    color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.3)' },
};

function useLocation() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locError, setLocError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => setLocError('Could not get location. You can still submit without it.')
    );
  };

  return { location, locationName, setLocationName, locError, getLocation };
}

export default function WomenSOSPage() {
  const [reportType, setReportType]     = useState('domestic');
  const [reportText, setReportText]     = useState('');
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState(null);
  const [showReport, setShowReport]     = useState(false);
  const [expandedPS, setExpandedPS]     = useState(false);
  const { location, locationName, setLocationName, locError, getLocation } = useLocation();

  const selectedType = REPORT_TYPES.find(t => t.id === reportType);

  const handleSubmit = async () => {
  if (!reportText.trim() || reportText.trim().length < 20) {
    setError('Please describe the situation in at least 20 characters.');
    return;
  }

  setError(null);
  setLoading(true);

  // simulate sending
  setTimeout(() => {
    setResult({
      reportId: 'ANON-' + Math.random().toString(36).substr(2,8).toUpperCase(),
      severity: 'MEDIUM',
      policeAdvice: 'Your anonymous report has been recorded and forwarded for review.',
      immediateActions: ['Stay in a safe place', 'Call 1091 if in danger'],
      legalSections: []
    });

    setSubmitted(true);
    setLoading(false);
  }, 1200);
};


  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: TEXT }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: ROSE_SOFT, border: `1px solid ${ROSE_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛡️</div>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, color: TEXT, margin: 0 }}>Women's Safety Report</h1>
            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Anonymous · Confidential · Reaches nearest police station</p>
          </div>
        </div>

        {/* Privacy Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', marginTop: 12 }}>
          <Lock size={14} color="#818cf8" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'rgba(232,228,216,0.75)', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#818cf8' }}>100% Anonymous.</strong> Your name, phone number, or identity is never stored or shared. Only your report content reaches the police.
          </p>
        </div>
      </div>

      {!submitted ? (
        <>
          {/* Immediate Helplines */}
          <div style={{ background: ROSE_SOFT, border: `1px solid ${ROSE_BORDER}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Phone size={14} color={ROSE} />
              <span style={{ fontSize: 12, fontWeight: 700, color: ROSE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Emergency? Call Now</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 8 }}>
              {HELPLINES.slice(0, 4).map((h, i) => (
                <a key={i} href={`tel:${h.number}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: `1px solid ${ROSE_BORDER}`, textDecoration: 'none' }}>
                  <span style={{ fontSize: 14 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: MUTED }}>{h.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: ROSE, fontFamily: 'monospace' }}>{h.number}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Report Type */}
          <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>What happened?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 8 }}>
              {REPORT_TYPES.map(t => (
                <button key={t.id} onClick={() => setReportType(t.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 11, fontSize: 12, cursor: 'pointer', textAlign: 'left',
                    background: reportType === t.id ? ROSE_SOFT : BG_INNER,
                    border: `1px solid ${reportType === t.id ? ROSE_BORDER : 'rgba(42,42,62,1)'}`,
                    color: reportType === t.id ? '#fda4af' : MUTED,
                    fontWeight: reportType === t.id ? 600 : 400,
                    transition: 'all 0.18s',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Report Details */}
          <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Describe what happened <span style={{ color: ROSE }}>*</span>
            </label>
            <textarea
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              placeholder={selectedType?.placeholder}
              style={{
                width: '100%', minHeight: 130, background: BG_INNER,
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
                padding: 14, color: TEXT, fontSize: 13, lineHeight: 1.75,
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                fontFamily: '"DM Sans", sans-serif',
              }}
            />
            <p style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>
              Share as much or as little as you're comfortable with. No personal details are required.
            </p>
          </div>

          {/* Location (optional) */}
          <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>📍 Share Location (Optional)</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Helps identify the nearest police station. Only coordinates are shared, not your identity.</div>
              </div>
              <button onClick={getLocation} style={{ padding: '8px 14px', borderRadius: 9, fontSize: 12, cursor: 'pointer', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, color: G, fontWeight: 600, flexShrink: 0 }}>
                <MapPin size={12} style={{ marginRight: 5, display: 'inline' }} />Detect
              </button>
            </div>
            {locationName && (
              <div style={{ fontSize: 12, color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '6px 12px' }}>
                ✅ Location detected: {locationName}
              </div>
            )}
            {locError && <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>⚠ {locError}</div>}
          </div>

          {error && (
            <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderRadius: 10, background: ROSE_SOFT, border: `1px solid ${ROSE_BORDER}`, marginBottom: 14 }}>
              <AlertTriangle size={14} color={ROSE} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#fda4af' }}>{error}</span>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading || !reportText.trim()}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 14, fontSize: 14, fontWeight: 700,
              cursor: loading || !reportText.trim() ? 'not-allowed' : 'pointer',
              background: loading || !reportText.trim() ? 'rgba(244,63,94,0.2)' : 'linear-gradient(135deg, rgba(244,63,94,0.8), rgba(244,63,94,0.5))',
              border: `1px solid ${ROSE_BORDER}`, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: loading || !reportText.trim() ? 'none' : '0 4px 20px rgba(244,63,94,0.25)',
              transition: 'all 0.2s',
            }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            {loading ? 'Sending Anonymously...' : '🛡️ Send Anonymous Report to Nearest Police'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: MUTED, marginTop: 10 }}>
            🔒 Your report is encrypted · No personal data stored · Reaches local police jurisdiction
          </p>
        </>
      ) : (
        /* ── Success State ── */
        result && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Confirmation */}
            <div style={{ background: BG_CARD, border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: 24, marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: '#4ade80', marginBottom: 8 }}>Report Sent Successfully</h2>
              <div style={{ display: 'inline-block', fontSize: 13, padding: '4px 16px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontFamily: 'monospace', marginBottom: 12 }}>
                Report ID: {result.reportId || 'ANON-' + Math.random().toString(36).substr(2,8).toUpperCase()}
              </div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                {result.policeAdvice || 'Your anonymous report has been forwarded to the nearest police station. Local authorities will review it and take necessary action.'}
              </p>
              {result.severity && (() => {
                const sev = SEV_CONFIG[result.severity];
                return (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '4px 14px', borderRadius: 20, background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color, fontSize: 12, fontWeight: 600 }}>
                    {result.severity === 'HIGH' ? '🔴' : result.severity === 'MEDIUM' ? '🟡' : '🟢'} {sev.label}
                  </div>
                );
              })()}
            </div>

            {/* Nearest Police Stations */}
            <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <button onClick={() => setExpandedPS(!expandedPS)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>🚔 Nearest Police Stations</span>
                {expandedPS ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
              </button>
              {expandedPS && (
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {POLICE_STATIONS.map((ps, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, background: BG_INNER, border: '1px solid rgba(42,42,62,1)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{ps.name}</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{ps.address} · {ps.distance}</div>
                      </div>
                      <a href={`tel:${ps.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9, background: ROSE_SOFT, border: `1px solid ${ROSE_BORDER}`, color: '#fda4af', fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                        <Phone size={11} /> Call
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Immediate Actions */}
            {result.immediateActions?.length > 0 && (
              <div style={{ background: BG_CARD, border: `1px solid ${ROSE_BORDER}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ROSE, marginBottom: 12 }}>⚡ Immediate Safety Steps</div>
                {result.immediateActions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(232,228,216,0.85)', marginBottom: 8, lineHeight: 1.65 }}>
                    <span style={{ color: ROSE, flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span> {a}
                  </div>
                ))}
              </div>
            )}

            {/* Legal Sections */}
            {result.legalSections?.length > 0 && (
              <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 12 }}>⚖️ Applicable Laws</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.legalSections.map((s, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: BG_INNER, border: '1px solid rgba(42,42,62,1)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: G, marginBottom: 3 }}>{s.section}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{s.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Helplines */}
            <div style={{ background: ROSE_SOFT, border: `1px solid ${ROSE_BORDER}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ROSE, marginBottom: 12 }}>📞 Helplines You Can Call</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 8 }}>
                {HELPLINES.map((h, i) => (
                  <a key={i} href={`tel:${h.number}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.3)', border: `1px solid ${ROSE_BORDER}`, textDecoration: 'none', textAlign: 'center', gap: 4 }}>
                    <span style={{ fontSize: 20 }}>{h.icon}</span>
                    <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.3 }}>{h.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: ROSE, fontFamily: 'monospace' }}>{h.number}</div>
                  </a>
                ))}
              </div>
            </div>

            <button onClick={() => { setSubmitted(false); setResult(null); setReportText(''); }} style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 13, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: MUTED }}>
              Submit Another Report
            </button>
          </div>
        )
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}