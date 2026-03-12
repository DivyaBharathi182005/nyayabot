// server.js — NyayaBot Backend · Full Express Server with Groq
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import {
  analyzeLegalQuery,
  generateComplaintDraft,
  generateRTIApplication,
  detectScamPattern,
  explainLegalTerm,
  estimateCaseStrength,
  findLandmarkCases,
  detectDistress,
} from './services/llmService.js';

import {
  retrieveRelevantSections,
  getSectionByNumber,
  getAllSections,
  getStats,
} from './services/ragEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true });
app.use('/api/', limiter);

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const stats = getStats();
  res.json({ status: 'ok', groq: !!process.env.GROQ_API_KEY, ...stats });
});

// ── LEGAL QUERY (main AI endpoint) ───────────────────────────────
app.post('/api/legal/query', async (req, res) => {
  try {
    const { query, language = 'en', anonymousMode = false } = req.body;
    if (!query?.trim()) return res.status(400).json({ error: 'Query is required' });

    const isDistress = detectDistress(query);
    const retrievedSections = retrieveRelevantSections(query, 5);
    const analysis = await analyzeLegalQuery({ query, retrievedSections, language });
    const caseStrength = await estimateCaseStrength({
      description: query,
      sections: retrievedSections,
    }).catch(() => null);
    const landmarkCases = await findLandmarkCases(
      query,
      retrievedSections.map(s => s.section_number)
    ).catch(() => []);

    res.json({
      success: true,
      analysis,
      caseStrength,
      landmarkCases,
      sections: retrievedSections,
      isDistress,
    });
  } catch (err) {
    console.error('Legal query error:', err.message);
    res.status(500).json({ error: 'Failed to process query. Check your GROQ_API_KEY.' });
  }
});

// ── EXPLAIN LEGAL TERM ────────────────────────────────────────────
app.post('/api/legal/explain-term', async (req, res) => {
  try {
    const { term, language = 'en' } = req.body;
    if (!term?.trim()) return res.status(400).json({ error: 'Term is required' });
    const explanation = await explainLegalTerm(term, language);
    res.json({ success: true, explanation });
  } catch (err) {
    console.error('Explain term error:', err.message);
    res.status(500).json({ error: 'Failed to explain term' });
  }
});

// ── COMPLAINT / FIR GENERATOR ─────────────────────────────────────
app.post('/api/complaint/generate', async (req, res) => {
  try {
    const { situation, complainantName, respondentName, place, date, witnesses } = req.body;
    if (!situation?.trim()) return res.status(400).json({ error: 'Situation is required' });

    const isDistress = detectDistress(situation);
    const draft = await generateComplaintDraft({ situation, complainantName, respondentName, place, date, witnesses });
    res.json({ success: true, draft, isDistress });
  } catch (err) {
    console.error('Complaint error:', err.message);
    res.status(500).json({ error: 'Failed to generate complaint' });
  }
});

// ── RTI APPLICATION GENERATOR ─────────────────────────────────────
app.post('/api/rti/generate', async (req, res) => {
  try {
    const { subject, department, specificInfo, applicantName, applicantAddress, state } = req.body;
    if (!subject?.trim() || !specificInfo?.trim())
      return res.status(400).json({ error: 'Subject and specific info are required' });

    const application = await generateRTIApplication({
      subject, department, specificInfo,
      applicantName: applicantName || '[Your Name]',
      applicantAddress: applicantAddress || '[Your Address]',
      state,
    });
    res.json({ success: true, application });
  } catch (err) {
    console.error('RTI error:', err.message);
    res.status(500).json({ error: 'Failed to generate RTI application' });
  }
});

// ── RTI GUIDE (static) ────────────────────────────────────────────
app.get('/api/rti/guide', (req, res) => {
  res.json({
    success: true,
    departments: ['Municipal Corporation','Police Department','RTO / Transport','Public Works Dept','Revenue Department','Education Department','Health Department','Income Tax Department'],
    timeline: [
      { days: 0,  event: 'Application submitted to PIO' },
      { days: 1,  event: 'Acknowledgement received' },
      { days: 30, event: 'Response due from PIO' },
      { days: 30, event: 'First Appeal window opens (if unsatisfied)' },
      { days: 60, event: 'First Appeal decision due' },
      { days: 90, event: 'Second Appeal to Central/State Information Commission' },
    ],
    guide: [
      { step: 1, title: 'Write the Application', description: 'Write on plain A4 paper or type. Address to Public Information Officer (PIO). No specific format required.' },
      { step: 2, title: 'Pay the Fee', description: 'Pay ₹10 via Indian Postal Order (IPO), Demand Draft, or cash. BPL card holders are exempt.' },
      { step: 3, title: 'Submit Application', description: 'Submit to PIO physically, by registered post, or online at rtionline.gov.in for Central Government.' },
      { step: 4, title: 'Get Acknowledgement', description: 'PIO must acknowledge receipt. Keep it safely as proof of submission.' },
      { step: 5, title: 'Wait for Response', description: 'PIO must respond within 30 days. For life/liberty matters, deadline is 48 hours.' },
      { step: 6, title: 'File First Appeal', description: 'If unsatisfied or no response, appeal to First Appellate Authority within 30 days.' },
    ],
    exemptions: [
      'Information that would harm national security or intelligence operations',
      'Cabinet papers and deliberations of Council of Ministers',
      'Information received in confidence from foreign government',
      'Information that would endanger life or safety of any person',
      'Personal information with no public interest justification',
      'Trade secrets that would harm competitive position',
    ],
  });
});

