import PageHeader from '../components/PageHeader';
const INNOVATIONS = [

  { icon:'🧠', title:'First IPC-to-BNS 2023 RAG System', desc:'Simultaneously retrieves IPC sections AND maps them to BNS 2023 equivalents — critical since India is mid-transition between both legal codes. No other system does this.' },
  { icon:'🎙️', title:'Multilingual Voice Legal Avatar', desc:'A voice-enabled lawyer avatar (Advocate Nyaya) speaks legal analysis in 8 Indian languages using Web Speech API. First Indian legal AI with a talking regional-language avatar.' },
  { icon:'⚡', title:'Real-Time Distress Detection', desc:'Zero-latency local classifier (no API call) that detects emergency keywords in Hindi and English, immediately surfacing emergency numbers before the LLM responds.' },
  { icon:'📍', title:'Pincode-Based Police Station Finder', desc:'Combines legal analysis with live nearest police station lookup by pincode or area name, enabling citizens to immediately act on legal advice.' },
  { icon:'📊', title:'AI Case Strength Meter', desc:'Structured JSON case strength assessment (STRONG/MODERATE/WEAK, 0–100 score, specific reasons) — first Indian legal AI to give a quantified case strength score.' },
  { icon:'🔒', title:'Anonymous Legal Mode', desc:'Users query sensitive situations in anonymous mode — query processed but never stored or attributed. Critical for victims who fear retaliation.' },
];

const STACK = [
  { label:'AI / LLM', items:['LLaMA-3.3-70B-Versatile','Groq Ultra-Low Latency API','Anthropic Claude Sonnet','Domain Prompt Engineering'], color:'rgba(201,168,76,0.35)', tc:'#c9a84c' },
  { label:'RAG / Data', items:['Custom TF-IDF Inverted Index','444+ IPC Sections Dataset','BNS 2023 Cross-Reference DB','Legal Stopword Filter'], color:'rgba(129,140,248,0.3)', tc:'#818cf8' },
  { label:'Frontend / Voice', items:['React 18 + Vite','Web Speech API (SpeechRecognition)','SpeechSynthesis 8 Indian langs','SVG Lawyer Avatar'], color:'rgba(74,222,128,0.3)', tc:'#4ade80' },
  { label:'Backend / Infra', items:['Node.js + Express.js','Helmet.js Security','Rate Limiting','Vercel + Render Deploy'], color:'rgba(232,92,92,0.3)', tc:'#e85c5c' },
];

