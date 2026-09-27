import { QuestionType, SectionConfig } from '../types';

export interface BalancedPatternResult {
  sections: SectionConfig[];
  totalQuestions: number;
  totalMarks: number;
  isExact: boolean;
}

/**
 * Standard Karnataka State Board section blueprints
 */
export const DEFAULT_SECTION_TEMPLATES: {
  type: QuestionType;
  romanNumeral: string;
  title: string;
  marksPerQuestion: number;
  minQ: number;
  maxQ: number;
}[] = [
  {
    type: 'fill_blank',
    romanNumeral: 'I',
    title: 'ಕೆಳಗಿನ ಖಾಲಿ ಜಾಗಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ಭರ್ತಿ ಮಾಡಿ:',
    marksPerQuestion: 1,
    minQ: 1,
    maxQ: 8,
  },
  {
    type: 'choose_correct',
    romanNumeral: 'II',
    title: 'ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆರಿಸಿ ಬರೆಯಿರಿ:',
    marksPerQuestion: 1,
    minQ: 1,
    maxQ: 8,
  },
  {
    type: 'match_following',
    romanNumeral: 'III',
    title: '‘ಎ’ ಗುಂಪಿಗೆ ‘ಬಿ’ ಗುಂಪನ್ನು ಹೊಂದಿಸಿ ಬರೆಯಿರಿ:',
    marksPerQuestion: 4,
    minQ: 0,
    maxQ: 2,
  },
  {
    type: 'one_word_sentence',
    romanNumeral: 'IV',
    title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ:',
    marksPerQuestion: 1,
    minQ: 1,
    maxQ: 8,
  },
  {
    type: 'two_three_sentences',
    romanNumeral: 'V',
    title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಎರಡು ಅಥವಾ ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ:',
    marksPerQuestion: 2,
    minQ: 1,
    maxQ: 10,
  },
  {
    type: 'short_answer',
    romanNumeral: 'VI',
    title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಉತ್ತರಿಸಿ / ವ್ಯತ್ಯಾಸ ತಿಳಿಸಿ:',
    marksPerQuestion: 2,
    minQ: 1,
    maxQ: 8,
  },
  {
    type: 'descriptive_answer',
    romanNumeral: 'VII',
    title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ:',
    marksPerQuestion: 3,
    minQ: 0,
    maxQ: 6,
  },
  {
    type: 'diagram_based',
    romanNumeral: 'VIII',
    title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗೆ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ / ಚಿತ್ರ ಬರೆದು ಭಾಗಗಳನ್ನು ಗುರುತಿಸಿ:',
    marksPerQuestion: 4,
    minQ: 0,
    maxQ: 3,
  },
];

/**
 * Calculates optimal question distribution for an exact typed question count and fixed marks (e.g. 30, 40, 50).
 * Guarantees that:
 * 1. Sum of questions === targetQuestions
 * 2. Sum of marks === fixedMarks
 */
