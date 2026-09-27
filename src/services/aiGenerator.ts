import { ClassId, DifficultyLevel, ExamId, Question, QuestionType, SubjectId } from '../types';

export interface AIGenerationRequest {
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  lessonNumber: number;
  lessonName: string;
  textbookContent: string;
  questionType: QuestionType;
  marks: number;
  difficulty: DifficultyLevel;
  count?: number;
}

export async function generateQuestionsFromTextbook(
  req: AIGenerationRequest
): Promise<Question[]> {
  if (!req.textbookContent || req.textbookContent.trim().length < 20) {
    throw new Error('ಈ ಪಾಠದ ಪಠ್ಯ ವಿಷಯವನ್ನು ಮೊದಲು ಸೇರಿಸಿ.');
  }

  try {
    const res = await fetch('/api/ai-generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textbookContent: req.textbookContent,
        classId: req.classId,
        subjectId: req.subjectId,
        lessonName: req.lessonName,
        lessonNumber: req.lessonNumber,
        questionType: req.questionType,
        marks: req.marks,
        difficulty: req.difficulty,
        count: req.count || 2,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions.map((q: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          classId: req.classId,
          subjectId: req.subjectId,
          examId: req.examId,
          lessonNumber: req.lessonNumber,
          lessonName: req.lessonName,
          questionType: req.questionType,
          questionText: q.questionText,
          options: q.options,
          matchPairs: q.matchPairs,
          answer: q.answer,
          explanation: q.explanation || 'ಪಠ್ಯಪುಸ್ತಕದ ಆಧಾರದಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ',
          marks: req.marks,
          difficulty: req.difficulty,
          isAIGenerated: true,
          approved: false,
          createdAt: new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn('Backend AI generation endpoint unreachable, falling back to local textbook parser:', err);
  }

  // Fallback: Rule-based local parsing of supplied textbook text
  return extractLocalQuestionsFromTextbook(req);
}

// Local smart extractor from textbook content
function extractLocalQuestionsFromTextbook(req: AIGenerationRequest): Question[] {
  const content = req.textbookContent.trim();
  const sentences = content
    .split(/[।.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.length < 150);

  const results: Question[] = [];
  const needed = req.count || 2;

  for (let i = 0; i < sentences.length && results.length < needed; i++) {
    const s = sentences[i];
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length < 4) continue;

    if (req.questionType === 'fill_blank') {
      // Pick a meaningful noun word in the middle
      const pickIdx = Math.min(Math.floor(words.length / 2), words.length - 2);
      const targetWord = words[pickIdx].replace(/[,;:'"()]/g, '');
      const blankSentence = words
        .map((w, idx) => (idx === pickIdx ? '________' : w))
        .join(' ');

      results.push({
        id: `ai-local-${Date.now()}-${results.length}`,
        classId: req.classId,
        subjectId: req.subjectId,
        examId: req.examId,
        lessonNumber: req.lessonNumber,
        lessonName: req.lessonName,
        questionType: 'fill_blank',
        questionText: `${blankSentence}.`,
        answer: targetWord,
        explanation: `ಪಠ್ಯಭಾಗದಿಂದ: "${s}"`,
        marks: req.marks || 1,
        difficulty: req.difficulty,
        isAIGenerated: true,
        approved: false,
      });
    } else if (req.questionType === 'choose_correct' || req.questionType === 'mcq') {
      const pickIdx = Math.min(Math.floor(words.length / 2), words.length - 2);
      const correctWord = words[pickIdx].replace(/[,;:'"()]/g, '');
      const qText = words.map((w, idx) => (idx === pickIdx ? '_____' : w)).join(' ');

      results.push({
        id: `ai-local-${Date.now()}-${results.length}`,
        classId: req.classId,
        subjectId: req.subjectId,
        examId: req.examId,
        lessonNumber: req.lessonNumber,
        lessonName: req.lessonName,
        questionType: req.questionType,
        questionText: `ಕೆಳಗಿನ ವಾಕ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ: ${qText}`,
        options: [
          `ಎ) ${correctWord}`,
          `ಬಿ) ಇತರ ಅಂಶ`,
          `ಸಿ) ಸರಿಹೊಂದುವುದಿಲ್ಲ`,
          `ಡಿ) ಮೇಲಿನ ಯಾವುದೂ ಅಲ್ಲ`,
        ],
        answer: `ಎ) ${correctWord}`,
        marks: req.marks || 1,
        difficulty: req.difficulty,
        isAIGenerated: true,
        approved: false,
      });
    } else if (req.questionType === 'one_word_sentence') {
      results.push({
        id: `ai-local-${Date.now()}-${results.length}`,
        classId: req.classId,
        subjectId: req.subjectId,
        examId: req.examId,
        lessonNumber: req.lessonNumber,
        lessonName: req.lessonName,
        questionType: 'one_word_sentence',
        questionText: `ಪಠ್ಯಭಾಗದ ಆಧಾರದಲ್ಲಿ ಉತ್ತರಿಸಿ: ${s.replace(/[?।.]/g, '')}?`,
        answer: s,
        marks: req.marks || 1,
        difficulty: req.difficulty,
        isAIGenerated: true,
        approved: false,
      });
    } else {
      results.push({
        id: `ai-local-${Date.now()}-${results.length}`,
        classId: req.classId,
        subjectId: req.subjectId,
        examId: req.examId,
        lessonNumber: req.lessonNumber,
        lessonName: req.lessonName,
        questionType: req.questionType,
        questionText: `ಪಠ್ಯಭಾಗದ ಆಧಾರದಲ್ಲಿ ವಿವರಿಸಿ: "${s.slice(0, 80)}..."`,
        answer: s,
        marks: req.marks || 2,
        difficulty: req.difficulty,
        isAIGenerated: true,
        approved: false,
      });
    }
  }

  if (results.length === 0) {
    throw new Error('ಪಠ್ಯಪುಸ್ತಕದ ವಿಷಯದಿಂದ ಪ್ರಶ್ನೆಗಳನ್ನು ರೂಪಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೆಚ್ಚು ವಿವರವಾದ ಪಠ್ಯವನ್ನು ಒದಗಿಸಿ.');
  }

  return results;
}
