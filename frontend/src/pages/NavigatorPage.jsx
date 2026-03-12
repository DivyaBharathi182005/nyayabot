// NavigatorPage.jsx — Legal Procedure Navigator (AI Decision Tree / GPS for Justice)
import { useState } from 'react';
import { ChevronRight, ChevronDown, MapPin, CheckCircle, Circle, ArrowRight, RotateCcw } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const G = '#c9a84c', GL = '#f0d080', TEXT = '#e8e4d8', MUTED = '#6b6880';
const BLUE = '#60a5fa', GREEN = '#4ade80', RED = '#e85c5c', PURPLE = '#a78bfa';

const SITUATIONS = [
  { id: 'theft',      icon: '🔓', label: 'Theft / Robbery',        color: BLUE },
  { id: 'dv',         icon: '🏠', label: 'Domestic Violence',       color: RED },
  { id: 'cyber',      icon: '💻', label: 'Cyber Fraud / Scam',      color: PURPLE },
  { id: 'land',       icon: '🏗️', label: 'Land / Property Dispute', color: '#f97316' },
  { id: 'workplace',  icon: '💼', label: 'Workplace Harassment',    color: '#ec4899' },
  { id: 'assault',    icon: '⚠️', label: 'Assault / Physical Hurt', color: RED },
  { id: 'consumer',   icon: '🛒', label: 'Consumer Complaint',      color: GREEN },
  { id: 'cheating',   icon: '📋', label: 'Cheating / Fraud',        color: '#f97316' },
];

