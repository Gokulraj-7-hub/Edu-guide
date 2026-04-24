import { Handler } from '@netlify/functions';
import { generateAIExplanation } from '../../backend/engines.js';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { result, streams, degrees } = JSON.parse(event.body || '{}');
    if (!result || !streams || !degrees) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required parameters' }) };
    }
    const explanation = await generateAIExplanation(result, streams, degrees);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ explanation }),
    };
  } catch (error) {
    console.error('AI Advisor Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate AI explanation' }) };
  }
};
