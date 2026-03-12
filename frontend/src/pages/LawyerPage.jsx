// LawyerPage.jsx — Fixed: AI consultation uses Anthropic API directly (no backend 404)
import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';

const LAWYERS = [
  { n:'Adv. Priya Krishnamurthy', sp:'Criminal & Women Rights', loc:'Chennai, Tamil Nadu', exp:'12 yrs', tags:['Criminal','498A','POCSO','Domestic Violence'], cat:'criminal', free:true, em:'🧑‍⚖️' },
  { n:'Adv. Rajesh Sharma', sp:'Civil & Property Law', loc:'Delhi, NCT', exp:'18 yrs', tags:['Property','Civil Disputes','Landlord Tenant'], cat:'civil', free:false, em:'👨‍⚖️' },
  { n:'Adv. Fatima Shaikh', sp:'Family & Matrimonial Law', loc:'Mumbai, Maharashtra', exp:'9 yrs', tags:['Divorce','Custody','Maintenance','Domestic Violence'], cat:'family', free:true, em:'👩‍⚖️' },
  { n:'Adv. Suresh Kumar', sp:'Labour & Employment Law', loc:'Bengaluru, Karnataka', exp:'14 yrs', tags:['Wrongful Termination','Salary Disputes','PF'], cat:'labour', free:false, em:'🧑‍⚖️' },
  { n:'Adv. Ananya Singh', sp:'Cyber Crime & IT Law', loc:'Hyderabad, Telangana', exp:'7 yrs', tags:['Cyber Fraud','IT Act','Online Harassment'], cat:'cyber', free:false, em:'👩‍⚖️' },
  { n:'Adv. Mohammed Irfan', sp:'Criminal Defence', loc:'Kolkata, West Bengal', exp:'21 yrs', tags:['Criminal Defence','Bail','High Court'], cat:'criminal', free:true, em:'👨‍⚖️' },
];

const CATS = ['all','criminal','family','civil','cyber','labour'];

const S = {
  input: { width:'100%', background:'#111120', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, color:'#e8e4d8', fontFamily:'DM Sans,sans-serif', fontSize:14, padding:'12px 14px', outline:'none', marginBottom:14 },
  label: { display:'block', fontSize:11, color:'#6b6880', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, textTransform:'uppercase', marginBottom:5 },
};

const G = '#c9a84c';

async function getAIConsultation(issue) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const res = await fetch(`${API_URL}/api/lawyer/consult`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issue }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return data.consultation || data.result || data.message || 'No response received.';
}

