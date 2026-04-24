import Groq from 'groq-sdk';
import { Domain, StreamFit, Degree, AssessmentResult, College, Question } from '../src/types.js';
import { supabase } from './supabase.js';

// Configuration
const difficultyFactors = {
  easy: 1.0,
  medium: 1.25,
  hard: 1.5,
};

const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY
].filter(Boolean);

let currentKeyIndex = 0;

function getAiClient() {
  if (GROQ_KEYS.length === 0) throw new Error("No Groq API keys available.");
  const key = GROQ_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  return new Groq({ apiKey: key as string });
}

// --- Supabase Data Fetchers ---
async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
  return (data || []).map((q: any) => ({
    id: q.id, text: q.text, domain: q.domain, weight: q.weight, difficulty: q.difficulty,
  }));
}

async function fetchDegrees(): Promise<Degree[]> {
  const { data, error } = await supabase.from('degrees').select('*');
  if (error) throw new Error(`Failed to fetch degrees: ${error.message}`);
  return (data || []).map((d: any) => ({
    id: d.id, name: d.name, requiredDomains: d.required_domains, careers: d.careers,
  }));
}

async function fetchColleges(): Promise<College[]> {
  const { data, error } = await supabase.from('colleges').select('*');
  if (error) throw new Error(`Failed to fetch colleges: ${error.message}`);
  return (data || []).map((c: any) => ({
    id: c.id, name: c.name, type: c.type, district: c.district, category: c.category,
    fees: c.fees, placement: c.placement, degrees: c.degrees, website: c.website,
  }));
}

// 1. Aptitude Assessment Engine
export async function assessAptitude(answers: Record<string, number>): Promise<AssessmentResult> {
  const questions = await fetchQuestions();

  const scores: Record<Domain, number> = { Logical: 0, Analytical: 0, Creative: 0, Communication: 0, Practical: 0 };
  const domainMax: Record<Domain, number> = { Logical: 0, Analytical: 0, Creative: 0, Communication: 0, Practical: 0 };
  const domainVariances: Record<Domain, number[]> = { Logical: [], Analytical: [], Creative: [], Communication: [], Practical: [] };

  for (const q of questions) {
    if (answers[q.id]) {
      const answerVal = answers[q.id];
      const diffMultiplier = difficultyFactors[q.difficulty];
      const weight = q.weight;
      const scoreAddition = answerVal * weight * diffMultiplier;
      scores[q.domain] += scoreAddition;
      domainMax[q.domain] += 5 * weight * diffMultiplier;
      domainVariances[q.domain].push(scoreAddition);
    }
  }

  const normalizedScores: Record<Domain, number> = { ...scores };
  for (const domain of Object.keys(scores) as Domain[]) {
    normalizedScores[domain] = domainMax[domain] > 0
      ? Math.round((scores[domain] / domainMax[domain]) * 100)
      : 0;
  }

  let totalVariance = 0;
  for (const domain of Object.keys(domainVariances) as Domain[]) {
    const vals = domainVariances[domain];
    if (vals.length > 1) {
      const mean = vals.reduce((sum, v) => sum + v, 0) / vals.length;
      totalVariance += vals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / vals.length;
    }
  }

  const confidence = totalVariance > 5.0 ? 'Low' : 'High';
  return { domainScores: normalizedScores, confidence, variance: totalVariance };
}

// 2. Stream Recommendation Engine
const streamMatrix: Record<string, Record<Domain, number>> = {
  'Engineering & Technology': { Logical: 0.50, Analytical: 0.35, Creative: 0.05, Communication: 0.05, Practical: 0.05 },
  'Medical & Allied Health Sciences': { Logical: 0.15, Analytical: 0.40, Creative: 0.05, Communication: 0.15, Practical: 0.25 },
  'Arts, Science & Commerce': { Logical: 0.10, Analytical: 0.20, Creative: 0.30, Communication: 0.30, Practical: 0.10 },
};

export function recommendStreams(domainScores: Record<Domain, number>): StreamFit[] {
  return Object.keys(streamMatrix)
    .map(stream => {
      const weights = streamMatrix[stream];
      const fit = Math.round(
        (Object.keys(weights) as Domain[]).reduce((sum, domain) => sum + domainScores[domain] * weights[domain], 0)
      );
      return { stream, fit };
    })
    .sort((a, b) => b.fit - a.fit);
}