const ROADMAPS = {
  theft: {
    title: 'Theft / Robbery Case Roadmap',
    laws: ['IPC Section 379 — Theft (3 yrs)', 'IPC Section 392 — Robbery (10 yrs)', 'BNS Section 303 — Theft (new law)'],
    urgency: 'File FIR within 24 hours for best evidence preservation',
    steps: [
      { n: 1, title: 'File FIR at Police Station', desc: 'Go to nearest police station. Describe what was stolen, when, where, and any suspects. Demand a free copy of FIR — it is your legal right (Section 154 CrPC).', tip: 'If police refuse FIR, approach SP office or file complaint before Magistrate (Section 156(3) CrPC).', time: 'Day 1', icon: '🚔', law: 'Section 154 CrPC' },
      { n: 2, title: 'Collect Evidence', desc: 'Gather CCTV footage requests, witness contact details, photos of the scene, receipts/bills for stolen items, and any digital evidence.', tip: 'Give a written list of all stolen items with approximate values to police.', time: 'Day 1–3', icon: '🔍', law: 'IPC Section 379' },
      { n: 3, title: 'Police Investigation', desc: 'Police investigate — question suspects, check CCTV, record witness statements. They must complete investigation within 60–90 days.', tip: 'Follow up every week. If no progress in 30 days, write to SP.', time: '30–90 days', icon: '🗂️', law: 'Section 173 CrPC' },
      { n: 4, title: 'Chargesheet Filed', desc: 'If accused is identified, police file chargesheet in the Magistrate court naming the accused and charges.', tip: 'If police close case without chargesheet, file a protest petition in court.', time: 'Day 60–90', icon: '📄', law: 'Section 173 CrPC' },
      { n: 5, title: 'Court Hearing Begins', desc: 'Magistrate takes cognizance, issues summons to accused. First hearing scheduled. You may engage a lawyer at this stage.', tip: 'Apply for free legal aid at DLSA if you cannot afford a lawyer — call 15100.', time: 'Day 90–120', icon: '⚖️', law: 'Section 190 CrPC' },
      { n: 6, title: 'Trial — Evidence & Arguments', desc: 'Both sides present evidence. You will be called as a witness. Your lawyer cross-examines the accused and defence witnesses.', tip: 'Keep all documents safely. Attend all hearing dates. Absence can weaken your case.', time: '6–24 months', icon: '🏛️', law: 'Section 228 CrPC' },
      { n: 7, title: 'Judgment', desc: 'Court pronounces verdict — conviction or acquittal. If convicted, sentence is passed. If acquitted, you can appeal in Sessions Court.', tip: 'You can appeal any unsatisfactory judgment within 90 days.', time: 'After trial', icon: '🔨', law: 'Section 374 CrPC' },
    ],
  },
  dv: {
    title: 'Domestic Violence Case Roadmap',
    laws: ['IPC Section 498A — Cruelty by husband (3 yrs)', 'Protection of Women from DV Act 2005', 'BNS Section 85 — Cruelty (new law)', 'IPC Section 304B — Dowry death (7 yrs min)'],
    urgency: 'EMERGENCY: Call 181 (Women Helpline) or 100 immediately if in danger',
    steps: [
      { n: 1, title: 'Reach a Safe Place', desc: 'Leave the unsafe environment. Go to a trusted person, shelter home, or One Stop Centre. Call 181 (Women Helpline) or 1091 for immediate help.', tip: 'Government Shelter Homes (Swadhar Greh) provide free food, shelter, and legal help.', time: 'Immediately', icon: '🆘', law: 'DV Act Section 6' },
      { n: 2, title: 'Contact Protection Officer', desc: 'Every district has a government-appointed Protection Officer (free). They help file Domestic Incident Report (DIR) and apply for Protection Orders.', tip: 'Protection Officer\'s contact is available at District Collectorate or Women & Child Welfare office.', time: 'Day 1–2', icon: '🛡️', law: 'DV Act Section 9' },
      { n: 3, title: 'File Police Complaint / FIR', desc: 'File FIR at nearest police station under IPC 498A (cruelty) or DV Act. Women police stations are preferred. You can also file complaint before Magistrate directly.', tip: 'Take a trusted person or NGO volunteer with you for support when filing FIR.', time: 'Day 1–3', icon: '🚔', law: 'IPC Section 498A' },
      { n: 4, title: 'Apply for Protection Order', desc: 'Magistrate can pass Protection Order within 3 days in urgent cases. This legally prohibits the abuser from contacting you or entering your home.', tip: 'Violation of Protection Order is a criminal offence — abuser can be arrested immediately.', time: 'Day 3–7', icon: '📋', law: 'DV Act Section 18' },
      { n: 5, title: 'Apply for Residence & Maintenance', desc: 'You have the right to stay in the shared household regardless of ownership. Apply for Residence Order and interim maintenance for yourself and children.', tip: 'Maintenance can be backdated to the date of application.', time: 'Day 7–30', icon: '🏠', law: 'DV Act Section 19, 20' },
      { n: 6, title: 'Criminal Trial (498A)', desc: 'Police file chargesheet. Trial proceeds in Magistrate court. You will testify. Keep all evidence — photos, medical reports, messages, witnesses.', tip: 'Hire a woman advocate if possible. Legal aid is free — call 15100.', time: '6–24 months', icon: '⚖️', law: 'IPC Section 498A' },
      { n: 7, title: 'Judgment & Relief', desc: 'Court awards punishment to accused and/or grants permanent maintenance, residence rights, custody of children.', tip: 'You can also simultaneously file for divorce in family court if desired.', time: 'After trial', icon: '🔨', law: 'DV Act Section 28' },
    ],
  },
  cyber: {
    title: 'Cyber Fraud / Scam Case Roadmap',
    laws: ['IT Act Section 66C — Identity theft (3 yrs)', 'IT Act Section 66D — Impersonation (3 yrs)', 'IPC Section 420 — Cheating (7 yrs)', 'BNS Section 318 — Cheating (new law)'],
    urgency: 'Report within GOLDEN HOUR — call 1930 immediately for money recovery freeze',
    steps: [
      { n: 1, title: 'Call Cyber Crime Helpline 1930', desc: 'Call 1930 IMMEDIATELY. The faster you report, the higher the chance of freezing the fraudulent transaction before money is withdrawn.', tip: 'Also report at cybercrime.gov.in. Keep your transaction ID, account number, and fraud details ready.', time: 'Within 1 hour', icon: '📞', law: 'IT Act Section 66C' },
      { n: 2, title: 'Contact Your Bank', desc: 'Call bank\'s 24x7 helpline and report fraud. Request transaction freeze/reversal. File a chargeback claim for card fraud. Get transaction details in writing.', tip: 'RBI mandates banks to resolve fraud complaints within 90 days. Keep all bank communications.', time: 'Within 24 hours', icon: '🏦', law: 'RBI Circular on Cyber Fraud' },
      { n: 3, title: 'File Online Complaint', desc: 'Register complaint at cybercrime.gov.in — upload screenshots, transaction IDs, chat history, call recordings, and all evidence. You get a complaint number.', tip: 'Take screenshots of everything BEFORE reporting — scammers may delete profiles.', time: 'Day 1', icon: '💻', law: 'IT Act Section 66' },
      { n: 4, title: 'File Police FIR', desc: 'Go to nearest police station or Cyber Crime police station with your online complaint number. File FIR under IT Act 66C and IPC 420.', tip: 'Cyber Crime cells exist in every district now. Print your online complaint for reference.', time: 'Day 2–3', icon: '🚔', law: 'IT Act Section 66C, IPC 420' },
      { n: 5, title: 'Preserve All Evidence', desc: 'Save all SMS, emails, WhatsApp messages, call recordings, screenshots, UPI transaction IDs, and bank statements. Do NOT delete anything.', tip: 'Get call detail records from your telecom provider — may help identify fraudster.', time: 'Ongoing', icon: '🔍', law: 'IT Act Section 65' },
      { n: 6, title: 'Police Investigation', desc: 'Cyber police trace IP addresses, mobile numbers, bank accounts. They coordinate with other states and IFSO (Intelligence Fusion & Strategic Operations).', tip: 'Follow up every 2 weeks. Cyber cases can take 3–12 months to investigate.', time: '3–12 months', icon: '🗂️', law: 'Section 78 IT Act' },
      { n: 7, title: 'Trial & Compensation', desc: 'Accused tried in cyber crime court. You may also file civil suit for recovery of lost money in addition to criminal case.', tip: 'Keep records of all financial losses for civil compensation claim.', time: '1–3 years', icon: '⚖️', law: 'IT Act Section 66C' },
    ],
  },
  land: {
    title: 'Land / Property Dispute Roadmap',
    laws: ['Transfer of Property Act 1882', 'Specific Relief Act 1963', 'IPC Section 447 — Trespass', 'Registration Act 1908'],
    urgency: 'Do NOT make any payments without registered documents',
    steps: [
      { n: 1, title: 'Collect All Documents', desc: 'Gather sale deed, khata/patta, encumbrance certificate, property tax receipts, survey records, and any correspondence about the dispute.', tip: 'Get encumbrance certificate from Sub-Registrar office — shows all transactions on property.', time: 'Week 1', icon: '📁', law: 'Registration Act 1908' },
      { n: 2, title: 'Send Legal Notice', desc: 'Through a lawyer, send a registered legal notice to the opposing party stating your claim and demanding resolution within 30 days.', tip: 'Keep acknowledgment card (AD card) safely — it proves they received the notice.', time: 'Week 2', icon: '📬', law: 'Specific Relief Act' },
      { n: 3, title: 'Try Mediation First', desc: 'Many property disputes resolve faster through mediation or Lok Adalat. Approach District Legal Services Authority (DLSA) for free mediation.', tip: 'Lok Adalat settlements are final and binding — cannot be appealed. Much faster than court.', time: 'Week 3–6', icon: '🤝', law: 'Legal Services Auth. Act' },
      { n: 4, title: 'File Civil Suit', desc: 'If mediation fails, file civil suit in District Court for declaration of title, injunction, or specific performance. Pay court fee based on property value.', tip: 'Attach ALL documents. Incomplete plaint causes delays. Hire experienced property lawyer.', time: 'Month 2–3', icon: '⚖️', law: 'CPC Order 7' },
      { n: 5, title: 'Apply for Interim Injunction', desc: 'If other party is trying to sell/transfer property during dispute, apply for interim stay/injunction immediately to freeze the property.', tip: 'Urgent injunctions can be granted same day in emergency situations.', time: 'Immediately if needed', icon: '🔒', law: 'CPC Order 39' },
      { n: 6, title: 'Trial & Evidence', desc: 'Present all documents, survey reports, witness testimonies. Court may appoint commissioner to inspect property. Process takes 2–5 years typically.', tip: 'Local witnesses (neighbors, village elders) are very valuable in land cases.', time: '2–5 years', icon: '🏛️', law: 'Indian Evidence Act' },
      { n: 7, title: 'Decree & Execution', desc: 'Court passes decree in your favor. If other party does not comply, file execution petition. Court can attach property and enforce decree.', tip: 'Register the court decree at Sub-Registrar office after execution.', time: 'After judgment', icon: '🔨', law: 'CPC Order 21' },
    ],
  },
  workplace: {
    title: 'Workplace Harassment Roadmap',
    laws: ['POSH Act 2013 — Sexual harassment', 'IPC Section 354 — Assault on woman', 'BNS Section 74', 'SC & ST Prevention of Atrocities Act'],
    urgency: 'Document every incident with date, time, witnesses immediately',
    steps: [
      { n: 1, title: 'Document Everything', desc: 'Write down every incident with date, time, location, witnesses, and exact words/actions. Save all emails, messages, call logs as evidence.', tip: 'Send yourself an email describing each incident — creates a timestamped record.', time: 'Immediately', icon: '📝', law: 'POSH Act 2013' },
      { n: 2, title: 'File Complaint with ICC', desc: 'Every company with 10+ employees must have an Internal Complaints Committee (ICC). File written complaint within 3 months of incident.', tip: 'If no ICC exists, company is violating POSH Act — report this to Labour Commissioner.', time: 'Within 3 months', icon: '🏢', law: 'POSH Act Section 4' },
      { n: 3, title: 'ICC Inquiry Process', desc: 'ICC must complete inquiry within 90 days. Both parties heard. You can request interim relief — transfer of harasser or work from home during inquiry.', tip: 'You can bring a support person (not lawyer) to ICC proceedings.', time: '90 days', icon: '🔍', law: 'POSH Act Section 11' },
      { n: 4, title: 'If ICC Fails — Local Complaints Committee', desc: 'If company has no ICC or you are not satisfied, approach District Officer\'s Local Complaints Committee (LCC). Free, government body.', tip: 'LCC handles cases from small businesses and domestic workers too.', time: 'Parallel option', icon: '🏛️', law: 'POSH Act Section 6' },
      { n: 5, title: 'File Police Complaint', desc: 'For severe harassment (physical assault, stalking, threats), file FIR at nearest police station. POSH and criminal proceedings can run simultaneously.', tip: 'Women police stations handle workplace harassment cases sensitively.', time: 'Parallel option', icon: '🚔', law: 'IPC Section 354' },
      { n: 6, title: 'Labour Court / Civil Court', desc: 'For unfair termination or salary issues related to harassment, approach Labour Court. For compensation, file civil suit.', tip: 'Keep all salary slips, employment contract, and termination letter.', time: 'If needed', icon: '⚖️', law: 'Industrial Disputes Act' },
      { n: 7, title: 'Relief & Compensation', desc: 'ICC/LCC can order: written apology, transfer, termination of harasser, and compensation. Criminal case can result in imprisonment.', tip: 'You can also file complaint with National Commission for Women (ncw.nic.in).', time: 'After proceedings', icon: '✅', law: 'POSH Act Section 13' },
    ],
  },
  assault: {
    title: 'Assault / Physical Hurt Case Roadmap',
    laws: ['IPC Section 323 — Voluntarily causing hurt (1 yr)', 'IPC Section 324 — Hurt by weapon (3 yrs)', 'IPC Section 325 — Grievous hurt (7 yrs)', 'BNS Sections 115–118'],
    urgency: 'Seek medical treatment FIRST — medical report is critical evidence',
    steps: [
      { n: 1, title: 'Get Medical Treatment', desc: 'Go to nearest government hospital or private hospital. Treatment is more important than anything else. The Medico-Legal Certificate (MLC) issued is critical evidence.', tip: 'Ask specifically for an MLC (Medico-Legal Certificate). Mention you want to file a police complaint.', time: 'Immediately', icon: '🏥', law: 'Section 54 CrPC' },
      { n: 2, title: 'File FIR at Police Station', desc: 'File FIR with your MLC, photos of injuries, and witness details. Mention exact sections — 323, 324, or 325 depending on severity.', tip: 'Photograph all injuries before and after treatment. Timestamps on photos are evidence.', time: 'Day 1', icon: '🚔', law: 'IPC Section 323/324/325' },
      { n: 3, title: 'Record Witness Statements', desc: 'Note names and contact numbers of all witnesses immediately. Ask them to give statements to police. Eyewitness testimony is very powerful.', tip: 'Video record witness accounts on your phone if they are willing.', time: 'Day 1–2', icon: '👥', law: 'Indian Evidence Act' },
      { n: 4, title: 'Police Investigation', desc: 'Police record your statement (Section 161 CrPC), arrest accused if cognizable offence, conduct scene inspection, and collect CCTV footage.', tip: 'If police are slow, approach SP or file complaint before Magistrate.', time: '30–60 days', icon: '🔍', law: 'Section 161 CrPC' },
      { n: 5, title: 'Medical Board (for Grievous Hurt)', desc: 'For serious injuries (fractures, permanent disability), police refer to Medical Board for assessment. Board report determines whether Section 323, 324, or 325 applies.', tip: 'Higher severity = higher section = more punishment for accused.', time: 'As needed', icon: '🏥', law: 'IPC Section 320' },
      { n: 6, title: 'Trial in Magistrate Court', desc: 'Chargesheet filed. Trial proceeds. You testify. Your MLC, photos, and witnesses presented as evidence. Simple hurt cases complete within 6–18 months.', tip: 'Attend all hearing dates. Absence weakens the prosecution case.', time: '6–18 months', icon: '⚖️', law: 'Section 228 CrPC' },
      { n: 7, title: 'Judgment & Compensation', desc: 'Conviction leads to imprisonment and/or fine. You can also claim compensation from accused through the court.', tip: 'File compensation application under Section 357 CrPC at time of judgment.', time: 'After trial', icon: '🔨', law: 'Section 357 CrPC' },
    ],
  },
  consumer: {
    title: 'Consumer Complaint Roadmap',
    laws: ['Consumer Protection Act 2019', 'District Commission (up to ₹50 lakh)', 'State Commission (up to ₹2 crore)', 'National Commission (above ₹2 crore)'],
    urgency: 'Keep ALL bills, receipts, warranty cards — without them complaint is weak',
    steps: [
      { n: 1, title: 'Send Legal Notice to Company', desc: 'Send registered letter to company demanding replacement/refund/repair within 15 days. This is mandatory before filing consumer complaint.', tip: 'Send by Speed Post with AD (acknowledgment due). Keep the receipt.', time: 'Day 1', icon: '📬', law: 'Consumer Protection Act' },
      { n: 2, title: 'File Online Complaint', desc: 'If no response within 15 days, file at edaakhil.nic.in (online consumer portal). Free, no lawyer needed. Upload all documents.', tip: 'You can file from home. No need to visit court. Track status online.', time: 'Day 16+', icon: '💻', law: 'Section 35 CP Act 2019' },
      { n: 3, title: 'Pay Minimal Court Fee', desc: 'Fee is very nominal — ₹200 for claims up to ₹5 lakh, ₹400 up to ₹10 lakh. Much less than civil court fees.', tip: 'Senior citizens, women complainants get priority disposal under new Act.', time: 'With filing', icon: '💰', law: 'CP Act Schedule of Fees' },
      { n: 4, title: 'Commission Issues Notice', desc: 'Consumer Commission issues notice to company (opposite party). They must respond within 30 days.', tip: 'If company does not respond, case is decided ex-parte (in your favor).', time: 'Within 21 days of filing', icon: '📋', law: 'Section 38 CP Act' },
      { n: 5, title: 'Mediation Attempt', desc: 'New 2019 Act mandates mediation attempt. If both parties agree, consumer mediator helps reach settlement faster (30–45 days).', tip: 'Accept reasonable offer in mediation — trial takes longer.', time: '30–45 days', icon: '🤝', law: 'Section 37 CP Act 2019' },
      { n: 6, title: 'Hearing & Order', desc: 'If no settlement, hearing proceeds. Commission must decide within 3–5 months under new Act. You can present your case personally — no lawyer mandatory.', tip: 'Consumer cases are consumer-friendly. Burden is on company to prove they are right.', time: '3–5 months', icon: '⚖️', law: 'Section 38(7) CP Act' },
      { n: 7, title: 'Relief & Execution', desc: 'Commission orders refund, replacement, compensation, and may impose penalty on company. Company must comply within 30 days or face contempt.', tip: 'If company does not comply, file execution petition. Commission can attach company assets.', time: 'After order', icon: '✅', law: 'Section 71 CP Act' },
    ],
  },
  cheating: {
    title: 'Cheating / Fraud Case Roadmap',
    laws: ['IPC Section 420 — Cheating (7 yrs)', 'IPC Section 406 — Criminal breach of trust (3 yrs)', 'BNS Section 318 — Cheating (new law)', 'BNS Section 316 — Criminal breach of trust'],
    urgency: 'File FIR quickly — cheats often move money and assets fast',
    steps: [
      { n: 1, title: 'Gather All Evidence', desc: 'Collect all payment receipts, agreements, messages, emails, call records, cheques, bank statements proving money was given and promise was made.', tip: 'Written agreements are strongest evidence. Even WhatsApp messages are valid evidence.', time: 'Day 1', icon: '📁', law: 'Indian Evidence Act' },
      { n: 2, title: 'Send Demand Notice', desc: 'Send registered legal notice demanding return of money within 15 days. This creates legal record and gives chance for settlement before court.', tip: 'Sometimes cheats settle after legal notice to avoid criminal proceedings.', time: 'Day 2–3', icon: '📬', law: 'IPC Section 420' },
      { n: 3, title: 'File FIR at Police Station', desc: 'File FIR under IPC 420 (cheating) and/or 406 (criminal breach of trust) depending on facts. Bring all documents.', tip: 'Economic offences cell handles large fraud cases. Approach them for cheating above ₹1 lakh.', time: 'Day 3–5', icon: '🚔', law: 'IPC Section 420/406' },
      { n: 4, title: 'File Civil Suit for Recovery', desc: 'Simultaneously file civil suit in District Court for recovery of money. Civil and criminal cases can run together.', tip: 'Attach accused\'s assets (property, bank accounts) through interim injunction to prevent hiding assets.', time: 'Parallel', icon: '⚖️', law: 'CPC Order 38' },
      { n: 5, title: 'Police Investigation', desc: 'Police investigate financial trail, record statements, and arrest accused if enough evidence. For large amounts, Economic Offences Wing gets involved.', tip: 'Provide police all bank account details of accused — helps freeze assets.', time: '60–90 days', icon: '🔍', law: 'Section 173 CrPC' },
      { n: 6, title: 'Trial', desc: 'Criminal trial proceeds. Your evidence, witnesses, and financial records are presented. Cheating cases often settle at this stage.', tip: 'Civil recovery suit may give you money back faster than waiting for criminal conviction.', time: '1–3 years', icon: '🏛️', law: 'Section 228 CrPC' },
      { n: 7, title: 'Judgment & Recovery', desc: 'Criminal: accused imprisoned + fine. Civil: decree for recovery of money with interest. Court can order attachment and sale of accused\'s property.', tip: 'File both civil and criminal simultaneously for maximum pressure and recovery chance.', time: 'After trial', icon: '🔨', law: 'IPC Section 420' },
    ],
  },
};