// ── SCAM DETECTOR ─────────────────────────────────────────────────
app.post('/api/scam/detect', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) return res.status(400).json({ error: 'Description is required' });
    const result = await detectScamPattern(description);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Scam detect error:', err.message);
    res.status(500).json({ error: 'Failed to detect scam pattern' });
  }
});

// ── SCAM PATTERNS (static) ────────────────────────────────────────
app.get('/api/scam/patterns', (req, res) => {
  res.json({
    success: true,
    patterns: [
      { name: 'OTP Fraud', description: 'Caller posing as bank/TRAI asks for OTP', sections: ['IT Act 66C', 'IPC 420'] },
      { name: 'KYC Scam', description: 'Fake bank official asks to update KYC urgently', sections: ['IT Act 66C', 'IPC 420'] },
      { name: 'Courier Scam', description: 'FedEx/police impersonation — drugs found in parcel', sections: ['IPC 384', 'IPC 420'] },
      { name: 'Investment Fraud', description: 'Guaranteed high returns on crypto/stocks', sections: ['IPC 420', 'SEBI Act'] },
      { name: 'Job Offer Scam', description: 'Fake job offer, asks for registration fee', sections: ['IPC 420', 'IPC 406'] },
      { name: 'Matrimonial Fraud', description: 'Fake matrimonial profile to extract money', sections: ['IPC 420', 'IT Act 66C'] },
    ],
  });
});