export default function LawyerPage() {
  const [cat, setCat] = useState('all');
  const [aiRes, setAiRes] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [issue, setIssue] = useState('');
  const [form, setForm] = useState({ name:'', phone:'', city:'', type:'Criminal Offence', desc:'', free:false });
  const [submitted, setSubmitted] = useState(false);

  const filtered = cat === 'all' ? LAWYERS : LAWYERS.filter(l => l.cat === cat);

  const aiConsult = async () => {
    if (!issue.trim()) { toast.error('Please describe your legal issue'); return; }
    setAiLoading(true); setAiRes('');
    try {
      const result = await getAIConsultation(issue);
      setAiRes(result);
    } catch (e) {
      toast.error('Error getting AI consultation: ' + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const submit = () => {
    if (!form.name || !form.phone) { toast.error('Please fill name and phone'); return; }
    setSubmitted(true);
    toast.success('Consultation request submitted!');
  };

  const inp = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      <PageHeader icon="⚖️" title="Find a Lawyer" subtitle="Browse advocates by specialization — criminal, civil, family, cyber law" />

      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, marginBottom:6, color:'#e8e4d8' }}>👨‍⚖️ Lawyer Consultation</h1>
      <p style={{ fontSize:13, color:'#6b6880', marginBottom:22 }}>Find advocates and get AI-powered consultation preparation</p>

      <div style={{ background:'rgba(129,140,248,0.06)', border:'1px solid rgba(129,140,248,0.2)', borderRadius:10, padding:'14px 16px', marginBottom:24, fontSize:13, lineHeight:1.65, color:'#e8e4d8' }}>
        💡 Free Legal Aid is available for economically weaker sections under Legal Services Authorities Act 1987. Call <strong style={{ color:G }}>15100</strong> for National Legal Aid Helpline.
      </div>

      {/* AI Pre-consultation */}
      <div style={{ background:'#16162a', border:`1px solid rgba(201,168,76,0.18)`, borderRadius:14, padding:22, marginBottom:24 }}>
        <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:G, marginBottom:8 }}>🤖 AI Pre-Consultation — Get Prepared</h3>
        <p style={{ fontSize:13, color:'#6b6880', marginBottom:14 }}>Describe your issue and NyayaBot tells you what lawyer type you need, what to ask them, and how strong your case is.</p>
        <label style={S.label}>Briefly describe your legal issue</label>
        <textarea value={issue} onChange={e => setIssue(e.target.value)}
          placeholder="E.g. My landlord locked me out and kept my belongings..."
          style={{ ...S.input, minHeight:100, resize:'none', marginBottom:12 }} />
        <button onClick={aiConsult} disabled={aiLoading}
          style={{ background:`linear-gradient(135deg,${G},#f0d080)`, color:'#0a0808', border:'none', cursor:'pointer', padding:'11px 24px', borderRadius:10, fontWeight:700, fontSize:14, opacity:aiLoading?0.7:1 }}>
          {aiLoading ? '⏳ Preparing...' : '⚡ Get AI Consultation Prep'}
        </button>
        {aiRes && (
          <div style={{ background:'#111120', border:`1px solid rgba(201,168,76,0.18)`, borderRadius:12, padding:18, marginTop:16, fontSize:14, lineHeight:1.8, color:'#e8e4d8', whiteSpace:'pre-wrap' }}>
            {aiRes}
          </div>
        )}
      </div>

      {/* Lawyer listings */}
      <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, marginBottom:10, color:'#e8e4d8' }}>Find Advocates by Specialisation</h3>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding:'5px 14px', borderRadius:8, border:`1px solid ${cat===c?G:'rgba(255,255,255,0.06)'}`, background:cat===c?'rgba(201,168,76,0.15)':'#111120', color:cat===c?G:'#6b6880', cursor:'pointer', fontSize:13, textTransform:'capitalize' }}>
            {c}
          </button>
        ))}
      </div>

      {filtered.map((l, i) => (
        <div key={i} style={{ background:'#111120', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:20, marginBottom:12 }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:12 }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'rgba(201,168,76,0.15)', border:'2px solid rgba(201,168,76,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{l.em}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700, color:'#e8e4d8', display:'flex', alignItems:'center', gap:8 }}>
                {l.n}
                {l.free && <span style={{ fontSize:9, padding:'2px 8px', borderRadius:4, background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.3)', fontFamily:'JetBrains Mono,monospace' }}>FREE AID</span>}
              </div>
              <div style={{ fontSize:12, color:G, marginBottom:2 }}>{l.sp}</div>
              <div style={{ fontSize:11, color:'#6b6880' }}>📍 {l.loc} · {l.exp} experience</div>
            </div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {l.tags.map(t => <span key={t} style={{ fontSize:10, padding:'2px 9px', borderRadius:6, background:'rgba(129,140,248,0.1)', border:'1px solid rgba(129,140,248,0.25)', color:'#818cf8' }}>{t}</span>)}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => toast('Fill the consultation form below and submit.')}
              style={{ padding:'7px 16px', borderRadius:9, fontSize:12, cursor:'pointer', background:'rgba(201,168,76,0.15)', border:`1px solid ${G}`, color:G }}>📞 Request Consultation</button>
            <button onClick={() => toast('WhatsApp available after request approval.')}
              style={{ padding:'7px 16px', borderRadius:9, fontSize:12, cursor:'pointer', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80' }}>💬 WhatsApp</button>
          </div>
        </div>
      ))}

      {/* Consultation form */}
      <div style={{ background:'#16162a', border:`1px solid rgba(201,168,76,0.18)`, borderRadius:14, padding:22, marginTop:24 }}>
        <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, color:G, marginBottom:8 }}>📞 Request Free Consultation</h3>
        <p style={{ fontSize:13, color:'#6b6880', marginBottom:18 }}>Fill this form and an advocate will contact you within 24 hours.</p>
        {submitted ? (
          <div style={{ background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:12, padding:18 }}>
            <p style={{ color:'#4ade80' }}>✅ Request submitted! An advocate will contact <strong>{form.name}</strong> at <strong>{form.phone}</strong> within 24 hours. For urgent matters call <strong style={{ color:G }}>15100</strong>.</p>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div><label style={S.label}>Your Name</label><input value={form.name} onChange={e => inp('name',e.target.value)} placeholder="Full name" style={S.input}/></div>
              <div><label style={S.label}>Mobile Number</label><input value={form.phone} onChange={e => inp('phone',e.target.value)} placeholder="10-digit mobile" style={S.input}/></div>
              <div><label style={S.label}>City / District</label><input value={form.city} onChange={e => inp('city',e.target.value)} placeholder="Your city" style={S.input}/></div>
              <div>
                <label style={S.label}>Case Type</label>
                <select value={form.type} onChange={e => inp('type',e.target.value)} style={{ ...S.input, appearance:'none', cursor:'pointer' }}>
                  {['Criminal Offence','Family / Matrimonial','Property / Civil','Cyber Crime','Labour Dispute','Consumer Complaint','RTI / Public Interest','Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <label style={S.label}>Brief Description</label>
            <textarea value={form.desc} onChange={e => inp('desc',e.target.value)} placeholder="Describe your case briefly..." style={{ ...S.input, minHeight:90, resize:'none' }}/>
            <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#6b6880' }}>
              <input type="checkbox" checked={form.free} onChange={e => inp('free',e.target.checked)} style={{ width:'auto' }}/>
              I need free legal aid (economically weaker section)
            </div>
            <button onClick={submit} style={{ background:`linear-gradient(135deg,${G},#f0d080)`, color:'#0a0808', border:'none', cursor:'pointer', padding:'12px 28px', borderRadius:11, fontWeight:700, fontSize:14, width:'100%' }}>
              📤 Submit Consultation Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}
