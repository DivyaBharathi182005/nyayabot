// LegalResult.jsx — Full structured display of IPC/BNS analysis
import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, CheckCircle, AlertTriangle, Scale, BookOpen, Gavel, TrendingUp, Phone, Navigation, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const G = '#c9a84c', GL = '#f0d080', MUTED = '#6b6880', TEXT = '#e8e4d8';
const DANGER = '#e85c5c', GREEN = '#4ade80', BLUE = '#60a5fa', PURPLE = '#818cf8';

const card = (extra = {}) => ({
  background: '#111120', border: '1px solid rgba(201,168,76,0.18)',
  borderRadius: 16, padding: '20px 24px', marginBottom: 14, ...extra,
});

// Parse bold markdown **text** → styled spans
function RichText({ text, style = {} }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={style}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: GL, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </span>
  );
}

// Parse full analysis text into structured sections
function parseAnalysis(text) {
  if (!text) return [];
  const sections = [];
  const lines = text.split('\n');
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Detect numbered headers like "1. **Primary Applicable Section**:" or "**Legal Summary**"
    const headerMatch = line.match(/^(?:\d+\.\s*)?\*\*([^*]+)\*\*:?\s*(.*)?$/);
    if (headerMatch) {
      if (current) sections.push(current);
      current = { title: headerMatch[1].trim(), content: headerMatch[2]?.trim() || '', lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      if (!sections.length) sections.push({ title: 'Analysis', content: line, lines: [] });
      else sections[sections.length - 1].lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

const SECTION_ICONS = {
  'Primary Applicable Section': { icon: '§', color: G },
  'Legal Summary': { icon: '📋', color: BLUE },
  'Punishment Details': { icon: '⚖️', color: DANGER },
  'Case Strength': { icon: '📊', color: GREEN },
  'Immediate Steps': { icon: '✅', color: GREEN },
  'Key Rights': { icon: '🛡️', color: PURPLE },
  'Important Note': { icon: '⚠️', color: G },
};

function AnalysisSection({ sec }) {
  const meta = Object.entries(SECTION_ICONS).find(([k]) =>
    sec.title.toLowerCase().includes(k.toLowerCase())
  )?.[1] || { icon: '•', color: MUTED };

  const allContent = [sec.content, ...sec.lines].filter(Boolean).join('\n');

  return (
    <div style={{ borderLeft: `3px solid ${meta.color}40`, paddingLeft: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <span style={{ fontSize: 15 }}>{meta.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'JetBrains Mono,monospace' }}>
          {sec.title}
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: TEXT, lineHeight: 1.75, opacity: 0.9, whiteSpace: 'pre-wrap' }}>
        <RichText text={allContent} />
      </div>
    </div>
  );
}

function SectionCard({ sec, index }) {
  const [open, setOpen] = useState(index < 2);
  return (
    <div style={{ background: '#16162a', border: `1px solid ${open ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, marginBottom: 8, overflow: 'hidden', transition: 'border-color .2s' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', textAlign: 'left' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: G, fontWeight: 800, background: 'rgba(201,168,76,0.1)', padding: '2px 8px', borderRadius: 6 }}>
            §{sec.sectionNumber || sec.section}
          </span>
          <span style={{ fontSize: 14, color: TEXT, fontWeight: 600 }}>{sec.offense}</span>
          {sec.relevanceScore != null && (
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', padding: '2px 8px', borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: G }}>
              {Math.round(sec.relevanceScore * 100)}% match
            </span>
          )}
        </div>
        <span style={{ color: MUTED, flexShrink: 0 }}>{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {sec.punishment && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(232,92,92,0.06)', border: '1px solid rgba(232,92,92,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: DANGER, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>PUNISHMENT (IPC)</div>
              <div style={{ fontSize: 13, color: TEXT, opacity: 0.9, lineHeight: 1.6 }}>{sec.punishment}</div>
            </div>
          )}
          {sec.bns && (
            <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: BLUE, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>🆕 BNS 2023 EQUIVALENT</div>
              <div style={{ fontSize: 13, color: BLUE, lineHeight: 1.6 }}>{typeof sec.bns === 'object' ? `Section ${sec.bns.bns || sec.bns.section || JSON.stringify(sec.bns)}` : sec.bns}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StrengthMeter({ cs }) {
  if (!cs) return null;
  const verdict = cs.verdict || cs.strength || 'MODERATE';
  const score = cs.score ?? cs.confidence ?? 50;
  const reasons = cs.reasons || cs.factors || [];
  const challenges = cs.challenges || cs.weaknesses || [];
  const recommendation = cs.recommendation || '';

  const color = verdict === 'STRONG' ? GREEN : verdict === 'WEAK' ? DANGER : G;
  const pct = Math.min(100, Math.max(0, score));

  return (
    <div style={card()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={16} color={color} />
        <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, color: TEXT, fontWeight: 600 }}>Case Strength</span>
        <span style={{ marginLeft: 'auto', padding: '3px 14px', borderRadius: 20, background: `${color}15`, border: `1px solid ${color}40`, color, fontSize: 12, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace' }}>
          {verdict}
        </span>
      </div>

      {/* Meter */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: MUTED }}>Estimated Case Strength</span>
          <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{pct}/100</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${color}80,${color})`, borderRadius: 10, transition: 'width 1.2s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: reasons.length && challenges.length ? '1fr 1fr' : '1fr', gap: 12, marginBottom: recommendation ? 12 : 0 }}>
        {reasons.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: GREEN, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>✅ Strengths</div>
            {reasons.map((r, i) => <div key={i} style={{ fontSize: 12.5, color: TEXT, opacity: 0.8, marginBottom: 5, lineHeight: 1.5 }}>• {r}</div>)}
          </div>
        )}
        {challenges.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: DANGER, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠️ Challenges</div>
            {challenges.map((c, i) => <div key={i} style={{ fontSize: 12.5, color: TEXT, opacity: 0.8, marginBottom: 5, lineHeight: 1.5 }}>• {c}</div>)}
          </div>
        )}
      </div>

      {recommendation && (
        <div style={{ padding: '10px 14px', background: 'rgba(201,168,76,0.06)', borderRadius: 10, borderLeft: `3px solid ${G}`, fontSize: 13, color: TEXT, opacity: 0.85, lineHeight: 1.6 }}>
          💡 {recommendation}
        </div>
      )}
    </div>
  );
}

function PrecedentCard({ p, i }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#16162a', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 12, marginBottom: 8, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13.5, color: PURPLE, fontWeight: 600 }}>{p.case || p.name || `Landmark Case ${i + 1}`}</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
            {p.court} {p.year && `· ${p.year}`} {p.citation && `· ${p.citation}`}
          </div>
        </div>
        {open ? <ChevronUp size={13} color={MUTED} /> : <ChevronDown size={13} color={MUTED} />}
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {p.principle && <div style={{ fontSize: 13, color: TEXT, opacity: 0.85, lineHeight: 1.7, marginTop: 10 }}><strong style={{ color: GL }}>Principle:</strong> {p.principle}</div>}
          {p.relevance && <div style={{ fontSize: 12.5, color: MUTED, marginTop: 7, lineHeight: 1.6 }}><strong style={{ color: MUTED }}>Relevance:</strong> {p.relevance}</div>}
        </div>
      )}
    </div>
  );
}

