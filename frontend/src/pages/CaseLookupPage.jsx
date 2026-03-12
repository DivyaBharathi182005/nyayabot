// CaseLookupPage.jsx — Case Number Lookup + Court Portals
import { useState } from 'react';
import { Search, ExternalLink, Info, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';


const G = '#c9a84c', MUTED = '#6b6880', TEXT = '#e8e4d8', BLUE = '#60a5fa';

const PORTALS = [
  { name: 'eCourts Services', url: 'https://services.ecourts.gov.in', icon: '⚖️', description: 'All District & High Courts — search by Case No., CNR, Party Name, FIR No.', tag: 'MOST USED', color: G },
  { name: 'Supreme Court of India', url: 'https://sci.gov.in', icon: '🏛️', description: 'Supreme Court case status, orders, and cause lists', tag: 'SC', color: BLUE },
  { name: 'NJDG — National Judicial Data Grid', url: 'https://njdg.ecourts.gov.in', icon: '📊', description: 'Pan-India case statistics, pendency data', tag: 'DATA', color: '#818cf8' },
  { name: 'High Court Case Status', url: 'https://hcservices.ecourts.gov.in', icon: '🏢', description: 'High Court cases — select your state HC', tag: 'HC', color: '#4ade80' },
];

const STEPS = [
  { n: 1, text: 'Go to services.ecourts.gov.in' },
  { n: 2, text: 'Select your State and District' },
  { n: 3, text: 'Enter CNR Number (preferred) OR Case Type + Number + Year' },
  { n: 4, text: 'View all hearings, orders, and next date' },
  { n: 5, text: 'Download PDF of orders and judgments' },
];

const CASE_TYPES = [
  { code: 'CC', name: 'Criminal Case', court: 'Magistrate Court' },
  { code: 'SC', name: 'Sessions Case', court: 'Sessions Court' },
  { code: 'CS', name: 'Civil Suit', court: 'District Court' },
  { code: 'EP', name: 'Execution Petition', court: 'District Court' },
  { code: 'MC', name: 'Miscellaneous Case', court: 'Any Court' },
  { code: 'WP', name: 'Writ Petition', court: 'High Court' },
  { code: 'CRL.A', name: 'Criminal Appeal', court: 'Sessions / HC' },
  { code: 'SLP', name: 'Special Leave Petition', court: 'Supreme Court' },
];

export default function CaseLookupPage() {
  const [expandedPortal, setExpandedPortal] = useState(null);
  const [caseInput, setCaseInput] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('ecourts');
  const [showTypes, setShowTypes] = useState(false);

  const handleSearch = () => {
    if (!caseInput.trim()) return;
    // Direct redirect to eCourts with CNR search
    window.open(`https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&app_token=&cino=${encodeURIComponent(caseInput.trim())}`, '_blank');
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <PageHeader icon="🔎" title="Case Lookup" subtitle="Search case status on eCourts India by case number or party name" />

      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>🔎 Case Number Lookup</h1>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 22 }}>Search live court case status using official Indian court portals</p>

      {/* CNR Quick Search */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 4 }}>⚡ Quick CNR Search</div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
          CNR (Case Number Record) is a unique 16-digit code like <span style={{ fontFamily: 'JetBrains Mono,monospace', color: G }}>MHPN01-000001-2024</span> — found on any court notice or order.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={caseInput}
            onChange={e => setCaseInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter CNR number (e.g. DLHC01-012345-2023)"
            style={{ flex: 1, background: '#16162a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: TEXT, fontFamily: 'JetBrains Mono,monospace', fontSize: 13, padding: '10px 14px', outline: 'none' }}
          />
          <button onClick={handleSearch}
            style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0a0808', border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} /> Search
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: MUTED }}>
          ⚠️ This will open the official eCourts portal with your CNR number pre-filled. Some case details may be confidential.
        </div>
      </div>

      {/* How to Search */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 14 }}>📋 How to Look Up Any Case</div>
        {STEPS.map((s) => (
          <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: G, flexShrink: 0 }}>{s.n}</div>
            <div style={{ fontSize: 13, color: TEXT, opacity: 0.85, lineHeight: 1.5, paddingTop: 2 }}>{s.text}</div>
          </div>
        ))}
      </div>

      {/* Court Portals */}
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 12 }}>🌐 Official Court Portals</div>
      {PORTALS.map((p, i) => (
        <div key={i} style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, marginBottom: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{p.name}</span>
                  <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono,monospace', padding: '2px 7px', borderRadius: 4, background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}>{p.tag}</span>
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>{p.description}</div>
              </div>
            </div>
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color, padding: '7px 14px', borderRadius: 9, fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Open <ExternalLink size={11} />
            </a>
          </div>
        </div>
      ))}

      {/* Case Type Reference */}
      <div style={{ background: '#111120', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: '16px 20px', marginTop: 8 }}>
        <button onClick={() => setShowTypes(!showTypes)}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: TEXT }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>📘 Case Type Code Reference</span>
          {showTypes ? <ChevronUp size={15} color={MUTED} /> : <ChevronDown size={15} color={MUTED} />}
        </button>
        {showTypes && (
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {CASE_TYPES.map((ct) => (
              <div key={ct.code} style={{ background: '#16162a', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: G, fontWeight: 700 }}>{ct.code}</div>
                <div style={{ fontSize: 12, color: TEXT, marginTop: 2 }}>{ct.name}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{ct.court}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.15)', borderRadius: 10, fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
        <Info size={12} style={{ color: '#e85c5c', marginRight: 6, verticalAlign: 'middle' }} />
        <strong style={{ color: '#e85c5c' }}>Privacy Note:</strong> Court records are public under the Right to Information Act, but some sensitive cases (juvenile, POCSO, matrimonial) may be restricted. Confidential case details require party consent or a court order.
      </div>
    </div>
  );
}
