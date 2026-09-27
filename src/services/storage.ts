import { DEFAULT_PATTERNS } from '../data/defaultPatterns';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';
import {
  PaperPatternPreset,
  Question,
  QuestionPaper,
  TeacherSettings,
  TextbookContent,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'sr_angadi_qp_settings',
  QUESTIONS: 'sr_angadi_qp_questions',
  SAVED_PAPERS: 'sr_angadi_qp_saved_papers',
  PATTERNS: 'sr_angadi_qp_patterns',
  TEXTBOOKS: 'sr_angadi_qp_textbooks',
  CUSTOM_LESSONS: 'sr_angadi_qp_custom_lessons',
};

export const DEFAULT_SETTINGS: TeacherSettings = {
  schoolName: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ',
  teacherName: 'S R Angadi',
  schoolAddress: 'ಕರ್ನಾಟಕ ಶಾಲೆ ಶಿಕ್ಷಣ ಇಲಾಖೆ',
  phone: '',
  email: '',
  defaultClass: '6th',
  defaultSubject: 'science',
  defaultExam: 'SA-1',
  defaultMarks: 40,
  defaultAnswerSpace: 'auto',
  defaultNumberingFormat: 'kannada',
  showFooter: true,
  showPageNumber: true,
  paperMargin: 'normal',
};

export function getSettings(): TeacherSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading settings from localStorage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TeacherSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

// ----------------- QUESTIONS -----------------
export function getCustomQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading questions from localStorage', e);
    return [];
  }
}

export function getAllQuestions(): Question[] {
  const custom = getCustomQuestions();
  // Merge sample questions and custom questions without duplicates
  const map = new Map<string, Question>();
  SAMPLE_QUESTIONS.forEach((q) => map.set(q.id, q));
  custom.forEach((q) => map.set(q.id, q));
  return Array.from(map.values());
}

export function saveQuestion(question: Question): Question {
  const custom = getCustomQuestions();
  const existingIdx = custom.findIndex((q) => q.id === question.id);
  if (existingIdx >= 0) {
    custom[existingIdx] = question;
  } else {
    custom.unshift(question);
  }
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(custom));
  return question;
}

export function saveBulkQuestions(newQuestions: Question[]): number {
  if (!newQuestions || newQuestions.length === 0) return 0;
  const custom = getCustomQuestions();
  const map = new Map<string, Question>();
  custom.forEach((q) => map.set(q.id, q));
  newQuestions.forEach((q) => {
    map.set(q.id, q);
  });
  const updated = Array.from(map.values());
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
  return newQuestions.length;
}

export function clearCustomQuestions(): void {
  localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
}

export function deleteQuestion(id: string): void {
  const custom = getCustomQuestions().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(custom));
}

// ----------------- SAVED PAPERS -----------------
export function getSavedPapers(): QuestionPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PAPERS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading saved papers from localStorage', e);
    return [];
  }
}

export function savePaper(paper: QuestionPaper): void {
  try {
    const papers = getSavedPapers();
    const idx = papers.findIndex((p) => p.id === paper.id);
    if (idx >= 0) {
      papers[idx] = { ...paper, updatedAt: new Date().toISOString() };
    } else {
      papers.unshift({ ...paper, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_PAPERS, JSON.stringify(papers));
  } catch (e) {
    console.error('Error saving paper to localStorage', e);
  }
}

export function deletePaper(id: string): void {
  const papers = getSavedPapers().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_PAPERS, JSON.stringify(papers));
}

export function duplicatePaper(id: string): QuestionPaper | null {
  const papers = getSavedPapers();
  const source = papers.find((p) => p.id === id);
  if (!source) return null;

  const copy: QuestionPaper = {
    ...source,
    id: 'paper-' + Date.now(),
    paperName: `${source.paperName} (ನಕಲು)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  papers.unshift(copy);
  localStorage.setItem(STORAGE_KEYS.SAVED_PAPERS, JSON.stringify(papers));
  return copy;
}

// ----------------- TEXTBOOKS -----------------
export function getTextbookContents(): TextbookContent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEXTBOOKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading textbooks from localStorage', e);
    return [];
  }
}

export function saveTextbookContent(entry: TextbookContent): void {
  const items = getTextbookContents();
  const idx = items.findIndex((t) => t.id === entry.id);
  if (idx >= 0) {
    items[idx] = entry;
  } else {
    items.unshift(entry);
  }
  localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(items));
}

export function deleteTextbookContent(id: string): void {
  const items = getTextbookContents().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(items));
}

// ----------------- PATTERNS -----------------
export function getCustomPatterns(): PaperPatternPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATTERNS);
    if (!raw) return DEFAULT_PATTERNS;
    return [...DEFAULT_PATTERNS, ...JSON.parse(raw)];
  } catch (e) {
    console.error('Error reading patterns from localStorage', e);
    return DEFAULT_PATTERNS;
  }
}

export function saveCustomPattern(pattern: PaperPatternPreset): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATTERNS);
    const list: PaperPatternPreset[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((p) => p.id === pattern.id);
    if (idx >= 0) {
      list[idx] = pattern;
    } else {
      list.push(pattern);
    }
    localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving custom pattern', e);
  }
}

export function deleteCustomPattern(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATTERNS);
    if (!raw) return;
    const list: PaperPatternPreset[] = JSON.parse(raw);
    const updated = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting custom pattern', e);
  }
}

// ----------------- CUSTOM LESSONS -----------------
// Auto-purge any stale cached lessons from older sessions to ensure 2026-27 revised syllabus is always fresh
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_LESSONS);
  }
} catch {
  // ignore
}

export function getCustomLessonsStorage(): Record<string, any[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading custom lessons', e);
    return {};
  }
}

export function saveCustomLessonsStorage(classId: string, subjectId: string, lessons: any[]): void {
  try {
    const all = getCustomLessonsStorage();
    const key = `${classId}_${subjectId}`;
    all[key] = lessons;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving custom lessons', e);
  }
}

export function resetCustomLessonsStorage(classId?: string, subjectId?: string): void {
  try {
    if (!classId && !subjectId) {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_LESSONS);
      return;
    }
    const all = getCustomLessonsStorage();
    const key = `${classId}_${subjectId}`;
    delete all[key];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(all));
  } catch (e) {
    console.error('Error resetting custom lessons', e);
  }
}

// ----------------- BACKUP & RESTORE -----------------
export function exportAllDataJSON(): string {
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    author: 'S R Angadi',
    settings: getSettings(),
    customQuestions: getCustomQuestions(),
    savedPapers: getSavedPapers(),
    textbooks: getTextbookContents(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllDataJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    if (data.customQuestions) localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data.customQuestions));
    if (data.savedPapers) localStorage.setItem(STORAGE_KEYS.SAVED_PAPERS, JSON.stringify(data.savedPapers));
    if (data.textbooks) localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(data.textbooks));
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON', e);
    return false;
  }
}

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
