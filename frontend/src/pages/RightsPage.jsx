// src/pages/RightsPage.jsx - Know Your Rights (Fixed - self-contained)
import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

const G = '#c9a84c', TEXT = '#e8e4d8', MUTED = '#6b6880', BG_CARD = '#111120', BG_INNER = '#0a0a0f';

// ── Self-contained rights data ────────────────────────────────────────────
const RIGHTS_DATA = {
  arrest: [
    {
      right: 'Right to Know the Grounds of Arrest',
      article: 'Article 22(1) | Section 50 CrPC / Section 47 BNSS',
      description: 'Every arrested person has the right to be informed immediately of the grounds of their arrest. Police must tell you clearly why you are being arrested. An arrest without communicating grounds is illegal.',
    },
    {
      right: 'Right to Consult a Lawyer',
      article: 'Article 22(1) | Section 41D CrPC',
      description: 'You have the right to consult a lawyer of your choice as soon as you are arrested. You can refuse to answer questions until your lawyer is present. This right cannot be denied under any circumstances.',
    },
    {
      right: 'Right to be Produced Before a Magistrate Within 24 Hours',
      article: 'Article 22(2) | Section 57 CrPC / Section 58 BNSS',
      description: "After arrest, the police must produce you before the nearest Magistrate within 24 hours (excluding travel time). Detention beyond 24 hours without a Magistrate's order is illegal.",
    },
    {
      right: 'Right to Inform a Relative or Friend',
      article: 'Section 50A CrPC / Section 49 BNSS',
      description: 'Police must immediately inform a family member or friend nominated by you about your arrest and the place of detention. The police are legally obligated to record this information.',
    },
    {
      right: 'Right Against Self-Incrimination',
      article: 'Article 20(3) | Constitution of India',
      description: 'You cannot be compelled to be a witness against yourself. You have the right to remain silent and are not required to answer questions that may incriminate you. Forced confessions are inadmissible in court.',
    },
    {
      right: 'Right to Medical Examination',
      article: 'Section 54 CrPC / Section 51 BNSS',
      description: 'An arrested person can request a medical examination by a doctor. This protects against false allegations of injuries caused before or during arrest. The examination must be conducted by a registered medical practitioner.',
    },
    {
      right: 'Protection Against Illegal Detention (Habeas Corpus)',
      article: 'Article 32 / Article 226 | Constitution',
      description: 'If you are illegally detained, you or your family can file a Writ of Habeas Corpus in the High Court or Supreme Court, demanding that the state justify your detention. The court can order your immediate release.',
    },
  ],
  bail: [
    {
      right: 'Right to Bail for Bailable Offences',
      article: 'Section 436 CrPC / Section 478 BNSS',
      description: 'For bailable offences, you have an absolute right to bail. The police or court cannot deny bail for bailable offences — it is not a matter of discretion but a legal entitlement.',
    },
    {
      right: 'Right to Default Bail (Statutory Bail)',
      article: 'Section 167(2) CrPC / Section 187 BNSS',
      description: 'If the police fail to file a chargesheet within the prescribed time (60 days for offences up to 10 years; 90 days for serious offences), you are entitled to bail as a matter of right. This is called Default Bail.',
    },
    {
      right: 'Right to Apply for Anticipatory Bail',
      article: 'Section 438 CrPC / Section 482 BNSS',
      description: 'If you apprehend that you may be arrested for a non-bailable offence, you can apply for anticipatory bail in the Sessions Court or High Court before your arrest.',
    },
    {
      right: 'Right to Free Legal Aid for Bail',
      article: 'Article 39A | Legal Services Authorities Act 1987',
      description: 'If you cannot afford a lawyer for a bail hearing, you are entitled to free legal representation from the District Legal Services Authority (DLSA). Free legal aid is a constitutional right.',
    },
    {
      right: 'Right to Bail on Medical Grounds',
      article: 'Section 437 CrPC / Judicial precedents',
      description: 'Courts can grant bail on medical grounds if the accused is seriously ill and the jail cannot provide adequate medical care. Medical bail is a recognized right under the principles of humane treatment.',
    },
    {
      right: 'Right to Bail After Half-Sentence (Undertrial)',
      article: 'Section 436A CrPC / Section 479 BNSS',
      description: 'If you have served half the maximum sentence for the alleged offence during undertrial custody, you are entitled to bail on personal bond. You cannot be kept in jail indefinitely as an undertrial.',
    },
  ],
  trial: [
    {
      right: 'Right to a Fair and Speedy Trial',
      article: 'Article 21 | Constitution of India',
      description: 'Every accused has a fundamental right to a fair trial decided within a reasonable time. Undue delays can be grounds for bail. The Supreme Court has held that speedy trial is part of the right to life.',
    },
    {
      right: 'Right to Know the Charges (Charge Framing)',
      article: 'Section 211-224 CrPC / Section 251 BNSS',
      description: 'The court must frame charges and inform the accused precisely of what they are being tried for. Charges must be clear and specific. You have the right to plead not guilty and contest each charge.',
    },
    {
      right: 'Right to Cross-Examine Prosecution Witnesses',
      article: 'Section 138 Indian Evidence Act / Section 143 BSA',
      description: 'You or your lawyer has the right to cross-examine every witness presented by the prosecution. This is a fundamental component of a fair trial and cannot be denied.',
    },
    {
      right: 'Right to Present Your Own Evidence and Witnesses',
      article: 'Section 243 CrPC / Section 278 BNSS',
      description: 'You have the right to call witnesses in your defence and present documentary evidence. The court cannot prevent you from presenting a legitimate defence.',
    },
    {
      right: 'Right to Free Interpreter',
      article: 'Section 279 CrPC / Section 316 BNSS',
      description: 'If you do not understand the language of the court, you have the right to a free interpreter. All proceedings, charges, and judgments must be explained to you in a language you understand.',
    },
    {
      right: 'Right to Appeal Against Conviction',
      article: 'Sections 372-394 CrPC / Chapter XXIX BNSS',
      description: 'Every convicted person has the right to appeal to a higher court — Sessions Court from Magistrate, High Court from Sessions Court, and Supreme Court from High Court.',
    },
    {
      right: 'Protection Against Double Jeopardy',
      article: 'Article 20(2) | Constitution of India',
      description: 'No person can be prosecuted and punished more than once for the same offence. If you have been acquitted or convicted, you cannot be tried again for the same offence arising from the same facts.',
    },
  ],
};

