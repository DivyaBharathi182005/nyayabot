// SimulatorPage.jsx — Crime Situation Simulator (Interactive Legal Awareness)
import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, BookOpen } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const G = '#c9a84c', GL = '#f0d080', TEXT = '#e8e4d8', MUTED = '#6b6880';
const GREEN = '#4ade80', RED = '#e85c5c', BLUE = '#60a5fa', PURPLE = '#a78bfa';

const SCENARIOS = [
  {
    id: 'otp_scam',
    category: 'Cyber Crime',
    icon: '📱',
    color: PURPLE,
    difficulty: 'Easy',
    title: 'OTP Fraud Call',
    situation: 'You receive a call. The person says: "I am calling from SBI Bank. Your account will be blocked in 2 hours due to KYC update failure. Please share the OTP you just received to verify your account."',
    question: 'What should you do?',
    options: [
      { id: 'a', text: 'Share the OTP quickly to avoid account blocking', correct: false },
      { id: 'b', text: 'Ask for their employee ID and call back on official bank number', correct: false, partial: true },
      { id: 'c', text: 'Hang up immediately. Call your bank\'s official number. Report to 1930', correct: true },
      { id: 'd', text: 'Give OTP but ask them to process it carefully', correct: false },
    ],
    explanation: 'Banks NEVER ask for OTP over phone. This is a classic OTP fraud. Sharing the OTP = losing money instantly. The correct action is to hang up, call your bank\'s official number (on back of card), and report to Cyber Crime Helpline 1930.',
    law: 'IT Act Section 66C — Identity Theft (3 years imprisonment)',
    authority: 'Report at: cybercrime.gov.in or call 1930',
    tip: 'Real banks send OTPs for YOUR actions (like login or transfer). They never need YOU to share OTP back to them.',
  },
  {
    id: 'fir_refused',
    category: 'Police Rights',
    icon: '🚔',
    color: RED,
    difficulty: 'Medium',
    title: 'Police Refusing FIR',
    situation: 'Your mobile phone was stolen from a restaurant. You go to the police station. The SHO says: "We are very busy. Come back tomorrow. Also, this is a minor matter — we cannot register FIR for every small theft."',
    question: 'What is your CORRECT legal response?',
    options: [
      { id: 'a', text: 'Come back tomorrow as the officer said', correct: false },
      { id: 'b', text: 'Politely insist FIR is your right under Section 154 CrPC, take names of refusing officers', correct: false, partial: true },
      { id: 'c', text: 'Insist on FIR. If refused, send complaint by post to Superintendent of Police. File complaint before Magistrate under Section 156(3)', correct: true },
      { id: 'd', text: 'Accept it and file an online complaint only', correct: false },
    ],
    explanation: 'Refusing to register FIR is illegal under Section 154 CrPC. The SHO cannot refuse. Your escalation options: (1) Write to SP, (2) Approach Magistrate under Section 156(3) CrPC who can directly order investigation, (3) File complaint with State Human Rights Commission.',
    law: 'Section 154 CrPC — Registration of FIR is mandatory. IPC 166A — Public servant disobeying law (1 year)',
    authority: 'Escalate to: Superintendent of Police → Magistrate → SP → High Court',
    tip: 'Note the officer\'s name and badge number before leaving. Send a written application — paper trail is important.',
  },
  {
    id: 'arrest_rights',
    category: 'Arrest Rights',
    icon: '🔒',
    color: '#f97316',
    difficulty: 'Medium',
    title: 'Police Arrest Without Reason',
    situation: 'Police come to your house at 10 PM and say "Come with us for questioning." They do not show any warrant and do not tell you why. They ask you to come "voluntarily."',
    question: 'What are your rights in this situation?',
    options: [
      { id: 'a', text: 'Go with them immediately — police must be obeyed', correct: false },
      { id: 'b', text: 'Refuse completely and lock your door', correct: false },
      { id: 'c', text: 'Ask calmly: "Am I being arrested? If yes, show warrant or state the reason. If not, I am not obligated to come." Inform family member of the situation.', correct: true },
      { id: 'd', text: 'Ask your neighbor to speak to police on your behalf', correct: false },
    ],
    explanation: '"Voluntary" questioning is not the same as arrest. If you are NOT under arrest, you have the right to refuse. If you ARE being arrested, they must state the reason (Article 22 Constitution). Always ask clearly: "Am I under arrest or am I free to go?" The answer determines your rights.',
    law: 'Article 22 Constitution — Right against arbitrary arrest. Section 41 CrPC — When police may arrest',
    authority: 'If illegally detained: File Habeas Corpus in High Court',
    tip: '"Am I under arrest or am I free to go?" — this is the most important question you can ask police.',
  },
  {
    id: 'domestic_violence',
    category: 'Domestic Violence',
    icon: '🏠',
    color: RED,
    difficulty: 'Hard',
    title: 'Domestic Violence Situation',
    situation: 'A woman\'s husband beats her and her in-laws support him. When she says she will call police, her husband says: "This is my house. You have no rights here. I will throw you out." The woman does not have a job.',
    question: 'What are her IMMEDIATE legal options?',
    options: [
      { id: 'a', text: 'Leave the house quietly to avoid more trouble', correct: false },
      { id: 'b', text: 'Call the police for immediate protection only', correct: false, partial: true },
      { id: 'c', text: 'Call 181 or 1091. File DV complaint with Protection Officer. Apply for Residence Order (she CANNOT be thrown out) and Maintenance Order simultaneously.', correct: true },
      { id: 'd', text: 'Wait and file for divorce later', correct: false },
    ],
    explanation: 'Under the Protection of Women from Domestic Violence Act 2005: (1) She has the right to STAY in the shared household regardless of ownership — husband cannot throw her out. (2) Protection Officer provides free help. (3) Maintenance can be ordered within days. (4) Protection Order can be passed within 3 days in urgent cases. She has MULTIPLE immediate remedies.',
    law: 'DV Act 2005 — Section 17 (Right to residence), Section 18 (Protection Order), Section 20 (Monetary relief)',
    authority: 'Call: 181 (Women Helpline) | 1091 | National Commission for Women: 7827170170',
    tip: 'The house does not need to be in her name. DV Act gives her the right to live there — this is one of the most powerful protections.',
  },
  {
    id: 'cyber_evidence',
    category: 'Cyber Crime',
    icon: '💻',
    color: BLUE,
    difficulty: 'Medium',
    title: 'Online Harassment / Blackmail',
    situation: 'Someone is sending you threatening messages on Instagram and says they will post embarrassing photos unless you pay ₹50,000. They are using a fake account.',
    question: 'What should you do FIRST?',
    options: [
      { id: 'a', text: 'Pay the money to make them stop', correct: false },
      { id: 'b', text: 'Delete the messages to clean up your profile', correct: false },
      { id: 'c', text: 'SCREENSHOT EVERYTHING first. Then report to cybercrime.gov.in and nearest police station. Block the account after screenshotting.', correct: true },
      { id: 'd', text: 'Try to find out who it is by responding and asking them to reveal identity', correct: false },
    ],
    explanation: 'NEVER pay — it encourages more extortion. NEVER delete evidence — screenshots and metadata are crucial for police investigation. First action: screenshot everything including the account URL, timestamps, and all messages. Then report to Cyber Crime portal and police. Instagram/WhatsApp can provide IP data to police.',
    law: 'IT Act Section 66E — Privacy violation (3 yrs). IPC Section 384 — Extortion (3 yrs). IPC Section 506 — Criminal intimidation',
    authority: 'Report: cybercrime.gov.in | Call 1930 | Nearest Cyber Crime police station',
    tip: 'Paying blackmailers NEVER stops them — they will come back for more. Evidence first, report immediately.',
  },
  {
    id: 'land_fraud',
    category: 'Property Law',
    icon: '🏗️',
    color: '#f97316',
    difficulty: 'Hard',
    title: 'Fake Property Sale Attempt',
    situation: 'A person approaches you to sell a plot. He shows documents and demands 20% advance "to block the property." He says you must pay in cash and register later. The deal seems profitable.',
    question: 'What are the red flags and what should you do?',
    options: [
      { id: 'a', text: 'Pay advance since the price is attractive and documents look genuine', correct: false },
      { id: 'b', text: 'Pay by cheque so there is a record', correct: false },
      { id: 'c', text: 'Verify documents at Sub-Registrar office, check Encumbrance Certificate, verify seller\'s identity through Aadhaar, NEVER pay cash advance before registration', correct: true },
      { id: 'd', text: 'Ask a friend to verify documents informally', correct: false },
    ],
    explanation: '"Cash advance before registration" is the BIGGEST red flag in property fraud. Always: (1) Get Encumbrance Certificate from Sub-Registrar — shows all existing claims on property, (2) Verify seller identity with government ID, (3) Check property tax receipts, (4) Never pay without registered agreement. Advance payment without registration = money gone.',
    law: 'IPC Section 420 — Cheating. Registration Act 1908 — All property transactions must be registered',
    authority: 'Verify at: Sub-Registrar Office | Land Records Department | Revenue Department',
    tip: '"Urgent" + "Cash only" + "Register later" = SCAM. No legitimate seller insists on these three conditions.',
  },
  {
    id: 'consumer_rights',
    category: 'Consumer Rights',
    icon: '🛒',
    color: GREEN,
    difficulty: 'Easy',
    title: 'Product Defect — Company Refusing Refund',
    situation: 'You bought a washing machine 2 months ago for ₹35,000. It stopped working. The company service center says it is "physical damage" (which it is not) and refuses to replace or refund. Their customer care is not responding.',
    question: 'What is your STRONGEST legal action?',
    options: [
      { id: 'a', text: 'Accept it and pay for repair since warranty may not cover', correct: false },
      { id: 'b', text: 'Post about it on social media to pressure the company', correct: false, partial: true },
      { id: 'c', text: 'Send legal notice to company. File complaint on edaakhil.nic.in claiming: defective product + service deficiency + mental agony compensation. No lawyer needed.', correct: true },
      { id: 'd', text: 'File a police complaint for cheating', correct: false },
    ],
    explanation: 'Consumer Forum (edaakhil.nic.in) is specifically designed for this. For ₹35,000 claim — District Consumer Commission. You can claim: (1) Replacement or full refund, (2) Compensation for mental agony, (3) Litigation costs. No lawyer is mandatory. Company must respond within 30 days or case is decided ex-parte. Court fee is minimal.',
    law: 'Consumer Protection Act 2019 — Section 35. Strict liability for manufacturing defects.',
    authority: 'File at: edaakhil.nic.in (online, free) | National Consumer Helpline: 1800-11-4000',
    tip: 'Consumer Forum is the most consumer-friendly court in India. Companies lose most defect cases. File immediately — do not let company delay you past limitation period.',
  },
  {
    id: 'workplace_posh',
    category: 'Workplace Rights',
    icon: '💼',
    color: '#ec4899',
    difficulty: 'Hard',
    title: 'POSH Act Situation',
    situation: 'A female employee\'s manager repeatedly makes inappropriate comments about her appearance and has started sending personal messages on her phone asking her to "meet privately." She is afraid speaking up will cost her the job.',
    question: 'What is the CORRECT action under law?',
    options: [
      { id: 'a', text: 'Stay quiet to protect her job and hope it stops', correct: false },
      { id: 'b', text: 'Directly confront the manager', correct: false },
      { id: 'c', text: 'Document all incidents with dates and save messages. File complaint with Internal Complaints Committee (ICC) within 3 months. She is legally protected from retaliation.', correct: true },
      { id: 'd', text: 'Resign and find a new job', correct: false },
    ],
    explanation: 'Under POSH Act 2013: (1) Filing an ICC complaint is legally protected — employer CANNOT retaliate through transfer, denial of promotion, or termination, (2) ICC must complete inquiry in 90 days, (3) If company has no ICC, approach Local Complaints Committee at district level, (4) Even verbal/non-physical harassment is covered. She has strong legal protection.',
    law: 'POSH Act 2013 — Section 4 (ICC mandatory), Section 9 (complaint within 3 months), Section 12 (interim relief)',
    authority: 'Approach: ICC → Local Complaints Committee → Labour Commissioner → National Commission for Women',
    tip: 'POSH Act makes retaliation against complainant itself an offence. She is MORE protected after filing than before.',
  },
];

