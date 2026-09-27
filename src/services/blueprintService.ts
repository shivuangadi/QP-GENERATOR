import { PaperState, BlueprintRow } from '../data/kannadaPaperData';
import {
  ALL_SUBJECTS,
  ExamType,
  getLessonsForExam,
  SUBJECT_LESSONS_MAP,
} from '../data/allSubjectsData';

export interface CalculatedBlueprint {
  subjectKannada: string;
  subjectEnglish: string;
  classKannada: string;
  classEnglish: string;
  examType: ExamType;
  totalMarks: number;
  rows: BlueprintRow[];
  totalKnowledge: number;
  totalUnderstanding: number;
  totalApplication: number;
  totalSkill: number;
  grandTotal: number;
  count1M: number;
  count2M: number;
  count4M: number;
}

export function detectSubjectId(paper: PaperState, passedSubject?: string): string {
  if (passedSubject && SUBJECT_LESSONS_MAP[passedSubject]) {
    return passedSubject;
  }
  const subText = (paper.header.subject || '').toLowerCase();
  if (subText.includes('ಗಣಿತ') || subText.includes('math')) return 'mathematics';
  if (subText.includes('ವಿಜ್ಞಾನ') || subText.includes('science') || subText.includes('ಕುತೂಹಲ')) return 'science';
  if (subText.includes('ಸಮಾಜ') || subText.includes('social')) return 'social';
  if (subText.includes('ಇಂಗ್ಲಿಷ್') || subText.includes('english')) return 'english';
  if (subText.includes('ಹಿಂದಿ') || subText.includes('hindi')) return 'hindi';
  if (subText.includes('ಮೌಲ್ಯ') || subText.includes('value')) return 'value_education';
  return 'kannada';
}

export function detectClassId(paper: PaperState, passedClass?: '6th' | '7th' | '8th'): '6th' | '7th' | '8th' {
  if (passedClass === '6th' || passedClass === '7th' || passedClass === '8th') {
    return passedClass;
  }
  const classText = (paper.header.classSection || '').toLowerCase();
  if (classText.includes('7') || classText.includes('೭')) return '7th';
  if (classText.includes('8') || classText.includes('೮')) return '8th';
  return '6th';
}

export function detectExamType(paper: PaperState, passedExam?: ExamType): ExamType {
  if (passedExam === 'FA' || passedExam === 'SA1' || passedExam === 'SA2') {
    return passedExam;
  }
  const examText = (paper.header.examTitle || '').toUpperCase();
  if (examText.includes('SA2') || examText.includes('ದ್ವಿತೀಯ')) return 'SA2';
  if (examText.includes('FA') || examText.includes('ರೂಪಣಾತ್ಮಕ')) return 'FA';
  return 'SA1';
}

