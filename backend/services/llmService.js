// services/llmService.js - LexAI v2 - Groq LLM wrapper
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
  kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali',
  gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu',
};

// ── System Prompt ─────────────────────────────────────────────────
const LEGAL_SYSTEM_PROMPT = `You are LexAI, an expert Indian legal assistant with deep knowledge of:
- Indian Penal Code (IPC) 1860
- Bharatiya Nyaya Sanhita (BNS) 2023 - the new criminal code replacing IPC
- Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023
- Indian Evidence Act / Bharatiya Sakshya Adhiniyam 2023
- Constitutional rights under Articles 20, 21, 22, 39A
- Landmark Supreme Court and High Court judgments
- Protection of Women from Domestic Violence Act 2005
- IT Act 2000 / IT Amendment Act 2008 (cyber crimes)
- POCSO Act 2012 (protection of children)

RESPONSE RULES:
1. Always cite specific IPC/BNS section numbers
2. Mention both old IPC and new BNS equivalent when applicable  
3. Explain punishments clearly (imprisonment years + fine amounts)
4. Assess case strength: STRONG / MODERATE / WEAK with reasoning
5. Suggest immediate practical steps
6. Be empathetic - many users are victims or in distress
7. Use simple, clear language - avoid excessive legal jargon
8. Always recommend consulting a qualified lawyer for actual legal action
9. For emergencies (violence, threats), always provide emergency numbers first

IMPORTANT: Never give definitive legal advice that replaces a qualified lawyer.`;

// ── Distress Detection (local, no API) ───────────────────────────
const DISTRESS_KEYWORDS = [
  'right now', 'happening now', 'help me', 'danger', 'scared', 'afraid',
  'threatening', 'violence', 'beating', 'attack', 'emergency', 'urgent',
  'please help', 'rape', 'assault', 'kidnap', 'hostage', 'dying', 'suicide',
  'kill', 'murder', 'bleeding', 'hurt badly', 'abuse', 'torture',
  'abhi', 'bachao', 'maaro', 'marenge', 'darr', 'mujhe bachao',
];

const TRAUMA_KEYWORDS = [
  'trauma', 'depressed', 'crying', 'broken', 'helpless', 'hopeless',
  'nobody helps', 'alone', 'scared', 'shaking', 'can\'t sleep',
  'mental', 'anxiety', 'panic', 'distress', 'devastated',
];

export function detectDistress(text) {
  const lower = text.toLowerCase();
  return DISTRESS_KEYWORDS.some(kw => lower.includes(kw));
}

export function detectTrauma(text) {
  const lower = text.toLowerCase();
  return TRAUMA_KEYWORDS.some(kw => lower.includes(kw)) || detectDistress(text);
}