const CATEGORIES = ['All', ...new Set(SCENARIOS.map(s => s.category))];

export default function SimulatorPage() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeScenario, setActiveScenario] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completedIds, setCompletedIds] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  const filtered = categoryFilter === 'All' ? SCENARIOS : SCENARIOS.filter(s => s.category === categoryFilter);
  const scenario = SCENARIOS.find(s => s.id === activeScenario);

  const handleAnswer = (optionId) => {
    if (answered) return;
    setSelectedOption(optionId);
    setAnswered(true);
    const opt = scenario.options.find(o => o.id === optionId);
    if (opt.correct) setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    else setScore(prev => ({ ...prev, total: prev.total + 1 }));
    if (!completedIds.includes(scenario.id)) setCompletedIds(prev => [...prev, scenario.id]);
  };

  const nextScenario = () => {
    const allIds = filtered.map(s => s.id);
    const currentIdx = allIds.indexOf(activeScenario);
    const nextIdx = currentIdx + 1;
    if (nextIdx < allIds.length) {
      setActiveScenario(allIds[nextIdx]);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setShowCongrats(true);
      setActiveScenario(null);
    }
  };

  const restart = () => {
    setActiveScenario(null);
    setSelectedOption(null);
    setAnswered(false);
    setShowCongrats(false);
    setScore({ correct: 0, total: 0 });
    setCompletedIds([]);
  };

  const getOptionStyle = (opt) => {
    if (!answered) return {
      background: '#111120', border: '1px solid rgba(255,255,255,0.07)',
      color: TEXT, cursor: 'pointer',
    };
    if (opt.correct) return { background: 'rgba(74,222,128,0.1)', border: `1px solid ${GREEN}`, color: GREEN, cursor: 'default' };
    if (opt.id === selectedOption && !opt.correct) return { background: 'rgba(232,92,92,0.1)', border: `1px solid ${RED}`, color: RED, cursor: 'default' };
    return { background: '#111120', border: '1px solid rgba(255,255,255,0.04)', color: MUTED, cursor: 'default', opacity: 0.5 };
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader icon="🎯" title="Crime Situation Simulator" subtitle="Learn how to react to real legal situations — interactive training" />

      <style>{`@keyframes simFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Score bar */}
      {score.total > 0 && (
        <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Trophy size={16} color={G} />
          <span style={{ fontSize: 13, color: TEXT }}>Score: <strong style={{ color: G }}>{score.correct}/{score.total}</strong></span>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(score.correct / score.total) * 100}%`, height: '100%', background: `linear-gradient(90deg,${G},${GL})`, borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 12, color: MUTED }}>{Math.round((score.correct / score.total) * 100)}%</span>
        </div>
      )}

      {showCongrats ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#111120', borderRadius: 16, border: '1px solid rgba(201,168,76,0.2)', animation: 'simFadeUp 0.3s ease' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{score.correct === score.total ? '🏆' : score.correct >= score.total / 2 ? '🎯' : '📚'}</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, color: G, marginBottom: 8 }}>
            {score.correct === score.total ? 'Perfect Score!' : score.correct >= score.total / 2 ? 'Good Job!' : 'Keep Learning!'}
          </h2>
          <p style={{ fontSize: 15, color: TEXT, marginBottom: 6 }}>You got <strong style={{ color: G }}>{score.correct} out of {score.total}</strong> correct</p>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Legal awareness is your best protection. Review the explanations of questions you missed.</p>
          <button onClick={restart} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 11, background: `linear-gradient(135deg,${G},${GL})`, border: 'none', cursor: 'pointer', color: '#0a0808', fontWeight: 700, fontSize: 14 }}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      ) : !activeScenario ? (
        <div style={{ animation: 'simFadeUp 0.3s ease' }}>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, fontSize: 13, color: TEXT, lineHeight: 1.7 }}>
            🎯 <strong style={{ color: G }}>How this works:</strong> Real scenarios. Choose the correct action. Get instant explanation with the exact law and authority to contact. This trains you to react correctly when it actually happens.
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', background: categoryFilter === cat ? G : '#16162a', border: `1px solid ${categoryFilter === cat ? G : 'rgba(255,255,255,0.07)'}`, color: categoryFilter === cat ? '#0a0808' : MUTED, fontWeight: categoryFilter === cat ? 700 : 400 }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {filtered.map(s => {
              const done = completedIds.includes(s.id);
              return (
                <button key={s.id} onClick={() => { setActiveScenario(s.id); setSelectedOption(null); setAnswered(false); }}
                  style={{ background: done ? 'rgba(74,222,128,0.04)' : '#111120', border: `1px solid ${done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '50'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{s.icon}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {done && <CheckCircle size={14} color={GREEN} />}
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${s.color}18`, color: s.color, fontFamily: 'JetBrains Mono,monospace' }}>{s.difficulty}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: s.color, marginBottom: 4, fontFamily: 'JetBrains Mono,monospace' }}>{s.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.situation}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'simFadeUp 0.3s ease' }}>
          {/* Scenario header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{scenario.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: scenario.color, fontFamily: 'JetBrains Mono,monospace', marginBottom: 2 }}>{scenario.category} · {scenario.difficulty}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{scenario.title}</div>
              </div>
            </div>
            <button onClick={() => setActiveScenario(null)} style={{ padding: '7px 14px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: MUTED, fontSize: 12 }}>
              ← All Scenarios
            </button>
          </div>

          {/* Situation */}
          <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: G, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Situation</div>
            <p style={{ fontSize: 14, color: TEXT, lineHeight: 1.8 }}>{scenario.situation}</p>
          </div>

          {/* Question */}
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 14 }}>❓ {scenario.question}</div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {scenario.options.map(opt => {
              const style = getOptionStyle(opt);
              return (
                <button key={opt.id} onClick={() => handleAnswer(opt.id)}
                  style={{ ...style, borderRadius: 12, padding: '14px 18px', textAlign: 'left', fontSize: 14, lineHeight: 1.6, transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 12 }}
                  onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor = `${scenario.color}50`; e.currentTarget.style.background = `${scenario.color}0d`; }}}
                  onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111120'; }}}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: 'JetBrains Mono,monospace' }}>
                    {opt.id.toUpperCase()}
                  </span>
                  <span style={{ flex: 1 }}>{opt.text}</span>
                  {answered && opt.correct && <CheckCircle size={18} color={GREEN} style={{ flexShrink: 0 }} />}
                  {answered && opt.id === selectedOption && !opt.correct && <XCircle size={18} color={RED} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {answered && (
            <div style={{ animation: 'simFadeUp 0.3s ease' }}>
              <div style={{ background: scenario.options.find(o => o.id === selectedOption)?.correct ? 'rgba(74,222,128,0.07)' : 'rgba(201,168,76,0.06)', border: `1px solid ${scenario.options.find(o => o.id === selectedOption)?.correct ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.25)'}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: scenario.options.find(o => o.id === selectedOption)?.correct ? GREEN : G, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {scenario.options.find(o => o.id === selectedOption)?.correct ? <CheckCircle size={16} /> : <BookOpen size={16} />}
                  {scenario.options.find(o => o.id === selectedOption)?.correct ? 'Correct! Here\'s why:' : 'The correct answer is C. Here\'s why:'}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.85)', lineHeight: 1.75, marginBottom: 14 }}>{scenario.explanation}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 11 }}>
                    <div style={{ color: G, fontWeight: 700, marginBottom: 4 }}>📖 Law</div>
                    <div style={{ color: 'rgba(232,228,216,0.8)', lineHeight: 1.5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>{scenario.law}</div>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', fontSize: 11 }}>
                    <div style={{ color: BLUE, fontWeight: 700, marginBottom: 4 }}>🏛️ Report To</div>
                    <div style={{ color: 'rgba(232,228,216,0.8)', lineHeight: 1.5, fontSize: 11 }}>{scenario.authority}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 9, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', fontSize: 12, color: 'rgba(232,228,216,0.8)' }}>
                  💡 <strong style={{ color: GREEN }}>Remember: </strong>{scenario.tip}
                </div>
              </div>

              <button onClick={nextScenario} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 12, background: `linear-gradient(135deg,${G},${GL})`, border: 'none', cursor: 'pointer', color: '#0a0808', fontWeight: 700, fontSize: 14 }}>
                Next Scenario <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
