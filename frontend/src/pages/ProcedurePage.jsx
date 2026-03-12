// src/pages/ProcedurePage.jsx - Fixed Court Procedure Guide (self-contained)
import { useState } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX, FileText } from 'lucide-react';

const G = '#c9a84c', TEXT = '#e8e4d8', MUTED = '#6b6880', BG_CARD = '#111120', BG_INNER = '#0a0a0f';

// ── Self-contained data (no broken API dependency) ────────────────────────
const PROCEDURES = {
  fir: {
    title: 'Filing an FIR (First Information Report)',
    stages: [
      { stage: 'Visit the Police Station', description: 'Go to the police station in whose jurisdiction the crime took place. You have the right to file an FIR free of cost. Do not let the police refuse to register your complaint.', tip: 'If the police refuse to register your FIR, you can approach the Superintendent of Police or file a complaint to a Magistrate under Section 156(3) CrPC.' },
      { stage: 'Give Your Statement', description: 'Narrate the incident clearly — who, what, when, where, how. The officer will write down your statement. Read it carefully before signing. Ensure all facts are accurate.' , tip: 'Ask for a copy of your statement before signing. You are legally entitled to one.'},
      { stage: 'FIR Registration & Number', description: 'Once registered, the FIR will be assigned a unique number. Note this number down — you will need it for all future communication and court hearings.', tip: 'An FIR number is your primary reference. Store it safely along with a copy of the FIR.' },
      { stage: 'Get a Free Copy', description: 'Under Section 154(2) CrPC, the complainant is entitled to a free copy of the FIR immediately. Insist on getting it before leaving the station.', tip: 'The free copy is a legal right, not a favour. If denied, write a complaint to the SP or file under RTI.' },
      { stage: 'Police Investigation', description: 'After FIR registration, police must investigate. They may call you for further statements, collect evidence, and arrest the accused if needed.', tip: 'Keep records of all follow-ups. If no action in 90 days, you can approach the Magistrate.' },
    ],
  },
  bail: {
    title: 'Applying for Bail',
    stages: [
      { stage: 'Understand the Type of Bail', description: 'There are three types: Regular Bail (after arrest), Anticipatory Bail (before arrest, feared arrest), and Interim Bail (temporary). Identify which applies to your situation.', tip: 'Anticipatory bail under Section 438 CrPC must be filed before arrest occurs.' },
      { stage: 'Hire a Lawyer', description: 'Engage a criminal lawyer immediately. They will assess the offence (bailable vs non-bailable), prepare the bail application, and represent you in court.', tip: 'Legal aid is available free of charge if you cannot afford a lawyer. Contact the District Legal Services Authority (DLSA).' },
      { stage: 'File Bail Application', description: 'Your lawyer files a bail application in the appropriate court — Sessions Court for non-bailable offences, or Magistrate\'s Court for bailable offences.', tip: 'Include surety details (person who will stand guarantee) in your application.' },
      { stage: 'Hearing & Arguments', description: 'The court hears arguments from both sides. Factors considered: severity of offence, criminal record, flight risk, possibility of tampering with evidence.', tip: 'Be present in court. Wear formal attire and remain composed throughout proceedings.' },
      { stage: 'Bail Order & Release', description: 'If bail is granted, a bail bond is executed. A surety (guarantor) must sign along with you. Pay the bail amount if directed. You will then be released.', tip: 'Comply strictly with all bail conditions — attending all hearings, not leaving the jurisdiction without permission.' },
    ],
  },
  civil_suit: {
    title: 'Filing a Civil Suit',
    stages: [
      { stage: 'Determine Jurisdiction', description: 'Identify the correct court — District Court, High Court, or subordinate court — based on the nature of the dispute and monetary value of the claim.', tip: 'For claims above ₹1 crore, approach the High Court. Below that, District or Sub-District courts.' },
      { stage: 'Draft the Plaint', description: 'Your lawyer drafts a plaint — a written statement of facts, the relief sought, and the legal basis. This is filed along with supporting documents and court fees.', tip: 'Ensure all relevant facts are in the plaint. You cannot add new facts later without amendment.' },
      { stage: 'Serve Summons to Defendant', description: 'The court issues summons to the defendant to appear and file a written statement (reply). The defendant typically has 30 days to respond.', tip: 'Keep proof of service. Defendants who ignore summons can be proceeded against ex-parte.' },
      { stage: 'Framing of Issues', description: 'The court identifies the points of dispute (issues) between parties. These issues form the basis of the trial and evidence to be led.', tip: 'Be present during this stage. Raise all relevant issues through your counsel.' },
      { stage: 'Evidence & Arguments', description: 'Both sides present witnesses, documents, and expert testimony. After examination and cross-examination, final arguments are submitted.', tip: 'Preserve all original documents. Courts give more weight to originals over photocopies.' },
      { stage: 'Judgment & Decree', description: 'The court delivers its judgment and passes a decree. If you win, you can execute the decree to recover money or enforce the order.', tip: 'A decree must be executed within 12 years. File for execution promptly if the other party does not comply.' },
    ],
  },
  consumer: {
    title: 'Filing a Consumer Complaint',
    stages: [
      { stage: 'Send Legal Notice First', description: 'Before filing, send a legal notice to the seller/service provider demanding resolution. Give them 15–30 days to respond. This is not mandatory but strengthens your case.', tip: 'Send the notice via registered post and keep the acknowledgment receipt as proof.' },
      { stage: 'Choose the Right Forum', description: 'District Consumer Forum (claims up to ₹50 lakh), State Commission (₹50 lakh–₹2 crore), or National Commission (above ₹2 crore).', tip: 'You can now file consumer complaints online at edaakhil.nic.in — no need to physically visit the forum.' },
      { stage: 'Draft & File the Complaint', description: 'Write your complaint with all facts, attach evidence (bill, warranty, communication), and submit with the prescribed fee. No lawyer is mandatory for consumer cases.', tip: 'Keep all invoices, bills, screenshots, and correspondence. These are your primary evidence.' },
      { stage: 'Admission & Notice', description: 'The forum reviews the complaint. If admitted, it sends notice to the opposite party (seller/company) who must reply within 30–45 days.', tip: 'Track your case status online via the Consumer Forum website.' },
      { stage: 'Hearing & Order', description: 'Both sides present their case. The forum can award compensation, replacement, refund, or even punitive damages. Most cases are resolved within 90–150 days.', tip: 'Consumer courts are consumer-friendly. Companies must prove they provided proper service.' },
    ],
  },
};