// ── POLICE STATIONS — Real data via OpenStreetMap Overpass API ────
app.post('/api/police/find', async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) return res.status(400).json({ error: 'Query is required' });

  try {
    // Step 1: Geocode the query using Nominatim (free, no key needed)
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=1`;
    const geoResp = await fetch(geoUrl, { headers: { 'User-Agent': 'NyayaBot/1.0' } });
    const geoData = await geoResp.json();

    if (!geoData || geoData.length === 0) {
      return res.json({ success: true, stations: [], tip: 'Location not found. Try a different pincode or area name.' });
    }

    const { lat, lon, display_name } = geoData[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radius = 5000; // 5km radius

    // Step 2: Query Overpass API for police stations nearby
    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["amenity"="police"](around:${radius},${latitude},${longitude});
        way["amenity"="police"](around:${radius},${latitude},${longitude});
      );
      out center 10;
    `;
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const overpassResp = await fetch(overpassUrl, {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'text/plain', 'User-Agent': 'NyayaBot/1.0' },
    });
    const overpassData = await overpassResp.json();

    const elements = overpassData.elements || [];

    // Step 3: Format results with distance calculation
    const stations = elements.map((el) => {
      const elLat = el.lat || el.center?.lat;
      const elLon = el.lon || el.center?.lon;

      // Haversine distance in km
      const R = 6371;
      const dLat = ((elLat - latitude) * Math.PI) / 180;
      const dLon = ((elLon - longitude) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos((latitude * Math.PI) / 180) * Math.cos((elLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
      const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || 'Police Station';
      const phone = tags.phone || tags['contact:phone'] || tags['phone:IN'] || null;
      const street = tags['addr:street'] || '';
      const city = tags['addr:city'] || tags['addr:suburb'] || '';
      const full = tags['addr:full'] || '';
      const address = full || [street, city].filter(Boolean).join(', ') || display_name.split(',').slice(0, 3).join(',');

      return {
        name,
        address: address || 'Address not available',
        phone: phone ? phone.replace(/\s+/g, '') : null,
        distance: distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`,
        distKm,
        lat: elLat,
        lon: elLon,
        type: tags.operator || tags.department || 'Police Station',
      };
    })
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 8);

    res.json({
      success: true,
      stations,
      area: display_name,
      coords: { lat: latitude, lon: longitude },
      tip: stations.length === 0
        ? 'No stations found in 5km. Try a broader area or pincode.'
        : `Found ${stations.length} stations near ${display_name.split(',')[0]}`,
    });

  } catch (err) {
    console.error('Police find error:', err.message);
    // Fallback: return Google Maps search link
    res.json({
      success: true,
      stations: [],
      tip: `Search failed. Open Google Maps and search "police station near ${query}" or call 100.`,
    });
  }
});

// ── LAWYER CONSULTATION ───────────────────────────────────────────
app.post('/api/lawyer/consult', async (req, res) => {
  try {
    const { issue } = req.body;
    if (!issue?.trim()) return res.status(400).json({ error: 'Issue description is required' });

    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 900,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Indian legal advisor. Give practical, specific legal guidance based on Indian law (IPC, BNS 2023, CrPC). Be concise and actionable.',
        },
        {
          role: 'user',
          content: `A person has described their legal issue. Give them:
1. **Type of Lawyer Needed** (criminal/civil/family/cyber/labour/consumer)
2. **Key Questions to Ask the Lawyer** (3-4 questions)
3. **Documents to Gather** (specific list)
4. **Case Strength** (STRONG/MODERATE/WEAK with reason)
5. **Immediate Steps** (what to do right now)

Legal issue: ${issue}`,
        },
      ],
    });

    const consultation = response.choices[0].message.content;
    res.json({ success: true, consultation });
  } catch (err) {
    console.error('Lawyer consult error:', err.message);
    res.status(500).json({ error: 'Failed to generate consultation. Check GROQ_API_KEY.' });
  }
});

// ── LEGAL AID ─────────────────────────────────────────────────────
app.get('/api/lawyer/legal-aid', (req, res) => {
  res.json({
    success: true,
    helpline: '15100',
    website: 'nalsa.gov.in',
    description: 'National Legal Services Authority provides free legal aid to eligible persons.',
    eligibility: ['Annual income below ₹3 lakh', 'SC/ST community members', 'Women & children', 'Victims of trafficking', 'Persons with disabilities', 'Industrial workmen'],
  });
});

// ── CASE PORTALS (static) ─────────────────────────────────────────
app.get('/api/case/portals', (req, res) => {
  res.json({
    success: true,
    portals: [
      { name: 'eCourts Services', url: 'https://services.ecourts.gov.in', description: 'All District & High Courts' },
      { name: 'Supreme Court', url: 'https://sci.gov.in', description: 'Supreme Court case status' },
      { name: 'NJDG', url: 'https://njdg.ecourts.gov.in', description: 'National Judicial Data Grid' },
    ],
  });
});

// ── CASE STATUS EXPLAIN ───────────────────────────────────────────
app.post('/api/case/explain-status', async (req, res) => {
  try {
    const { statusText, caseType } = req.body;
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Explain this Indian court case status in simple terms for a common person: "${statusText}" (Case type: ${caseType || 'general'}). Keep it under 4 sentences.`,
      }],
    });
    res.json({ success: true, explanation: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to explain status' });
  }
});

// ── TRANSLATE LEGAL TERM ──────────────────────────────────────────
app.post('/api/translate/legal-term', async (req, res) => {
  try {
    const { term, targetLang } = req.body;
    const explanation = await explainLegalTerm(term, targetLang);
    res.json({ success: true, explanation });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ── TIMELINE (static) ─────────────────────────────────────────────
app.get('/api/timeline/stages', (req, res) => {
  res.json({
    success: true,
    stages: [
      { id: 'fir', label: 'FIR Filed', description: 'First Information Report registered at police station' },
      { id: 'investigation', label: 'Investigation', description: 'Police investigation — typically 60-90 days' },
      { id: 'chargesheet', label: 'Chargesheet Filed', description: 'Police files chargesheet in court' },
      { id: 'cognizance', label: 'Cognizance', description: 'Court takes cognizance and issues summons/warrants' },
      { id: 'trial', label: 'Trial', description: 'Evidence, witnesses, arguments' },
      { id: 'judgment', label: 'Judgment', description: 'Court pronounces verdict' },
      { id: 'appeal', label: 'Appeal (if any)', description: 'Higher court review if conviction challenged' },
    ],
  });
});

app.post('/api/timeline/calculate', (req, res) => {
  const { startDate, stage } = req.body;
  const start = new Date(startDate || Date.now());
  res.json({
    success: true,
    startDate: start.toISOString(),
    stage,
    estimatedDates: {
      chargesheet: new Date(start.getTime() + 75 * 864e5).toISOString(),
      firstHearing: new Date(start.getTime() + 90 * 864e5).toISOString(),
      trialEnd: new Date(start.getTime() + 365 * 864e5).toISOString(),
    },
    note: 'Estimates only. Actual timelines depend on court workload, complexity, and parties.',
  });
});

// ── WITNESS GUIDE (static) ────────────────────────────────────────
app.get('/api/witness/guide', (req, res) => {
  res.json({
    success: true,
    guide: {
      scheme: 'Witness Protection Scheme 2018 — Supreme Court of India',
      rights: [
        'Right to protection under Section 195A CrPC',
        'Identity concealment in sensitive cases',
        'Change of residence if threatened',
        'Police protection before/during/after trial',
        'In-camera testimony for vulnerable witnesses',
      ],
      howToApply: [
        'File application before the Competent Authority (Sessions Judge)',
        'Attach threat perception report from police',
        'Hearing within 7 days of application',
        'Protection order passed within 5 days of hearing',
      ],
      helplines: ['100 — Police', '112 — Emergency', '15100 — Legal Aid'],
    },
  });
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ NyayaBot Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Groq API Key: ${process.env.GROQ_API_KEY ? '✓ Found' : '✗ MISSING — set GROQ_API_KEY in .env'}`);
  const stats = getStats();
  console.log(`📚 IPC Sections loaded: ${stats.total} | BNS mapped: ${stats.bnsMapped}\n`);
});
