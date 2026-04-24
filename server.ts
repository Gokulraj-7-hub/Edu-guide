import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Load our Mock Service logic
import { assessAptitude, recommendStreams, rankColleges, generateAIExplanation, chatWithAI } from './backend/engines.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/assess', async (req, res) => {
    try {
      const { answers } = req.body;
      if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: 'Missing or invalid answers' });
      }
      const result = await assessAptitude(answers);
      const streams = recommendStreams(result.domainScores);
      res.json({ result, streams });
    } catch (error) {
      console.error('Assessment Error:', error);
      res.status(500).json({ error: 'Failed to assess aptitude' });
    }
  });

  app.post('/api/colleges', async (req, res) => {
    try {
      const { degreeId, budget, district, collegeType, domainScores } = req.body;
      if (!degreeId) {
        return res.status(400).json({ error: 'Missing degreeId' });
      }
      const rankedColleges = await rankColleges(degreeId, budget || 0, district || 'Any', collegeType || 'Any', domainScores);
      res.json({ colleges: rankedColleges });
    } catch (error) {
      console.error('College Ranking Error:', error);
      res.status(500).json({ error: 'Failed to rank colleges' });
    }
  });

  app.post('/api/advise', async (req, res) => {
    try {
      const { result, streams, degrees } = req.body;
      if (!result || !streams || !degrees) {
        return res.status(400).json({ error: 'Missing required parameters (result, streams, degrees)' });
      }
      const explanation = await generateAIExplanation(result, streams, degrees);
      res.json({ explanation });
    } catch (error) {
      console.error('AI Advisor Error:', error);
      res.status(500).json({ error: 'Failed to generate AI explanation' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Missing or invalid messages array' });
      }
      const reply = await chatWithAI(messages);
      res.json({ reply });
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ error: 'Failed to generate AI chat response' });
    }
  });

  // Vite Integration for UI
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