const CHECKLISTS = {
  fir: {
    title: 'Documents for Filing an FIR',
    items: [
      { name: 'Your Aadhaar Card / Voter ID', required: true, description: 'Valid government photo ID for identity verification.' },
      { name: 'Written account of the incident', required: true, description: 'A written narration of the event — what happened, when, where, and who was involved.' },
      { name: 'Photographs / Video Evidence', required: false, description: 'If available, images or video of the crime scene or perpetrator.' },
      { name: 'Witness names and contact details', required: false, description: 'Names and phone numbers of anyone who witnessed the incident.' },
      { name: 'Any documentary evidence', required: false, description: 'Bills, contracts, screenshots, or any document related to the offence.' },
    ],
    note: 'Police cannot demand extra documents to register an FIR. Registration is your right.',
  },
  bail: {
    title: 'Documents for Bail Application',
    items: [
      { name: 'FIR Copy', required: true, description: 'Copy of the FIR filed against the accused.' },
      { name: 'Arrest Memo', required: true, description: 'Document given by police at the time of arrest stating the reason and time.' },
      { name: 'Surety\'s ID & Address Proof', required: true, description: 'Aadhaar/PAN and address proof of the person standing as guarantee.' },
      { name: 'Passport-size Photographs', required: true, description: 'Photographs of the accused and the surety.' },
      { name: 'Property documents (if surety is property)', required: false, description: 'If bail is property-based, submit ownership documents of the property.' },
      { name: 'Medical records (if health grounds)', required: false, description: 'If bail is sought on medical grounds, attach recent medical reports.' },
    ],
    note: 'Free legal aid is available at all District Legal Services Authorities for bail applications.',
  },
  civil_suit: {
    title: 'Documents for Filing a Civil Suit',
    items: [
      { name: 'Plaint (written complaint)', required: true, description: 'Drafted by your lawyer — the core document stating your claim.' },
      { name: 'Vakalatnama', required: true, description: 'Authorization for your lawyer to represent you in court.' },
      { name: 'All original contracts / agreements', required: true, description: 'The contract or agreement giving rise to the dispute.' },
      { name: 'Court Fee Receipt', required: true, description: 'Court fees must be paid based on the value of the claim.' },
      { name: 'Evidence documents', required: false, description: 'Invoices, receipts, correspondence, photographs, etc. supporting your claim.' },
    ],
    note: 'Keep originals safe and submit attested photocopies to the court unless originals are specifically required.',
  },
  rti: {
    title: 'Documents for RTI Application',
    items: [
      { name: 'RTI Application (written)', required: true, description: 'Written request addressed to the Public Information Officer (PIO) of the concerned department.' },
      { name: '₹10 Court Fee Stamp / IPO / DD', required: true, description: 'Application fee of ₹10 payable by court fee stamp, postal order, or demand draft.' },
      { name: 'Your address & contact details', required: true, description: 'Your full postal address and phone number for receiving the reply.' },
      { name: 'BPL Certificate (if applicable)', required: false, description: 'BPL card holders are exempt from paying the ₹10 application fee.' },
    ],
    note: 'RTI applications can now be filed online at rtionline.gov.in. You must receive a reply within 30 days.',
  },
};