export function balanceSectionsForTarget(
  targetQuestions: number,
  fixedMarks: number,
  existingSections?: SectionConfig[]
): BalancedPatternResult {
  const safeMarks = Math.max(10, fixedMarks);
  // Practical bounds for target questions
  const minPossibleQuestions = Math.max(5, Math.ceil(safeMarks / 4));
  const maxPossibleQuestions = safeMarks;
  const clampedQuestions = Math.min(Math.max(minPossibleQuestions, targetQuestions), maxPossibleQuestions);

  // If existing sections are provided, try to preserve their titles and structure
  const baseTemplates = (existingSections && existingSections.length > 0)
    ? existingSections.map((s) => ({
        id: s.id,
        type: s.questionType,
        romanNumeral: s.romanNumeral,
        title: s.title,
        marksPerQuestion: s.marksPerQuestion,
      }))
    : DEFAULT_SECTION_TEMPLATES.map((t, idx) => ({
        id: `sec-${idx + 1}`,
        type: t.type,
        romanNumeral: t.romanNumeral,
        title: t.title,
        marksPerQuestion: t.marksPerQuestion,
      }));

  interface Candidate {
    counts: number[];
    score: number;
  }

  let bestCandidate: Candidate | null = null;

  // We search for a combination of question counts that satisfies:
  // sum(counts) === clampedQuestions
  // sum(counts[i] * marks[i]) === safeMarks

  // Standard section indices mapping:
  // Objective 1-mark sections (fill, choose, one_word)
  // 2-mark sections (two_three, short_answer)
  // 3-mark sections (descriptive)
  // 4-mark sections (match, diagram)

  const oneMarkIndices: number[] = [];
  const twoMarkIndices: number[] = [];
  const threeMarkIndices: number[] = [];
  const fourMarkIndices: number[] = [];

  baseTemplates.forEach((t, i) => {
    if (t.marksPerQuestion === 1) oneMarkIndices.push(i);
    else if (t.marksPerQuestion === 2) twoMarkIndices.push(i);
    else if (t.marksPerQuestion === 3) threeMarkIndices.push(i);
    else if (t.marksPerQuestion >= 4) fourMarkIndices.push(i);
  });

  // Search over possible total 4-mark and 3-mark questions
  const max4MarkQ = Math.min(4, Math.floor(safeMarks / 4));
  const max3MarkQ = Math.min(6, Math.floor(safeMarks / 3));

  for (let q4 = 0; q4 <= max4MarkQ; q4++) {
    for (let q3 = 0; q3 <= max3MarkQ; q3++) {
      const highMarks = q4 * 4 + q3 * 3;
      const highQ = q4 + q3;

      if (highMarks > safeMarks || highQ > clampedQuestions) continue;

      const remQ = clampedQuestions - highQ;
      const remMarks = safeMarks - highMarks;

      // Now remMarks must be made of 1-mark and 2-mark questions:
      // q2 + q1 = remQ
      // 2*q2 + q1 = remMarks
      // => q2 = remMarks - remQ
      // => q1 = 2*remQ - remMarks
      const q2 = remMarks - remQ;
      const q1 = 2 * remQ - remMarks;

      if (q2 >= 0 && q1 >= 0) {
        // Valid exact solution found!
        // Calculate quality score:
        // Prefer having at least 1 match (4 marks) if questions >= 10
        // Prefer having balanced 1-mark and 2-mark questions
        let score = 100;

        if (clampedQuestions >= 12 && q4 >= 1) score += 30;
        if (q1 >= 2 && q1 <= Math.ceil(clampedQuestions * 0.5)) score += 25;
        if (q2 >= 2 && q2 <= Math.ceil(clampedQuestions * 0.5)) score += 25;
        if (clampedQuestions >= 15 && q3 >= 1) score += 20;

        // Penalty for extremes
        if (q1 === 0 && clampedQuestions > 8) score -= 30;
        if (q2 === 0 && clampedQuestions > 8) score -= 30;

        if (!bestCandidate || score > bestCandidate.score) {
          // Distribute q1 across oneMarkIndices
          const counts = new Array(baseTemplates.length).fill(0);

          // Distribute 4-mark questions
          if (fourMarkIndices.length > 0) {
            let rem4 = q4;
            fourMarkIndices.forEach((idx, i) => {
              if (i === fourMarkIndices.length - 1) {
                counts[idx] = rem4;
              } else {
                const take = Math.min(rem4, Math.floor(q4 / fourMarkIndices.length));
                counts[idx] = take;
                rem4 -= take;
              }
            });
          }

          // Distribute 3-mark questions
          if (threeMarkIndices.length > 0) {
            let rem3 = q3;
            threeMarkIndices.forEach((idx, i) => {
              if (i === threeMarkIndices.length - 1) {
                counts[idx] = rem3;
              } else {
                const take = Math.min(rem3, Math.floor(q3 / threeMarkIndices.length));
                counts[idx] = take;
                rem3 -= take;
              }
            });
          }

          // Distribute 2-mark questions
          if (twoMarkIndices.length > 0) {
            let rem2 = q2;
            twoMarkIndices.forEach((idx, i) => {
              if (i === twoMarkIndices.length - 1) {
                counts[idx] = rem2;
              } else {
                const take = Math.min(rem2, Math.floor(q2 / twoMarkIndices.length));
                counts[idx] = take;
                rem2 -= take;
              }
            });
          }

          // Distribute 1-mark questions
          if (oneMarkIndices.length > 0) {
            let rem1 = q1;
            oneMarkIndices.forEach((idx, i) => {
              if (i === oneMarkIndices.length - 1) {
                counts[idx] = rem1;
              } else {
                const take = Math.min(rem1, Math.floor(q1 / oneMarkIndices.length));
                counts[idx] = take;
                rem1 -= take;
              }
            });
          }

          bestCandidate = { counts, score };
        }
      }
    }
  }

  // If no candidate was found (e.g. extreme mismatch), construct a fallback
  if (!bestCandidate) {
    const counts = new Array(baseTemplates.length).fill(0);
    let currentMarks = 0;
    let currentQ = 0;

    for (let i = 0; i < baseTemplates.length && currentMarks < safeMarks; i++) {
      const m = baseTemplates[i].marksPerQuestion;
      const count = Math.min(Math.floor((safeMarks - currentMarks) / m), 4);
      counts[i] = count;
      currentMarks += count * m;
      currentQ += count;
    }

    bestCandidate = { counts, score: 0 };
  }

  const generatedSections: SectionConfig[] = baseTemplates.map((t, i) => {
    const qCount = bestCandidate!.counts[i] || 0;
    return {
      id: t.id,
      romanNumeral: t.romanNumeral,
      title: t.title,
      questionType: t.type,
      marksPerQuestion: t.marksPerQuestion,
      questionCount: qCount,
      totalMarks: qCount * t.marksPerQuestion,
    };
  });

  const finalTotalQuestions = generatedSections.reduce((s, sec) => s + sec.questionCount, 0);
  const finalTotalMarks = generatedSections.reduce((s, sec) => s + sec.totalMarks, 0);

  return {
    sections: generatedSections,
    totalQuestions: finalTotalQuestions,
    totalMarks: finalTotalMarks,
    isExact: finalTotalMarks === safeMarks,
  };
}

