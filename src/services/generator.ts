import { DEFAULT_PATTERNS } from '../data/defaultPatterns';
import { getLessons, getSubjectById } from '../data/syllabus';
import {
  AnswerSpaceType,
  ClassId,
  DifficultyLevel,
  ExamId,
  NumberingFormat,
  PaperPatternPreset,
  PaperSection,
  Question,
  QuestionPaper,
  QuestionType,
  SectionConfig,
  SubjectId,
  SubNumberingFormat,
} from '../types';
import { getAllQuestions, getCustomPatterns, getSettings } from './storage';

function synthesizeMissingQuestion(
  classId: ClassId,
  subjectId: SubjectId,
  examId: ExamId,
  lessonNumber: number,
  lessonName: string,
  questionType: QuestionType,
  marks: number,
  index: number
): Question {
  const id = `synth-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`;

  if (questionType === 'fill_blank') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `"${lessonName}" ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ಮುಖ್ಯ ನಿಯಮ/ಪರಿಕಲ್ಪನೆಯನ್ನು ತಿಳಿಸಿ: ________.`,
      answer: 'ಪಠ್ಯಪುಸ್ತಕದ ಆಧಾರಿತ ಉತ್ತರ',
      marks,
      difficulty: 'easy',
      isDemo: true,
    };
  }
  if (questionType === 'choose_correct' || questionType === 'mcq') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `"${lessonName}" ಪಾಠಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಸೂಕ್ತವಾದ ಉತ್ತರವನ್ನು ಆರಿಸಿ ಬರೆಯಿರಿ:`,
      options: [
        'ಎ) ಮುಖ್ಯ ಪರಿಕಲ್ಪನಾ ಅಂಶ - ೧',
        'ಬಿ) ಸೂಕ್ತ ವಿವರಣೆ / ನಿಯಮ - ೨ (ಸರಿಯಾದ ಉತ್ತರ)',
        'ಸಿ) ಪ್ರಾಯೋಗಿಕ ಅಂಶ - ೩',
        'ಡಿ) ಮೇಲಿನ ಯಾವುದೂ ಅಲ್ಲ',
      ],
      answer: 'ಬಿ) ಸೂಕ್ತ ವಿವರಣೆ / ನಿಯಮ - ೨ (ಸರಿಯಾದ ಉತ್ತರ)',
      marks,
      difficulty: 'easy',
      isDemo: true,
    };
  }
  if (questionType === 'match_following') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `‘ಎ’ ಗುಂಪಿನಲ್ಲಿರುವ "${lessonName}" ಪರಿಕಲ್ಪನೆಗಳಿಗೆ ‘ಬಿ’ ಗುಂಪಿನ ವಿವರಣೆಗಳನ್ನು ಹೊಂದಿಸಿ ಬರೆಯಿರಿ:`,
      matchPairs: [
        { left: 'ಪರಿಕಲ್ಪನೆ ೧', right: 'ಸೂಕ್ತ ವಿವರಣೆ ೧' },
        { left: 'ಪರಿಕಲ್ಪನೆ ೨', right: 'ಸೂಕ್ತ ವಿವರಣೆ ೨' },
        { left: 'ಪರಿಕಲ್ಪನೆ ೩', right: 'ಸೂಕ್ತ ವಿವರಣೆ ೩' },
        { left: 'ಪರಿಕಲ್ಪನೆ ೪', right: 'ಸೂಕ್ತ ವಿವರಣೆ ೪' },
      ],
      marks,
      difficulty: 'medium',
      isDemo: true,
    };
  }
  if (questionType === 'one_word_sentence') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `"${lessonName}" ಪಾಠದ ಆಧಾರದಲ್ಲಿ ಪ್ರಮುಖ ನಿಯಮ ಅಥವಾ ವ್ಯಾಖ್ಯೆಯನ್ನು ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ.`,
      answer: 'ಪಠ್ಯಪುಸ್ತಕದ ಅಧಿಕೃತ ವ್ಯಾಖ್ಯಾನ',
      marks,
      difficulty: 'easy',
      isDemo: true,
    };
  }
  if (questionType === 'two_three_sentences') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `"${lessonName}" ಪಾಠದಲ್ಲಿ ಬರುವ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ಎರಡು ಅಥವಾ ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಸಂಕ್ಷಿಪ್ತವಾಗಿ ವಿವರಿಸಿ.`,
      answer: 'ಪಾಠದ ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ವಿವರಣೆ.',
      marks,
      difficulty: 'medium',
      isDemo: true,
    };
  }
  if (questionType === 'diagram_based') {
    return {
      id,
      classId,
      subjectId,
      examId,
      lessonNumber,
      lessonName,
      questionType,
      questionText: `"${lessonName}" ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಸೂಕ್ತ ಚಿತ್ರವನ್ನು ಬರೆದು ಪ್ರಮುಖ ಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ.`,
      answer: 'ಸ್ಪಷ್ಟ ರೇಖಾಚಿತ್ರ ಮತ್ತು ಭಾಗಗಳ ಗುರುತಿಸುವಿಕೆ.',
      marks,
      difficulty: 'hard',
      isDemo: true,
    };
  }
  return {
    id,
    classId,
    subjectId,
    examId,
    lessonNumber,
    lessonName,
    questionType,
    questionText: `"${lessonName}" ಕುರಿತು ವಿವರಣಾತ್ಮಕ ಉತ್ತರವನ್ನು ಬರೆಯಿರಿ.`,
    answer: 'ಪಾಠದ ಸಂಪೂರ್ಣ ವಿವರಣಾತ್ಮಕ ಉತ್ತರ.',
    marks,
    difficulty: 'medium',
    isDemo: true,
  };
}

