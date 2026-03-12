// WitnessPage.jsx — Witness Protection Guide
import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Phone, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';


const G = '#c9a84c', MUTED = '#6b6880', TEXT = '#e8e4d8', DANGER = '#e85c5c', GREEN = '#4ade80';

const SCHEME = {
  categories: [
    { cat: 'A', color: DANGER, desc: 'Threat to life during & after trial', protection: 'Change of identity, relocation, safe house, 24/7 protection' },
    { cat: 'B', color: '#f97316', desc: 'Safety & security threat during trial', protection: 'Security cover, in-camera trial, voice/face masking' },
    { cat: 'C', color: G, desc: 'General safety concerns', protection: 'Frequent police patrolling, secure court routes' },
  ],
};

const RIGHTS = [
  { right: 'Punishment for threatening witnesses', law: 'Section 195A CrPC', icon: '⚖️', desc: 'Up to 7 years imprisonment for anyone threatening or inducing a witness to give false evidence.' },
  { right: 'Identity protection in POCSO cases', law: 'Section 44 POCSO Act', icon: '🔒', desc: 'Identity of victim/witness cannot be disclosed to media or public in child abuse cases.' },
  { right: 'In-Camera Trial', law: 'Section 327 CrPC', icon: '🎦', desc: 'Right to testify without public or press presence in sensitive cases like rape, POCSO.' },
  { right: 'Video Conferencing Testimony', law: 'Court Circulars (Post-COVID)', icon: '💻', desc: 'Witness can testify via video link from a safe location without coming to court physically.' },
  { right: 'Magistrate Statement (Section 164)', law: 'Section 164 CrPC', icon: '📜', desc: 'Witness can record statement before a Magistrate for added legal protection and weight.' },
];

const HOW_TO_APPLY = [
  { n: 1, action: 'Document the Threat', desc: 'Save screenshots, recordings, or get names of people who witnessed the threat made to you.' },
  { n: 2, action: 'File FIR for Intimidation', desc: 'File FIR at local police station under Section 195A CrPC for witness intimidation.' },
  { n: 3, action: 'Apply to Competent Authority', desc: 'Submit written application to the District Judge or Sessions Judge (Witness Protection Fund authority in your state).' },
  { n: 4, action: 'Threat Assessment', desc: 'Authorities assess the threat category (A/B/C) within the prescribed timeframe.' },
  { n: 5, action: 'Protection Order Issued', desc: 'Appropriate protection order is passed and implemented by police/court.' },
];

const SAFETY_TIPS = [
  'Do NOT share your testimony or case details on social media',
  'Vary your route to court — avoid predictable patterns',
  'Inform police immediately if threatened or followed',
  'Keep copies of all documents in a safe, separate location',
  'Tell your lawyer about any new threats immediately',
  'Screenshot/record all threatening messages as evidence',
  'Request in-camera testimony if you fear public identification',
  'Contact State Legal Services Authority for free legal aid',
  'Trust your instincts — report even minor suspicious activity',
];

export default function WitnessPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <PageHeader icon="👁️" title="Witness Protection Guide" subtitle="Rights under CrPC Section 195A and Witness Protection Scheme 2018" />

      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
        🛡️ Witness Protection Guide
      </h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>
        Know your rights as a witness and how to get protection under India's Witness Protection Scheme 2018
      </p>

      {/* Scheme Info */}
      <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07), rgba(232,92,92,0.05))', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 6 }}>⚖️ Witness Protection Scheme 2018</div>
        <div style={{ fontSize: 13, color: TEXT, opacity: 0.85, marginBottom: 14, lineHeight: 1.7 }}>
          Approved by the <strong style={{ color: G }}>Supreme Court of India</strong> (Mahender Chawla v. Union of India). Available for witnesses in cases involving organised crime, terrorism, serious violent offences, corruption, sexual assault, and trafficking.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {SCHEME.categories.map((c) => (
            <div key={c.cat} style={{ background: '#111120', border: `1px solid ${c.color}25`, borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: `${c.color}15`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: c.color }}>
                  {c.cat}
                </span>
                <span style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>Category {c.cat}</span>
              </div>
              <div style={{ fontSize: 12, color: TEXT, opacity: 0.8, marginBottom: 6 }}>{c.desc}</div>
              <div style={{ fontSize: 11, color: MUTED, fontStyle: 'italic' }}>Protection: {c.protection}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rights */}
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 12 }}>⚖️ Your Legal Rights as a Witness</div>
      {RIGHTS.map((r, i) => (
        <div key={i} style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
          <button onClick={() => setExpanded(expanded === i ? null : i)}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT }}>{r.right}</div>
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: G, marginTop: 1 }}>{r.law}</div>
              </div>
            </div>
            {expanded === i ? <ChevronUp size={14} color={MUTED} /> : <ChevronDown size={14} color={MUTED} />}
          </button>
          {expanded === i && (
            <div style={{ padding: '0 16px 14px 46px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 13, color: TEXT, opacity: 0.8, lineHeight: 1.7, marginTop: 10 }}>{r.desc}</div>
            </div>
          )}
        </div>
      ))}

      {/* How to Apply */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '18px 22px', marginTop: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 14 }}>📋 How to Apply for Protection</div>
        {HOW_TO_APPLY.map((s) => (
          <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{s.action}</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div style={{ background: '#111120', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 14 }}>🔒 Personal Safety Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {SAFETY_TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: TEXT, opacity: 0.85, lineHeight: 1.55 }}>
              <span style={{ color: GREEN, flexShrink: 0, marginTop: 1 }}>✓</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Helplines */}
      <div style={{ background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.2)', borderRadius: 14, padding: '16px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: DANGER, marginBottom: 12 }}>📞 Emergency Helplines</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
          {[
            { n: '100', l: 'Police' }, { n: '112', l: 'National Emergency' },
            { n: '1091', l: 'Women Helpline' }, { n: '15100', l: 'Legal Aid (NALSA)' },
            { n: '181', l: 'Domestic Violence' }, { n: '1098', l: 'Child Helpline' },
          ].map((e) => (
            <a key={e.n} href={`tel:${e.n}`}
              style={{ display: 'block', background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.15)', borderRadius: 10, padding: '10px 12px', textDecoration: 'none' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 20, color: DANGER, fontWeight: 700 }}>{e.n}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{e.l}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
