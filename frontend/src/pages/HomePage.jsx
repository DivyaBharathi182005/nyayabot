// HomePage.jsx — NyayaBot · Full i18n
import { useNavigate } from 'react-router-dom';
import { useT } from '../utils/i18n';

const G = '#c9a84c', GL = '#f0d080', MUTED = '#6b6880', TEXT = '#e8e4d8';
const BLUE = '#60a5fa', GREEN = '#4ade80', PURPLE = '#a78bfa';

const MODULES = [
  { path: '/query',       icon: '🔍', nameKey: 'modQueryName',     descKey: 'modQueryDesc',     tag: 'CORE',  tagColor: G },
  { path: '/avatar',      icon: '👨‍⚖️', nameKey: 'modAvatarName',    descKey: 'modAvatarDesc',    tag: 'VOICE', tagColor: PURPLE },
  { path: '/police',      icon: '🚔', nameKey: 'modPoliceName',    descKey: 'modPoliceDesc',    tag: 'MAP',   tagColor: BLUE },
  { path: '/complaint',   icon: '📄', nameKey: 'modComplaintName', descKey: 'modComplaintDesc', tag: 'AI',    tagColor: GREEN },
  { path: '/lawyer',      icon: '⚖️',  nameKey: 'modLawyerName',    descKey: 'modLawyerDesc',    tag: null,    tagColor: null },
  { path: '/rights',      icon: '🛡️', nameKey: 'modRightsName',    descKey: 'modRightsDesc',    tag: null,    tagColor: null },
  { path: '/rti',         icon: '📋', nameKey: 'modRTIName',       descKey: 'modRTIDesc',       tag: 'AI',    tagColor: GREEN },
  { path: '/scam',        icon: '⚠️',  nameKey: 'modScamName',      descKey: 'modScamDesc',      tag: null,    tagColor: null },
  { path: '/procedure',   icon: '🏛️', nameKey: 'modProcedureName', descKey: 'modProcedureDesc', tag: null,    tagColor: null },
  { path: '/case',        icon: '🔎', nameKey: 'modCaseName',      descKey: 'modCaseDesc',      tag: 'LIVE',  tagColor: BLUE },
  { path: '/timeline',    icon: '📅', nameKey: 'modTimelineName',  descKey: 'modTimelineDesc',  tag: null,    tagColor: null },
  { path: '/witness',     icon: '👁️', nameKey: 'modWitnessName',   descKey: 'modWitnessDesc',   tag: null,    tagColor: null },
  { path: '/dictionary',  icon: '📖', nameKey: 'modDictName',      descKey: 'modDictDesc',      tag: null,    tagColor: null },
  { path: '/womensos', icon: '🚺', nameKey: 'modWomenSOSName', descKey: 'modWomenSOSDesc', tag: 'SOS', tagColor: '#ff6b6b' },
  { path: '/novelty',     icon: '🏆', nameKey: 'modNoveltyName',   descKey: 'modNoveltyDesc',   tag: 'INFO',  tagColor: G },
];

const STATS = [
  { n: '444+', lKey: 'statIPC',       subKey: 'statRAGDb' },
  { n: '60+',  lKey: 'statBNS',       subKey: 'statMapped' },
  { n: '9',    lKey: 'statLanguages', subKey: 'statVoiceSupport' },
  { n: '14',   lKey: 'statModules',   subKey: 'statLegalTools' },
];

const HIGHLIGHTS = [
  { icon: '🧠', titleKey: 'hlRAGTitle',      descKey: 'hlRAGDesc' },
  { icon: '🎙️', titleKey: 'hlVoiceTitle',    descKey: 'hlVoiceDesc' },
  { icon: '⚖️', titleKey: 'hlBNSTitle',      descKey: 'hlBNSDesc' },
  { icon: '🆘', titleKey: 'hlSOSTitle',      descKey: 'hlSOSDesc' },
  { icon: '📊', titleKey: 'hlStrengthTitle', descKey: 'hlStrengthDesc' },
  { icon: '🔒', titleKey: 'hlAnonTitle',     descKey: 'hlAnonDesc' },
];