// ── Speak helper ──────────────────────────────────────────────────────────
function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-IN';
    utt.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utt);
  };
  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };
  return { isSpeaking, speak, stopSpeaking };
}

const PROC_TABS = [
  { id: 'fir',         label: '📋 Filing FIR' },
  { id: 'bail',        label: '🔓 Applying Bail' },
  { id: 'civil_suit',  label: '⚖️ Civil Suit' },
  { id: 'consumer',    label: '🛒 Consumer Complaint' },
];

const CHECKLIST_TABS = [
  { id: 'fir',         label: '📋 FIR Documents' },
  { id: 'bail',        label: '🔓 Bail Documents' },
  { id: 'civil_suit',  label: '⚖️ Civil Suit' },
  { id: 'rti',         label: '📝 RTI Filing' },
];

export default function ProcedurePage() {
  const [activeProc, setActiveProc]           = useState('fir');
  const [expandedStage, setExpandedStage]     = useState(null);
  const [activeChecklist, setActiveChecklist] = useState(null);
  const { isSpeaking, speak, stopSpeaking }   = useVoice();

  const currentProc   = PROCEDURES[activeProc];
  const stages        = currentProc?.stages || [];
  const checklistData = activeChecklist ? CHECKLISTS[activeChecklist] : null;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: TEXT }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏛️</div>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: TEXT, margin: 0 }}>Court Procedure Guide</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Step-by-step from FIR to judgment — with document checklists</p>
          </div>
        </div>
      </div>

      {/* Procedure Selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {PROC_TABS.map(p => (
          <button key={p.id} onClick={() => { setActiveProc(p.id); setExpandedStage(null); }}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
              background: activeProc === p.id ? 'rgba(201,168,76,0.15)' : BG_CARD,
              border: `1px solid ${activeProc === p.id ? G : 'rgba(255,255,255,0.07)'}`,
              color: activeProc === p.id ? G : MUTED,
              fontWeight: activeProc === p.id ? 700 : 400,
              transition: 'all 0.18s',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Procedure Title */}
      {currentProc && (
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, color: TEXT, marginBottom: 16 }}>
          {currentProc.title}
        </h3>
      )}

      {/* Steps */}
      <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 16, letterSpacing: '0.03em' }}>Step-by-Step Process</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stages.map((stage, i) => (
            <div key={i} style={{ borderRadius: 12, border: '1px solid rgba(42,42,62,1)', background: BG_INNER, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedStage(expandedStage === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13, background: 'rgba(201,168,76,0.18)', color: G }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: TEXT }}>{stage.stage}</span>
                {expandedStage === i ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
              </button>

              {expandedStage === i && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(42,42,62,0.7)' }}>
                  <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.8)', lineHeight: 1.75, marginTop: 12, marginBottom: 10 }}>{stage.description}</p>
                  {stage.tip && (
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 12, lineHeight: 1.6 }}>
                      <span style={{ color: G, fontWeight: 700 }}>💡 Tip: </span>
                      <span style={{ color: 'rgba(232,228,216,0.75)' }}>{stage.tip}</span>
                    </div>
                  )}
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speak(`${stage.stage}. ${stage.description}. ${stage.tip || ''}`)}
                    style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isSpeaking ? '#e85c5c' : MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Checklists */}
      <div style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 16 }}>📄 Document Checklists</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {CHECKLIST_TABS.map(type => (
            <button key={type.id}
              onClick={() => setActiveChecklist(activeChecklist === type.id ? null : type.id)}
              style={{
                padding: '10px 14px', borderRadius: 11, fontSize: 13, cursor: 'pointer',
                background: activeChecklist === type.id ? G : BG_INNER,
                border: `1px solid ${activeChecklist === type.id ? G : 'rgba(42,42,62,1)'}`,
                color: activeChecklist === type.id ? '#0a0808' : MUTED,
                fontWeight: activeChecklist === type.id ? 700 : 400,
                transition: 'all 0.18s',
              }}>
              {type.label}
            </button>
          ))}
        </div>

        {checklistData && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h4 style={{ fontWeight: 700, color: G, fontSize: 14, marginBottom: 14 }}>{checklistData.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {checklistData.items.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 12, background: BG_INNER, border: '1px solid rgba(42,42,62,1)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, background: doc.required ? 'rgba(74,222,128,0.15)' : 'rgba(107,104,128,0.2)', color: doc.required ? '#4ade80' : MUTED }}>
                    {doc.required ? '✓' : '○'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{doc.name}</span>
                      {doc.required && <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 20, background: 'rgba(61,220,151,0.1)', color: '#3ddc97', border: '1px solid rgba(61,220,151,0.25)' }}>Required</span>}
                    </div>
                    {doc.description && <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{doc.description}</p>}
                  </div>
                </div>
              ))}
            </div>
            {checklistData.note && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.2)', fontSize: 12, color: 'rgba(232,228,216,0.7)', lineHeight: 1.65 }}>
                ℹ️ {checklistData.note}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}