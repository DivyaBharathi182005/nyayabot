// services/ragEngine.js - Retrieval Augmented Generation for IPC/BNS
// Builds TF-IDF style vector index from IPC data for semantic retrieval

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load Dataset ─────────────────────────────────────────────────
const IPC_DATA = JSON.parse(
  readFileSync(path.join(__dirname, '../data/ipc_data.json'), 'utf-8')
);

// BNS 2023 mapping (IPC section → BNS equivalent)
// Major correspondences from Bharatiya Nyaya Sanhita 2023
const BNS_MAPPING = {
  '302': { bns: '101', title: 'Murder' },
  '304': { bns: '105', title: 'Culpable homicide not amounting to murder' },
  '307': { bns: '109', title: 'Attempt to murder' },
  '376': { bns: '63', title: 'Rape' },
  '354': { bns: '74', title: 'Assault on woman with intent to outrage modesty' },
  '420': { bns: '318', title: 'Cheating and dishonestly inducing delivery of property' },
  '406': { bns: '316', title: 'Criminal breach of trust' },
  '379': { bns: '303', title: 'Theft' },
  '392': { bns: '309', title: 'Robbery' },
  '395': { bns: '310', title: 'Dacoity' },
  '498A': { bns: '85', title: 'Cruelty by husband or relatives' },
  '304B': { bns: '80', title: 'Dowry death' },
  '323': { bns: '115', title: 'Voluntarily causing hurt' },
  '324': { bns: '117', title: 'Voluntarily causing hurt by dangerous weapons' },
  '325': { bns: '116', title: 'Voluntarily causing grievous hurt' },
  '326': { bns: '118', title: 'Voluntarily causing grievous hurt by dangerous weapons' },
  '363': { bns: '137', title: 'Kidnapping' },
  '364': { bns: '140', title: 'Kidnapping for ransom' },
  '366': { bns: '142', title: 'Kidnapping or abducting woman' },
  '375': { bns: '63', title: 'Rape definition' },
  '377': { bns: '100', title: 'Unnatural offences' },
  '293': { bns: '294', title: 'Sale of obscene objects to young person' },
  '500': { bns: '356', title: 'Defamation' },
  '504': { bns: '352', title: 'Intentional insult' },
  '506': { bns: '351', title: 'Criminal intimidation' },
  '447': { bns: '329', title: 'Criminal trespass' },
  '427': { bns: '324', title: 'Mischief causing damage' },
  '436': { bns: '330', title: 'Mischief by fire' },
  '467': { bns: '336', title: 'Forgery of valuable security' },
  '468': { bns: '336', title: 'Forgery for purpose of cheating' },
  '471': { bns: '340', title: 'Using forged document' },
  '186': { bns: '221', title: 'Obstructing public servant' },
  '353': { bns: '132', title: 'Assault on public servant' },
  '120B': { bns: '61', title: 'Criminal conspiracy' },
  '34': { bns: '3(5)', title: 'Acts done by several persons in furtherance of common intention' },
  '107': { bns: '45', title: 'Abetment' },
  '109': { bns: '48', title: 'Punishment of abetment' },
};

// ── Text Tokenizer ───────────────────────────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Legal stopwords to ignore
const LEGAL_STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'shall', 'may', 'any',
  'such', 'been', 'have', 'which', 'from', 'not', 'are', 'was', 'will',
  'under', 'section', 'ipc', 'act', 'code', 'law', 'legal', 'court',
  'india', 'indian', 'person', 'who', 'whoever', 'one', 'two', 'three',
]);

function meaningfulTokens(text) {
  return tokenize(text).filter(t => !LEGAL_STOPWORDS.has(t) && t.length > 3);
}

// ── Build Inverted Index ──────────────────────────────────────────
const invertedIndex = new Map(); // token → [{ sectionIdx, freq }]
const sectionVectors = [];

IPC_DATA.forEach((section, idx) => {
  const corpus = `${section.offense} ${section.description} ${section.punishment}`;
  const tokens = meaningfulTokens(corpus);
  const freq = {};
  tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
  sectionVectors.push({ idx, freq, totalTokens: tokens.length });

  Object.entries(freq).forEach(([token, count]) => {
    if (!invertedIndex.has(token)) invertedIndex.set(token, []);
    invertedIndex.get(token).push({ sectionIdx: idx, freq: count });
  });
});