const STEP_COLORS = [G, BLUE, PURPLE, '#f97316', GREEN, '#ec4899', RED];

export default function NavigatorPage() {
  const [selected, setSelected] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const roadmap = selected ? ROADMAPS[selected] : null;

  const toggleStep = (n) => setActiveStep(activeStep === n ? null : n);
  const toggleComplete = (n, e) => {
    e.stopPropagation();
    setCompletedSteps(prev => prev.includes(n) ? prev.filter(s => s !== n) : [...prev, n]);
  };
  const reset = () => { setSelected(null); setActiveStep(null); setCompletedSteps([]); };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader icon="🗺️" title="Legal Procedure Navigator" subtitle="Step-by-step GPS for the Indian justice system" />

      <style>{`
        @keyframes navFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes navPulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.3)} 50%{box-shadow:0 0 0 8px rgba(201,168,76,0)} }
      `}</style>

      {!selected ? (
        <div style={{ animation: 'navFadeUp 0.3s ease' }}>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, fontSize: 13, color: TEXT, lineHeight: 1.7 }}>
            🗺️ <strong style={{ color: G }}>How this works:</strong> Select your situation below. NyayaBot shows you a complete step-by-step legal roadmap — what to do first, what laws apply, pro tips at each stage, and how long each step takes.
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 16 }}>Select Your Situation:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {SITUATIONS.map(s => (
              <button key={s.id} onClick={() => setSelected(s.id)}
                style={{ background: '#111120', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '60'; e.currentTarget.style.background = s.color + '10'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111120'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: s.color, fontFamily: 'JetBrains Mono,monospace' }}>View roadmap →</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'navFadeUp 0.3s ease' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: G }}>{roadmap.title}</h2>
            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: MUTED, fontSize: 12 }}>
              <RotateCcw size={12} /> Change Situation
            </button>
          </div>

          {/* Urgency banner */}
          <div style={{ background: 'rgba(232,92,92,0.08)', border: '1px solid rgba(232,92,92,0.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#e85c5c', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚡ <strong>{roadmap.urgency}</strong>
          </div>

          {/* Laws */}
          <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: G, fontFamily: 'JetBrains Mono,monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Applicable Laws</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {roadmap.laws.map((law, i) => (
                <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: G, fontFamily: 'JetBrains Mono,monospace' }}>{law}</span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${(completedSteps.length / roadmap.steps.length) * 100}%`, height: '100%', background: `linear-gradient(90deg,${G},${GL})`, borderRadius: 3, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap' }}>{completedSteps.length}/{roadmap.steps.length} done</span>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roadmap.steps.map((step, i) => {
              const color = STEP_COLORS[i % STEP_COLORS.length];
              const isCompleted = completedSteps.includes(step.n);
              const isOpen = activeStep === step.n;
              return (
                <div key={step.n}
                  style={{ background: isCompleted ? 'rgba(74,222,128,0.04)' : '#111120', border: `1px solid ${isOpen ? color + '60' : isCompleted ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
                  <button onClick={() => toggleStep(step.n)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    {/* Step number */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: isCompleted ? 'rgba(74,222,128,0.15)' : `${color}20`, border: `1px solid ${isCompleted ? 'rgba(74,222,128,0.4)' : color + '50'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                      {isCompleted ? '✅' : step.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono,monospace', color: color, fontWeight: 700 }}>STEP {step.n}</span>
                        <span style={{ fontSize: 9, color: MUTED, fontFamily: 'JetBrains Mono,monospace', background: 'rgba(255,255,255,0.05)', padding: '1px 7px', borderRadius: 10 }}>{step.time}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isCompleted ? GREEN : TEXT, marginTop: 2 }}>{step.title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button onClick={(e) => toggleComplete(step.n, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? GREEN : MUTED, display: 'flex', alignItems: 'center', padding: 4 }}
                        title={isCompleted ? 'Mark incomplete' : 'Mark as done'}>
                        {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                      </button>
                      {isOpen ? <ChevronDown size={14} color={MUTED} /> : <ChevronRight size={14} color={MUTED} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.85)', lineHeight: 1.75, marginTop: 12, marginBottom: 10 }}>{step.desc}</p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200, padding: '10px 12px', borderRadius: 9, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)', fontSize: 12, color: 'rgba(232,228,216,0.8)', lineHeight: 1.6 }}>
                          <span style={{ color: G, fontWeight: 700 }}>💡 Pro Tip: </span>{step.tip}
                        </div>
                        <div style={{ padding: '10px 12px', borderRadius: 9, background: `${color}0d`, border: `1px solid ${color}30`, fontSize: 11, color: color, fontFamily: 'JetBrains Mono,monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={11} /> {step.law}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {completedSteps.length === roadmap.steps.length && (
            <div style={{ marginTop: 20, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GREEN, marginBottom: 6 }}>All steps completed!</div>
              <div style={{ fontSize: 13, color: MUTED }}>You have followed the complete legal roadmap. Consult a qualified lawyer for final guidance.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
