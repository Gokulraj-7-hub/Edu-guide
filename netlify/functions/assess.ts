import { Handler } from '@netlify/functions';
import { assessAptitude, recommendStreams } from '../../backend/engines.js';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { answers } = JSON.parse(event.body || '{}');
    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing or invalid answers' }) };
    }
    const result = await assessAptitude(answers);
    const streams = recommendStreams(result.domainScores);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, streams }),
    };
  } catch (error) {
    console.error('Assessment Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to assess aptitude' }) };
  }
};
