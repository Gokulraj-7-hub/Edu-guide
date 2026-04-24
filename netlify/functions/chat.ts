import { Handler } from '@netlify/functions';
import { chatWithAI } from '../../backend/engines.js';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');
    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing or invalid messages array' }) };
    }
    const reply = await chatWithAI(messages);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate AI chat response' }) };
  }
};