/**
 * Given user modified section counts, adjusts the remaining sections
 * so that total marks remains STRICTLY EQUAL to the locked fixedMarks!
 */
export function lockAndAutoAdjustMarks(
  fixedMarks: number,
  targetSecId: string,
  newCount: number,
  currentSections: SectionConfig[]
): SectionConfig[] {
  const updated = currentSections.map((s) => (s.id === targetSecId ? { ...s, questionCount: Math.max(0, newCount), totalMarks: Math.max(0, newCount) * s.marksPerQuestion } : { ...s }));

  const currentSumMarks = updated.reduce((s, sec) => s + sec.totalMarks, 0);
  const diff = fixedMarks - currentSumMarks; // positive means we need more marks, negative means we need fewer

  if (diff === 0) {
    return updated;
  }

  // Adjust other sections without touching the target section
  const mutableSections = updated.filter((s) => s.id !== targetSecId);

  if (diff > 0) {
    // We need more marks: increase 1-mark or 2-mark questions
    let remainingToAdd = diff;
    for (const sec of mutableSections) {
      if (remainingToAdd <= 0) break;
      if (sec.marksPerQuestion <= remainingToAdd) {
        const canAddQ = Math.floor(remainingToAdd / sec.marksPerQuestion);
        if (canAddQ > 0) {
          const add = Math.min(canAddQ, 3);
          sec.questionCount += add;
          sec.totalMarks = sec.questionCount * sec.marksPerQuestion;
          remainingToAdd -= add * sec.marksPerQuestion;
        }
      }
    }
  } else {
    // We need fewer marks: reduce from other sections that have questionCount > 0
    let remainingToCut = Math.abs(diff);
    // Sort so we reduce non-vital questions first
    const sorted = [...mutableSections].sort((a, b) => b.marksPerQuestion - a.marksPerQuestion);
    for (const sec of sorted) {
      if (remainingToCut <= 0) break;
      if (sec.questionCount > 0) {
        const canCut = Math.min(sec.questionCount, Math.ceil(remainingToCut / sec.marksPerQuestion));
        sec.questionCount -= canCut;
        sec.totalMarks = sec.questionCount * sec.marksPerQuestion;
        remainingToCut -= canCut * sec.marksPerQuestion;
      }
    }
  }

  return updated;
}
