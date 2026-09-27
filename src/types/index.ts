export type ClassId = '6th' | '7th' | '8th';
export type ExamId = 'SA-1' | 'SA-2' | 'ANNUAL';
export type MediumId = 'kannada';

export type SubjectId =
  | 'kannada'
  | 'english'
  | 'hindi'
  | 'mathematics'
  | 'science'
  | 'social'
  | 'value_education';

export type QuestionType =
  | 'fill_blank'
  | 'choose_correct'
  | 'match_following'
  | 'one_word_sentence'
  | 'two_three_sentences'
  | 'short_answer'
  | 'descriptive_answer'
  | 'state_difference'
  | 'give_reason'
  | 'true_false'
  | 'mcq'
  | 'diagram_based'
  | 'activity_based';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type AnswerSpaceType = 'none' | 'ruled' | 'by_marks' | 'auto';

export type NumberingFormat = 'arabic' | 'kannada'; // 1, 2, 3 or ೧, ೨, ೩
export type SubNumberingFormat = 'kannada_letters' | 'english_letters'; // ಅ, ಆ, ಇ or a, b, c

export interface MatchPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  lessonNumber: number;
  lessonName: string;
  topic?: string;
  questionType: QuestionType;
  questionText: string;
  options?: string[]; // for MCQ or choose correct
  matchPairs?: MatchPair[]; // for match the following
  answer?: string;
  explanation?: string;
  marks: number;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  imageCaption?: string;
  imagePosition?: 'right' | 'below' | 'center';
  imageWidth?: number; // percentage (e.g. 40, 60, 100)
  answerSpaceLines?: number;
  isDemo?: boolean;
  isAIGenerated?: boolean;
  approved?: boolean;
  createdAt?: string;
}

export interface SectionConfig {
  id: string;
  romanNumeral: string; // e.g. I, II, III, IV...
  title: string; // e.g. ಕೆಳಗಿನ ಖಾಲಿ ಜಾಗಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ
  questionType: QuestionType;
  marksPerQuestion: number;
  questionCount: number;
  totalMarks: number;
  instructions?: string;
}

export interface PaperSection {
  config: SectionConfig;
  questions: Question[];
}

export interface PaperHeaderInfo {
  deptName: string;
  schoolName: string;
  examTitle: string;
  subTitle: string;
  paperCode: string;
  academicYear: string;
  date: string;
  time: string;
  showStudentTable: boolean;
  generalInstructions: string[];
}

export interface QuestionPaper {
  id: string;
  paperName: string;
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  academicYear: string;
  date: string;
  time: string;
  totalMarks: number;
  headerInfo: PaperHeaderInfo;
  sections: PaperSection[];
  answerSpaceType: AnswerSpaceType;
  numberingFormat: NumberingFormat;
  subNumberingFormat: SubNumberingFormat;
  showTeacherTags: boolean;
  showAnswerKeyInSeparatePage: boolean;
  selectedLessons: number[];
  paperVersion?: string; // 'A' | 'B' | 'C' | 'D'
  createdAt: string;
  updatedAt: string;
}

export interface LessonInfo {
  number: number;
  name: string;
  exam: ExamId;
  subjectId: SubjectId;
  classId: ClassId;
  hasTextbookContent?: boolean;
}

export type ClassBookUrl = string | {
  part1?: string;
  part2?: string;
  full?: string;
};

export interface SubjectInfo {
  id: SubjectId;
  nameKannada: string;
  nameEnglish: string;
  icon?: string;
  officialPdfUrls?: {
    [key in ClassId]?: ClassBookUrl;
  };
  lessons: {
    [key in ClassId]?: LessonInfo[];
  };
}

export interface TextbookContent {
  id: string;
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  lessonNumber: number;
  lessonName: string;
  bookTitle: string;
  content: string;
  sourceUrl?: string;
  importedAt: string;
}

export interface PaperPatternPreset {
  id: string;
  name: string;
  classId: ClassId;
  subjectId: SubjectId;
  examId: ExamId;
  totalMarks: number;
  sections: SectionConfig[];
  isCustom?: boolean;
}

export interface TeacherSettings {
  schoolName: string;
  teacherName: string;
  schoolAddress: string;
  phone: string;
  email: string;
  logoUrl?: string;
  defaultClass: ClassId;
  defaultSubject: SubjectId;
  defaultExam: ExamId;
  defaultMarks: number;
  defaultAnswerSpace: AnswerSpaceType;
  defaultNumberingFormat: NumberingFormat;
  showFooter: boolean;
  showPageNumber: boolean;
  paperMargin: 'normal' | 'compact' | 'spacious';
}
