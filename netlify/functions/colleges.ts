import { Handler } from '@netlify/functions';
import { rankColleges } from '../../backend/engines.js';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { degreeId, budget, district, collegeType, domainScores } = JSON.parse(event.body || '{}');
    if (!degreeId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing degreeId' }) };
    }
    const rankedColleges = await rankColleges(degreeId, budget || 0, district || 'Any', collegeType || 'Any', domainScores);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colleges: rankedColleges }),
    };
  } catch (error) {
    console.error('College Ranking Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to rank colleges' }) };
  }
};