export function calculateBlueprintForPaper(
  paper: PaperState,
  classId?: '6th' | '7th' | '8th',
  subjectId?: string,
  examType?: ExamType,
  selectedChapters?: string[]
): CalculatedBlueprint {
  const effSubjectId = detectSubjectId(paper, subjectId);
  const effClassId = detectClassId(paper, classId);
  const effExamType = detectExamType(paper, examType);
  const targetTotal = paper.header.totalMarks || 40;

  // Find official subject info
  const subjectObj = ALL_SUBJECTS.find((s) => s.id === effSubjectId) || ALL_SUBJECTS[0];
  const classKannada = effClassId === '6th' ? '6ನೇ ತರಗತಿ' : effClassId === '7th' ? '7ನೇ ತರಗತಿ' : '8ನೇ ತರಗತಿ';
  const classEnglish = `Class ${effClassId.replace('th', '')}`;

  // 1. Collect chapter names for this subject & class
  let chapterNames: string[] = [];

  if (selectedChapters && selectedChapters.length > 0) {
    chapterNames = [...selectedChapters];
  } else if (paper.selectedLessons && paper.selectedLessons.length > 0) {
    chapterNames = [...paper.selectedLessons];
  } else {
    // Official lessons from syllabus for this exam & class
    const officialLessons = getLessonsForExam(effSubjectId, effClassId, effExamType);
    if (officialLessons.length > 0) {
      chapterNames = officialLessons.map((l) => l.name);
    } else {
      const allSubjectLessons = SUBJECT_LESSONS_MAP[effSubjectId]?.[effClassId] || [];
      chapterNames = allSubjectLessons.map((l) => l.name);
    }
  }

  // If still empty, collect unique lessonNames from questions in paper
  if (chapterNames.length === 0) {
    const questionLessons = new Set<string>();
    paper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.lessonName && !q.lessonName.includes('ಪತ್ರ ಲೇಖನ') && !q.lessonName.includes('Letter')) {
          questionLessons.add(q.lessonName);
        }
      });
    });
    chapterNames = Array.from(questionLessons);
  }

  // Absolute fallback if somehow no chapters exist
  if (chapterNames.length === 0) {
    chapterNames = ['ಅಧ್ಯಾಯ 1', 'ಅಧ್ಯಾಯ 2', 'ಅಧ್ಯಾಯ 3', 'ಅಧ್ಯಾಯ 4'];
  }

  // 2. Count question types in paper
  let count1M = 0;
  let count2M = 0;
  let count4M = 0;
  paper.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      if (q.marks === 1) count1M++;
      else if (q.marks === 2) count2M++;
      else if (q.marks >= 4) count4M++;
    });
  });

  // 3. Check if paper questions map directly to these chapters
  const actualChapterMarks: Record<string, { k: number; u: number; a: number; s: number; total: number }> = {};
  chapterNames.forEach((ch) => {
    actualChapterMarks[ch] = { k: 0, u: 0, a: 0, s: 0, total: 0 };
  });

  let hasMappedQuestions = false;
  paper.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      const chName = chapterNames.find((name) => q.lessonName && (q.lessonName.includes(name) || name.includes(q.lessonName)));
      if (chName) {
        hasMappedQuestions = true;
        const entry = actualChapterMarks[chName];
        entry.total += q.marks;
        if (q.marks === 1) {
          if (entry.k <= entry.u) entry.k += 1;
          else entry.u += 1;
        } else if (q.marks === 2) {
          if (entry.u <= entry.a) entry.u += 2;
          else entry.a += 2;
        } else {
          if (entry.a <= entry.s) entry.a += 2;
          entry.s += q.marks - 2;
        }
      }
    });
  });

  // 4. Distribute target marks across chapters if not fully mapped
  const rows: BlueprintRow[] = [];
  const numChapters = chapterNames.length;
  const baseMarksPerChapter = Math.floor(targetTotal / numChapters);
  const remainder = targetTotal % numChapters;

  let runningKnowledge = 0;
  let runningUnderstanding = 0;
  let runningApplication = 0;
  let runningSkill = 0;
  let runningTotal = 0;

  chapterNames.forEach((ch, idx) => {
    let rowTotal = hasMappedQuestions && actualChapterMarks[ch].total > 0
      ? actualChapterMarks[ch].total
      : baseMarksPerChapter + (idx < remainder ? 1 : 0);

    // If it's the last row, balance exact grand total
    if (idx === numChapters - 1) {
      rowTotal = Math.max(1, targetTotal - runningTotal);
    }
    runningTotal += rowTotal;

    // Distribute rowTotal across Knowledge (25%), Understanding (35%), Application (25%), Skill (15%)
    let k = Math.max(0, Math.round(rowTotal * 0.25));
    let u = Math.max(0, Math.round(rowTotal * 0.35));
    let a = Math.max(0, Math.round(rowTotal * 0.25));
    let s = Math.max(0, rowTotal - (k + u + a));

    // Ensure sum matches rowTotal
    if (k + u + a + s !== rowTotal) {
      const diff = rowTotal - (k + u + a + s);
      u = Math.max(0, u + diff);
    }

    runningKnowledge += k;
    runningUnderstanding += u;
    runningApplication += a;
    runningSkill += s;

    rows.push({
      chapter: ch,
      knowledge: k,
      understanding: u,
      application: a,
      skill: s,
      total: rowTotal,
    });
  });

  return {
    subjectKannada: subjectObj.nameKannada,
    subjectEnglish: subjectObj.nameEnglish,
    classKannada,
    classEnglish,
    examType: effExamType,
    totalMarks: targetTotal,
    rows,
    totalKnowledge: runningKnowledge,
    totalUnderstanding: runningUnderstanding,
    totalApplication: runningApplication,
    totalSkill: runningSkill,
    grandTotal: runningTotal,
    count1M,
    count2M,
    count4M,
  };
}