// ── Main Legal Query Analysis ─────────────────────────────────────
export async function analyzeLegalQuery({ query, retrievedSections, language = 'en' }) {
  const sectionsContext = retrievedSections.map(s =>
    `**${s.section || s.section_number} (IPC)**${s.bns ? ` → BNS Section ${s.bns.bns}` : ''}
Offense: ${s.offense}
Punishment: ${s.punishment}
Description: ${(s.description || '').substring(0, 200)}...`
  ).join('\n\n');

  const isTrauma = detectTrauma(query);
  const toneInstruction = isTrauma
    ? 'IMPORTANT: User seems distressed. Use a VERY gentle, empathetic, supportive tone. Acknowledge their situation first before legal information. Add mental health helpline iCall: 9152987821 at the end.'
    : '';

  const langInstruction = language !== 'en'
    ? `\n\n🔴 MANDATORY LANGUAGE INSTRUCTION: You MUST write your ENTIRE response in ${LANG_NAMES[language] || language} language. Every single word, heading, section, and sentence must be in ${LANG_NAMES[language] || language}. Do NOT use English at all except for legal section numbers like IPC 302, BNS 101. This is non-negotiable.`
    : '';

  const userPrompt = `${langInstruction}

User Legal Query: "${query}"

RELEVANT IPC/BNS SECTIONS RETRIEVED FROM DATABASE:
${sectionsContext}

${toneInstruction}

Analyze this legal situation and provide:
1. **Primary Applicable Section**: Most relevant IPC/BNS section with number
2. **Legal Summary**: What offense this constitutes in simple terms (2-3 sentences)
3. **Punishment Details**: Exact imprisonment + fine under both IPC and BNS
4. **Case Strength**: STRONG/MODERATE/WEAK with 2-3 specific reasons
5. **Immediate Steps**: What the person should do right now (numbered list, 4-5 steps)
6. **Key Rights**: Most important legal rights applicable here (2-3 rights)
7. **Important Note**: Any critical caveats or warnings

${language !== 'en' ? `🔴 REMINDER: Respond COMPLETELY in ${LANG_NAMES[language] || language}. No English words except IPC/BNS section numbers.` : ''}

Use clear formatting with bold headers. Be thorough but accessible to a common person.`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1500,
    temperature: 0.3,
    messages: [
      { role: 'system', content: LEGAL_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  return response.choices[0].message.content;
}

// ── Case Strength Estimator ───────────────────────────────────────
export async function estimateCaseStrength({ description, sections }) {
  const sectionsStr = sections.slice(0, 3).map(s =>
    `${s.section_number}: ${s.offense}`
  ).join(', ');

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 400,
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are an experienced Indian criminal lawyer assessing case strength. Be precise and practical.' },
      {
        role: 'user',
        content: `Situation: "${description}"
Applicable sections: ${sectionsStr}

Assess case strength as JSON:
{
  "verdict": "STRONG" | "MODERATE" | "WEAK",
  "score": 0-100,
  "reasons": ["reason1", "reason2", "reason3"],
  "challenges": ["challenge1", "challenge2"],
  "recommendation": "one sentence action recommendation"
}
Return ONLY the JSON, no other text.`,
      },
    ],
  });

  try {
    const text = response.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      verdict: 'MODERATE',
      score: 50,
      reasons: ['Insufficient information to make detailed assessment'],
      challenges: ['Please consult a lawyer for accurate case evaluation'],
      recommendation: 'Consult a qualified lawyer for detailed case assessment.',
    };
  }
}

// ── Landmark Cases Finder ─────────────────────────────────────────
export async function findLandmarkCases(query, sectionNumbers) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    temperature: 0.1,
    messages: [
      { role: 'system', content: 'You are an expert on Indian Supreme Court and High Court landmark judgments. Only cite real, verifiable cases.' },
      {
        role: 'user',
        content: `Legal query: "${query}"
Relevant IPC sections: ${sectionNumbers.slice(0, 3).join(', ')}

List 2-3 most relevant landmark Indian court cases as JSON array:
[
  {
    "case": "Case name vs Case name",
    "court": "Supreme Court/High Court name",
    "year": "YYYY",
    "citation": "AIR/SCC citation",
    "principle": "Key legal principle established (1-2 sentences)",
    "relevance": "Why this case matters here (1 sentence)"
  }
]
Return ONLY the JSON array. Only include real, famous cases.`,
      },
    ],
  });

  try {
    const text = response.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

// ── Complaint/FIR Draft Generator ────────────────────────────────
export async function generateComplaintDraft({ situation, complainantName, respondentName, place, date, witnesses }) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1200,
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are an expert Indian legal document drafter. Create formal, legally precise complaint letters suitable for filing at police stations or courts in India.' },
      {
        role: 'user',
        content: `Draft a formal police complaint letter / FIR draft with these details:
Situation: ${situation}
Complainant: ${complainantName || '[COMPLAINANT NAME]'}
Accused/Respondent: ${respondentName || '[ACCUSED NAME]'}
Place of Incident: ${place || '[PLACE]'}
Date of Incident: ${date || '[DATE]'}
Witnesses: ${witnesses || 'None mentioned'}

Format as:
1. Heading: "To, The Station House Officer, [Police Station], [City]"
2. Subject line with relevant IPC sections
3. Opening: "I, [name]... hereby submit this complaint"
4. Facts of the case (numbered paragraphs)
5. Specific IPC/BNS sections violated
6. Prayer/relief sought
7. Verification statement
8. Signature block

Use formal legal language. Include actual IPC/BNS section numbers relevant to the situation.`,
      },
    ],
  });

  return response.choices[0].message.content;
}

