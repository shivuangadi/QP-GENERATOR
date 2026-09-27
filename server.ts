import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server in AI Studio must listen strictly on port 3000
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Fetch textbook content from URL proxy
app.post('/api/fetch-textbook-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ವೆಬ್ ವಿಳಾಸವನ್ನು (URL) ನಮೂದಿಸಿ.' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,text/plain,application/json,*/*',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (Status: ${response.status}). ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಪೇಸ್ಟ್ ಮಾಡಿ.`,
      });
    }

    const contentType = response.headers.get('content-type') || '';
    let extractedText = '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      extractedText = JSON.stringify(data, null, 2);
    } else {
      const htmlOrText = await response.text();
      // Clean HTML tags and extract readable text
      extractedText = htmlOrText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
    }

    if (!extractedText || extractedText.length < 30) {
      return res.status(422).json({
        error: 'ಈ ವೆಬ್ ಲಿಂಕ್‌ನಲ್ಲಿ ಓದಬಹುದಾದ ಪಠ್ಯ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಕಾಪಿ-ಪೇಸ್ಟ್ ಮಾಡಿ.',
      });
    }

    res.json({
      success: true,
      url,
      content: extractedText.slice(0, 30000), // safe limit for frontend
      length: extractedText.length,
    });
  } catch (err: any) {
    console.error('Error fetching textbook URL:', err);
    res.status(500).json({
      error: `ವೆಬ್ ಲಿಂಕ್ ಫೆಚ್ ಮಾಡುವಲ್ಲಿ ದೋಷ: ${err.message || 'ಬಾಹ್ಯ ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ'}. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಪೇಸ್ಟ್ ಮಾಡಿ.`,
    });
  }
});

// AI Question Generation Proxy (Server-side Gemini SDK)
app.post('/api/ai-generate-questions', async (req, res) => {
  try {
    const {
      textbookContent,
      classId,
      subjectId,
      lessonName,
      lessonNumber,
      questionType,
      marks,
      difficulty,
      count = 3,
    } = req.body;

    if (!textbookContent || typeof textbookContent !== 'string' || textbookContent.trim().length < 20) {
      return res.status(400).json({
        error: 'ಈ ಪಾಠದ ಪಠ್ಯ ವಿಷಯವನ್ನು ಮೊದಲು ಸೇರಿಸಿ (Please provide sufficient textbook content first)',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        fallbackAvailable: true,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are an expert Karnataka State Board school teacher and curriculum question paper designer.
Your task is to generate high quality exam questions for Karnataka State Syllabus Kannada Medium.
CRITICAL MANDATORY RULES:
1. ONLY generate questions and answers derived strictly from the provided textbook excerpt. Do not invent or hallucinate information outside this content.
2. The entire question text, options, answers, and explanations must be in pristine, grammatically accurate Kannada Unicode text.
3. Target audience: Class ${classId} Kannada medium school students.
4. Difficulty level: ${difficulty || 'medium'}.
5. Marks per question: ${marks || 1}.
6. Question type: ${questionType}.
7. Return exactly ${count} distinct questions as structured JSON.`;

    const userPrompt = `
Textbook Lesson ${lessonNumber}: "${lessonName}"
Subject: ${subjectId}
Class: ${classId}
Question Type: ${questionType}
Marks per question: ${marks}
Number of questions required: ${count}

--- TEXTBOOK CONTENT START ---
${textbookContent.slice(0, 15000)}
--- TEXTBOOK CONTENT END ---

Generate ${count} authentic examination questions strictly from the textbook text above in Kannada.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: {
                type: Type.STRING,
                description: 'The complete question in Kannada Unicode',
              },
              answer: {
                type: Type.STRING,
                description: 'The correct answer key in Kannada',
              },
              explanation: {
                type: Type.STRING,
                description: 'Brief explanation referencing the textbook content',
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Options in Kannada if question type is MCQ or choose correct (4 options starting with ಎ, ಬಿ, ಸಿ, ಡಿ)',
              },
              matchPairs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    left: { type: Type.STRING },
                    right: { type: Type.STRING },
                  },
                },
                description: 'List of matching pairs if question type is match_following',
              },
            },
            required: ['questionText', 'answer'],
          },
        },
      },
    });

    const outputText = response.text || '[]';
    const parsed = JSON.parse(outputText);

    res.json({
      success: true,
      questions: parsed,
    });
  } catch (error: any) {
    console.error('Error generating AI questions:', error);
    res.status(500).json({
      error: error.message || 'ಪ್ರಶ್ನೆ ರಚನೆಯಲ್ಲಿ ತಾಂತ್ರಿಕ ದೋಷ ಸಂಭವಿಸಿದೆ.',
      fallbackAvailable: true,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Development SPA index.html handler
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Question Paper Tool server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