export interface GeneratePaperOptions {
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  selectedLessons: number[];
  totalMarks: number;
  patternId?: string;
  customSections?: SectionConfig[];
  lessonBalance?: 'balanced' | 'random' | 'manual';
  difficultyBalance?: { easy: number; medium: number; hard: number };
  answerSpaceType?: AnswerSpaceType;
  numberingFormat?: NumberingFormat;
  subNumberingFormat?: SubNumberingFormat;
  paperVersion?: string;
  customPaperName?: string;
}

export interface GenerationResult {
  paper: QuestionPaper;
  warning?: string;
  shortfalls?: { sectionTitle: string; needed: number; found: number }[];
}

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuestionPaper(options: GeneratePaperOptions): GenerationResult {
  const settings = getSettings();
  const allBank = getAllQuestions();
  const subject = getSubjectById(options.subjectId);
  const subjectName = subject ? subject.nameKannada : options.subjectId;

  // 1. Determine Section Pattern
  let sectionsToUse: SectionConfig[] = [];
  if (options.customSections && options.customSections.length > 0) {
    sectionsToUse = options.customSections;
  } else if (options.patternId) {
    const availablePatterns = getCustomPatterns();
    const found = availablePatterns.find((p) => p.id === options.patternId);
    if (found) sectionsToUse = found.sections;
  }

  // Fallback to default pattern for totalMarks if not found
  if (sectionsToUse.length === 0) {
    const match = DEFAULT_PATTERNS.find(
      (p) => p.totalMarks === options.totalMarks && p.classId === options.classId
    ) || DEFAULT_PATTERNS.find((p) => p.totalMarks === options.totalMarks) || DEFAULT_PATTERNS[0];
    sectionsToUse = match.sections;
  }

  // 2. Filter Pool from Question Bank
  // Matching: class, subject, and either matching exam, ANNUAL exam, or selected lesson number
  const candidatePool = allBank.filter((q) => {
    const classMatch = q.classId === options.classId;
    const subjectMatch = q.subjectId === options.subjectId;
    const examMatch =
      options.examId === 'ANNUAL' ||
      q.examId === options.examId ||
      q.examId === 'ANNUAL' ||
      (options.selectedLessons.length > 0 && options.selectedLessons.includes(q.lessonNumber));
    return classMatch && subjectMatch && examMatch;
  });

  // Filter by selected lessons
  const lessonFilteredPool = candidatePool.filter((q) =>
    options.selectedLessons.length === 0 || options.selectedLessons.includes(q.lessonNumber)
  );

  const usedQuestionIds = new Set<string>();
  const usedQuestionTexts = new Set<string>();
  const shortfalls: { sectionTitle: string; needed: number; found: number }[] = [];
  const generatedSections: PaperSection[] = [];

  // 3. For each section, select matching questions
  sectionsToUse.forEach((secConfig) => {
    const needed = secConfig.questionCount;
    const selectedForSection: Question[] = [];

    // Find candidates in lesson-filtered pool first
    let candidates = lessonFilteredPool.filter((q) => {
      if (usedQuestionIds.has(q.id) || usedQuestionTexts.has(q.questionText)) return false;
      // Match question type or compatible type
      const typeMatch = q.questionType === secConfig.questionType;
      const marksMatch = q.marks === secConfig.marksPerQuestion;
      return typeMatch && marksMatch;
    });

    // If lesson-balanced requested, distribute across lessons
    if (options.lessonBalance === 'balanced' && options.selectedLessons.length > 0) {
      // Group by lesson
      const byLesson: Record<number, Question[]> = {};
      options.selectedLessons.forEach((l) => (byLesson[l] = []));
      candidates.forEach((q) => {
        if (byLesson[q.lessonNumber]) {
          byLesson[q.lessonNumber].push(q);
        }
      });

      // Round-robin selection
      let addedInRound = true;
      while (selectedForSection.length < needed && addedInRound) {
        addedInRound = false;
        for (const lNum of options.selectedLessons) {
          if (selectedForSection.length >= needed) break;
          const list = byLesson[lNum];
          if (list && list.length > 0) {
            const picked = list.shift()!;
            selectedForSection.push(picked);
            usedQuestionIds.add(picked.id);
            usedQuestionTexts.add(picked.questionText);
            addedInRound = true;
          }
        }
      }
    } else {
      // Random or standard selection
      candidates = shuffle(candidates);
      for (const q of candidates) {
        if (selectedForSection.length >= needed) break;
        selectedForSection.push(q);
        usedQuestionIds.add(q.id);
        usedQuestionTexts.add(q.questionText);
      }
    }

    // If not enough questions found, look in broader subject pool as backup
    if (selectedForSection.length < needed) {
      const broaderCandidates = shuffle(
        candidatePool.filter((q) => {
          if (usedQuestionIds.has(q.id) || usedQuestionTexts.has(q.questionText)) return false;
          return q.questionType === secConfig.questionType && q.marks === secConfig.marksPerQuestion;
        })
      );
      for (const q of broaderCandidates) {
        if (selectedForSection.length >= needed) break;
        selectedForSection.push(q);
        usedQuestionIds.add(q.id);
        usedQuestionTexts.add(q.questionText);
      }
    }

    // If still short, synthesize contextual curriculum questions from selected lessons
    if (selectedForSection.length < needed) {
      const lessonsList = getLessons(options.classId, options.subjectId, 'ANNUAL');
      const targetLessons = options.selectedLessons.length > 0
        ? lessonsList.filter((l) => options.selectedLessons.includes(l.number))
        : lessonsList;

      let lIdx = 0;
      while (selectedForSection.length < needed) {
        const lesson = (targetLessons.length > 0 ? targetLessons[lIdx % targetLessons.length] : undefined) || {
          number: 1,
          name: subjectName,
        };
        const synthQ = synthesizeMissingQuestion(
          options.classId,
          options.subjectId,
          options.examId,
          lesson.number,
          lesson.name,
          secConfig.questionType,
          secConfig.marksPerQuestion,
          selectedForSection.length + 1
        );
        selectedForSection.push(synthQ);
        usedQuestionIds.add(synthQ.id);
        lIdx++;
      }
    }

    generatedSections.push({
      config: { ...secConfig },
      questions: selectedForSection,
    });
  });

  // Calculate actual total marks
  let actualTotalMarks = 0;
  generatedSections.forEach((s) => {
    s.questions.forEach((q) => {
      actualTotalMarks += q.marks;
    });
  });

  const examDisplay = options.examId === 'SA-1' ? 'ಪ್ರಥಮ ಸಂಕಲನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ (SA-1)' : 'ದ್ವಿತೀಯ ಸಂಕಲನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ (SA-2)';
  const classDisplay = options.classId === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ';

  const defaultPaperName = `${classDisplay} - ${subjectName} - ${options.examId} (${options.totalMarks} ಅಂಕಗಳು)`;

  const paper: QuestionPaper = {
    id: 'qp-' + Date.now(),
    paperName: options.customPaperName || defaultPaperName,
    classId: options.classId,
    subjectId: options.subjectId,
    examId: options.examId,
    academicYear: '2026-27',
    date: new Date().toISOString().split('T')[0],
    time: options.totalMarks >= 40 ? '೨ ಗಂಟೆಗಳು' : '೧ ಗಂಟೆ ೩೦ ನಿಮಿಷ',
    totalMarks: options.totalMarks,
    headerInfo: {
      deptName: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ',
      schoolName: settings.schoolName || 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ',
      examTitle: `${examDisplay} - ಶೈಕ್ಷಣಿಕ ವರ್ಷ 2026-27`,
      subTitle: 'ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ (ಕನ್ನಡ ಮಾಧ್ಯಮ)',
      paperCode: `${options.classId}-${options.subjectId.toUpperCase().slice(0, 3)}-${options.examId}`,
      academicYear: '2026-27',
      date: new Date().toLocaleDateString('kn-IN'),
      time: options.totalMarks >= 40 ? '೨:೦೦ ಗಂಟೆ' : '೧:೩೦ ಗಂಟೆ',
      showStudentTable: true,
      generalInstructions: [
        'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.',
        'ಪ್ರಶ್ನೆಗಳ ಬಲಬದಿಯಲ್ಲಿ ನೀಡಲಾದ ಸಂಖ್ಯೆಗಳು ನಿಗದಿತ ಅಂಕಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ.',
        'ಉತ್ತರಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಓದಲು ಸಾಧ್ಯವಾಗುವಂತೆ ಬರೆಯಿರಿ.',
      ],
    },
    sections: generatedSections,
    answerSpaceType: options.answerSpaceType || settings.defaultAnswerSpace || 'auto',
    numberingFormat: options.numberingFormat || settings.defaultNumberingFormat || 'kannada',
    subNumberingFormat: options.subNumberingFormat || 'kannada_letters',
    showTeacherTags: false,
    showAnswerKeyInSeparatePage: false,
    selectedLessons: options.selectedLessons,
    paperVersion: options.paperVersion || 'A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let warning: string | undefined;
  if (shortfalls.length > 0) {
    warning = `ಆಯ್ಕೆ ಮಾಡಿದ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ನಲ್ಲಿ ಕೆಲವು ವಿಭಾಗಗಳಿಗೆ ಸಾಕಷ್ಟು ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿಲ್ಲ. ಲಭ್ಯವಿದ್ದ ಪ್ರಶ್ನೆಗಳಿಂದ ಪತ್ರಿಕೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ನೀವು ಹೊಸ ಪ್ರಶ್ನೆಗಳನ್ನು ಸೇರಿಸಬಹುದು.`;
  }

  return {
    paper,
    warning,
    shortfalls: shortfalls.length > 0 ? shortfalls : undefined,
  };
}

// Find replacement questions for a given question
export function getReplacementCandidates(
  currentQuestion: Question,
  paper: QuestionPaper
): Question[] {
  const allBank = getAllQuestions();
  const existingIds = new Set<string>();
  paper.sections.forEach((s) => s.questions.forEach((q) => existingIds.add(q.id)));

  // Tier 1: Perfect match (class, subject, exam, type, marks)
  const tier1 = allBank.filter((q) => {
    if (q.id === currentQuestion.id || existingIds.has(q.id)) return false;
    return (
      q.classId === currentQuestion.classId &&
      q.subjectId === currentQuestion.subjectId &&
      q.questionType === currentQuestion.questionType &&
      q.marks === currentQuestion.marks
    );
  });

  if (tier1.length >= 4) return tier1;

  // Tier 2: Same class, subject and marks (compatible types or any exam)
  const tier2 = allBank.filter((q) => {
    if (q.id === currentQuestion.id || existingIds.has(q.id)) return false;
    if (tier1.some((t) => t.id === q.id)) return false;
    return (
      q.classId === currentQuestion.classId &&
      q.subjectId === currentQuestion.subjectId &&
      q.marks === currentQuestion.marks
    );
  });

  const combined = [...tier1, ...tier2];
  if (combined.length >= 2) return combined;

  // Tier 3: Same class and subject
  const tier3 = allBank.filter((q) => {
    if (q.id === currentQuestion.id || existingIds.has(q.id)) return false;
    if (combined.some((t) => t.id === q.id)) return false;
    return q.classId === currentQuestion.classId && q.subjectId === currentQuestion.subjectId;
  });

  return [...combined, ...tier3];
}

// Validate paper marks and constraints
export function validateQuestionPaper(paper: QuestionPaper): {
  isValid: boolean;
  errors: string[];
  totalQuestionMarks: number;
} {
  const errors: string[] = [];
  let totalQuestionMarks = 0;
  let totalQuestionsCount = 0;

  paper.sections.forEach((sec, sIdx) => {
    if (sec.questions.length === 0) {
      errors.push(`ವಿಭಾಗ ${sec.config.romanNumeral} ನಲ್ಲಿ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ.`);
    }
    sec.questions.forEach((q, qIdx) => {
      totalQuestionsCount++;
      totalQuestionMarks += q.marks || 0;
      if (!q.questionText || q.questionText.trim() === '') {
        errors.push(`ವಿಭಾಗ ${sec.config.romanNumeral} ರ ಪ್ರಶ್ನೆ ಸಂಖ್ಯೆ ${qIdx + 1} ಖಾಲಿಯಾಗಿದೆ.`);
      }
    });
  });

  if (totalQuestionsCount === 0) {
    errors.push('ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯಲ್ಲಿ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಸೇರಿಲ್ಲ.');
  }

  if (totalQuestionMarks !== paper.totalMarks) {
    errors.push(
      `ಅಂಕಗಳ ವ್ಯತ್ಯಾಸವಿದೆ: ಪತ್ರಿಕೆಯ ನಿಗದಿತ ಅಂಕ = ${paper.totalMarks}, ಆದರೆ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳ ಒಟ್ಟು ಅಂಕ = ${totalQuestionMarks}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    totalQuestionMarks,
  };
}
