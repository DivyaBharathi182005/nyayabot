// Layout.jsx — NyayaBot · Full i18n (9 languages)
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Home } from 'lucide-react';
import { useT } from '../utils/i18n';

const G = '#c9a84c', GL = '#f0d080';
const TEXT = '#e8e3d5', MUTED = '#5c5870', DANGER = '#e05252';
const DEEP = '#07070f';

const EMERGENCY = [
  { n: '100',        l: 'Police',       c: DANGER },
  { n: '112',        l: 'Emergency',    c: DANGER },
  { n: '108',        l: 'Ambulance',    c: '#f97316' },
  { n: '1091',       l: 'Women',        c: '#f472b6' },
  { n: '1098',       l: 'Child',        c: '#60a5fa' },
  { n: '181',        l: 'Domestic V.',  c: '#f472b6' },
  { n: '1930',       l: 'Cyber Crime',  c: '#a78bfa' },
  { n: '15100',      l: 'Legal Aid',    c: G },
  { n: '9152987821', l: 'iCall',        c: '#4ade80' },
];

export default function Layout() {
  const nav = useNavigate();
  const loc = useLocation();
  const T = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sosOpen,  setSosOpen]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);

  const NAV_GROUPS = [
    { labelKey: 'navCore', items: [
      { path: '/query',    icon: '🔍', labelKey: 'navLegalQuery',      descKey: 'navLegalQueryDesc' },
      { path: '/avatar',   icon: '👨‍⚖️', labelKey: 'navLawyerAvatar',   descKey: 'navLawyerAvatarDesc' },
    ]},
    { labelKey: 'navFileAct', items: [
      { path: '/police',    icon: '🚔', labelKey: 'navPoliceStations', descKey: 'navPoliceStationsDesc' },
      { path: '/complaint', icon: '📄', labelKey: 'navFileComplaint',  descKey: 'navFileComplaintDesc' },
      { path: '/rti',       icon: '📋', labelKey: 'navRTI',            descKey: 'navRTIDesc' },
      { path: '/lawyer',    icon: '⚖️',  labelKey: 'navFindLawyer',    descKey: 'navFindLawyerDesc' },
    ]},
    { labelKey: 'navKnowProtect', items: [
  { path: '/rights',  icon: '🛡️', labelKey: 'navYourRights',    descKey: 'navYourRightsDesc' },
  { path: '/witness', icon: '👁️', labelKey: 'navWitnessSafety', descKey: 'navWitnessSafetyDesc' },
  { path: '/scam',    icon: '⚠️',  labelKey: 'navScamDetector',  descKey: 'navScamDetectorDesc' },
  { path: '/womensos', icon: '🌸', labelKey: 'navWomenSOS', descKey: 'navWomenSOSDesc' },
]},
    { labelKey: 'navLearnProtect', items: [
      { path: '/navigator',    icon: '🗺️', labelKey: 'navLegalNavigator', descKey: 'navLegalNavigatorDesc' },
      { path: '/rights-module',icon: '🛡️', labelKey: 'navRightsDuring',   descKey: 'navRightsDuringDesc' },
      { path: '/simulator',    icon: '🎯', labelKey: 'navCrimeSimulator',  descKey: 'navCrimeSimulatorDesc' },
    ]},
    { labelKey: 'navReference', items: [
      { path: '/procedure', icon: '🏛️', labelKey: 'navCourtProcedure', descKey: 'navCourtProcedureDesc' },
      { path: '/case',      icon: '🔎', labelKey: 'navCaseLookup',    descKey: 'navCaseLookupDesc' },
      { path: '/timeline',  icon: '📅', labelKey: 'navCaseTimeline',  descKey: 'navCaseTimelineDesc' },
      { path: '/dictionary',icon: '📖', labelKey: 'navDictionary',    descKey: 'navDictionaryDesc' },
    ]},
  ];

  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [menuOpen]);
  useEffect(() => {
    document.body.style.overflow = (menuOpen || sosOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, sosOpen]);

  const active = (p) => loc.pathname === p;

  return (
    <div style={{ minHeight: '100vh', background: DEEP }}>
      {/* ── Top Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200, height: 'var(--nav-h)',
        background: scrolled ? 'rgba(7,7,15,0.98)' : 'rgba(7,7,15,0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,168,76,0.20)' : 'rgba(255,255,255,0.06)'}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
        transition: 'border-color 0.3s, background 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
      }}>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{
          width: 38, height: 38, borderRadius: 10,
          background: menuOpen ? 'rgba(201,168,76,0.10)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${menuOpen ? 'rgba(201,168,76,0.30)' : 'rgba(255,255,255,0.09)'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: TEXT, transition: 'all 0.18s', flexShrink: 0,
        }}>
          <Menu size={17} />
        </button>

        <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: 'rgba(201,168,76,0.13)', border: '1px solid rgba(201,168,76,0.26)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚖️</div>
          <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 700, background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.01em' }}>
            {T('appName')}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={() => setSosOpen(true)} className="animate-sos" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(224,82,82,0.09)', border: '1px solid rgba(224,82,82,0.28)',
          color: DANGER, padding: '6px 15px', borderRadius: 20,
          fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          cursor: 'pointer', letterSpacing: '0.04em', flexShrink: 0,
        }}>
          <Phone size={11} /> SOS
        </button>
      </nav>

      {/* ── Side Menu Overlay ── */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 900 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(5px)', animation: 'overlayIn 0.2s ease' }} />
          <div ref={panelRef} style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 290,
            background: '#0b0b1a', borderRight: '1px solid rgba(201,168,76,0.16)',
            display: 'flex', flexDirection: 'column',
            animation: 'menuSlide 0.27s cubic-bezier(0.16,1,0.3,1)', overflowY: 'auto',
          }}>
            <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#0b0b1a', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 28, height: 28, background: 'rgba(201,168,76,0.13)', border: '1px solid rgba(201,168,76,0.24)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚖️</div>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 17, fontWeight: 700, background: `linear-gradient(135deg,${G},${GL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{T('appName')}</span>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding: '8px 10px 0' }}>
              <button onClick={() => nav('/')} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                background: loc.pathname === '/' ? 'rgba(201,168,76,0.10)' : 'none',
                borderLeft: loc.pathname === '/' ? `3px solid ${G}` : '3px solid transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left', transition: 'all 0.14s',
              }}>
                <Home size={15} color={loc.pathname === '/' ? G : MUTED} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: loc.pathname === '/' ? G : TEXT, fontWeight: loc.pathname === '/' ? 600 : 400 }}>{T('home')}</span>
              </button>
            </div>

            <div style={{ padding: '4px 0 16px', flex: 1 }}>
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi} style={{ marginTop: 6 }}>
                  <div style={{ padding: '10px 18px 5px', fontSize: 9.5, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.10em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                    {T(group.labelKey)}
                  </div>
                  {group.items.map(item => (
                    <button key={item.path} onClick={() => nav(item.path)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                      padding: '9px 18px 9px 10px',
                      background: active(item.path) ? 'rgba(201,168,76,0.09)' : 'none',
                      borderLeft: active(item.path) ? `3px solid ${G}` : '3px solid transparent',
                      border: 'none', cursor: 'pointer', transition: 'all 0.13s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (!active(item.path)) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!active(item.path)) e.currentTarget.style.background = 'none'; }}>
                      <span style={{ fontSize: 16, flexShrink: 0, width: 22, textAlign: 'center', lineHeight: 1 }}>{item.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: active(item.path) ? G : TEXT, fontWeight: active(item.path) ? 600 : 400, lineHeight: 1.3 }}>{T(item.labelKey)}</div>
                        <div style={{ fontSize: 10.5, color: MUTED, marginTop: 1 }}>{T(item.descKey)}</div>
                      </div>
                      {active(item.path) && <ChevronRight size={12} color={G} style={{ flexShrink: 0, opacity: 0.7 }} />}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#090916' }}>
              <button onClick={() => { setMenuOpen(false); setSosOpen(true); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px', borderRadius: 10,
                background: 'rgba(224,82,82,0.09)', border: '1px solid rgba(224,82,82,0.25)',
                color: DANGER, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
              }}>
                <Phone size={13} /> {T('emergencyNumbers')}
              </button>
              <div style={{ fontSize: 10, color: MUTED, textAlign: 'center', marginTop: 10, lineHeight: 1.6 }}>
                {T('aiLegalCompanion')}<br/>
                <span style={{ color: 'rgba(201,168,76,0.40)', fontSize: 9.5 }}>{T('notLegalAdvice')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SOS Modal ── */}
      {sosOpen && (
        <div onClick={() => setSosOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'overlayIn 0.2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0d0d1b', border: '1px solid rgba(224,82,82,0.32)',
            borderRadius: 20, padding: '26px 26px 22px', maxWidth: 460, width: '100%',
            animation: 'scaleIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ color: DANGER, fontFamily: 'Cormorant Garamond, serif', fontSize: 22, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
                <Phone size={19} color={DANGER} /> {T('emergencyNumbers')}
              </h2>
              <button onClick={() => setSosOpen(false)} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED }}>
                <X size={14} />
              </button>
            </div>
            <p style={{ color: MUTED, marginBottom: 18, fontSize: 12 }}>{T('emergencySubtitle')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
              {EMERGENCY.map(e => (
                <a key={e.n} href={`tel:${e.n}`} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: `${e.c}0d`, border: `1px solid ${e.c}28`,
                  borderRadius: 11, padding: '11px 8px', textDecoration: 'none', transition: 'all 0.14s',
                }}
                onMouseEnter={el => { el.currentTarget.style.background = `${e.c}1a`; }}
                onMouseLeave={el => { el.currentTarget.style.background = `${e.c}0d`; }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: e.n.length > 6 ? 11 : 17, color: e.c, fontWeight: 800, marginBottom: 3, textAlign: 'center' }}>{e.n}</div>
                  <div style={{ color: MUTED, fontSize: 9.5, textAlign: 'center' }}>{e.l}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Page Content ── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 22px 80px' }}>
        <Outlet />
      </main>
    </div>
  );
}
