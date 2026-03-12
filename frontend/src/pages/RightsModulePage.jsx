// RightsModulePage.jsx — Know Your Rights During... (Situational Rights)
import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Volume2, VolumeX } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useVoice } from '../hooks/useVoice';
import useStore from '../store/useStore';

const G = '#c9a84c', GL = '#f0d080', TEXT = '#e8e4d8', MUTED = '#6b6880';
const RED = '#e85c5c', GREEN = '#4ade80', BLUE = '#60a5fa', PURPLE = '#a78bfa';

const SITUATIONS = [
  {
    id: 'arrest', icon: '🚔', label: 'During Arrest', color: RED,
    intro: 'If police are arresting you, these rights are GUARANTEED by the Constitution of India. Knowing them can protect you from illegal detention and custodial abuse.',
    rights: [
      { title: 'Right to Know the Reason', desc: 'Police MUST tell you why they are arresting you. You can ask "What is the charge against me?" They cannot arrest without disclosing the offence.', law: 'Article 22, Constitution + Section 50 CrPC', do: 'Calmly ask: "Sir, what is the reason for my arrest?"', dont: 'Do not resist physically — it can become a separate offence.' },
      { title: 'Right to Inform Your Family', desc: 'Police must immediately inform a person of your choice about your arrest and the place where you are being held.', law: 'Section 50A CrPC', do: 'Immediately say the name and number of the person to inform.', dont: 'Do not assume they will inform on their own — insist on this right.' },
      { title: 'Right to a Lawyer', desc: 'You have the right to consult a lawyer immediately. If you cannot afford one, the State must provide free legal aid. You cannot be denied this.', law: 'Article 22(1) Constitution + Section 303 CrPC', do: 'Say clearly: "I want to speak to my lawyer before making any statement."', dont: 'Do not sign any document or give any statement without a lawyer present.' },
      { title: 'Right to Remain Silent', desc: 'You CANNOT be forced to speak against yourself. Anything you say can be used against you. You have the absolute right to remain silent during interrogation.', law: 'Article 20(3) Constitution', do: 'Say: "I am exercising my right to remain silent."', dont: 'Do not make any admission or confessional statement without lawyer.' },
      { title: 'Right to Medical Examination', desc: 'You can request medical examination to document your physical condition at the time of arrest. This protects you against false claims of injury.', law: 'Section 54 CrPC', do: 'Request medical examination both at time of arrest and after custody.', dont: 'Do not waive this right — documents pre-existing injuries.' },
      { title: 'Must be Produced Before Magistrate in 24 Hours', desc: 'You MUST be brought before a Magistrate within 24 hours of arrest (excluding travel time). Any detention beyond 24 hours without Magistrate\'s order is illegal.', law: 'Article 22(2) Constitution + Section 57 CrPC', do: 'Count the hours. If 24 hours pass without Magistrate, it is illegal detention.', dont: 'Do not accept "a few more hours" — 24 hours is absolute.' },
      { title: 'Right Against Torture', desc: 'No physical or mental torture, third degree, or inhuman treatment is permitted under any circumstances. Any such act is a criminal offence by the officer.', law: 'D.K. Basu Guidelines (SC) + Section 330 IPC', do: 'Note names/badge numbers of officers. Report any torture to NHRC or Magistrate.', dont: 'Do not be pressured into confessing under physical or mental pressure.' },
      { title: 'Women: Special Protections', desc: 'Women cannot be arrested after sunset and before sunrise EXCEPT in exceptional circumstances with written permission of Magistrate. Only female officers can search/handle a woman.', law: 'Section 46(4) CrPC + Section 51(2) CrPC', do: 'Women: refuse arrest after sunset unless female officer present and magistrate permission shown.', dont: 'Do not allow male officers to conduct personal search of a woman.' },
    ],
  },
  {
    id: 'interrogation', icon: '🔦', label: 'During Police Interrogation', color: PURPLE,
    intro: 'Police interrogation is often the most vulnerable moment for a citizen. These rights ensure you cannot be manipulated into a false confession.',
    rights: [
      { title: 'You Cannot Be Forced to Confess', desc: 'A confession made to a police officer is NOT admissible as evidence in court under Indian law. Police know this — any pressure to confess is illegal.', law: 'Section 25 Indian Evidence Act', do: 'Say: "I know a confession to police has no legal value. I will speak to my lawyer."', dont: 'Never confess to police even if they say "it will help you." It cannot help — only harm.' },
      { title: 'Right to Have Lawyer Present', desc: 'You have the right to have your lawyer present during police questioning. Police cannot deny this right.', law: 'D.K. Basu Guidelines (Supreme Court)', do: 'Refuse to answer any question until your lawyer arrives.', dont: 'Do not be fooled by "informal chat" or "just a few questions" — lawyer must be present.' },
      { title: 'Statement Under Section 161 is Not Evidence', desc: 'Your statement to police during investigation (Section 161 CrPC) is NOT evidence. It cannot be used to convict you. It can only be used to challenge your consistency in court.', law: 'Section 161 CrPC + Section 162 CrPC', do: 'Know that your 161 statement is not a confession — but be consistent.', dont: 'Do not lie in 161 statement as inconsistency can be used against credibility.' },
      { title: 'Right to Know Questions Being Asked', desc: 'Police must ask questions related to the investigation only. Irrelevant personal questions about family, religion, politics are not permitted.', law: 'Section 161 CrPC', do: 'Ask: "How is this question relevant to the case?" for inappropriate questions.', dont: 'Do not answer questions about unrelated matters.' },
      { title: 'No Psychological Pressure Allowed', desc: 'Sleep deprivation, prolonged standing, threats, intimidation, humiliation — all are illegal interrogation techniques. These constitute custodial torture.', law: 'NHRC Guidelines + D.K. Basu Case', do: 'Note time, date, and nature of any pressure applied. Report to NHRC at 14433.', dont: 'Do not assume this is "normal" police procedure — it is illegal.' },
      { title: 'Vulnerable Persons: Extra Protection', desc: 'Children must be interrogated only in the presence of parents/guardian. Mentally ill persons must have caretaker present. Victims of sexual assault are questioned by female officers only.', law: 'JJ Act 2015 + Section 164A CrPC', do: 'Inform police immediately if person being questioned is a minor or has mental illness.', dont: 'Do not allow child interrogation without guardian present.' },
    ],
  },
  {
    id: 'search', icon: '🔍', label: 'During Search & Seizure', color: BLUE,
    intro: 'Police have powers to search but these powers have strict legal limits. Knowing the rules protects your privacy and prevents illegal seizure of property.',
    rights: [
      { title: 'Police Must Show a Search Warrant', desc: 'For searching your HOME, police must generally have a search warrant issued by a Magistrate. Without warrant, they can only search in limited emergency situations.', law: 'Section 93–98 CrPC', do: 'Ask: "Please show me the search warrant." Note warrant number and issuing magistrate.', dont: 'Do not physically resist, but clearly state objection to warrantless search on record.' },
      { title: 'Exceptions: When Police Can Search Without Warrant', desc: 'Police CAN search without warrant: (1) after arrest, (2) in hot pursuit, (3) to prevent offence, (4) in public place. Know the exceptions.', law: 'Section 165 CrPC', do: 'Ask police to state which exception applies if searching without warrant.', dont: 'Do not assume ALL warrantless searches are illegal — know the exceptions.' },
      { title: 'Right to Witness the Search', desc: 'Search must be conducted in presence of two independent witnesses (Panchas) from the locality — not police officers. You have the right to insist on this.', law: 'Section 100 CrPC', do: 'Insist: "I want two independent witnesses present before search begins."', dont: 'Do not allow police to conduct search alone without independent witnesses.' },
      { title: 'Copy of Search List Must Be Given', desc: 'Everything seized must be listed in a Panchnama/mahazar. You MUST receive a copy. This protects against planting of evidence.', law: 'Section 100(5) CrPC', do: 'Read the Panchnama carefully before signing. Keep your copy safely.', dont: 'Never sign a blank or incomplete seizure list.' },
      { title: 'Women Cannot Be Searched by Male Officers', desc: 'The person of a woman cannot be searched by anyone other than a female police officer. This applies to body searches, not premises.', law: 'Section 51(2) CrPC', do: 'Women: firmly refuse personal search by male officer. Request female officer.', dont: 'Do not allow male officers to physically search a woman under any pressure.' },
      { title: 'Right Against Planting of Evidence', desc: 'Always insist on independent witnesses before search. If evidence is "found" suspiciously, question when it was placed. CCTV, witnesses, and sequence of events matter.', law: 'D.K. Basu + Section 100 CrPC', do: 'Before search starts, note what you see in the room. Document with photos if possible.', dont: 'Do not assume evidence found is legitimately discovered — question the process.' },
    ],
  },
  {
    id: 'custody', icon: '🔒', label: 'During Custody / Remand', color: '#f97316',
    intro: 'Once in police or judicial custody, you have rights that cannot be taken away. These protect against the worst abuses in the justice system.',
    rights: [
      { title: 'Right to Bail (Bailable Offences)', desc: 'For bailable offences, bail is your RIGHT — police or court MUST grant it. They have no discretion to deny bail for bailable offences.', law: 'Section 436 CrPC', do: 'Ask immediately: "Is this a bailable offence?" If yes, demand bail as of right.', dont: 'Do not wait — apply for bail immediately. Delay helps no one.' },
      { title: 'Default Bail After 60/90 Days', desc: 'If police fail to file chargesheet within 60 days (for serious offences) or 90 days (for maximum life/death sentence cases), you are entitled to bail as a RIGHT.', law: 'Section 167(2) CrPC', do: 'Count days from arrest carefully. On Day 60/90, apply for default bail immediately.', dont: 'Do not wait for court to offer — actively apply on the deadline day.' },
      { title: 'Right to Food, Water, and Medical Care', desc: 'Every person in custody has the right to adequate food, drinking water, and medical treatment. Denying these is illegal and constitutes custodial abuse.', law: 'Article 21 Constitution + Prison Manuals', do: 'Report denial of food/medical care to visiting Magistrate or Judicial Magistrate.', dont: 'Do not suffer in silence — these are legal entitlements.' },
      { title: 'Right to Family Visits', desc: 'Family members have the right to visit you in custody. Police cannot completely block family access. Lawyers have an unconditional right to meet you.', law: 'Section 50A CrPC + Prison Rules', do: 'Inform family of your location immediately. Lawyer visits cannot be refused.', dont: 'Do not accept "no visitors allowed" — only courts can restrict visits in specific cases.' },
      { title: 'Magistrate Must Visit Custody Periodically', desc: 'Executive Magistrates must visit lock-ups. Judicial Magistrates inspect jails. You can report any complaint to the visiting Magistrate directly.', law: 'Section 436A CrPC + Prison Act', do: 'Note down complaints for Magistrate visit. Speak up during inspection.', dont: 'Do not miss the opportunity to complain to the visiting Magistrate.' },
      { title: 'Half the Maximum Sentence Rule', desc: 'If you have spent half the maximum sentence for the offence in custody as an undertrial prisoner, you are entitled to bail as a right.', law: 'Section 436A CrPC', do: 'Calculate: if offence carries 10 years max, after 5 years undertrail, you get bail as right.', dont: 'Do not assume courts will apply this automatically — apply for it.' },
    ],
  },
  {
    id: 'court', icon: '⚖️', label: 'During Court Proceedings', color: GREEN,
    intro: 'Inside the courtroom, you have fundamental rights that ensure a fair trial. These cannot be waived by any court order.',
    rights: [
      { title: 'Right to Know the Charges Against You', desc: 'The court must explain the charges to you in a language you understand before trial begins. You have the right to plead guilty or not guilty.', law: 'Section 228/240 CrPC', do: 'If you do not understand the charges, say so. Court must re-explain clearly.', dont: 'Do not plead guilty without fully understanding what you are admitting.' },
      { title: 'Presumption of Innocence', desc: 'YOU ARE INNOCENT until the prosecution PROVES guilt beyond reasonable doubt. The burden of proof is entirely on the State. You do not have to prove your innocence.', law: 'Fundamental Principle — Woolmington vs DPP', do: 'Understand: the prosecution must prove each element of the offence. You start innocent.', dont: 'Do not feel pressured to "explain yourself" — the burden is not yours.' },
      { title: 'Right to Cross-Examine Witnesses', desc: 'Every witness who testifies against you MUST face cross-examination by your lawyer. Evidence not tested by cross-examination carries very little weight.', law: 'Section 138 Indian Evidence Act', do: 'Ensure your lawyer prepares thorough cross-examination for every prosecution witness.', dont: 'Never waive the right to cross-examine — it is one of the most powerful tools.' },
      { title: 'Right Against Double Jeopardy', desc: 'Once acquitted or convicted of an offence, you CANNOT be tried again for the same offence. This protection is absolute and cannot be overridden.', law: 'Article 20(2) Constitution + Section 300 CrPC', do: 'If facing second trial for same offence, immediately file application citing double jeopardy.', dont: 'Do not assume courts know your history — you must raise this plea.' },
      { title: 'Right to Present Your Defence', desc: 'You have the absolute right to call witnesses, present evidence, and make arguments in your defence. Court cannot prevent you from presenting your side.', law: 'Section 243 CrPC', do: 'Prepare defence witnesses and documents in advance. List them before trial starts.', dont: 'Do not skip defence stage assuming prosecution evidence is weak — present your version.' },
      { title: 'Right to Speedy Trial', desc: 'Prolonged delay in trial violates your fundamental rights. If trial is unreasonably delayed, you can apply for bail on grounds of delay or petition High Court.', law: 'Article 21 Constitution + Hussainara Khatoon Case', do: 'Track hearing dates. If more than 6 months pass without progress, file speedy trial application.', dont: 'Do not accept endless adjournments passively — challenge delays legally.' },
      { title: 'Right to Appeal', desc: 'Every conviction can be appealed to a higher court. Sessions Court to High Court to Supreme Court. Limitation period is 30–90 days depending on offence.', law: 'Section 374 CrPC', do: 'File appeal within time limit. Even after conviction, you remain innocent until appeal is decided.', dont: 'Do not delay appeal. Time limits are strict and courts rarely extend them.' },
    ],
  },
];