// ── TF-IDF Scoring ────────────────────────────────────────────────
function tfidfScore(queryTokens, sectionIdx) {
  const vector = sectionVectors[sectionIdx];
  if (!vector) return 0;

  let score = 0;
  const N = IPC_DATA.length;

  queryTokens.forEach(token => {
    const tf = (vector.freq[token] || 0) / (vector.totalTokens || 1);
    const df = (invertedIndex.get(token) || []).length;
    const idf = df > 0 ? Math.log(N / df) : 0;
    score += tf * idf;
  });

  return score;
}

// ── Keyword Boost Map ─────────────────────────────────────────────
const KEYWORD_BOOSTS = {
  'murder': ['302', '304', '307', '308'],
  'rape': ['376', '375', '354', '354A', '354B'],
  'theft': ['379', '380', '381', '382'],
  'robbery': ['392', '393', '394', '395', '396'],
  'fraud': ['420', '415', '406', '467', '468'],
  'dowry': ['304B', '498A', '406'],
  'kidnap': ['363', '364', '365', '366', '367'],
  'assault': ['352', '353', '354', '323', '324', '325'],
  'defamation': ['499', '500'],
  'cheating': ['420', '415', '416', '417', '418'],
  'trespass': ['441', '442', '447', '448'],
  'forgery': ['463', '464', '465', '466', '467', '471'],
  'bribery': ['171B', '171E', '7', '8', '9', '11'],
  'conspiracy': ['120A', '120B'],
  'hurt': ['319', '320', '321', '322', '323', '324', '325', '326'],
  'accident': ['304A', '337', '338'],
  'domestic violence': ['498A', '304B', '323'],
  'harassment': ['354A', '354B', '354C', '354D', '509'],
  'stalking': ['354D'],
  'cybercrime': ['66A', '66B', '66C', '66D', '67', '67A'],
  'sedition': ['124A'],
  'riot': ['147', '148', '149', '150'],
};

// ── Main Retrieval Function ───────────────────────────────────────
export function retrieveRelevantSections(query, topK = 5) {
  const queryTokens = meaningfulTokens(query);
  const queryLower = query.toLowerCase();

  // Score all sections
  const candidates = new Map();

  // 1. TF-IDF candidates from inverted index
  queryTokens.forEach(token => {
    const matches = invertedIndex.get(token) || [];
    matches.forEach(({ sectionIdx }) => {
      candidates.set(sectionIdx, (candidates.get(sectionIdx) || 0) + 1);
    });
  });

  // 2. Keyword boost
  Object.entries(KEYWORD_BOOSTS).forEach(([keyword, sections]) => {
    if (queryLower.includes(keyword)) {
      sections.forEach(secNum => {
        const idx = IPC_DATA.findIndex(s => s.section_number === secNum || s.section === `IPC_${secNum}`);
        if (idx >= 0) {
          candidates.set(idx, (candidates.get(idx) || 0) + 10); // strong boost
        }
      });
    }
  });

  // 3. Score and rank candidates
  const scored = Array.from(candidates.keys()).map(idx => ({
    section: IPC_DATA[idx],
    score: tfidfScore(queryTokens, idx) + (candidates.get(idx) * 0.1),
  }));

  scored.sort((a, b) => b.score - a.score);

  // 4. Add BNS mapping to each result
  const results = scored.slice(0, topK).map(({ section, score }) => {
    const secNum = section.section_number;
    const bnsInfo = BNS_MAPPING[secNum];
    return {
      ...section,
      bns: bnsInfo || null,
      relevanceScore: Math.round(score * 100) / 100,
    };
  });

  return results;
}

// ── Get section by number ─────────────────────────────────────────
export function getSectionByNumber(sectionNum) {
  const normalized = sectionNum.replace(/IPC_?/i, '').trim();
  const section = IPC_DATA.find(
    s => s.section_number === normalized || s.section === `IPC_${normalized}`
  );
  if (!section) return null;
  return {
    ...section,
    bns: BNS_MAPPING[normalized] || null,
  };
}

// ── Export data accessors ─────────────────────────────────────────
export function getAllSections() {
  return IPC_DATA.map(s => ({
    ...s,
    bns: BNS_MAPPING[s.section_number] || null,
  }));
}

export function getStats() {
  return {
    total: IPC_DATA.length,
    indexSize: invertedIndex.size,
    bnsMapped: Object.keys(BNS_MAPPING).length,
  };
}

export { BNS_MAPPING };