function EmergencyBox({ numbers }) {
  if (!numbers) return null;
  const entries = Object.entries(numbers).map(([k, v]) => ({
    label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), number: v,
  }));
  return (
    <div style={{ ...card({ borderColor: 'rgba(232,92,92,0.5)', background: 'rgba(232,92,92,0.04)' }), marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <AlertTriangle size={16} color={DANGER} />
        <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, color: DANGER, fontWeight: 600 }}>Emergency Contacts</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 8 }}>
        {entries.map((e, i) => (
          <a key={i} href={`tel:${e.number}`} style={{ display: 'block', background: 'rgba(232,92,92,0.08)', border: '1px solid rgba(232,92,92,0.2)', borderRadius: 10, padding: '10px 12px', textDecoration: 'none' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: e.number.length > 6 ? 14 : 20, color: DANGER, fontWeight: 700 }}>{e.number}</div>
            <div style={{ color: MUTED, fontSize: 11 }}>{e.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', color: copied ? GREEN : MUTED, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, padding: '4px 10px' }}>
      {copied ? <CheckCircle size={12} color={GREEN} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function LegalResult({ result }) {
  const nav = useNavigate();
  if (!result) return null;

  const { analysis, retrievedSections = [], caseStrength, precedents, emergencyNumbers, isDistress, language, timestamp } = result;
  const parsedSections = parseAnalysis(analysis);
  const precedentList = Array.isArray(precedents) ? precedents : [];

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Emergency numbers */}
      {isDistress && emergencyNumbers && <EmergencyBox numbers={emergencyNumbers} />}

      {/* ── Parsed Analysis ─────────────────────────── */}
      {parsedSections.length > 0 && (
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Scale size={17} color={G} />
              <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: TEXT, fontWeight: 600 }}>Legal Analysis</span>
              {language && language !== 'en' && <span style={{ fontSize: 10, color: MUTED, fontFamily: 'JetBrains Mono,monospace', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }}>{language.toUpperCase()}</span>}
            </div>
            <CopyButton text={analysis || ''} />
          </div>
          {parsedSections.map((s, i) => <AnalysisSection key={i} sec={s} />)}
        </div>
      )}

      {/* ── IPC / BNS Sections ──────────────────────── */}
      {retrievedSections.length > 0 && (
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BookOpen size={17} color={G} />
            <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: TEXT, fontWeight: 600 }}>
              Applicable IPC / BNS Sections
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: MUTED, fontFamily: 'JetBrains Mono,monospace' }}>
              {retrievedSections.length} sections found
            </span>
          </div>
          {retrievedSections.map((sec, i) => <SectionCard key={i} sec={sec} index={i} />)}
        </div>
      )}

      {/* ── Case Strength ────────────────────────────── */}
      {caseStrength && <StrengthMeter cs={caseStrength} />}

      {/* ── Landmark Precedents ──────────────────────── */}
      {precedentList.length > 0 && (
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Gavel size={17} color={PURPLE} />
            <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, color: TEXT, fontWeight: 600 }}>Landmark Cases</span>
          </div>
          {precedentList.map((p, i) => <PrecedentCard key={i} p={p} i={i} />)}
        </div>
      )}

      {/* ── Post-Query Action Panel ──────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.07),rgba(129,140,248,0.06))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: '18px 22px', marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>What do you want to do next?</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => nav('/police')}
            style={{ flex: 1, minWidth: 170, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 12, padding: '13px 18px', cursor: 'pointer', color: TEXT, transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = GREEN}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.25)'}>
            <span style={{ fontSize: 22 }}>🚔</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>File a Case</div>
              <div style={{ fontSize: 11, color: MUTED }}>Find nearest police station + route</div>
            </div>
          </button>
          <button onClick={() => nav('/lawyer')}
            style={{ flex: 1, minWidth: 170, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: 12, padding: '13px 18px', cursor: 'pointer', color: TEXT, transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = PURPLE}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.25)'}>
            <span style={{ fontSize: 22 }}>👨‍⚖️</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: PURPLE }}>Consult a Lawyer</div>
              <div style={{ fontSize: 11, color: MUTED }}>Find advocates + legal aid</div>
            </div>
          </button>
          <button onClick={() => nav('/complaint')}
            style={{ flex: 1, minWidth: 170, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '13px 18px', cursor: 'pointer', color: TEXT, transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = G}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}>
            <span style={{ fontSize: 22 }}>📄</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: G }}>Draft Complaint</div>
              <div style={{ fontSize: 11, color: MUTED }}>Auto-generate FIR / complaint letter</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 11, color: MUTED, padding: '4px 8px' }}>
        ⚠️ AI-generated legal information — not a substitute for qualified legal advice. Consult a lawyer before taking action.
        {timestamp && <span> · {new Date(timestamp).toLocaleTimeString('en-IN')}</span>}
      </div>
    </div>
  );
}