export default function RightsModulePage() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const language = useStore(s => s.language);
  const { speak, stopSpeaking } = useVoice(language);

  const situation = SITUATIONS.find(s => s.id === selected);

  const handleSpeak = (id, text) => {
    if (speakingId === id) { stopSpeaking(); setSpeakingId(null); }
    else { stopSpeaking(); setSpeakingId(id); speak(text); }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader icon="🛡️" title="Know Your Rights During..." subtitle="Situation-specific legal rights every Indian citizen must know" />

      <style>{`@keyframes rmFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {!selected ? (
        <div style={{ animation: 'rmFadeUp 0.3s ease' }}>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, fontSize: 13, color: TEXT, lineHeight: 1.7 }}>
            🛡️ <strong style={{ color: G }}>This module teaches you exactly what rights you have</strong> in specific situations — arrest, interrogation, search, custody, and court. Select a situation to learn your rights with plain-language explanations, what TO DO, and what NOT TO DO.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {SITUATIONS.map(s => (
              <button key={s.id} onClick={() => setSelected(s.id)}
                style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '50'; e.currentTarget.style.background = s.color + '0d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111120'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: s.color }}>{s.rights.length} rights explained →</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ animation: 'rmFadeUp 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: G, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{situation.icon}</span> {situation.label}
            </h2>
            <button onClick={() => { setSelected(null); setExpanded(null); stopSpeaking(); setSpeakingId(null); }}
              style={{ padding: '7px 14px', borderRadius: 9, background: 'none', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: MUTED, fontSize: 12 }}>
              ← All Situations
            </button>
          </div>

          <div style={{ background: `${situation.color}0d`, border: `1px solid ${situation.color}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: TEXT, lineHeight: 1.7 }}>
            <Shield size={14} style={{ color: situation.color, marginRight: 8, verticalAlign: 'middle' }} />
            {situation.intro}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {situation.rights.map((right, i) => {
              const isOpen = expanded === i;
              const isSpeak = speakingId === i;
              return (
                <div key={i} style={{ background: '#111120', border: `1px solid ${isOpen ? situation.color + '50' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
                  <button onClick={() => setExpanded(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${situation.color}18`, border: `1px solid ${situation.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: situation.color, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT, textAlign: 'left' }}>{right.title}</span>
                    {isOpen ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12, marginBottom: 12, gap: 10 }}>
                        <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.85)', lineHeight: 1.75, flex: 1 }}>{right.desc}</p>
                        <button onClick={() => handleSpeak(i, `${right.title}. ${right.desc}. What to do: ${right.do}. What not to do: ${right.dont}`)}
                          style={{ padding: '6px 12px', borderRadius: 8, background: isSpeak ? 'rgba(232,92,92,0.12)' : 'rgba(201,168,76,0.08)', border: `1px solid ${isSpeak ? 'rgba(232,92,92,0.3)' : 'rgba(201,168,76,0.2)'}`, cursor: 'pointer', color: isSpeak ? RED : G, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, flexShrink: 0 }}>
                          {isSpeak ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          {isSpeak ? 'Stop' : 'Listen'}
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 12 }}>
                          <div style={{ color: GREEN, fontWeight: 700, marginBottom: 4, fontSize: 11 }}>✅ DO THIS</div>
                          <div style={{ color: 'rgba(232,228,216,0.8)', lineHeight: 1.6 }}>{right.do}</div>
                        </div>
                        <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.2)', fontSize: 12 }}>
                          <div style={{ color: RED, fontWeight: 700, marginBottom: 4, fontSize: 11 }}>❌ AVOID THIS</div>
                          <div style={{ color: 'rgba(232,228,216,0.8)', lineHeight: 1.6 }}>{right.dont}</div>
                        </div>
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: 8, background: `${situation.color}0d`, border: `1px solid ${situation.color}25`, fontSize: 11, color: situation.color, fontFamily: 'JetBrains Mono,monospace' }}>
                        📖 {right.law}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