const CATEGORIES = [
  { key: 'arrest', label: 'During Arrest', emoji: '🚔', color: '#f87171' },
  { key: 'bail',   label: 'Bail Rights',   emoji: '🔓', color: G },
  { key: 'trial',  label: 'During Trial',  emoji: '⚖️', color: '#818cf8' },
];

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

export default function RightsPage() {
  const [activeCategory, setActiveCategory] = useState('arrest');
  const [expandedRight, setExpandedRight]   = useState(null);
  const { isSpeaking, speak, stopSpeaking } = useVoice();

  const categoryRights = RIGHTS_DATA[activeCategory] || [];
  const activeCat = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: TEXT }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛡️</div>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: TEXT, margin: 0 }}>Know Your Rights</h1>
            <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Fundamental rights under Indian Constitution, CrPC &amp; BNSS 2023</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedRight(null); }}
            style={{
              flex: 1, padding: '11px 8px', borderRadius: 12, fontSize: 13,
              fontWeight: activeCategory === cat.key ? 700 : 400,
              cursor: 'pointer', transition: 'all 0.18s',
              background: activeCategory === cat.key ? `${cat.color}20` : BG_CARD,
              border: `1px solid ${activeCategory === cat.key ? cat.color : 'rgba(255,255,255,0.07)'}`,
              color: activeCategory === cat.key ? cat.color : MUTED,
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Rights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {categoryRights.map((right, i) => (
          <div key={i}
            onClick={() => setExpandedRight(expandedRight === i ? null : i)}
            style={{
              background: BG_CARD,
              border: `1px solid ${expandedRight === i ? (activeCat.color + '55') : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s',
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 13, background: 'rgba(201,168,76,0.15)', color: G }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0, lineHeight: 1.5 }}>{right.right}</h3>
                  {expandedRight === i
                    ? <ChevronUp size={15} color={MUTED} style={{ flexShrink: 0, marginTop: 2 }} />
                    : <ChevronDown size={15} color={MUTED} style={{ flexShrink: 0, marginTop: 2 }} />}
                </div>
                <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, padding: '2px 10px', borderRadius: 20, background: 'rgba(129,140,248,0.1)', color: '#a5b4fc', border: '1px solid rgba(129,140,248,0.2)' }}>
                  {right.article}
                </span>
              </div>
            </div>

            {expandedRight === i && (
              <div style={{ padding: '0 16px 16px 60px', borderTop: '1px solid rgba(42,42,62,0.6)', animation: 'fadeIn 0.25s ease' }}>
                <p style={{ fontSize: 13, color: 'rgba(232,228,216,0.82)', lineHeight: 1.75, margin: '12px 0 10px' }}>{right.description}</p>
                <button
                  onClick={e => { e.stopPropagation(); isSpeaking ? stopSpeaking() : speak(`${right.right}. ${right.description}`); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: isSpeaking ? '#f87171' : MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  {isSpeaking ? 'Stop' : 'Listen'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Witness Protection */}
      <div style={{ background: 'rgba(61,220,151,0.05)', border: '1px solid rgba(61,220,151,0.25)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Shield size={16} color="#3ddc97" />
          <h3 style={{ fontWeight: 700, fontSize: 14, color: '#3ddc97', margin: 0 }}>Witness Protection Rights</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Right to identity protection during trial (court can order in-camera proceedings)',
            'Protection from threats and harassment under Witness Protection Scheme 2018',
            'Can apply for protection to the Competent Authority (Sessions Court)',
            'Protection categories: Category A (threat to life), B (serious bodily harm), C (harassment)',
            'Expenses for relocation and security are borne by the state government',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(232,228,216,0.8)', lineHeight: 1.65 }}>
              <span style={{ color: '#3ddc97', flexShrink: 0 }}>•</span> {item}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(61,220,151,0.08)', fontSize: 12, color: 'rgba(232,228,216,0.7)' }}>
          📞 Report witness harassment: <strong style={{ color: '#3ddc97' }}>Police 100</strong> · <strong style={{ color: '#3ddc97' }}>NHRC 1800-11-8100</strong>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}