// ── RTI Application Generator ─────────────────────────────────────
export async function generateRTIApplication({ subject, department, specificInfo, applicantName, state }) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1000,
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are an expert in RTI (Right to Information) Act 2005. Draft precise, legally compliant RTI applications for Indian citizens.' },
      {
        role: 'user',
        content: `Draft an RTI application:
Subject: ${subject}
Department: ${department}
Specific Information Required: ${specificInfo}
Applicant Name: ${applicantName || '[APPLICANT NAME]'}
State: ${state || 'India (Central Government)'}

Format properly with:
1. To: The Public Information Officer (PIO)
2. Subject line
3. Introduction citing RTI Act 2005
4. Specific information requested (numbered points)
5. Fee payment note (₹10 IPO/DD)
6. Contact address for reply
7. Date and signature
8. Enclosures list

Make it legally precise and complete.`,
      },
    ],
  });

  return response.choices[0].message.content;
}

// ── Scam Detection ────────────────────────────────────────────────
export async function detectScamPattern(description) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 500,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: 'You are an expert on Indian legal scams, cybercrime patterns, and fraud. Identify if a situation matches known scam patterns in India.',
      },
      {
        role: 'user',
        content: `Analyze if this is a known scam/fraud pattern in India:
"${description}"

Respond as JSON:
{
  "isScam": true/false,
  "confidence": 0-100,
  "scamType": "name of scam type or null",
  "explanation": "brief explanation",
  "knownPatterns": ["pattern1", "pattern2"],
  "immediateActions": ["action1", "action2"],
  "reportTo": ["authority1", "authority2"],
  "helplines": ["helpline1", "helpline2"]
}
Return ONLY JSON.`,
      },
    ],
  });

  try {
    const text = response.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { isScam: false, confidence: 0, explanation: 'Could not analyze pattern', immediateActions: [], reportTo: [] };
  }
}

// ── Translation ───────────────────────────────────────────────────
export async function translateToEnglish(text, sourceLang) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    temperature: 0.1,
    messages: [
      {
        role: 'user',
        content: `Translate this ${sourceLang} text to English accurately, preserving legal context. Return ONLY the English translation, nothing else:\n\n"${text}"`,
      },
    ],
  });
  return response.choices[0].message.content.trim();
}

export async function translateResponse(text, targetLang) {
  if (targetLang === 'en') return text;
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0.1,
    messages: [
      {
        role: 'user',
        content: `Translate this legal response from English to ${targetLang}. Preserve all formatting (bold, numbers, headers). Return ONLY the translation:\n\n${text}`,
      },
    ],
  });
  return response.choices[0].message.content.trim();
}

// ── Legal Dictionary ──────────────────────────────────────────────
export async function explainLegalTerm(term, language = 'en') {
  const langName = LANG_NAMES[language] || language;
  const langInstruction = language !== 'en'
    ? `🔴 MANDATORY: Write your ENTIRE response in ${langName} language. Every word must be in ${langName}. Only keep legal section numbers (like IPC 302) in English.`
    : '';

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 400,
    temperature: 0.3,
    messages: [
      { role: 'system', content: `You are an Indian legal educator who explains legal terms simply to common people. Use examples from everyday Indian life. ${langInstruction}` },
      {
        role: 'user',
        content: `${langInstruction}

Explain the legal term "${term}" in the context of Indian law.
${language !== 'en' ? `Respond COMPLETELY in ${langName}. Do not use English.` : ''}

Format:
1. Simple definition (1-2 sentences in plain language)
2. Technical legal definition
3. Example from Indian context
4. Relevant law/section
5. Common misconceptions (if any)`,
      },
    ],
  });
  return response.choices[0].message.content;
}

// ── Witness Protection Guide ──────────────────────────────────────
export async function getWitnessProtectionInfo(crimeType) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are an expert on Indian witness protection laws and procedures.' },
      {
        role: 'user',
        content: `Provide witness protection guidance for: ${crimeType}

Include:
1. Rights under CrPC Section 195A and Witness Protection Scheme 2018
2. How to apply for protection
3. Types of protection available
4. Important contact authorities
5. Safety measures while waiting for protection

Keep practical and actionable.`,
      },
    ],
  });
  return response.choices[0].message.content;
}