export default function HomePage() {
  const nav = useNavigate();
  const T = useT();

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '48px 20px 40px' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 20px', animation: 'float 5s ease-in-out infinite' }}>
          <svg viewBox="0 0 88 88" fill="none">
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="88" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor={G}/><stop offset="1" stopColor={GL}/>
              </linearGradient>
            </defs>
            <circle cx="44" cy="44" r="41" stroke="url(#hg)" strokeWidth="1.5" strokeDasharray="5 3" opacity=".45"/>
            <rect x="42.5" y="16" width="3" height="56" rx="1.5" fill="url(#hg)"/>
            <rect x="24" y="30" width="40" height="2.5" rx="1.25" fill="url(#hg)"/>
            <line x1="28" y1="32.5" x2="22" y2="50" stroke="url(#hg)" strokeWidth="1.5"/>
            <path d="M14 50 Q22 55 30 50" stroke="url(#hg)" strokeWidth="1.5" fill="none"/>
            <line x1="60" y1="32.5" x2="66" y2="50" stroke="url(#hg)" strokeWidth="1.5"/>
            <path d="M58 50 Q66 55 74 50" stroke="url(#hg)" strokeWidth="1.5" fill="none"/>
            <rect x="28" y="70" width="32" height="3" rx="1.5" fill="url(#hg)"/>
            <circle cx="44" cy="16" r="4" fill="url(#hg)"/>
          </svg>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.22)', color: G, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', marginBottom: 20, letterSpacing: '0.04em' }}>
          ⚖️ {T('homeBadge')}
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(44px,7vw,78px)', fontWeight: 900, background: `linear-gradient(135deg,${G},${GL},${G})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.05, marginBottom: 10, letterSpacing: '-0.02em' }}>
          {T('appName')}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(240,208,128,0.6)', marginBottom: 8, fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>{T('homeSubtitle')}</p>
        <p style={{ fontSize: 13.5, color: MUTED, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.8 }}>{T('homeDesc')}</p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
          <button onClick={() => nav('/query')} className="ny-btn ny-btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>{T('homeStartQuery')}</button>
          <button onClick={() => nav('/avatar')} className="ny-btn ny-btn-secondary" style={{ padding: '12px 22px', fontSize: 14 }}>{T('homeTalkAvatar')}</button>
          <button onClick={() => nav('/novelty')} className="ny-btn ny-btn-secondary" style={{ padding: '12px 22px', fontSize: 14 }}>{T('homeInnovation')}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(201,168,76,0.14)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(201,168,76,0.18)', maxWidth: 600, margin: '0 auto 52px' }}>
          {STATS.map(s => (
            <div key={s.n} style={{ background: '#111120', padding: '18px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: TEXT, fontWeight: 600, marginTop: 2 }}>{T(s.lKey)}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{T(s.subKey)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Highlights ── */}
      <div style={{ marginBottom: 44 }}>
        <div className="ny-label" style={{ textAlign: 'center', marginBottom: 16 }}>{T('homeWhatDiff')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{T(h.titleKey)}</div>
                <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5 }}>{T(h.descKey)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── All Modules ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: TEXT }}>{T('homeAllModules')}</h2>
          <span style={{ fontSize: 11, color: MUTED, fontFamily: 'JetBrains Mono, monospace' }}>{MODULES.length} {T('homeTools')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
          {MODULES.map(m => (
            <div key={m.path} onClick={() => nav(m.path)}
              style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.22s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.38)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {m.tag && (
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${m.tagColor}18`, border: `1px solid ${m.tagColor}35`, color: m.tagColor, letterSpacing: '0.06em' }}>{m.tag}</span>
              )}
              <div style={{ fontSize: 22, marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 5 }}>{T(m.nameKey)}</div>
              <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.55 }}>{T(m.descKey)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 52, padding: '18px 20px', background: '#0f0f1e', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7 }}>
          {T('homeFooterNote')}<br/>
          <span style={{ color: 'rgba(201,168,76,0.5)' }}>{T('homeFooterSub')}</span>
        </div>
      </div>
    </div>
  );
}
