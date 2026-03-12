import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: BASE, timeout: 30000 });

export async function queryLegal(query, language = 'en') {
  const { data } = await api.post('/api/legal/query', { query, language });
  return data;
}
export async function explainTerm(term, language = 'en') {
  const { data } = await api.post('/api/legal/explain-term', { term, language });
  return data.explanation;
}
export async function generateComplaint(payload) {
  const { data } = await api.post('/api/complaint/generate', payload);
  return data;
}
export async function generateRTI(payload) {
  const { data } = await api.post('/api/rti/generate', payload);
  return data;
}
export async function getRTIGuide() {
  const { data } = await api.get('/api/rti/guide');
  return data;
}
export async function detectScam(description) {
  const { data } = await api.post('/api/scam/detect', { description });
  return data;
}
export async function getScamPatterns() {
  const { data } = await api.get('/api/scam/patterns');
  return data;
}
export async function findPoliceStations(query) {
  const { data } = await api.post('/api/police/find', { query });
  return data;
}
export async function getLawyerConsultation(issue) {
  const { data } = await api.post('/api/lawyer/consult', { issue });
  return data;
}
export async function getLegalAid() {
  const { data } = await api.get('/api/lawyer/legal-aid');
  return data;
}
export async function getCasePortals() {
  const { data } = await api.get('/api/case/portals');
  return data;
}
export async function explainCaseStatus(statusText, caseType) {
  const { data } = await api.post('/api/case/explain-status', { statusText, caseType });
  return data;
}
export async function getTimelineStages() {
  const { data } = await api.get('/api/timeline/stages');
  return data;
}
export async function calculateTimeline(startDate, stage) {
  const { data } = await api.post('/api/timeline/calculate', { startDate, stage });
  return data;
}
export async function getWitnessGuide() {
  const { data } = await api.get('/api/witness/guide');
  return data;
}
export async function checkHealth() {
  const { data } = await api.get('/api/health');
  return data;
}
export async function getLegalProcedure(type, language = 'en') {
  const { data } = await api.post('/api/legal/query', { query: `Explain the step-by-step legal procedure for: ${type}`, language });
  return data;
}
export async function getLegalChecklist(type, language = 'en') {
  const { data } = await api.post('/api/legal/query', { query: `Give a checklist of documents and steps required for: ${type}`, language });
  return data;
}
export function detectDistress(text = '') {
  return /danger|emergency|help now|scared|attack|assault|bleeding|dying|rape|bachao|maaro|happening now/i.test(text);
}
export async function getLegalRights(category, language = 'en') {
  const { data } = await api.post('/api/legal/query', { query: `Explain the fundamental and legal rights related to: ${category}`, language });
  return data;
}