// 3. Proximity Matrix
const proximityMap: Record<string, string[]> = {
  'Chennai': ['Thiruvallur', 'Kanchipuram', 'Chengalpattu'],
  'Coimbatore': ['Tiruppur', 'Erode', 'The Nilgiris'],
  'Madurai': ['Theni', 'Dindigul', 'Sivaganga', 'Virudhunagar'],
  'Namakkal': ['Salem', 'Erode', 'Karur', 'Tiruchirappalli'],
  'Salem': ['Namakkal', 'Dharmapuri', 'Erode'],
  'Erode': ['Salem', 'Namakkal', 'Tiruppur', 'Coimbatore'],
  'Tiruchirappalli': ['Karur', 'Namakkal', 'Perambalur', 'Ariyalur', 'Pudukkottai', 'Thanjavur'],
};

// 4. College Recommendation Engine (now async — fetches from Supabase)
export async function rankColleges(
  degreeId: string,
  maxBudget: number,
  preferredDistrict: string,
  collegeType: 'Government' | 'Aided' | 'Self-Financing' | 'Any',
  studentScores?: Record<Domain, number>
): Promise<College[]> {
  const [allColleges, allDegrees] = await Promise.all([fetchColleges(), fetchDegrees()]);
  const targetDegree = allDegrees.find(d => d.id === degreeId);

  const filtered = allColleges.filter(c => {
    const matchesDegree = c.degrees.includes(degreeId);
    const matchesBudget = maxBudget === 0 || c.fees <= maxBudget;
    const matchesDistrict = preferredDistrict === 'Any' || c.district === preferredDistrict || (proximityMap[preferredDistrict]?.includes(c.district));
    const matchesType = collegeType === 'Any' || c.type === collegeType;
    return matchesDegree && matchesBudget && matchesDistrict && matchesType;
  });

  return filtered
    .map(c => {
      const placementNorm = c.placement / 5;
      const affordabilityNorm = maxBudget > 0 ? 1 - (c.fees / maxBudget) : 0;
      let proximityScore = preferredDistrict === 'Any' ? 1 : c.district === preferredDistrict ? 1 : proximityMap[preferredDistrict]?.includes(c.district) ? 0.5 : 0;

      let synergyScore = 0.5;
      if (studentScores && targetDegree) {
        synergyScore = Object.entries(targetDegree.requiredDomains).reduce((sum, [domain, weight]) => {
          return sum + (studentScores[domain as Domain] / 100) * (weight as number);
        }, 0);
      }

      let rankScore = (placementNorm * 0.4) + (affordabilityNorm * 0.2) + (proximityScore * 0.2) + (synergyScore * 0.2);
      if (preferredDistrict === 'Namakkal' && c.name.toUpperCase().includes('K.S.R')) rankScore += 0.1;

      let matchReason = "Solid choice based on your preferences.";
      if (synergyScore > 0.8) matchReason = "Exceptional aptitude fit for this degree program.";
      else if (placementNorm > 0.8) matchReason = "Top-tier career placement track record.";
      else if (proximityScore === 1 && affordabilityNorm > 0.7) matchReason = "Best value choice in your home district.";
      else if (proximityScore === 0.5) matchReason = "Great option in a nearby neighboring district.";

      return { college: { ...c, matchReason }, rankScore };
    })
    .sort((a, b) => b.rankScore - a.rankScore)
    .map(rc => rc.college);
}

// 5. AI Advisor
export async function generateAIExplanation(result: AssessmentResult, streams: StreamFit[], recommendedDegrees: Degree[]): Promise<string> {
  const prompt = `You are a career advisor. Use ONLY the provided data.
Data:
- Scores: ${JSON.stringify(result.domainScores)}
- Top Stream: ${streams[0].stream} (${streams[0].fit}% match)
- Degrees & Careers: ${JSON.stringify(recommendedDegrees.map(d => ({ degree: d.name, careers: d.careers })))}

Explain:
1. Why the top stream fits
2. Key strengths
3. Career opportunities
4. Step-by-step roadmap`;

  const client = getAiClient();
  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }]
  });
  return response.choices?.[0]?.message?.content || 'No AI explanation generated.';
}

// 6. Interactive Chatbot
export async function chatWithAI(messages: { role: 'user' | 'assistant' | 'system', content: string }[]): Promise<string> {
  const client = getAiClient();
  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages
  });
  return response.choices?.[0]?.message?.content || 'Failed to generate response.';
}

// 7. Export fetchDegrees for server.ts to use
export { fetchDegrees };
