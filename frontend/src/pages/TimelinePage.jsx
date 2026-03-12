// TimelinePage.jsx — Legal Case Timeline Tracker
import { useState } from 'react';
import { CheckCircle, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';


const G = '#c9a84c', MUTED = '#6b6880', TEXT = '#e8e4d8', GREEN = '#4ade80', BLUE = '#60a5fa';

const CRIMINAL = [
  { id: 'fir', stage: 'FIR Filed', icon: '📋', avg: '1 day', min: 1, max: 7, tips: 'Get FIR copy immediately. Note FIR number and date. Demand receipt.' },
  { id: 'investigation', stage: 'Police Investigation', icon: '🔍', avg: '60–90 days', min: 60, max: 90, tips: 'Cooperate but don\'t give statements without a lawyer. Preserve evidence.' },
  { id: 'chargesheet', stage: 'Chargesheet Filed', icon: '📄', avg: '60–90 days from arrest', min: 60, max: 90, tips: 'If police don\'t file chargesheet in time → Default Bail right under Section 167(2) CrPC.' },
  { id: 'cognizance', stage: 'Court Takes Cognizance', icon: '⚖️', avg: '1–4 weeks', min: 14, max: 30, tips: 'Court officially recognises the case. Accused may be summoned.' },
  { id: 'charges_framed', stage: 'Charges Framed', icon: '📝', avg: '1–2 months', min: 14, max: 60, tips: 'Critical stage — accused pleads guilty or not guilty. Have a strong lawyer present.' },
  { id: 'trial', stage: 'Trial', icon: '👥', avg: '6 months – 3 years', min: 180, max: 1095, tips: 'Attend every hearing. Document all delays. Apply for speedy trial if excessive delay.' },
  { id: 'arguments', stage: 'Final Arguments', icon: '🗣️', avg: '1–3 months', min: 14, max: 60, tips: 'Maintain complete records of all hearings and orders.' },
  { id: 'judgment', stage: 'Judgment', icon: '🏛️', avg: '1–4 weeks', min: 7, max: 30, tips: 'Can appeal to a higher court within 90 days of conviction.' },
  { id: 'appeal', stage: 'Appeal (if needed)', icon: '📤', avg: '1–5 years', min: 180, max: 1825, tips: 'Sessions Court → High Court → Supreme Court. Each level has 90-day filing limit.' },
];

const CIVIL = [
  { id: 'notice', stage: 'Legal Notice Sent', icon: '📨', avg: '1–7 days', min: 1, max: 7, tips: 'Send by registered post. Keep acknowledgment. Give 30 days to respond.' },
  { id: 'plaint', stage: 'Plaint Filed in Court', icon: '📋', avg: '1–4 weeks', min: 7, max: 30, tips: 'Court fee varies by claim amount. Attach all documents and vakalatnama.' },
  { id: 'summons', stage: 'Summons Issued', icon: '📬', avg: '2–8 weeks', min: 14, max: 60, tips: 'Court sends summons to defendant. If evaded, court can proceed ex-parte.' },
  { id: 'written_stmt', stage: 'Written Statement', icon: '📝', avg: '30–90 days', min: 30, max: 90, tips: 'Defendant files reply. Can be extended by court with good reason.' },
  { id: 'issues', stage: 'Issues Framed', icon: '🔖', avg: '2–6 weeks', min: 14, max: 45, tips: 'Court identifies key disputed facts and law. Critical for scope of case.' },
  { id: 'evidence', stage: 'Evidence & Discovery', icon: '🔍', avg: '3 months – 1 year', min: 90, max: 365, tips: 'Submit all documents here. Examine and cross-examine witnesses.' },
  { id: 'arguments', stage: 'Final Arguments', icon: '🗣️', avg: '1–2 months', min: 14, max: 60, tips: 'Prepare strong written arguments alongside oral arguments.' },
  { id: 'decree', stage: 'Decree / Judgment', icon: '🏛️', avg: '1–4 weeks', min: 7, max: 30, tips: 'Get certified copy of decree for execution. Can appeal within 30 days.' },
];

const COURTS = [
  { level: 1, court: 'Police Station', note: 'FIR, Investigation', color: '#6b6880' },
  { level: 2, court: 'Magistrate Court', note: 'Minor crimes, remand, bail', color: '#4ade80' },
  { level: 3, court: 'Sessions / District Court', note: 'Serious crimes, civil suits', color: BLUE },
  { level: 4, court: 'High Court', note: 'Appeals, writs — per state', color: '#818cf8' },
  { level: 5, court: 'Supreme Court of India', note: 'Final appeal, constitutional', color: G },
];

export default function TimelinePage() {
  const [caseType, setCaseType] = useState('criminal');
  const [currentStage, setCurrentStage] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [projection, setProjection] = useState(null);

  const stages = caseType === 'criminal' ? CRIMINAL : CIVIL;

  const calculateProjection = () => {
    if (!startDate || !currentStage) return;
    const start = new Date(startDate);
    const idx = stages.findIndex(s => s.id === currentStage);
    let d = new Date(start);
    const proj = stages.map((s, i) => {
      if (i < idx) return { ...s, status: 'DONE', date: null };
      const estDate = new Date(d);
      d = new Date(d.getTime() + s.min * 86400000);
      return { ...s, status: i === idx ? 'CURRENT' : 'UPCOMING', date: estDate.toLocaleDateString('en-IN') };
    });
    setProjection(proj);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <PageHeader icon="📅" title="Case Timeline Tracker" subtitle="Track stages with average duration estimates for Indian courts" />

      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>📅 Legal Case Timeline</h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>Track your case stage and estimate future hearing dates</p>

      {/* Type Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {['criminal', 'civil'].map(t => (
          <button key={t} onClick={() => { setCaseType(t); setProjection(null); setCurrentStage(null); }}
            style={{ padding: '9px 22px', borderRadius: 10, border: `1px solid ${caseType === t ? G : 'rgba(255,255,255,0.1)'}`, background: caseType === t ? 'rgba(201,168,76,0.12)' : 'none', color: caseType === t ? G : MUTED, cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {t === 'criminal' ? '🔒 Criminal Case' : '⚖️ Civil Case'}
          </button>
        ))}
      </div>

      {/* Projection Calculator */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 12 }}>🗓️ Project Your Timeline</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>CASE START DATE (e.g. FIR date)</div>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', background: '#16162a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, color: TEXT, padding: '9px 12px', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ flex: 2, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>CURRENT STAGE</div>
            <select value={currentStage || ''} onChange={e => setCurrentStage(e.target.value)}
              style={{ width: '100%', background: '#16162a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, color: TEXT, padding: '9px 12px', fontSize: 13, outline: 'none' }}>
              <option value="">Select current stage...</option>
              {stages.map(s => <option key={s.id} value={s.id}>{s.icon} {s.stage}</option>)}
            </select>
          </div>
          <button onClick={calculateProjection} disabled={!startDate || !currentStage}
            style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0a0808', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: (!startDate || !currentStage) ? 0.5 : 1, whiteSpace: 'nowrap' }}>
            Calculate
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(201,168,76,0.12)', zIndex: 0 }} />
        {(projection || stages).map((s, i) => {
          const status = projection ? s.status : null;
          const isExpanded = expandedStage === i;
          const isDone = status === 'DONE';
          const isCurrent = status === 'CURRENT';
          return (
            <div key={s.id} style={{ display: 'flex', gap: 16, marginBottom: 12, position: 'relative', zIndex: 1 }}>
              {/* Dot */}
              <div style={{ width: 42, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: isDone ? GREEN : isCurrent ? G : '#16162a', border: `2px solid ${isDone ? GREEN : isCurrent ? G : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? <CheckCircle size={12} color="#0a0808" fill={GREEN} /> : isCurrent ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0a0808' }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
                </div>
              </div>

              {/* Card */}
              <div style={{ flex: 1, background: isCurrent ? 'rgba(201,168,76,0.06)' : '#111120', border: `1px solid ${isCurrent ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, overflow: 'hidden', opacity: isDone ? 0.55 : 1 }}>
                <button onClick={() => setExpandedStage(isExpanded ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: isCurrent ? G : TEXT }}>
                        {s.stage}
                        {isCurrent && <span style={{ fontSize: 10, background: 'rgba(201,168,76,0.2)', color: G, padding: '1px 7px', borderRadius: 4, marginLeft: 8, fontFamily: 'JetBrains Mono,monospace' }}>YOU ARE HERE</span>}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Clock size={10} /> {s.avg}
                        {projection && s.date && <span style={{ color: BLUE }}>· Est. {s.date}</span>}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
                </button>
                {isExpanded && (
                  <div style={{ padding: '4px 16px 14px 48px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 12.5, color: TEXT, opacity: 0.8, lineHeight: 1.65, padding: '10px 14px', background: 'rgba(201,168,76,0.04)', borderRadius: 9, borderLeft: `3px solid rgba(201,168,76,0.3)` }}>
                      💡 {s.tips}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Court Hierarchy */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '18px 22px', marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 14 }}>🏛️ Indian Court Hierarchy</div>
        {COURTS.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${c.color}18`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.level}</div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{c.court}</span>
              <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{c.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: MUTED, textAlign: 'center' }}>
        ⚠️ Timeline estimates are based on national averages. Actual durations vary by court, judge, and case complexity. Fast track courts and POCSO courts operate on shorter timelines.
      </div>
    </div>
  );
}