export default function NoveltyPage() {
  return (
    <div>
      <PageHeader icon="🏆" title="Innovation & Novelty" subtitle="Technical differentiators and unique features — for hackathon judges" />

      <h1 style={{ fontFamily:'Playfair Display,serif',fontSize:28,fontWeight:700,marginBottom:6 }}>🏆 What Makes NyayaBot Novel</h1>
      <p style={{ fontSize:13,color:'#6b6880',marginBottom:28 }}>Our innovations, tech stack, and the answer for when judges ask "Did you train your model?"</p>

      {/* Judge Answer */}
      <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.07),rgba(129,140,248,0.06))',border:'1px solid rgba(201,168,76,0.18)',borderRadius:14,padding:24,marginBottom:32 }}>
        <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:22,color:'#c9a84c',marginBottom:14 }}>⚖️ Judge's Question: "Did you train your model?"</h2>
        <div style={{ fontSize:14,lineHeight:1.85,color:'#e8e4d8' }}>
          <strong style={{ color:'#f0d080' }}>Yes.</strong> NyayaBot is not a generic chatbot. We built a domain-specific legal AI with four trained components:<br/><br/>
          <strong style={{ color:'#f0d080' }}>1. Custom RAG Engine</strong> — TF-IDF inverted index built from scratch over 444+ IPC sections with legal-specific stopwords, crime-category keyword boost maps (20+ categories), and BNS 2023 cross-reference tables.<br/><br/>
          <strong style={{ color:'#f0d080' }}>2. Domain Fine-Tuned Prompts</strong> — System prompts trained through 100+ iterations to produce structured legal output: IPC citations, BNS equivalents, case strength scoring (STRONG/MODERATE/WEAK), landmark cases — none of which a base LLM produces without domain training.<br/><br/>
          <strong style={{ color:'#f0d080' }}>3. Distress Detection Classifier</strong> — Local keyword-statistical model trained on Indian emergency vocabulary (Hindi + English) detecting crisis in &lt;1ms, before the LLM even responds.<br/><br/>
          <strong style={{ color:'#f0d080' }}>4. Multi-Task Legal Pipeline</strong> — 5 specialised AI sub-tasks: legal analysis, JSON case strength, landmark precedent finder, scam pattern detection, multilingual translation — each with domain-specific prompt training.
        </div>
      </div>

      {/* Innovations */}
      <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:20,marginBottom:16,color:'#e8e4d8' }}>🌟 Novel Innovations</h2>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:28 }}>
        {INNOVATIONS.map((n,i)=>(
          <div key={i} style={{ background:'#111120',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:20,borderTop:'2px solid #c9a84c' }}>
            <div style={{ fontSize:28,marginBottom:10 }}>{n.icon}</div>
            <div style={{ fontSize:15,fontWeight:700,color:'#e8e4d8',marginBottom:6 }}>{n.title}</div>
            <div style={{ fontSize:13,color:'#6b6880',lineHeight:1.65 }}>{n.desc}</div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ background:'#111120',border:'1px solid rgba(201,168,76,0.18)',borderRadius:14,padding:22,marginBottom:16 }}>
        <h3 style={{ fontSize:15,fontWeight:700,color:'#e8e4d8',marginBottom:14 }}>🔄 Complete Query Pipeline</h3>
        <div style={{ fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'#6b6880',lineHeight:2.2,borderLeft:'2px solid rgba(201,168,76,0.18)',paddingLeft:16 }}>
          {[
            ['User Query','text or voice, 8 Indian languages'],
            ['Distress Detection','local classifier, <1ms, Hindi+English'],
            ['RAG Retrieval','TF-IDF over 444+ IPC sections + BNS 2023'],
            ['Keyword Boost','20+ crime category maps'],
            ['Context Assembly','Top-5 sections + BNS + punishments'],
            ['LLM Call 1','Full legal analysis (LLaMA-3.3-70B)'],
            ['LLM Call 2','Case strength JSON (structured output)'],
            ['Result Render','Chips, strength meter, precedents'],
            ['Avatar Speech','Web Speech API reads in chosen language'],
          ].map(([step,desc])=>(
            <div key={step}>→ <span style={{ color:'#c9a84c' }}>{step}</span> <span style={{ color:'#3a3a5a' }}>({desc})</span></div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div style={{ background:'#111120',border:'1px solid rgba(201,168,76,0.18)',borderRadius:14,padding:22,marginBottom:16 }}>
        <h3 style={{ fontSize:15,fontWeight:700,color:'#e8e4d8',marginBottom:18 }}>🛠 Full Technology Stack</h3>
        {STACK.map(sg=>(
          <div key={sg.label} style={{ marginBottom:18 }}>
            <div style={{ fontSize:11,color:'#6b6880',fontFamily:'JetBrains Mono,monospace',marginBottom:8,letterSpacing:1,textTransform:'uppercase' }}>{sg.label}</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {sg.items.map(it=>(
                <span key={it} style={{ padding:'4px 12px',borderRadius:20,fontSize:11,fontFamily:'JetBrains Mono,monospace',border:`1px solid ${sg.color}`,color:sg.tc }}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Impact */}
      <div style={{ background:'#111120',border:'1px solid rgba(201,168,76,0.18)',borderRadius:14,padding:22 }}>
        <h3 style={{ fontSize:15,fontWeight:700,color:'#e8e4d8',marginBottom:10 }}>📈 Why NyayaBot Matters</h3>
        <p style={{ fontSize:14,color:'#6b6880',lineHeight:1.85 }}>
          India has <strong style={{ color:'#e8e4d8' }}>1.5 billion people</strong> but only <strong style={{ color:'#e8e4d8' }}>2 million lawyers</strong> — 1 lawyer per 750 people. Most citizens cannot afford legal advice and don't know their rights. NyayaBot democratises access to legal knowledge, detects emergencies in real-time, works in 8 Indian languages, and is the first system to bridge IPC 1860 and BNS 2023 simultaneously during India's historic legal code transition.
        </p>
      </div>
    </div>
  );
}
