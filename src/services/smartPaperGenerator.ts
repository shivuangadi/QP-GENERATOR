import {
  PaperState,
  QuestionItem,
  SectionItem,
  INITIAL_40_MARKS_PAPER,
} from '../data/kannadaPaperData';
import {
  ALL_SUBJECTS,
  ALL_CLASSES,
  ExamType,
} from '../data/allSubjectsData';
import { CustomUploadedBank } from '../components/UploadJsonModal';

export type AnswerSpaceOption = 'none' | 'dotted_2' | 'dotted_3' | 'by_marks' | 'box' | 'ruled';

export interface GenerateConfig {
  classId: '6th' | '7th' | '8th';
  subjectId: string;
  examType: ExamType;
  totalMarks: number;
  questionCount: number;
  answerSpace: AnswerSpaceOption;
  date: string;
  section?: string;
  schoolName: string;
  studentName?: string;
  rollNumber?: string;
  customBank?: CustomUploadedBank | null;
  useOnlyCustomBank?: boolean;
  selectedLessons?: string[];
}

// Check if subject is a language paper (Letter Writing is ONLY in Language papers!)
export const isLanguageSubject = (subjectId: string): boolean => {
  return subjectId === 'kannada' || subjectId === 'english' || subjectId === 'hindi';
};

// Letter Writing Questions for Language Papers (Strictly 4 marks each)
export const LETTER_WRITING_QUESTIONS: Record<string, QuestionItem> = {
  kannada: {
    id: 'kan-letter-q',
    number: 0,
    questionText: 'ಮೂರು ದಿನಗಳ ರಜೆ ಕೋರಿ ನಿಮ್ಮ ಶಾಲೆಯ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರಿಗೆ ರಜಾ ಪತ್ರವನ್ನು ಬರೆಯಿರಿ.',
    lessonName: 'ಪತ್ರ ಲೇಖನ (Letter Writing)',
    marks: 4,
    answer: 'ಸ್ಥಳ, ದಿನಾಂಕ, ಇವರಿಗೆ: ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು, ಮಾನ್ಯರೇ, ವಿಷಯ: ರಜೆ ಕೋರಿ, ಪತ್ರದ ಒಡಲು (ಕಾರಣಗಳು), ವಂದನೆಗಳೊಂದಿಗೆ, ತಮ್ಮ ವಿಧೇಯ ವಿದ್ಯಾರ್ಥಿ ಸಹಿ.',
    isLetterWriting: true,
  },
  english: {
    id: 'en-letter-q',
    number: 0,
    questionText: 'Write a letter to your Headmaster requesting three days leave due to illness.',
    lessonName: 'Letter Writing',
    marks: 4,
    answer: 'From, Date, To: The Headmaster, Respected Sir, Subject: Request for leave, Body of the letter, Thanking you, Yours faithfully, Student signature.',
    isLetterWriting: true,
  },
  hindi: {
    id: 'hi-letter-q',
    number: 0,
    questionText: 'तीन दिन के अवकाश के लिए अपने प्रधानाध्यापक को प्रार्थना पत्र लिखिए।',
    lessonName: 'पत्र लेखन (Letter Writing)',
    marks: 4,
    answer: 'सेवा में, श्रीमान प्रधानाध्यापक महोदय, विषय: तीन दिन के अवकाश हेतु, आदरणीय महोदय, सविनय निवेदन है कि..., धन्यवाद, आपका आज्ञाकारी छात्र/छात्रा।',
    isLetterWriting: true,
  },
};

// Multi-subject Question Pool (Strictly 1-Mark, 2-Mark, and 4-Mark questions; NO 3 or 5 marks)
export const MULTI_SUBJECT_QUESTION_POOLS: Record<
  string,
  {
    oneMark: QuestionItem[];
    twoMark: QuestionItem[];
    fourMark: QuestionItem[];
  }
> = {
  kannada: {
    oneMark: [
      { id: 'kan-1', number: 0, questionText: '‘ನೀ ಹೋದ ಮರುದಿನ’ ಪದ್ಯದ ಕವಿ ________.', lessonName: 'ನೀ ಹೋದ ಮರುದಿನ', marks: 1, answer: 'ಸಿದ್ಧಲಿಂಗಯ್ಯ' },
      { id: 'kan-2', number: 0, questionText: 'ರಾಜನು _____ ವನ್ನು ಅಲ್ಲಿಗೇ ಪರಿಸಮಾಪ್ತಿಗೊಳಿಸಿದನು.', lessonName: 'ಗಂಧರ್ವಸೇನ', marks: 1, answer: 'ಒಡ್ಯೋಲಗ' },
      { id: 'kan-3', number: 0, questionText: '‘ಅವ್ವ’ ಎಂದರೆ _______.', lessonName: 'ಅವ್ವ', marks: 1, answer: 'ತಾಯಿ' },
      { id: 'kan-4', number: 0, questionText: 'ಪುಟ್ಟಿ ಹೋಗಲು ಬಯಸುವ ಗ್ರಹ ________.', lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ', marks: 1, answer: 'ಮಂಗಳ ಗ್ರಹ' },
      { id: 'kan-5', number: 0, questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಹುಟ್ಟೂರು ________.', lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್', marks: 1, answer: 'ಗಾಜನೂರು' },
      { id: 'kan-6', number: 0, questionText: '‘ಒಡ್ಯೋಲಗ’ ಪದದ ಅರ್ಥ ಬರೆಯಿರಿ.', lessonName: 'ಗಂಧರ್ವಸೇನ', marks: 1, answer: 'ರಾಜಸಭೆ' },
      { id: 'kan-7', number: 0, questionText: '‘ಮರುದಿನ’ ಪದದ ಅರ್ಥ ತಿಳಿಸಿ.', lessonName: 'ನೀ ಹೋದ ಮರುದಿನ', marks: 1, answer: 'ಮಾರನೆಯ ದಿನ' },
      { id: 'kan-8', number: 0, questionText: '‘ವಿಶ್ರಾಂತಿ’ ಪದದ ಅರ್ಥವೇನು?', lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ', marks: 1, answer: 'ಆರಾಮ / ದಣಿವು ಆರಿಸಿಕೊಳ್ಳುವುದು' },
      { id: 'kan-9', number: 0, questionText: '‘ಸಂಭ್ರಮ’ ಪದದ ಅರ್ಥ ಬರೆಯಿರಿ.', lessonName: 'ಬೇಸಿಗೆ', marks: 1, answer: 'ಉತ್ಸಾಹ / ಸಂತೋಷ' },
      { id: 'kan-10', number: 0, questionText: '‘ಮೂರ್ಖತನ’ ಪದದ ಅರ್ಥ ಬರೆಯಿರಿ.', lessonName: 'ಗಂಧರ್ವಸೇನ', marks: 1, answer: 'ಅವಿವೇಕ / ತಿಳಿವಳಿಕೆಯಿಲ್ಲದಿರುವುದು' },
      { id: 'kan-11', number: 0, questionText: 'ಮಗುವಿಗೆ ಹಣ್ಣುಗಳು ಏನನ್ನು ನೀಡುತ್ತವೆ?', lessonName: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು', marks: 1, answer: 'ಶಕ್ತಿ ಮತ್ತು ಆರೋಗ್ಯ' },
      { id: 'kan-12', number: 0, questionText: 'ಸುಧಾಮ ಯಾವುದನ್ನು ಮಾನವಧರ್ಮ ಎನ್ನುತ್ತಾನೆ?', lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ', marks: 1, answer: 'ಕಷ್ಟದಲ್ಲಿರುವವರಿಗೆ ಸಹಾಯ ಮಾಡುವುದು' },
      { id: 'kan-13', number: 0, questionText: 'ಗಂಧರ್ವ ಸೇನ ಯಾರು?', lessonName: 'ಗಂಧರ್ವಸೇನ', marks: 1, answer: 'ಮಡಿವಾಳಿಯ ಸಾಕಿದ ಕತ್ತೆ' },
      { id: 'kan-14', number: 0, questionText: 'ಸಿದ್ಧಾರ್ಥನ ತಂದೆಯ ಹೆಸರೇನು?', lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', marks: 1, answer: 'ಶುದ್ಧೋದನ ಮಹಾರಾಜ' },
      { id: 'kan-15', number: 0, questionText: 'ಬೇಸಿಗೆಯ ನಂತರ ಯಾವ ಋತುವು ಪ್ರಕೃತಿಯನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ?', lessonName: 'ಬೇಸಿಗೆ', marks: 1, answer: 'ಮಳೆಗಾಲ (ವರ್ಷ ಋತು)' },
      { id: 'kan-16', number: 0, questionText: '‘ಕರ್ತವ್ಯ’ ಪದವನ್ನು ಬಳಸಿ ಸ್ವಂತ ವಾಕ್ಯ ಬರೆಯಿರಿ.', lessonName: 'ಬೇಸಿಗೆ', marks: 1, answer: 'ದೇಶಸೇವೆ ನಮ್ಮ ಮುಖ್ಯ ಕರ್ತವ್ಯ.' },
      { id: 'kan-17', number: 0, questionText: '‘ನೆನಪು’ ಪದವನ್ನು ಬಳಸಿ ಸ್ವಂತ ವಾಕ್ಯ ಬರೆಯಿರಿ.', lessonName: 'ನೀ ಹೋದ ಮರುದಿನ', marks: 1, answer: 'ನನ್ನ ಬಾಲ್ಯದ ನೆನಪುಗಳು ಮಧುರವಾದವು.' },
      { id: 'kan-18', number: 0, questionText: '‘ತಾಯಿ’ ಪದವನ್ನು ಬಳಸಿ ಸ್ವಂತ ವಾಕ್ಯ ರಚಿಸಿ.', lessonName: 'ಅವ್ವ', marks: 1, answer: 'ತಾಯಿಯ ಪ್ರೀತಿ ನಿಸ್ವಾರ್ಥವಾದದ್ದು.' },
      { id: 'kan-19', number: 0, questionText: '‘ಸ್ನೇಹ’ ಪದವನ್ನು ಬಳಸಿ ಸ್ವಂತ ವಾಕ್ಯ ಬರೆಯಿರಿ.', lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ', marks: 1, answer: 'ಕೃಷ್ಣ-ಸುಧಾಮನ ಸ್ನೇಹ ಆದರ್ಶಪ್ರಾಯವಾದದ್ದು.' },
      { id: 'kan-20', number: 0, questionText: '‘ಪರಿಶ್ರಮ’ ಪದವನ್ನು ಬಳಸಿ ಸ್ವಂತ ವಾಕ್ಯ ರಚಿಸಿ.', lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್', marks: 1, answer: 'ನಿರಂತರ ಪರಿಶ್ರಮದಿಂದ ಯಶಸ್ಸು ಗಳಿಸಬಹುದು.' },
    ],
    twoMark: [
      { id: 'kan-2m-1', number: 0, questionText: 'ಸೂರ್ಯನಿಂದ ಮಕ್ಕಳು ಕಲಿಯಬೇಕಾದ ಪಾಠವೇನು?', lessonName: 'ಬೇಸಿಗೆ', marks: 2, answer: 'ಸೂರ್ಯನು ಪ್ರತಿದಿನ ತಪ್ಪದೆ ಉದಯಿಸಿ ಬೆಳಕು ನೀಡುವಂತೆ, ನಾವೂ ನಿಷ್ಠೆಯಿಂದ ಶ್ರಮಿಸಬೇಕು.' },
      { id: 'kan-2m-2', number: 0, questionText: 'ರಾಜಕುಮಾರರಿಗೆ ದೊರೆತ ಯಾವುದಾದರೂ ಎರಡು ಪ್ರಶಸ್ತಿ/ಬಿರುದುಗಳನ್ನು ಹೆಸರಿಸಿ.', lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್', marks: 2, answer: 'ಕರ್ನಾಟಕ ರತ್ನ, ದಾದಾ ಸಾಹೇಬ್ ಫಾಲ್ಕೆ ಪ್ರಶಸ್ತಿ.' },
      { id: 'kan-2m-3', number: 0, questionText: 'ತಾಯಿಯ ಮಹತ್ವವನ್ನು ‘ಅವ್ವ’ ಪಾಠದ ಆಧಾರದಲ್ಲಿ ಎರಡು ವಾಕ್ಯ ಬರೆಯಿರಿ.', lessonName: 'ಅವ್ವ', marks: 2, answer: 'ತಾಯಿಯ ಪ್ರೀತಿ ನಿಸ್ವಾರ್ಥವಾದುದು; ಮಕ್ಕಳ ಸುಖಕ್ಕಾಗಿ ಸದಾ ಶ್ರಮಿಸುತ್ತಾಳೆ.' },
      { id: 'kan-2m-4', number: 0, questionText: 'ಸುಧಾಮನ ಪತ್ನಿ ಅವನನ್ನು ಕೃಷ್ಣನ ಬಳಿ ಏಕೆ ಕಳುಹಿಸಿದಳು?', lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ', marks: 2, answer: 'ಬಡತನದ ಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸಿಕೊಳ್ಳಲು ಮತ್ತು ಬಾಲ್ಯ ಸ್ನೇಹಿತನ ಭೇಟಿಗೆ ಕಳುಹಿಸಿದಳು.' },
      { id: 'kan-2m-5', number: 0, questionText: 'ಸಿದ್ಧಾರ್ಥ ಮತ್ತು ದೇವದತ್ತರ ನಡುವೆ ಹಂಸದ ವಿಷಯದಲ್ಲಿ ಉಂಟಾದ ವಿವಾದವೇನು?', lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', marks: 2, answer: 'ದೇವದತ್ತನು ಹಂಸವನ್ನು ತಾನು ಹೊಡೆದುದರಿಂದ ತನ್ನದೆಂದನು; ಸಿದ್ಧಾರ್ಥನು ಜೀವ ಉಳಿಸಿದ ತನಗೆ ಸೇರಬೇಕೆಂದನು.' },
      { id: 'kan-2m-6', number: 0, questionText: 'ಲೋಪಸಂಧಿ ಎಂದರೇನು? ಒಂದು ಉದಾಹರಣೆ ನೀಡಿ.', lessonName: 'ವ್ಯಾಕರಣ', marks: 2, answer: 'ಸ್ವರದ ಮುಂದೆ ಸ್ವರ ಬಂದು ಅರ್ಥ ಕೆಡದಂತೆ ಪೂರ್ವ ಸ್ವರ ಬಿಟ್ಟುಹೋಗುವುದೇ ಲೋಪಸಂಧಿ. ಉದಾ: ಊರೂರು = ಊರು + ಊರು.' },
      { id: 'kan-2m-7', number: 0, questionText: 'ಗಂಧರ್ವಸೇನನ ಕಥೆಯಿಂದ ನಮಗೆ ದೊರೆಯುವ ನೀತಿಪಾಠವೇನು?', lessonName: 'ಗಂಧರ್ವಸೇನ', marks: 2, answer: 'ಯಾವುದೇ ವಿಷಯದ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ವಿಚಾರಿಸದೆ ಮೂರ್ಖರಂತೆ ಕಣ್ಣುಮುಚ್ಚಿ ನಂಬಬಾರದು.' },
      { id: 'kan-2m-8', number: 0, questionText: 'ಸರ್ವಜ್ಞನ ತ್ರಿಪದಿಯ ಎರಡು ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ನೀತಿ ಮಾರ್ಗ', marks: 2, answer: '1) ಮೂರು ಸಾಲುಗಳ ಛಂದೋರೂಪ, 2) ಆಡುಮಾತಿನಲ್ಲಿ ಸಾರ್ವಕಾಲಿಕ ನೀತಿ ಬೋಧನೆ.' },
    ],
    fourMark: [
      { id: 'kan-4m-1', number: 0, questionText: '‘ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ’ ಪದ್ಯದ ಆಶಯವನ್ನು ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.', lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ', marks: 4, answer: 'ಮಕ್ಕಳಲ್ಲಿ ವೈಜ್ಞಾನಿಕ ಅನ್ವೇಷಣಾ ಮನೋಭಾವ, ಬಾಹ್ಯಾಕಾಶದ ಕೌತುಕಗಳನ್ನು ಅರಿಯುವ ಆಸಕ್ತಿ ಮತ್ತು ಕನಸುಗಳನ್ನು ನನಸಾಗಿಸುವ ಛಲವನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುವುದು.' },
      { id: 'kan-4m-2', number: 0, questionText: 'ಕೃಷ್ಣನು ಸುಧಾಮನಿಗೆ ಮನೆ ಕಟ್ಟಿಸಿಕೊಟ್ಟ ಸಂದರ್ಭವನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ.', lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ', marks: 4, answer: 'ಸುಧಾಮನು ನಿಷ್ಕಾಮ ಭಕ್ತಿಯಿಂದ ಅವಲಕ್ಕಿ ಅರ್ಪಿಸಿದನು. ಅವನ ನಿಸ್ವಾರ್ಥತೆಯನ್ನು ಮೆಚ್ಚಿದ ಶ್ರೀಕೃಷ್ಣನು ಅವನ ಬಡ ಗುಡಿಸಲನ್ನು ಭವ್ಯ ಅರಮನೆಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿದನು.' },
      { id: 'kan-4m-3', number: 0, questionText: '‘ಬೇಸಿಗೆ’ ಪದ್ಯದ ಸಾರಾಂಶ ಬರೆದು, ಅದರಿಂದ ದೊರೆಯುವ ಸಂದೇಶವನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಬೇಸಿಗೆ', marks: 4, answer: 'ಬೇಸಿಗೆಯ ಕಠಿಣ ಬಿಸಿಲು ಭೂಮಿಯನ್ನು ಕಾಯಿಸಿದರೂ, ನಂತರದ ಫಲಪ್ರದ ಮಳೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ; ಕಷ್ಟದ ನಂತರವೇ ಸುಖ ಎಂಬುದು ಸಂದೇಶ.' },
      { id: 'kan-4m-4', number: 0, questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಸರಳತೆ ಮತ್ತು ವ್ಯಕ್ತಿತ್ವದ ಬಗ್ಗೆ ನಾಲ್ಕು ವಾಕ್ಯ ಬರೆಯಿರಿ.', lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್', marks: 4, answer: 'ಅವರು ಅತ್ಯಂತ ನಮ್ರ ಹಾಗೂ ಸರಳ ವ್ಯಕ್ತಿಯಾಗಿದ್ದರು. ಕನ್ನಡ ನಾಡು-ನುಡಿಯ ಸೇವೆಗೆ ಸದಾ ಮುಂಚೂಣಿಯಲ್ಲಿದ್ದರು. ಅಭಿಮಾನಿಗಳನ್ನು ದೇವರು ಎಂದು ಗೌರವಿಸುತ್ತಿದ್ದರು.' },
      { id: 'kan-4m-5', number: 0, questionText: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ ಮತ್ತು ಜೀವದಯೆಯ ಗುಣವನ್ನು ಪಾಠದ ಆಧಾರದಲ್ಲಿ ವಿವರಿಸಿ.', lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', marks: 4, answer: 'ಗಾಯಗೊಂಡ ಹಂಸದ ಬಾಣವನ್ನು ತೆಗೆದು ಉಪಚರಿಸಿದನು. ಕೊಲ್ಲುವವನಿಗಿಂತ ಕಾಯುವವನೇ ಶ್ರೇಷ್ಠನೆಂಬ ನ್ಯಾಯವನ್ನು ಜಗತ್ತಿಗೆ ಸಾಬೀತುಪಡಿಸಿದನು.' },
    ],
  },
  english: {
    oneMark: [
      { id: 'en-1m-1', number: 0, questionText: 'Who wrote the poem "The Rainbow"?', lessonName: 'The Rainbow', marks: 1, answer: 'Christina Rossetti' },
      { id: 'en-1m-2', number: 0, questionText: 'Fill in the blank: Anandi Gopal was India’s first woman ________.', lessonName: 'Anandi Gopal', marks: 1, answer: 'Doctor' },
      { id: 'en-1m-3', number: 0, questionText: 'What did the spider do in the cave?', lessonName: 'The King and The Spider', marks: 1, answer: 'It tried again and again to weave its web.' },
      { id: 'en-1m-4', number: 0, questionText: 'Identify the noun in the sentence: "Bengaluru is a beautiful city."', lessonName: 'Grammar', marks: 1, answer: 'Bengaluru / city' },
      { id: 'en-1m-5', number: 0, questionText: 'Give the antonym of: "Cruel"', lessonName: 'Kindness to Animals', marks: 1, answer: 'Kind' },
      { id: 'en-1m-6', number: 0, questionText: 'Fill in the blank: Clouds bridge heaven and ________.', lessonName: 'The Rainbow', marks: 1, answer: 'Earth' },
      { id: 'en-1m-7', number: 0, questionText: 'Give the plural form of "Child": ________.', lessonName: 'Grammar', marks: 1, answer: 'Children' },
      { id: 'en-1m-8', number: 0, questionText: 'Who was King Robert Bruce?', lessonName: 'The King and The Spider', marks: 1, answer: 'King of Scotland' },
      { id: 'en-1m-9', number: 0, questionText: 'Write the opposite word of "Success".', lessonName: 'Grammar', marks: 1, answer: 'Failure' },
      { id: 'en-1m-10', number: 0, questionText: 'Fill in the blank: Anandi went to ________ for medical studies.', lessonName: 'Anandi Gopal', marks: 1, answer: 'America' },
      { id: 'en-1m-11', number: 0, questionText: 'What do boats sail on according to the poem?', lessonName: 'The Rainbow', marks: 1, answer: 'Rivers' },
      { id: 'en-1m-12', number: 0, questionText: 'What do ships sail on according to the poem?', lessonName: 'The Rainbow', marks: 1, answer: 'Seas' },
      { id: 'en-1m-13', number: 0, questionText: 'Give the past tense of "Write": ________.', lessonName: 'Grammar', marks: 1, answer: 'Wrote' },
      { id: 'en-1m-14', number: 0, questionText: 'Give the opposite of "Honest": ________.', lessonName: 'Grammar', marks: 1, answer: 'Dishonest' },
      { id: 'en-1m-15', number: 0, questionText: 'Identify the verb in: "The birds fly in the sky."', lessonName: 'Grammar', marks: 1, answer: 'Fly' },
      { id: 'en-1m-16', number: 0, questionText: 'Use the word "Courage" in your own sentence.', lessonName: 'Grammar', marks: 1, answer: 'The brave soldier fought with great courage.' },
      { id: 'en-1m-17', number: 0, questionText: 'Use the word "Persevere" in your own sentence.', lessonName: 'Grammar', marks: 1, answer: 'We must persevere until we achieve our goal.' },
      { id: 'en-1m-18', number: 0, questionText: 'Use the word "Kindness" in your own sentence.', lessonName: 'Grammar', marks: 1, answer: 'Kindness makes the world a better place.' },
      { id: 'en-1m-19', number: 0, questionText: 'Use the word "Dream" in your own sentence.', lessonName: 'Grammar', marks: 1, answer: 'Anandi fulfilled her dream of becoming a doctor.' },
      { id: 'en-1m-20', number: 0, questionText: 'Use the word "Beautiful" in your own sentence.', lessonName: 'Grammar', marks: 1, answer: 'The rainbow looks very beautiful in the sky.' },
    ],
    twoMark: [
      { id: 'en-2m-1', number: 0, questionText: 'What lesson did King Robert Bruce learn from the spider?', lessonName: 'The King and The Spider', marks: 2, answer: 'He learned that perseverance and determination lead to success.' },
      { id: 'en-2m-2', number: 0, questionText: 'Why should we be kind to animals according to the poem?', lessonName: 'Kindness to Animals', marks: 2, answer: 'Animals too have feelings and feel pain like humans.' },
      { id: 'en-2m-3', number: 0, questionText: 'Change the tense into Simple Past: "She writes a letter."', lessonName: 'Grammar', marks: 2, answer: 'She wrote a letter.' },
      { id: 'en-2m-4', number: 0, questionText: 'Mention any two hardships faced by Anandi Gopal during her education.', lessonName: 'Anandi Gopal', marks: 2, answer: 'She faced severe orthodox opposition and health challenges.' },
      { id: 'en-2m-5', number: 0, questionText: 'What are the things that sail on the rivers and seas according to the poem?', lessonName: 'The Rainbow', marks: 2, answer: 'Boats sail on the rivers and ships sail on the seas.' },
      { id: 'en-2m-6', number: 0, questionText: 'Frame two meaningful sentences using the word "Beautiful".', lessonName: 'Grammar', marks: 2, answer: '1) The rainbow looks beautiful. 2) Nature is full of beautiful birds.' },
      { id: 'en-2m-7', number: 0, questionText: 'Why did King Bruce hide in a cave?', lessonName: 'The King and The Spider', marks: 2, answer: 'His army was defeated in battle and he fled to save his life.' },
      { id: 'en-2m-8', number: 0, questionText: 'How did Gopalrao encourage Anandi in her studies?', lessonName: 'Anandi Gopal', marks: 2, answer: 'He supported her education against social taboos and helped her travel abroad for medical studies.' },
    ],
    fourMark: [
      { id: 'en-4m-1', number: 0, questionText: 'Explain the central message of the poem "The Rainbow".', lessonName: 'The Rainbow', marks: 4, answer: 'The poet conveys that natural beauty like clouds and rainbows bridges earth and heaven far more beautifully than man-made ships or bridges.' },
      { id: 'en-4m-2', number: 0, questionText: 'Describe how King Robert Bruce won his battle after learning from the spider.', lessonName: 'The King and The Spider', marks: 4, answer: 'Seeing the spider succeed on its seventh attempt, Bruce was inspired with fresh determination, gathered his soldiers, and won the final battle.' },
      { id: 'en-4m-3', number: 0, questionText: 'Write four qualities of Anandi Gopal that make her an inspiration for girls.', lessonName: 'Anandi Gopal', marks: 4, answer: 'Her dedication to education, courage to travel abroad alone, perseverance through illness, and dedication to medical service.' },
      { id: 'en-4m-4', number: 0, questionText: 'How can students show kindness to animals and nature in daily life? Explain in four points.', lessonName: 'Kindness to Animals', marks: 4, answer: '1) Providing water and food to stray animals. 2) Not hurting birds. 3) Planting trees. 4) Creating awareness about animal welfare.' },
      { id: 'en-4m-5', number: 0, questionText: 'Describe the role of discipline and hard work in a student’s success in four sentences.', lessonName: 'General', marks: 4, answer: 'Discipline creates a regular study routine. Hard work helps master difficult subjects. Together they build strong character and ensure academic excellence.' },
    ],
  },
  hindi: {
    oneMark: [
      { id: 'hi-1m-1', number: 0, questionText: '‘सूरज’ शब्द का पर्यायवाची शब्द लिखिए।', lessonName: 'सरल शब्द', marks: 1, answer: 'सूर्य / दिनकर' },
      { id: 'hi-1m-2', number: 0, questionText: '‘बड़ा’ शब्द का विलोम शब्द क्या है?', lessonName: 'विलोम शब्द', marks: 1, answer: 'छोटा' },
      { id: 'hi-1m-3', number: 0, questionText: 'भारत की राजधानी कौन-सी है?', lessonName: 'मेरा देश भारत', marks: 1, answer: 'नई दिल्ली' },
      { id: 'hi-1m-4', number: 0, questionText: 'हिंदी वर्णमाला में कितने स्वर हैं?', lessonName: 'वर्णमाला', marks: 1, answer: '11' },
      { id: 'hi-1m-5', number: 0, questionText: '‘पानी’ शब्द का पर्यायवाची शब्द लिखिए।', lessonName: 'सरल शब्द', marks: 1, answer: 'जल / नीर' },
      { id: 'hi-1m-6', number: 0, questionText: '‘सच्चा’ शब्द का विलोम शब्द क्या है?', lessonName: 'विलोम शब्द', marks: 1, answer: 'झूठा' },
      { id: 'hi-1m-7', number: 0, questionText: 'हमारा राष्ट्रीय पक्षी कौन-सा है?', lessonName: 'मेरा देश भारत', marks: 1, answer: 'मोर' },
      { id: 'hi-1m-8', number: 0, questionText: 'हमारा राष्ट्रीय पशु कौन-सा है?', lessonName: 'मेरा देश भारत', marks: 1, answer: 'बाघ' },
      { id: 'hi-1m-9', number: 0, questionText: '‘दिन’ शब्द का विलोम शब्द क्या है?', lessonName: 'विलोम शब्द', marks: 1, answer: 'रात' },
      { id: 'hi-1m-10', number: 0, questionText: '‘आकाश’ शब्द का पर्यायवाची शब्द क्या है?', lessonName: 'सरल शब्द', marks: 1, answer: 'गगन / नभ' },
      { id: 'hi-1m-11', number: 0, questionText: 'भारत का राष्ट्रीय पुष्प कौन-सा है?', lessonName: 'मेरा देश भारत', marks: 1, answer: 'कमल' },
      { id: 'hi-1m-12', number: 0, questionText: '‘पुस्तक’ का बहुवचन रूप क्या है?', lessonName: 'व्याकरण', marks: 1, answer: 'पुस्तकें' },
      { id: 'hi-1m-13', number: 0, questionText: '‘पेड़’ शब्द का पर्यायवाची शब्द लिखिए।', lessonName: 'सरल शब्द', marks: 1, answer: 'वृक्ष / तरु' },
      { id: 'hi-1m-14', number: 0, questionText: '‘सुख’ का विलोम शब्द लिखिए।', lessonName: 'विलोम शब्द', marks: 1, answer: 'दुःख' },
      { id: 'hi-1m-15', number: 0, questionText: '‘लड़का’ का स्त्रीलिंग रूप क्या है?', lessonName: 'व्याकरण', marks: 1, answer: 'लड़की' },
      { id: 'hi-1m-16', number: 0, questionText: '‘मित्र’ शब्द का प्रयोग करते हुए एक वाक्य बनाइए।', lessonName: 'वाक्य रचना', marks: 1, answer: 'राम मेरा सबसे अच्छा मित्र है।' },
      { id: 'hi-1m-17', number: 0, questionText: '‘परिश्रम’ शब्द का प्रयोग करते हुए एक वाक्य बनाइए।', lessonName: 'वाक्य रचना', marks: 1, answer: 'परिश्रम से ही सफलता मिलती है।' },
      { id: 'hi-1m-18', number: 0, questionText: '‘सत्य’ शब्द का प्रयोग करते हुए एक वाक्य बनाइए।', lessonName: 'वाक्य रचना', marks: 1, answer: 'हमें सदा सत्य बोलना चाहिए।' },
      { id: 'hi-1m-19', number: 0, questionText: '‘देश’ शब्द का प्रयोग करते हुए एक वाक्य बनाइए।', lessonName: 'वाक्य रचना', marks: 1, answer: 'भारत हमारा प्यारा देश है।' },
      { id: 'hi-1m-20', number: 0, questionText: '‘समय’ शब्द का प्रयोग करते हुए एक वाक्य बनाइए।', lessonName: 'वाक्य रचना', marks: 1, answer: 'समय बहुत मूल्यवान होता है।' },
    ],
    twoMark: [
      { id: 'hi-2m-1', number: 0, questionText: 'बच्चे भगवान से क्या प्रार्थना करते हैं?', lessonName: 'प्रार्थना', marks: 2, answer: 'बच्चे सद्बुद्धि, विद्या और देश सेवा का वरदान माँगते हैं।' },
      { id: 'hi-2m-2', number: 0, questionText: 'किन्हीं दो पालतू पशुओं और दो पक्षियों के नाम हिंदी में लिखिए।', lessonName: 'हमारे पशु-पक्षी', marks: 2, answer: 'पशु: गाय, कुत्ता। पक्षी: तोता, मोर।' },
      { id: 'hi-2m-3', number: 0, questionText: 'अपने परिवार के बारे में दो वाक्य हिंदी में लिखिए।', lessonName: 'मेरा घर और परिवार', marks: 2, answer: 'मेरे परिवार में चार सदस्य हैं। हम सब आपस में प्रेम से रहते हैं।' },
      { id: 'hi-2m-4', number: 0, questionText: 'भारत के किन्हीं दो राष्ट्रीय प्रतीकों के नाम लिखिए।', lessonName: 'मेरा देश भारत', marks: 2, answer: 'राष्ट्रीय ध्वज: तिरंगा, राष्ट्रीय पशु: बाघ।' },
      { id: 'hi-2m-5', number: 0, questionText: 'सदा सच बोलने से क्या लाभ होता है? दो वाक्य लिखिए।', lessonName: 'सच्चाई', marks: 2, answer: 'सदा सच बोलने से मन शांत रहता है और समाज में आदर मिलता है।' },
      { id: 'hi-2m-6', number: 0, questionText: 'पर्यावरण स्वच्छ रखने के दो उपाय लिखिए।', lessonName: 'हमारा पर्यावरण', marks: 2, answer: '1) पेड़-पौधे लगाना, 2) कचरा कूड़ेदान में डालना।' },
      { id: 'hi-2m-7', number: 0, questionText: 'पेड़ों से हमें क्या-क्या लाभ मिलते हैं? दो वाक्य लिखिए।', lessonName: 'प्रकृति', marks: 2, answer: 'पेड़ हमें शुद्ध हवा (ऑक्सीजन), मीठे फल और शीतल छाया देते हैं।' },
      { id: 'hi-2m-8', number: 0, questionText: 'विद्यार्थी जीवन में अनुशासन का क्या महत्व है?', lessonName: 'अनुशासन', marks: 2, answer: 'अनुशासन से जीवन में सफलता मिलती है और अच्छा चरित्र बनता है।' },
    ],
    fourMark: [
      { id: 'hi-4m-1', number: 0, questionText: '‘हमारे राष्ट्रीय प्रतीक’ विषय पर चार वाक्य लिखिए।', lessonName: 'मेरा देश भारत', marks: 4, answer: 'हमारा राष्ट्रीय ध्वज तिरंगा है। राष्ट्रीय पक्षी मोर और राष्ट्रीय पशु बाघ है। राष्ट्रीय गान जन-गण-मन है और राष्ट्रीय पुष्प कमल है।' },
      { id: 'hi-4m-2', number: 0, questionText: '‘प्रकृति का सौंदर्य’ विषय पर चार वाक्य हिंदी में लिखिए।', lessonName: 'प्रकृति', marks: 4, answer: 'पेड़-पौधे हमें फल और छाया देते हैं। नदियाँ मीठा जल देती हैं। हरियाली से मन प्रसन्न होता है और प्रकृति का संतुलन बना रहता है।' },
      { id: 'hi-4m-3', number: 0, questionText: '‘मेरी पाठशाला’ विषय पर चार सुंदर वाक्य हिंदी में लिखिए।', lessonName: 'मेरी पाठशाला', marks: 4, answer: 'मेरी पाठशाला का भवन बहुत सुंदर है। यहाँ एक बड़ा खेल का मैदान और पुस्तकालय है। सभी शिक्षक हमें प्रेम से पढ़ाते हैं।' },
      { id: 'hi-4m-4', number: 0, questionText: '‘समय का सदुपयोग’ विषय पर चार वाक्य लिखिए।', lessonName: 'समय का महत्व', marks: 4, answer: 'बीता हुआ समय कभी वापस नहीं आता। समय पर काम करने से सफलता मिलती है। आलस्य छोड़कर हमें हर पल का सदुपयोग करना चाहिए।' },
      { id: 'hi-4m-5', number: 0, questionText: '‘सच्चा मित्र’ कैसा होना चाहिए? चार वाक्य लिखिए।', lessonName: 'सच्चा मित्र', marks: 4, answer: 'सच्चा मित्र विपत्ति में साथ देता है। वह हमें गलत रास्ते से हटाकर सही मार्ग दिखाता है। वह निस्वार्थ भाव से स्नेह करता है।' },
    ],
  },
  mathematics: {
    oneMark: [
      { id: 'ma-1m-1', number: 0, questionText: 'ಅತಿ ಚಿಕ್ಕ ಸ್ವಾಭಾವಿಕ ಸಂಖ್ಯೆ ಯಾವುದು?', lessonName: 'ನಮ್ಮ ಸಂಖ್ಯೆಗಳು', marks: 1, answer: '1' },
      { id: 'ma-1m-2', number: 0, questionText: 'ಸೊನ್ನೆ (0) ಒಂದು ಪೂರ್ಣ ಸಂಖ್ಯೆಯೇ? (ಹೌದು / ಇಲ್ಲ)', lessonName: 'ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳು', marks: 1, answer: 'ಹೌದು' },
      { id: 'ma-1m-3', number: 0, questionText: '(-5) ಮತ್ತು (+8) ರ ಮೊತ್ತವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಪೂರ್ಣಾಂಕಗಳು', marks: 1, answer: '+3' },
      { id: 'ma-1m-4', number: 0, questionText: 'ಲಂಬಕೋನದ ಅಳತೆ ಎಷ್ಟು ಡಿಗ್ರಿ?', lessonName: 'ಮೂಲ ರೇಖಾಗಣಿತ', marks: 1, answer: '90°' },
      { id: 'ma-1m-5', number: 0, questionText: 'ಸರಳಕೋನದ ಅಳತೆಯನ್ನು ತಿಳಿಸಿ.', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: '180°' },
      { id: 'ma-1m-6', number: 0, questionText: 'ತ್ರಿಭುಜದ ಮೂರು ಒಳಕೋನಗಳ ಮೊತ್ತ ಎಷ್ಟು?', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: '180°' },
      { id: 'ma-1m-7', number: 0, questionText: 'ಒಂದು ದಿನದಲ್ಲಿ ಎಷ್ಟು ಗಂಟೆಗಳು ಇರುತ್ತವೆ?', lessonName: 'ಅಳತೆಗಳು', marks: 1, answer: '24 ಗಂಟೆಗಳು' },
      { id: 'ma-1m-8', number: 0, questionText: '50 ರ ನಂತರ ಬರುವ ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆ ಯಾವುದು?', lessonName: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ', marks: 1, answer: '53' },
      { id: 'ma-1m-9', number: 0, questionText: '1 ಕಿಲೋಮೀಟರ್ = ______ ಮೀಟರ್.', lessonName: 'ಅಳತೆಗಳು', marks: 1, answer: '1000 ಮೀಟರ್' },
      { id: 'ma-1m-10', number: 0, questionText: 'ವೃತ್ತದ ಕೇಂದ್ರದಿಂದ ಪರಿಧಿಗೆ ಎಳೆದ ರೇಖೆಗೆ ಏನನ್ನುತ್ತಾರೆ?', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: 'ತ್ರಿಜ್ಯ (Radius)' },
      { id: 'ma-1m-11', number: 0, questionText: 'ಅತಿ ಚಿಕ್ಕ ಅವಿಭಾಜ್ಯ ಸಂಖ್ಯೆ ಯಾವುದು?', lessonName: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ', marks: 1, answer: '2' },
      { id: 'ma-1m-12', number: 0, questionText: 'ಚತುರ್ಭುಜದ ನಾಲ್ಕು ಕೋನಗಳ ಮೊತ್ತ ಎಷ್ಟು?', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: '360°' },
      { id: 'ma-1m-13', number: 0, questionText: '1 ಲೀಟರ್ = ______ ಮಿಲಿಲೀಟರ್.', lessonName: 'ಅಳತೆಗಳು', marks: 1, answer: '1000 ಮಿಲಿಲೀಟರ್' },
      { id: 'ma-1m-14', number: 0, questionText: 'ಸಮಬಾಹು ತ್ರಿಭುಜದ ಪ್ರತಿಯೊಂದು ಕೋನದ ಅಳತೆ ಎಷ್ಟು?', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: '60°' },
      { id: 'ma-1m-15', number: 0, questionText: '(-10) ರ ಸಂಕಲನದ ವಿಲೋಮ ಯಾವುದು?', lessonName: 'ಪೂರ್ಣಾಂಕಗಳು', marks: 1, answer: '+10' },
      { id: 'ma-1m-16', number: 0, questionText: '3/5 ರಲ್ಲಿ ಅಂಶ (Numerator) ಯಾವುದು?', lessonName: 'ಭಿನ್ನರಾಶಿಗಳು', marks: 1, answer: '3' },
      { id: 'ma-1m-17', number: 0, questionText: 'ವೃತ್ತದ ಅತಿ ದೊಡ್ಡ ಜ್ಯಾ (Chord) ಯಾವುದು?', lessonName: 'ರೇಖಾಗಣಿತ', marks: 1, answer: 'ವ್ಯಾಸ (Diameter)' },
      { id: 'ma-1m-18', number: 0, questionText: '1 ಚದರ ಮೀಟರ್ = ______ ಚದರ ಸೆಂಟಿಮೀಟರ್.', lessonName: 'ಕ್ಷೇತ್ರಗಣಿತ', marks: 1, answer: '10000 ಚ.ಸೆಂ.ಮೀ' },
      { id: 'ma-1m-19', number: 0, questionText: 'ಶೂನ್ಯವನ್ನು ಯಾವುದೇ ಸಂಖ್ಯೆಯಿಂದ ಗುಣಿಸಿದಾಗ ಬರುವ ಗುಣಲಬ್ಧ ಎಷ್ಟು?', lessonName: 'ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳು', marks: 1, answer: '0' },
      { id: 'ma-1m-20', number: 0, questionText: '7 ರ ಮೊದಲ ಮೂರು ಗುಣಕಗಳನ್ನು (Multiples) ಬರೆಯಿರಿ.', lessonName: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ', marks: 1, answer: '7, 14, 21' },
    ],
    twoMark: [
      { id: 'ma-2m-1', number: 0, questionText: 'ಸಂಖ್ಯಾರೇಖೆಯ ಮೇಲೆ (-3) + (5) ಅನ್ನು ಪ್ರತಿನಿಧಿಸಿ ಉತ್ತರ ಪಡೆಯಿರಿ.', lessonName: 'ಪೂರ್ಣಾಂಕಗಳು', marks: 2, answer: 'ಸಂಖ್ಯಾ ರೇಖೆ ರಚನೆ ಮತ್ತು ಉತ್ತರ +2.' },
      { id: 'ma-2m-2', number: 0, questionText: '8 ಮತ್ತು 12 ರ ಲಘುತ್ತಮ ಸಾಮಾನ್ಯ ಅಪವರ್ತ್ಯವನ್ನು (ಲ.ಸಾ.ಅ.) ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ', marks: 2, answer: '8 = 2×2×2, 12 = 2×2×3; ಲ.ಸಾ.ಅ = 24.' },
      { id: 'ma-2m-3', number: 0, questionText: 'ಒಂದು ಸಮಬಾಹು ತ್ರಿಭುಜದ ಒಂದು ಬಾಹುವಿನ ಉದ್ದ 5 ಸೆಂ.ಮೀ ಇದ್ದರೆ ಅದರ ಸುತ್ತಳತೆ ಎಷ್ಟು?', lessonName: 'ಕ್ಷೇತ್ರಗಣಿತ', marks: 2, answer: 'ಸುತ್ತಳತೆ = 3 × ಬಾಹು = 3 × 5 = 15 ಸೆಂ.ಮೀ.' },
      { id: 'ma-2m-4', number: 0, questionText: 'ಭಿನ್ನರಾಶಿಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತಗೊಳಿಸಿ: 12/36 ಮತ್ತು 15/60.', lessonName: 'ಭಿನ್ನರಾಶಿಗಳು', marks: 2, answer: '12/36 = 1/3, 15/60 = 1/4.' },
      { id: 'ma-2m-5', number: 0, questionText: 'ಒಂದು ಚೌಕದ ಬಾಹು 6 ಸೆಂ.ಮೀ ಇದ್ದರೆ ಅದರ ವಿಸ್ತೀರ್ಣ ಎಷ್ಟು?', lessonName: 'ಕ್ಷೇತ್ರಗಣಿತ', marks: 2, answer: 'ವಿಸ್ತೀರ್ಣ = ಬಾಹು × ಬಾಹು = 6 × 6 = 36 ಚ.ಸೆಂ.ಮೀ.' },
      { id: 'ma-2m-6', number: 0, questionText: '24 ಮತ್ತು 36 ರ ಮಹತ್ತಮ ಸಾಮಾನ್ಯ ಅಪವರ್ತನ (ಮ.ಸಾ.ಅ.) ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ', marks: 2, answer: 'ಮ.ಸಾ.ಅ = 12.' },
      { id: 'ma-2m-7', number: 0, questionText: '(-8) - (-12) ರ ಬೆಲೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಪೂರ್ಣಾಂಕಗಳು', marks: 2, answer: '(-8) + 12 = +4.' },
      { id: 'ma-2m-8', number: 0, questionText: 'ಒಂದು ವೃತ್ತದ ತ್ರಿಜ್ಯ 7 ಸೆಂ.ಮೀ ಇದ್ದರೆ ಅದರ ಪರಿಧಿಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಕ್ಷೇತ್ರಗಣಿತ', marks: 2, answer: 'ಪರಿಧಿ = 2πr = 2 × (22/7) × 7 = 44 ಸೆಂ.ಮೀ.' },
    ],
    fourMark: [
      { id: 'ma-4m-1', number: 0, questionText: 'ಒಂದು ಆಯತಾಕಾರದ ಮೈದಾನದ ಉದ್ದ 20 ಮೀ ಮತ್ತು ಅಗಲ 15 ಮೀ ಇದೆ. ಅದರ ಸುತ್ತಳತೆ ಮತ್ತು ವಿಸ್ತೀರ್ಣವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಕ್ಷೇತ್ರಗಣಿತ', marks: 4, answer: 'ಸುತ್ತಳತೆ = 2(ಉದ್ದ + ಅಗಲ) = 70 ಮೀ; ವಿಸ್ತೀರ್ಣ = ಉದ್ದ × ಅಗಲ = 300 ಚ.ಮೀ.' },
      { id: 'ma-4m-2', number: 0, questionText: 'ಕೈವಾರ ಮತ್ತು ಅಳತೆಪಟ್ಟಿ ಬಳಸಿ 60° ಕೋನವನ್ನು ರಚಿಸಿ, ಕೋನಾರ್ಧಕ ರೇಖೆಯನ್ನು ಎಳೆಯಿರಿ.', lessonName: 'ಪ್ರಾಯೋಗಿಕ ರೇಖಾಗಣಿತ', marks: 4, answer: 'ಕ್ರಮಬದ್ಧ ರಚನಾ ಹಂತಗಳು ಮತ್ತು ಕೋನಾರ್ಧಕ ರೇಖೆ.' },
      { id: 'ma-4m-3', number: 0, questionText: 'ಒಂದು ಶಾಲೆಯಲ್ಲಿ 120 ಹುಡುಗರು ಮತ್ತು 80 ಹುಡುಗಿಯರಿದ್ದಾರೆ. ಹುಡುಗರು ಮತ್ತು ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳ ಅನುಪಾತವನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', lessonName: 'ಅನುಪಾತ ಮತ್ತು ಸಮಾನುಪಾತ', marks: 4, answer: 'ಒಟ್ಟು = 200; ಅನುಪಾತ = 120:200 = 3:5.' },
      { id: 'ma-4m-4', number: 0, questionText: 'ಸಂಕಲನ ಮಾಡಿ: (2/5) + (3/10) + (1/2). ಹಂತಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿರಿ.', lessonName: 'ಭಿನ್ನರಾಶಿಗಳು', marks: 4, answer: 'ಲ.ಸಾ.ಅ = 10; (4 + 3 + 5)/10 = 12/10 = 6/5 = 1(1/5).' },
      { id: 'ma-4m-5', number: 0, questionText: 'ಒಂದು ವ್ಯಾಪಾರಿಯು 500 ರೂ. ಗೆ ಕೊಂಡ ವಸ್ತುವನ್ನು 600 ರೂ. ಗೆ ಮಾರಿದರೆ ಅವನ ಲಾಭ ಮತ್ತು ಶೇಕಡಾ ಲಾಭವನ್ನು ಲೆಕ್ಕಿಸಿ.', lessonName: 'ವ್ಯಾವಹಾರಿಕ ಗಣಿತ', marks: 4, answer: 'ಲಾಭ = 100 ರೂ.; ಶೇಕಡಾ ಲಾಭ = (100/500) × 100 = 20%.' },
    ],
  },
  science: {
    oneMark: [
      { id: 'sc-1m-1', number: 0, questionText: 'ಭಾರತದಲ್ಲಿ ರಾಷ್ಟ್ರೀಯ ವಿಜ್ಞಾನ ದಿನವನ್ನು ಯಾವಾಗ ಆಚರಿಸಲಾಗುತ್ತದೆ?', lessonName: 'ವಿಜ್ಞಾನದ ಅದ್ಭುತ ಪ್ರಪಂಚ', marks: 1, answer: 'ಫೆಬ್ರವರಿ 28' },
      { id: 'sc-1m-2', number: 0, questionText: 'ಕಾಂತದ ಯಾವ ಧ್ರುವಗಳು ಪರಸ್ಪರ ಆಕರ್ಷಿಸುತ್ತವೆ?', lessonName: 'ಕಾಂತಗಳ ಅನ್ವೇಷಣೆ', marks: 1, answer: 'ವಿಜಾತೀಯ ಧ್ರುವಗಳು (ಉತ್ತರ ಮತ್ತು ದಕ್ಷಿಣ ಧ್ರುವಗಳು)' },
      { id: 'sc-1m-3', number: 0, questionText: 'ಉದ್ದದ ಅಂತರರಾಷ್ಟ್ರೀಯ (SI) ಏಕಮಾನ ಯಾವುದು?', lessonName: 'ಉದ್ದದ ಅಳತೆ ಮತ್ತು ಚಲನೆ', marks: 1, answer: 'ಮೀಟರ್ (Meter)' },
      { id: 'sc-1m-4', number: 0, questionText: 'ವಿಟಮಿನ್ ‘ಸಿ’ ಕೊರತೆಯಿಂದ ಬರುವ ರೋಗ ಯಾವುದು?', lessonName: 'ಮನದುಂಬಿದ ಊಟ', marks: 1, answer: 'ಸ್ಕರ್ವಿ (Scurvy)' },
      { id: 'sc-1m-5', number: 0, questionText: 'ಬೆಳಕಿನ ಉಪಸ್ಥಿತಿಯಲ್ಲಿ ಸಸ್ಯಗಳು ಆಹಾರ ತಯಾರಿಸುವ ಕ್ರಿಯೆ ಯಾವುದು?', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 1, answer: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis)' },
      { id: 'sc-1m-6', number: 0, questionText: 'ನೀರಿನ ಘನೀಭವನ ಬಿಂದು ಎಷ್ಟು ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್?', lessonName: 'ಸಾಮಗ್ರಿಗಳು', marks: 1, answer: '0° C' },
      { id: 'sc-1m-7', number: 0, questionText: 'ರಕ್ತದಲ್ಲಿ ಹಿಮೋಗ್ಲೋಬಿನ್ ತಯಾರಿಕೆಗೆ ಬೇಕಾಗುವ ಖನಿಜಾಂಶ ಯಾವುದು?', lessonName: 'ಆಹಾರದ ಘಟಕಗಳು', marks: 1, answer: 'ಕಬ್ಬಿಣಾಂಶ (Iron)' },
      { id: 'sc-1m-8', number: 0, questionText: 'ಸಸ್ಯದ ಯಾವ ಭಾಗವು ನೀರು ಮತ್ತು ಖನಿಜಗಳನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತದೆ?', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 1, answer: 'ಬೇರುಗಳು (Roots)' },
      { id: 'sc-1m-9', number: 0, questionText: 'ವಿದ್ಯುತ್ ವಾಹಕ ವಸ್ತುವಿಗೆ ಒಂದು ಉದಾಹರಣೆ ಕೊಡಿ.', lessonName: 'ವಿದ್ಯುತ್ ಮತ್ತು ಮಂಡಲಗಳು', marks: 1, answer: 'ತಾಮ್ರ / ಕಬ್ಬಿಣ' },
      { id: 'sc-1m-10', number: 0, questionText: 'ಪ್ರಾಣಿ ಮೂಲದ ಒಂದು ನಾರನ್ನು ಹೆಸರಿಸಿ.', lessonName: 'ನಾರುಗಳಿಂದ ಬಟ್ಟೆ', marks: 1, answer: 'ಉಣ್ಣೆ / ರೇಷ್ಮೆ' },
      { id: 'sc-1m-11', number: 0, questionText: 'ಮಾನವನ ದೇಹದಲ್ಲಿರುವ ಒಟ್ಟು ಮೂಳೆಗಳ ಸಂಖ್ಯೆ ಎಷ್ಟು?', lessonName: 'ದೇಹದ ಚಲನೆಗಳು', marks: 1, answer: '206' },
      { id: 'sc-1m-12', number: 0, questionText: 'ವಿಟಮಿನ್ ‘ಎ’ ಕೊರತೆಯಿಂದ ಬರುವ ದೃಷ್ಟಿದೋಷ ಯಾವುದು?', lessonName: 'ಆಹಾರದ ಘಟಕಗಳು', marks: 1, answer: 'ಇರುಳುಗಣ್ಣು ರೋಗ (Night blindness)' },
      { id: 'sc-1m-13', number: 0, questionText: 'ವಿದ್ಯುತ್ ನಿರೋಧಕ ವಸ್ತುವಿಗೆ ಒಂದು ಉದಾಹರಣೆ ಕೊಡಿ.', lessonName: 'ವಿದ್ಯುತ್ ಮತ್ತು ಮಂಡಲಗಳು', marks: 1, answer: 'ಪ್ಲಾಸ್ಟಿಕ್ / ರಬ್ಬರ್ / ಮರ' },
      { id: 'sc-1m-14', number: 0, questionText: 'ನೀರಿನ ಕುದಿಯುವ ಬಿಂದು ಎಷ್ಟು?', lessonName: 'ಸಾಮಗ್ರಿಗಳು', marks: 1, answer: '100° C' },
      { id: 'sc-1m-15', number: 0, questionText: 'ಸಸ್ಯಗಳ ಉಸಿರಾಟದಲ್ಲಿ ಯಾವ ಅನಿಲವು ಬಿಡುಗಡೆಯಾಗುತ್ತದೆ?', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 1, answer: 'ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್' },
      { id: 'sc-1m-16', number: 0, questionText: 'ಭೂಮಿಯ ನೈಸರ್ಗಿಕ ಉಪಗ್ರಹ ಯಾವುದು?', lessonName: 'ಬಾಹ್ಯಾಕಾಶ', marks: 1, answer: 'ಚಂದ್ರ' },
      { id: 'sc-1m-17', number: 0, questionText: 'ಹಸಿರು ಸಸ್ಯಗಳಲ್ಲಿರುವ ಹಸಿರು ವರ್ಣಕದ ಹೆಸರೇನು?', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 1, answer: 'ಪತ್ರಹರಿತ್ತು (Chlorophyll)' },
      { id: 'sc-1m-18', number: 0, questionText: 'ಗಾಳಿಯಲ್ಲಿ ಅತ್ಯಧಿಕ ಪ್ರಮಾಣದಲ್ಲಿರುವ ಅನಿಲ ಯಾವುದು?', lessonName: 'ನಮ್ಮ ಸುತ್ತಲಿನ ಗಾಳಿ', marks: 1, answer: 'ಸಾರಜನಕ (Nitrogen - 78%)' },
      { id: 'sc-1m-19', number: 0, questionText: 'ಬೆಳಕಿನ ವೇಗ ಎಷ್ಟು?', lessonName: 'ಬೆಳಕು ಮತ್ತು ನೆರಳು', marks: 1, answer: 'ಸೆಕೆಂಡಿಗೆ 3 ಲಕ್ಷ ಕಿಲೋಮೀಟರ್' },
      { id: 'sc-1m-20', number: 0, questionText: 'ಆಹಾರದಲ್ಲಿ ಪಿಷ್ಟ (Starch) ಪರೀಕ್ಷಿಸಲು ಯಾವ ದ್ರಾವಣ ಬಳಸುತ್ತಾರೆ?', lessonName: 'ಆಹಾರದ ಘಟಕಗಳು', marks: 1, answer: 'ಅಯೋಡಿನ್ ದ್ರಾವಣ' },
    ],
    twoMark: [
      { id: 'sc-2m-1', number: 0, questionText: 'ತಾಯಿಬೇರು ಮತ್ತು ನಾರುಬೇರುಗಳ ನಡುವಿನ ಎರಡು ಮುಖ್ಯ ವ್ಯತ್ಯಾಸಗಳನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 2, answer: 'ತಾಯಿಬೇರು: ಒಂದು ಮುಖ್ಯ ಬೇರಿದ್ದು ಪಾರ್ಶ್ವ ಬೇರುಗಳಿರುತ್ತವೆ. ನಾರುಬೇರು: ಕಾಂಡದ ಬುಡದಿಂದ ಗುಂಪಾಗಿ ಹೊರಡುತ್ತವೆ.' },
      { id: 'sc-2m-2', number: 0, questionText: 'ಪಾರದರ್ಶಕ ಮತ್ತು ಅಪಾರದರ್ಶಕ ವಸ್ತುಗಳು ಎಂದರೇನು? ಉದಾಹರಣೆ ಕೊಡಿ.', lessonName: 'ಸಾಮಗ್ರಿಗಳು', marks: 2, answer: 'ಪಾರದರ್ಶಕ: ಬೆಳಕನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಹಾದುಹೋಗಲು ಬಿಡುತ್ತವೆ (ಗಾಜು). ಅಪಾರದರ್ಶಕ: ಬೆಳಕನ್ನು ತಡೆಯುತ್ತವೆ (ಮರ).' },
      { id: 'sc-2m-3', number: 0, questionText: 'ಕಾಂತದ ರಕ್ಷಣೆಗಾಗಿ ತೆಗೆದುಕೊಳ್ಳಬೇಕಾದ ಎರಡು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ಕಾಂತಗಳು', marks: 2, answer: '1) ಬಿಸಿ ಮಾಡಬಾರದು, 2) ಎತ್ತರದಿಂದ ಕೆಳಗೆ ಬೀಳಿಸಬಾರದು ಅಥವಾ ಬಡಿಯಬಾರದು.' },
      { id: 'sc-2m-4', number: 0, questionText: 'ಸಮತೋಲನ ಆಹಾರ ಎಂದರೇನು? ನಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ಇದು ಏಕೆ ಮುಖ್ಯ?', lessonName: 'ಮನದುಂಬಿದ ಊಟ', marks: 2, answer: 'ದೇಹಕ್ಕೆ ಬೇಕಾದ ಎಲ್ಲಾ ಪೋಷಕಾಂಶಗಳನ್ನು ಸರಿಯಾದ ಪ್ರಮಾಣದಲ್ಲಿ ಒಳಗೊಂಡಿರುವ ಆಹಾರ.' },
      { id: 'sc-2m-5', number: 0, questionText: 'ಸಸ್ಯಗಳಲ್ಲಿ ಕಾಂಡದ ಎರಡು ಮುಖ್ಯ ಕಾರ್ಯಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 2, answer: '1) ಸಸ್ಯಕ್ಕೆ ಆಧಾರ ನೀಡುತ್ತದೆ, 2) ನೀರು ಮತ್ತು ಪೋಷಕಾಂಶಗಳನ್ನು ಎಲೆಗಳಿಗೆ ಸಾಗಿಸುತ್ತದೆ.' },
      { id: 'sc-2m-6', number: 0, questionText: 'ವಿದ್ಯುತ್ ಕೋಶದಲ್ಲಿ ಎಷ್ಟು ಟರ್ಮಿನಲ್‌ಗಳಿರುತ್ತವೆ? ಅವುಗಳನ್ನು ಹೆಸರಿಸಿ.', lessonName: 'ವಿದ್ಯುತ್ ಮತ್ತು ಮಂಡಲಗಳು', marks: 2, answer: 'ಎರಡು ಟರ್ಮಿನಲ್‌ಗಳು: ಧನ (+) ಮತ್ತು ಋಣ (-) ಟರ್ಮಿನಲ್.' },
      { id: 'sc-2m-7', number: 0, questionText: 'ಘರ್ಷಣೆ ಬಲ ಎಂದರೇನು? ಒಂದು ಉದಾಹರಣೆ ನೀಡಿ.', lessonName: 'ಚಲನೆ ಮತ್ತು ಅಳತೆ', marks: 2, answer: 'ಎರಡು ಮೇಲ್ಮೈಗಳ ನಡುವಿನ ಸಾಪೇಕ್ಷ ಚಲನೆಯನ್ನು ವಿರೋಧಿಸುವ ಬಲ. ಉದಾ: ನೆಲದ ಮೇಲೆ ಉರುಳುವ ಚೆಂಡು ನಿಲ್ಲುವುದು.' },
      { id: 'sc-2m-8', number: 0, questionText: 'ಭಾಷ್ಪೀಭವನ ಮತ್ತು ಸಾಂದ್ರೀಕರಣಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ ತಿಳಿಸಿ.', lessonName: 'ನೀರು', marks: 2, answer: 'ಭಾಷ್ಪೀಭವನ: ನೀರು ಹಬೆಯಾಗುವುದು. ಸಾಂದ್ರೀಕರಣ: ಹಬೆ ತಂಪಾಗಿ ನೀರಾಗುವುದು.' },
    ],
    fourMark: [
      { id: 'sc-4m-1', number: 0, questionText: 'ಒಂದು ಸಸ್ಯದ ಹೂವಿನ ಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ ಮತ್ತು ಅವುಗಳ ಕಾರ್ಯಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ', marks: 4, answer: 'ಪುಷ್ಪಪಾತ್ರೆ (ರಕ್ಷಣೆ), ದಳಗಳು (ಕೀಟ ಆಕರ್ಷಣೆ), ಕೇಸರ (ಗಂಡು ಜನನಾಂಗ), ಶಲಾಕೆ (ಹೆಣ್ಣು ಜನನಾಂಗ).' },
      { id: 'sc-4m-2', number: 0, questionText: 'ಕಾಂತಸೂಚಿಯ (Magnetic Compass) ರಚನೆ ಮತ್ತು ಉಪಯೋಗಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಕಾಂತಗಳ ಅನ್ವೇಷಣೆ', marks: 4, answer: 'ಕಾಂತಸೂಚಿಯು ಮುಕ್ತವಾಗಿ ಚಲಿಸುವ ಕಾಂತೀಯ ಸೂಚಿ ಹೊಂದಿರುತ್ತದೆ. ಇದು ಯಾವಾಗಲೂ ಉತ್ತರ-ದಕ್ಷಿಣ ದಿಕ್ಕನ್ನು ಸೂಚಿಸುತ್ತದೆ. ನಾವಿಕರು ದಿಕ್ಕು ತಿಳಿಯಲು ಬಳಸುತ್ತಾರೆ.' },
      { id: 'sc-4m-3', number: 0, questionText: 'ಆಹಾರದಲ್ಲಿರುವ ಕಾರ್ಬೋಹೈಡ್ರೇಟ್ ಮತ್ತು ಪ್ರೋಟೀನ್‌ಗಳ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಆಹಾರದ ಘಟಕಗಳು', marks: 4, answer: 'ಕಾರ್ಬೋಹೈಡ್ರೇಟ್ ದೇಹಕ್ಕೆ ತ್ವರಿತ ಶಕ್ತಿ ನೀಡುತ್ತದೆ. ಪ್ರೋಟೀನ್‌ಗಳು ದೇಹದ ಬೆಳವಣಿಗೆ ಮತ್ತು ಅಂಗಾಂಶಗಳ ದುರಸ್ತಿಗೆ ಅತ್ಯಗತ್ಯವಾಗಿವೆ.' },
      { id: 'sc-4m-4', number: 0, questionText: 'ಒಂದು ಸರಳ ವಿದ್ಯುತ್ ಮಂಡಲದ ಚಿತ್ರ ಬರೆದು ಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ.', lessonName: 'ವಿದ್ಯುತ್ ಮತ್ತು ಮಂಡಲಗಳು', marks: 4, answer: 'ವಿದ್ಯುತ್ ಕೋಶ, ಬಲ್ಬ್, ಸ್ವಿಚ್ ಮತ್ತು ವಾಹಕ ತಂತಿಗಳ ಜೋಡಣೆ.' },
      { id: 'sc-4m-5', number: 0, questionText: 'ಜಲಚಕ್ರದ (Water Cycle) ಪ್ರಮುಖ ಹಂತಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ನೀರು', marks: 4, answer: 'ಸೂರ್ಯನ ಶಾಖದಿಂದ ಬಾಷ್ಪೀಭವನ, ಮೋಡಗಳ ರಚನೆ (ಸಾಂದ್ರೀಕರಣ), ಮಳೆಯಾಗಿ ಭೂಮಿಗೆ ಇಳಿಯುವುದು ಮತ್ತು ನದಿ-ಸಮುದ್ರ ಸೇರುವುದು.' },
    ],
  },
  social: {
    oneMark: [
      { id: 'so-1m-1', number: 0, questionText: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಎತ್ತರವಾದ ಶಿಖರ ಯಾವುದು?', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 1, answer: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ' },
      { id: 'so-1m-2', number: 0, questionText: 'ಸಿಂಧೂ ನಾಗರಿಕತೆಯ ಪ್ರಸಿದ್ಧ ಬಂದರು ನಗರ ಯಾವುದು?', lessonName: 'ಪ್ರಾಚೀನ ಸಿಂಧೂ ನಾಗರಿಕತೆ', marks: 1, answer: 'ಲೋಥಾಲ್' },
      { id: 'so-1m-3', number: 0, questionText: 'ಇತಿಹಾಸದ ಪಿತಾಮಹ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ?', lessonName: 'ಇತಿಹಾಸ ಪರಿಚಯ', marks: 1, answer: 'ಹೆರೋಡೋಟಸ್' },
      { id: 'so-1m-4', number: 0, questionText: 'ಭಾರತದ ಸಂವಿಧಾನ ಶಿಲ್ಪಿ ಯಾರು?', lessonName: 'ಪೌರನೀತಿ', marks: 1, answer: 'ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್' },
      { id: 'so-1m-5', number: 0, questionText: 'ಗ್ಲೋಬ್ ಎಂದರೆ ಏನು?', lessonName: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು', marks: 1, answer: 'ಭೂಮಿಯ ಕರಾರುವಾಕ್ಕಾದ ತ್ರಿಪರಿಮಾಣ ಮಾದರಿ.' },
      { id: 'so-1m-6', number: 0, questionText: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ನದಿ ಕಾವೇರಿ ಎಲ್ಲಿ ಹುಟ್ಟುತ್ತದೆ?', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 1, answer: 'ತಲಕಾವೇರಿ (ಕೊಡಗು)' },
      { id: 'so-1m-7', number: 0, questionText: 'ಅಶೋಕ ಚಕ್ರವರ್ತಿಯು ಯಾವ ಯುದ್ಧದ ನಂತರ ಬೌದ್ಧ ಧರ್ಮ ಸ್ವೀಕರಿಸಿದನು?', lessonName: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ', marks: 1, answer: 'ಕಳಿಂಗ ಯುದ್ಧ' },
      { id: 'so-1m-8', number: 0, questionText: 'ಭಾರತದ ರಾಷ್ಟ್ರಪತಿಗಳ ಅಧಿಕಾರಾವಧಿ ಎಷ್ಟು ವರ್ಷ?', lessonName: 'ನಮ್ಮ ಸಂವಿಧಾನ', marks: 1, answer: '5 ವರ್ಷಗಳು' },
      { id: 'so-1m-9', number: 0, questionText: 'ಸೌರವ್ಯೂಹದ ಅತಿ ದೊಡ್ಡ ಗ್ರಹ ಯಾವುದು?', lessonName: 'ಸೌರವ್ಯೂಹ', marks: 1, answer: 'ಗುರು (Jupiter)' },
      { id: 'so-1m-10', number: 0, questionText: 'ವಿಶ್ವ ಪರಿಸರ ದಿನವನ್ನು ಯಾವಾಗ ಆಚರಿಸಲಾಗುತ್ತದೆ?', lessonName: 'ಪರಿಸರ', marks: 1, answer: 'ಜೂನ್ 5' },
      { id: 'so-1m-11', number: 0, questionText: 'ಭಾರತದ ಮೊದಲ ಪ್ರಧಾನ ಮಂತ್ರಿ ಯಾರು?', lessonName: 'ನಮ್ಮ ಭಾರತ', marks: 1, answer: 'ಪಂಡಿತ್ ಜವಾಹರಲಾಲ್ ನೆಹರು' },
      { id: 'so-1m-12', number: 0, questionText: 'ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು?', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 1, answer: 'ಬೆಂಗಳೂರು' },
      { id: 'so-1m-13', number: 0, questionText: 'ಭೂಮಧ್ಯ ರೇಖೆಯ ಅಕ್ಷಾಂಶ ಎಷ್ಟು ಡಿಗ್ರಿ?', lessonName: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು', marks: 1, answer: '0° ಅಕ್ಷಾಂಶ' },
      { id: 'so-1m-14', number: 0, questionText: 'ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ ಮುಖ್ಯಸ್ಥರನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?', lessonName: 'ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳು', marks: 1, answer: 'ಅಧ್ಯಕ್ಷರು' },
      { id: 'so-1m-15', number: 0, questionText: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯೋತ್ಸವ ದಿನ ಯಾವಾಗ?', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 1, answer: 'ನವೆಂಬರ್ 1' },
      { id: 'so-1m-16', number: 0, questionText: 'ಭಾರತದ ಅತ್ಯುನ್ನತ ನ್ಯಾಯಾಲಯ ಯಾವುದು?', lessonName: 'ನ್ಯಾಯಾಂಗ', marks: 1, answer: 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್ (ಸರ್ವೋಚ್ಚ ನ್ಯಾಯಾಲಯ)' },
      { id: 'so-1m-17', number: 0, questionText: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯದ ಸ್ಥಾಪಕ ಯಾರು?', lessonName: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ', marks: 1, answer: 'ಚಂದ್ರಗುಪ್ತ ಮೌರ್ಯ' },
      { id: 'so-1m-18', number: 0, questionText: 'ಭೂಮಿಯ ಮೇಲೆ ಎಷ್ಟು ಖಂಡಗಳಿವೆ?', lessonName: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು', marks: 1, answer: '7 ಖಂಡಗಳು' },
      { id: 'so-1m-19', number: 0, questionText: 'ವಿಶ್ವದಲ್ಲೇ ಅತಿ ದೊಡ್ಡ ಸಾಗರ ಯಾವುದು?', lessonName: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು', marks: 1, answer: 'ಪೆಸಿಫಿಕ್ ಸಾಗರ' },
      { id: 'so-1m-20', number: 0, questionText: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಪ್ರಾಣಿ ಯಾವುದು?', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 1, answer: 'ಆನೆ' },
    ],
    twoMark: [
      { id: 'so-2m-1', number: 0, questionText: 'ಕರ್ನಾಟಕದ ನಾಲ್ಕು ಕಂದಾಯ ವಿಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ.', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 2, answer: 'ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಬೆಳಗಾವಿ ಮತ್ತು ಕಲಬುರಗಿ.' },
      { id: 'so-2m-2', number: 0, questionText: 'ಐತಿಹಾಸಿಕ ಆಧಾರಗಳ ಎರಡು ಮುಖ್ಯ ವಿಧಗಳು ಯಾವುವು?', lessonName: 'ಇತಿಹಾಸ ಪರಿಚಯ', marks: 2, answer: '1) ಸಾಹಿತ್ಯಕ ಆಧಾರಗಳು, 2) ಪುರಾತತ್ತ್ವ ಆಧಾರಗಳು.' },
      { id: 'so-2m-3', number: 0, questionText: 'ಕುಟುಂಬದಿಂದ ಮಕ್ಕಳು ಕಲಿಯುವ ಎರಡು ಮುಖ್ಯ ಮೌಲ್ಯಗಳಾವುವು?', lessonName: 'ಕುಟುಂಬ ಮತ್ತು ಸಮಾಜ', marks: 2, answer: 'ಪ್ರೀತಿ, ಸಹಕಾರ, ಹಿರಿಯರಿಗೆ ಗೌರವ ಮತ್ತು ಶಿಸ್ತು.' },
      { id: 'so-2m-4', number: 0, questionText: 'ಸಿಂಧೂ ಬಯಲಿನ ನಾಗರಿಕತೆಯ ನಗರಾಡಳಿತದ ಎರಡು ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಪ್ರಾಚೀನ ಸಿಂಧೂ ನಾಗರಿಕತೆ', marks: 2, answer: '1) ಸುಸಜ್ಜಿತ ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆ, 2) ವಿಶಾಲವಾದ ನೇರ ರಸ್ತೆಗಳು.' },
      { id: 'so-2m-5', number: 0, questionText: 'ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ ತಿಳಿಸಿ.', lessonName: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು', marks: 2, answer: 'ಅಕ್ಷಾಂಶ: ಪೂರ್ವ-ಪಶ್ಚಿಮವಾಗಿ ಎಳೆಯಲಾದ ಕಾಲ್ಪನಿಕ ರೇಖೆಗಳು. ರೇಖಾಂಶ: ಉತ್ತರ-ದಕ್ಷಿಣವಾಗಿ ಎಳೆಯಲಾದ ರೇಖೆಗಳು.' },
      { id: 'so-2m-6', number: 0, questionText: 'ಗ್ರಾಮ ಪಂಚಾಯಿತಿಯ ಯಾವುದಾದರೂ ಎರಡು ಮುಖ್ಯ ಕಾರ್ಯಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳು', marks: 2, answer: '1) ಕುಡಿಯುವ ನೀರಿನ ಪೂರೈಕೆ, 2) ಬೀದಿ ದೀಪ ಮತ್ತು ನೈರ್ಮಲ್ಯ ರಕ್ಷಣೆ.' },
      { id: 'so-2m-7', number: 0, questionText: 'ಶಿಲಾಯುಗವನ್ನು ಯಾವ ಮೂರು ಕಾಲಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗಿದೆ?', lessonName: 'ಇತಿಹಾಸದ ಆರಂಭ', marks: 2, answer: 'ಹಳೆ ಶಿಲಾಯುಗ, ಮಧ್ಯ ಶಿಲಾಯುಗ ಮತ್ತು ನವ ಶಿಲಾಯುಗ.' },
      { id: 'so-2m-8', number: 0, questionText: 'ಭಾರತದ ರಾಷ್ಟ್ರಧ್ವಜದಲ್ಲಿರುವ ಮೂರು ಬಣ್ಣಗಳು ಮತ್ತು ಅವುಗಳ ಸಂಕೇತ ತಿಳಿಸಿ.', lessonName: 'ರಾಷ್ಟ್ರೀಯ ಲಾಂಛನಗಳು', marks: 2, answer: 'ಕೇಸರಿ: ತ್ಯಾಗ ಮತ್ತು ಧೈರ್ಯ, ಬಿಳಿ: ಶಾಂತಿ ಮತ್ತು ಸತ್ಯ, ಹಸಿರು: ಸಮೃದ್ಧಿ.' },
    ],
    fourMark: [
      { id: 'so-4m-1', number: 0, questionText: 'ಗೌತಮ ಬುದ್ಧನ ನಾಲ್ಕು ಆರ್ಯ ಸತ್ಯಗಳು ಮತ್ತು ಬೋಧನೆಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಬೌದ್ಧ ಧರ್ಮದ ಉದಯ', marks: 4, answer: 'ಪ್ರಪಂಚ ದುಃಖಮಯವಾಗಿದೆ, ಆಸೆಯೇ ದುಃಖಕ್ಕೆ ಮೂಲ, ಆಸೆ ತ್ಯಜಿಸಿದರೆ ಮುಕ್ತಿ, ಅಷ್ಟಾಂಗ ಮಾರ್ಗ ಪಾಲನೆ.' },
      { id: 'so-4m-2', number: 0, questionText: 'ಸಿಂಧೂ ಬಯಲಿನ ನಾಗರಿಕತೆಯ ನಗರ ಯೋಜನೆಯ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ.', lessonName: 'ಪ್ರಾಚೀನ ಸಿಂಧೂ ನಾಗರಿಕತೆ', marks: 4, answer: 'ನೇರವಾದ ವಿಶಾಲ ರಸ್ತೆಗಳು, ಸುಟ್ಟ ಇಟ್ಟಿಗೆಗಳ ಮನೆಗಳು, ಮುಚ್ಚಿದ ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಮೊಹೆಂಜೋದಾರೋದ ಬೃಹತ್ ಸ್ನಾನಗೃಹ.' },
      { id: 'so-4m-3', number: 0, questionText: 'ಕರ್ನಾಟಕದ ಪ್ರಾಕೃತಿಕ ವಿಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ, ಕರಾವಳಿ ತೀರದ ಮಹತ್ವವನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ನಮ್ಮ ಕರ್ನಾಟಕ', marks: 4, answer: 'ಕರಾವಳಿ ತೀರ, ಮಲೆನಾಡು ಮತ್ತು ಮೈದಾನ ಪ್ರದೇಶ. ಕರಾವಳಿಯು ಮೀನುಗಾರಿಕೆ, ಬಂದರು ವ್ಯಾಪಾರ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮಕ್ಕೆ ಪ್ರಸಿದ್ಧ.' },
      { id: 'so-4m-4', number: 0, questionText: 'ಭಾರತದ ಸಂವಿಧಾನ ನಮಗೆ ನೀಡಿರುವ ಮೂಲಭೂತ ಹಕ್ಕುಗಳು ಯಾವುವು?', lessonName: 'ನಮ್ಮ ಸಂವಿಧಾನ', marks: 4, answer: 'ಸಮಾನತೆಯ ಹಕ್ಕು, ಸ್ವಾತಂತ್ರ್ಯದ ಹಕ್ಕು, ಧಾರ್ಮಿಕ ಸ್ವಾತಂತ್ರ್ಯದ ಹಕ್ಕು, ಶೋಷಣೆಯ ವಿರುದ್ಧ ಹಕ್ಕು, ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ಶಿಕ್ಷಣದ ಹಕ್ಕು, ಸಂವಿಧಾನಾತ್ಮಕ ಪರಿಹಾರದ ಹಕ್ಕು.' },
      { id: 'so-4m-5', number: 0, questionText: 'ಅಶೋಕ ಚಕ್ರವರ್ತಿಯ ಆಡಳಿತ ಸುಧಾರಣೆಗಳು ಮತ್ತು ಧರ್ಮ ಪ್ರಚಾರದ ಕುರಿತು ಬರೆಯಿರಿ.', lessonName: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ', marks: 4, answer: 'ಕಳಿಂಗ ಯುದ್ಧದ ನಂತರ ಯುದ್ಧ ತ್ಯಜಿಸಿ ಶಾಂತಿ ಮಾರ್ಗ ಹಿಡಿದನು. ಧರ್ಮ ಮಹಾಮಾತ್ರರನ್ನು ನೇಮಿಸಿ ಬೌದ್ಧ ಧರ್ಮವನ್ನು ವಿಶ್ವದಾದ್ಯಂತ ಪ್ರಚಾರ ಮಾಡಿದನು. ಶಿಲಾಶಾಸನಗಳನ್ನು ಕೆತ್ತಿಸಿದನು.' },
    ],
  },
  value_education: {
    oneMark: [
      { id: 've-1m-1', number: 0, questionText: '“ಸತ್ಯಮೇವ ಜಯತೇ” ಎಂಬ ಸೂಕ್ತಿಯ ಅರ್ಥವೇನು?', lessonName: 'ಸತ್ಯತೆ', marks: 1, answer: 'ಸತ್ಯವೇ ಯಾವಾಗಲೂ ಜಯಗಳಿಸುತ್ತದೆ.' },
      { id: 've-1m-2', number: 0, questionText: 'ಸಮಯಪಾಲನೆ ಎಂದರೇನು?', lessonName: 'ಸಮಯ ನಿರ್ವಹಣೆ', marks: 1, answer: 'ಕಾರ್ಯಗಳನ್ನು ನಿಗದಿತ ವೇಳೆಯಲ್ಲಿ ನಿಷ್ಠೆಯಿಂದ ನಿರ್ವಹಿಸುವುದು.' },
      { id: 've-1m-3', number: 0, questionText: 'ಪ್ರಾಮಾಣಿಕತೆ ಎಂದರೇನು?', lessonName: 'ಪ್ರಾಮಾಣಿಕತೆ', marks: 1, answer: 'ಯಾವುದೇ ಆಮಿಷಕ್ಕೆ ಒಳಗಾಗದೆ ಸದಾ ಸತ್ಯ ಮತ್ತು ನ್ಯಾಯದ ಹಾದಿಯಲ್ಲಿ ನಡೆಯುವುದು.' },
      { id: 've-1m-4', number: 0, questionText: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಶಿಸ್ತು ಏಕೆ ಮುಖ್ಯ?', lessonName: 'ಶಿಸ್ತು', marks: 1, answer: 'ಉತ್ತಮ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ಜೀವನದಲ್ಲಿ ಯಶಸ್ಸು ಸಾಧಿಸಲು.' },
      { id: 've-1m-5', number: 0, questionText: 'ಪರಿಸರ ಸಂರಕ್ಷಣೆಯಲ್ಲಿ ನಮ್ಮ ಮುಖ್ಯ ಕರ್ತವ್ಯವೇನು?', lessonName: 'ಪರಿಸರ ಪ್ರೇಮ', marks: 1, answer: 'ಗಿಡಮರಗಳನ್ನು ನೆಡುವುದು ಮತ್ತು ಸ್ವಚ್ಛತೆ ಕಾಪಾಡುವುದು.' },
      { id: 've-1m-6', number: 0, questionText: 'ಸಹಾನುಭೂತಿ ಎಂದರೇನು?', lessonName: 'ದಯೆ ಮತ್ತು ಕರುಣೆ', marks: 1, answer: 'ಇತರರ ಕಷ್ಟಗಳನ್ನು ತನ್ನ ಕಷ್ಟವೆಂದು ಭಾವಿಸಿ ಸ್ಪಂದಿಸುವುದು.' },
      { id: 've-1m-7', number: 0, questionText: 'ಕೃತಜ್ಞತೆ ಎಂದರೇನು?', lessonName: 'ಸದ್ಗುಣಗಳು', marks: 1, answer: 'ನಮಗೆ ಸಹಾಯ ಮಾಡಿದವರ ಉಪಕಾರವನ್ನು ಸದಾ ಸ್ಮರಿಸುವುದು.' },
      { id: 've-1m-8', number: 0, questionText: 'ದೇಶಪ್ರೇಮ ಎಂದರೇನು?', lessonName: 'ದೇಶಭಕ್ತಿ', marks: 1, answer: 'ನಮ್ಮ ಮಾತೃಭೂಮಿ ಮತ್ತು ನಾಡಿನ ಸಂಸ್ಕೃತಿಯನ್ನು ಪ್ರೀತಿಸಿ ಗೌರವಿಸುವುದು.' },
      { id: 've-1m-9', number: 0, questionText: 'ಅಹಿಂಸೆ ಎಂದರೇನು?', lessonName: 'ಶಾಂತಿ', marks: 1, answer: 'ಮನಸ್ಸು, ಮಾತು ಮತ್ತು ಕೃತಿಯಿಂದ ಯಾರಿಗೂ ನೋವುಂಟು ಮಾಡದಿರುವುದು.' },
      { id: 've-1m-10', number: 0, questionText: 'ಗುರುಗಳನ್ನು ಗೌರವಿಸುವುದು ಏಕೆ ಮುಖ್ಯ?', lessonName: 'ಗುರುಭಕ್ತಿ', marks: 1, answer: 'ಗುರುಗಳು ನಮಗೆ ಜ್ಞಾನ ಮತ್ತು ಸನ್ಮಾರ್ಗ ತೋರುವ ಮಾರ್ಗದರ್ಶಕರು.' },
      { id: 've-1m-11', number: 0, questionText: 'ಸ್ವಾವಲಂಬನೆ ಎಂದರೇನು?', lessonName: 'ಸ್ವಾವಲಂಬನೆ', marks: 1, answer: 'ತನ್ನ ಕೆಲಸಗಳನ್ನು ತಾನೇ ಶ್ರದ್ಧೆಯಿಂದ ನಿರ್ವಹಿಸುವುದು.' },
      { id: 've-1m-12', number: 0, questionText: 'ಸಹನೆ (ತಾಳ್ಮೆ) ಗುಣದಿಂದ ದೊರೆಯುವ ಲಾಭವೇನು?', lessonName: 'ಸದ್ಗುಣಗಳು', marks: 1, answer: 'ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ವಿವಾದಗಳಿಂದ ಮುಕ್ತಿ.' },
      { id: 've-1m-13', number: 0, questionText: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪ್ರಾರ್ಥನೆಯಿಂದಾಗುವ ಪ್ರಯೋಜನವೇನು?', lessonName: 'ಪ್ರಾರ್ಥನೆ', marks: 1, answer: 'ಏಕಾಗ್ರತೆ ಮತ್ತು ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಹೆಚ್ಚುತ್ತದೆ.' },
      { id: 've-1m-14', number: 0, questionText: 'ಸ್ವಚ್ಛತೆಯು ಯಾವುದಕ್ಕೆ ಸಮಾನವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ?', lessonName: 'ಸ್ವಚ್ಛತೆ', marks: 1, answer: 'ಸ್ವಚ್ಛತೆಯೇ ದೈವತ್ವಕ್ಕೆ ಸಮಾನ.' },
      { id: 've-1m-15', number: 0, questionText: 'ಆತ್ಮವಿಶ್ವಾಸ ಎಂದರೇನು?', lessonName: 'ವ್ಯಕ್ತಿತ್ವ ವಿಕಸನ', marks: 1, answer: 'ತನ್ನ ಸಾಮರ್ಥ್ಯದ ಮೇಲೆ ತನಗಿರುವ ಅಚಲ ನಂಬಿಕೆ.' },
      { id: 've-1m-16', number: 0, questionText: '‘ಕಾಯಕವೇ ಕೈಲಾಸ’ ಎಂದವರು ಯಾರು?', lessonName: 'ಕಾಯಕ ನಿಷ್ಠೆ', marks: 1, answer: 'ಬಸವಣ್ಣನವರು' },
      { id: 've-1m-17', number: 0, questionText: 'ಹಿರಿಯರಿಗೆ ಸಹಾಯ ಮಾಡುವುದು ಯಾವ ಮೌಲ್ಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ?', lessonName: 'ಸಂಸ್ಕಾರ', marks: 1, answer: 'ಗೌರವ ಮತ್ತು ಮಾನವೀಯತೆ.' },
      { id: 've-1m-18', number: 0, questionText: 'ಕೋಪವನ್ನು ನಿಯಂತ್ರಿಸಲು ಏನು ಮಾಡಬೇಕು?', lessonName: 'ಮನಶ್ಶಾಂತಿ', marks: 1, answer: 'ದೀರ್ಘ ಉಸಿರಾಟ ಮತ್ತು ಮೌನ ತಾಳುವುದು.' },
      { id: 've-1m-19', number: 0, questionText: 'ಸಹಕಾರ ಎಂದರೇನು?', lessonName: 'ಸಹಕಾರ', marks: 1, answer: 'ಒಂದು ಒಳ್ಳೆಯ ಗುರಿಗಾಗಿ ಒಟ್ಟಾಗಿ ಕೆಲಸ ಮಾಡುವುದು.' },
      { id: 've-1m-20', number: 0, questionText: '“ವಿದ್ಯಾದಾನ ಶ್ರೇಷ್ಠದಾನ” ಏಕೆ?', lessonName: 'ದಾನ ಗುಣ', marks: 1, answer: 'ವಿದ್ಯೆಯು ವ್ಯಕ್ತಿಯ ಜೀವನವನ್ನು ಬೆಳಗಿಸುತ್ತದೆ ಮತ್ತು ಎಂದೂ ನಶಿಸುವುದಿಲ್ಲ.' },
    ],
    twoMark: [
      { id: 've-2m-1', number: 0, questionText: 'ಗುರುಹಿರಿಯರಿಗೆ ಗೌರವ ಸಲ್ಲಿಸುವುದು ನಮ್ಮ ಸಂಸ್ಕೃತಿಯಲ್ಲಿ ಏಕೆ ಮುಖ್ಯ?', lessonName: 'ಗುರುಹಿರಿಯರಿಗೆ ಗೌರವ', marks: 2, answer: 'ಗುರುಹಿರಿಯರ ಆಶೀರ್ವಾದ, ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಅನುಭವಗಳು ನಮ್ಮ ಸನ್ಮಾರ್ಗಕ್ಕೆ ದಾರಿದೀಪವಾಗಿವೆ.' },
      { id: 've-2m-2', number: 0, questionText: 'ವೈಯಕ್ತಿಕ ನೈರ್ಮಲ್ಯ ಮತ್ತು ಪರಿಸರ ಸ್ವಚ್ಛತೆಯ ಎರಡು ನಿಯಮಗಳನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಸ್ವಚ್ಛತೆ ಮತ್ತು ಆರೋಗ್ಯ', marks: 2, answer: '1) ಪ್ರತಿದಿನ ಸ್ನಾನ ಮತ್ತು ಹಲ್ಲುಜ್ಜುವುದು, 2) ತ್ಯಾಜ್ಯವನ್ನು ಕಸದ ಬುಟ್ಟಿಗೆ ಹಾಕುವುದು.' },
      { id: 've-2m-3', number: 0, questionText: 'ಉತ್ತಮ ಸ್ನೇಹಿತನಲ್ಲಿ ಇರಬೇಕಾದ ಎರಡು ಮುಖ್ಯ ಗುಣಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ಸ್ನೇಹ ಮತ್ತು ಸಹಕಾರ', marks: 2, answer: '1) ಕಷ್ಟದಲ್ಲಿ ಸಹಾಯ ಮಾಡುವುದು, 2) ತಪ್ಪು ಮಾಡಿದಾಗ ತಿದ್ದಿ ಸನ್ಮಾರ್ಗ ತೋರುವುದು.' },
      { id: 've-2m-4', number: 0, questionText: 'ಕೋಪವನ್ನು ನಿಯಂತ್ರಿಸಲು ಎರಡು ಉಪಾಯಗಳನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಮನಸ್ಸಿನ ಶಾಂತಿ', marks: 2, answer: '1) ದೀರ್ಘ ಉಸಿರಾಟ ಮಾಡುವುದು, 2) ಶಾಂತವಾಗಿ ಯೋಚಿಸಿ ಪ್ರತಿಕ್ರಿಯಿಸುವುದು.' },
      { id: 've-2m-5', number: 0, questionText: 'ಕಷ್ಟಪಟ್ಟು ದುಡಿಯುವುದರಿಂದ (ಪರಿಶ್ರಮ) ನಮಗೆ ದೊರೆಯುವ ಪ್ರಯೋಜನಗಳೇನು?', lessonName: 'ಪರಿಶ್ರಮ', marks: 2, answer: 'ಆತ್ಮವಿಶ್ವಾಸ ಹೆಚ್ಚುತ್ತದೆ ಮತ್ತು ಗುರಿ ತಲುಪಿ ಯಶಸ್ಸು ಸಾಧಿಸಬಹುದು.' },
      { id: 've-2m-6', number: 0, questionText: 'ಸಮಯ ನಿರ್ವಹಣೆಯ ಎರಡು ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳನ್ನು ತಿಳಿಸಿ.', lessonName: 'ಸಮಯ ನಿರ್ವಹಣೆ', marks: 2, answer: '1) ಕೆಲಸಗಳು ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಮುಗಿಯುತ್ತವೆ, 2) ಮಾನಸಿಕ ಒತ್ತಡ ಕಡಿಮೆಯಾಗುತ್ತದೆ.' },
      { id: 've-2m-7', number: 0, questionText: 'ಪ್ರಾಣಿ-ಪಕ್ಷಿಗಳಿಗೆ ನಾವು ಹೇಗೆ ಕರುಣೆ ತೋರಬಹುದು? ಎರಡು ಅಂಶಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ದಯೆ ಮತ್ತು ಕರುಣೆ', marks: 2, answer: '1) ಬೇಸಿಗೆಯಲ್ಲಿ ನೀರು ಮತ್ತು ಕಾಳು ಇಡುವುದು, 2) ಅವುಗಳನ್ನು ಹಿಂಸಿಸದಿರುವುದು.' },
      { id: 've-2m-8', number: 0, questionText: 'ಮನೆಯಲ್ಲಿ ಪೋಷಕರಿಗೆ ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ಎರಡು ಉದಾಹರಣೆ ನೀಡಿ.', lessonName: 'ಕುಟುಂಬ ಮೌಲ್ಯಗಳು', marks: 2, answer: '1) ತನ್ನ ಕೊಠಡಿ ಸ್ವಚ್ಛವಾಗಿಟ್ಟುಕೊಳ್ಳುವುದು, 2) ಚಿಕ್ಕಪುಟ್ಟ ಮನೆಗೆಲಸಗಳಲ್ಲಿ ನೆರವಾಗುವುದು.' },
    ],
    fourMark: [
      { id: 've-4m-1', number: 0, questionText: '“ಕಾಯಕವೇ ಕೈಲಾಸ” ಎಂಬ ತತ್ತ್ವವನ್ನು ವಿದ್ಯಾರ್ಥಿ ಜೀವನಕ್ಕೆ ಅನ್ವಯಿಸಿ ವಿವರಿಸಿ.', lessonName: 'ಕಾಯಕ ನಿಷ್ಠೆ', marks: 4, answer: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾಭ್ಯಾಸವೇ ಕಾಯಕ. ಶ್ರದ್ಧೆಯಿಂದ ಓದುವುದು, ನಿಯಮಿತ ಅಭ್ಯಾಸ ಮಾಡುವುದು ಮತ್ತು ಕಷ್ಟಪಟ್ಟು ಕಲಿಯುವುದೇ ನಿಜವಾದ ಪೂಜೆ.' },
      { id: 've-4m-2', number: 0, questionText: 'ಮಹಾಪುರುಷರ ಜೀವನದಿಂದ ನಾವು ಕಲಿಯಬೇಕಾದ ಪ್ರಮುಖ ನೈತಿಕ ಮೌಲ್ಯಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಮಹಾಪುರುಷರ ಜೀವನಾದರ್ಶಗಳು', marks: 4, answer: 'ಗಾಂಧೀಜಿಯವರ ಸತ್ಯ ಮತ್ತು ಅಹಿಂಸೆ, ಸ್ವಾಮಿ ವಿವೇಕಾನಂದರ ಧೈರ್ಯ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸ, ಡಾ. ಅಂಬೇಡ್ಕರ್ ಅವರ ಜ್ಞಾನದಾಹ ಮತ್ತು ಸಮಾನತೆಯ ತತ್ತ್ವಗಳು.' },
      { id: 've-4m-3', number: 0, questionText: 'ಶಾಲಾ ಪರಿಸರದಲ್ಲಿ ಸಹಕಾರ ಮತ್ತು ಸದ್ಭಾವನೆ ಬೆಳೆಸಿಕೊಳ್ಳಲು ನಾಲ್ಕು ನಿಯಮಗಳನ್ನು ಬರೆಯಿರಿ.', lessonName: 'ಸಹಕಾರ', marks: 4, answer: 'ಸಹಪಾಠಿಗಳೊಂದಿಗೆ ಒಡನಾಟ, ಪಠ್ಯ ಸಾಮಗ್ರಿಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು, ಎಲ್ಲರನ್ನೂ ಸಮಾನವಾಗಿ ಕಾಣುವುದು ಮತ್ತು ಶಿಕ್ಷಕರ ಮಾತನ್ನು ಪಾಲಿಸುವುದು.' },
      { id: 've-4m-4', number: 0, questionText: 'ಪರಿಸರ ಸಂರಕ್ಷಣೆಯಲ್ಲಿ ವಿದ್ಯಾರ್ಥಿಗಳ ನಾಲ್ಕು ಕರ್ತವ್ಯಗಳನ್ನು ವಿವರಿಸಿ.', lessonName: 'ಪರಿಸರ ಪ್ರೇಮ', marks: 4, answer: '1) ಶಾಲಾ ಆವರಣದಲ್ಲಿ ಗಿಡ ನೆಡುವುದು, 2) ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಕೆಯನ್ನು ತ್ಯಜಿಸುವುದು, 3) ನೀರು ಮತ್ತು ವಿದ್ಯುತ್ ಪೋಲು ಮಾಡದಿರುವುದು, 4) ಸ್ವಚ್ಛ ಭಾರತ ಅಭಿಯಾನದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳುವುದು.' },
      { id: 've-4m-5', number: 0, questionText: 'ಉತ್ತಮ ವ್ಯಕ್ತಿತ್ವ ನಿರ್ಮಾಣಕ್ಕೆ ಸತ್ಯ, ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ಶಿಸ್ತು ಹೇಗೆ ನೆರವಾಗುತ್ತವೆ? ವಿವರಿಸಿ.', lessonName: 'ವ್ಯಕ್ತಿತ್ವ ವಿಕಸನ', marks: 4, answer: 'ಸತ್ಯವು ಭಯವಿಲ್ಲದ ಜೀವನ ನೀಡುತ್ತದೆ. ಪ್ರಾಮಾಣಿಕತೆಯು ಸಮಾಜದಲ್ಲಿ ವಿಶ್ವಾಸ ತಂದುಕೊಡುತ್ತದೆ. ಶಿಸ್ತು ಗುರಿಯನ್ನು ಮುಟ್ಟಲು ನೆರವಾಗುತ್ತದೆ. ಇವು ವ್ಯಕ್ತಿಯನ್ನು ಸಮಾಜದ ಉತ್ತಮ ಪ್ರಜೆಯನ್ನಾಗಿ ಮಾಡುತ್ತವೆ.' },
    ],
  },
};

// Solve exact partition using ONLY marks 1, 2, and 4 (NO 3 or 5 marks!)
export function solveMarksPartitionOnly1_2_4(
  targetMarks: number,
  targetCount: number
): { marks: number; count: number }[] {
  const count = Math.max(2, Math.min(targetMarks, targetCount));

  // Let's find counts c4, c2, c1 such that:
  // 4*c4 + 2*c2 + 1*c1 = targetMarks
  // c4 + c2 + c1 = count
  // Using ONLY marks 4, 2, and 1!
  let bestSolution: { marks: number; count: number }[] | null = null;
  let minDiff = Infinity;

  for (let c4 = Math.floor(targetMarks / 4); c4 >= 0; c4--) {
    const remMarks = targetMarks - 4 * c4;
    const remCount = count - c4;
    if (remCount < 0) continue;

    // 2*c2 + 1*c1 = remMarks
    // c2 + c1 = remCount
    // Subtracting gives: c2 = remMarks - remCount
    const c2 = remMarks - remCount;
    const c1 = remCount - c2;

    if (c1 >= 0 && c2 >= 0) {
      const spec: { marks: number; count: number }[] = [];
      if (c1 > 0) spec.push({ marks: 1, count: c1 });
      if (c2 > 0) spec.push({ marks: 2, count: c2 });
      if (c4 > 0) spec.push({ marks: 4, count: c4 });
      return spec;
    }

    const currentDiff = Math.abs(remMarks - remCount);
    if (currentDiff < minDiff && c2 >= 0) {
      minDiff = currentDiff;
      const safeC1 = Math.max(0, remCount - Math.max(0, c2));
      const safeC2 = Math.max(0, Math.floor(remMarks / 2));
      bestSolution = [
        { marks: 1, count: safeC1 },
        { marks: 2, count: safeC2 },
        { marks: 4, count: c4 },
      ].filter((x) => x.count > 0);
    }
  }

  if (bestSolution) return bestSolution;

  // Fallback using 1 and 2 marks only
  const c2 = Math.floor((targetMarks - count) / 1);
  const c1 = count - c2;
  return [
    { marks: 1, count: Math.max(1, c1) },
    { marks: 2, count: Math.max(1, c2) },
  ];
}

// Generate customized paper based on exact user specification:
// 30 Marks: 1M×4, 1M×4, 1M×3, 1M×3, 2M×4, 4M×2 (Total 20 Qs)
// 40 Marks: 1M×5, 1M×5, 1M×4, 1M×4, 2M×5, 4M×3 (Total 26 Qs)
// 50 Marks: 1M×5, 1M×5, 1M×5, 1M×5, 2M×7, 4M×4 (Total 31 Qs)
// NO 3 MARKS AND 5 MARKS QUESTIONS!
// FOR LETTER WRITING GIVE IT AT LAST OF THE QUESTION SO THAT IT GETS A HALF PAGE TO WRITE LETTER.
// (IN LANGUAGE PAPERS ONLY LETTER WRITING)
export function generateCustomPaper(config: GenerateConfig): PaperState {
  const {
    classId,
    subjectId,
    examType,
    totalMarks,
    schoolName,
    date,
    studentName,
    rollNumber,
    customBank,
    useOnlyCustomBank,
    selectedLessons,
  } = config;

  const subjectInfo = ALL_SUBJECTS.find((s) => s.id === subjectId) || ALL_SUBJECTS[0];
  const classInfo = ALL_CLASSES.find((c) => c.id === classId) || ALL_CLASSES[0];
  const isLanguage = isLanguageSubject(subjectId);

  // Base state
  const base = JSON.parse(JSON.stringify(INITIAL_40_MARKS_PAPER)) as PaperState;

  // Exam Title
  let examTitleText = 'ಪ್ರಥಮ ಸಂಕಲನಾತ್ಮಕ ಪರೀಕ್ಷೆ (SA-1)';
  if (examType === 'SA2') examTitleText = 'ದ್ವಿತೀಯ ಸಂಕಲನಾತ್ಮಕ ಪರೀಕ್ಷೆ (SA-2)';
  if (examType === 'FA') examTitleText = 'ರಚನಾತ್ಮಕ ಮೌಲ್ಯಮಾಪನ ಪರೀಕ್ಷೆ (FA)';

  base.header.schoolName = schoolName;
  base.header.examTitle = examTitleText;
  base.header.subTitle = '';
  base.header.classSection = classInfo.nameKannada;
  base.header.subject = subjectInfo.nameKannada;
  base.header.date = date;
  base.header.time = totalMarks >= 40 ? '2 ಗಂಟೆ' : '1 ಗಂಟೆ 30 ನಿಮಿಷ';
  base.header.academicYear = '2026-27';
  base.header.totalMarks = totalMarks;
  base.header.studentName = studentName || '';
  base.header.rollNumber = rollNumber || '';
  if (selectedLessons) {
    base.selectedLessons = selectedLessons;
  }

  // Extract source questions for subject
  let sourcePool = MULTI_SUBJECT_QUESTION_POOLS[subjectId] || MULTI_SUBJECT_QUESTION_POOLS['kannada'];

  // Filter by selected chapters if specified
  if (selectedLessons && selectedLessons.length > 0 && !useOnlyCustomBank) {
    const matchLesson = (q: QuestionItem) => !q.lessonName || selectedLessons.includes(q.lessonName);
    const f1 = sourcePool.oneMark.filter(matchLesson);
    const f2 = sourcePool.twoMark.filter(matchLesson);
    const f4 = sourcePool.fourMark.filter(matchLesson);

    sourcePool = {
      oneMark: f1.length > 0 ? f1 : sourcePool.oneMark,
      twoMark: f2.length > 0 ? f2 : sourcePool.twoMark,
      fourMark: f4.length > 0 ? f4 : sourcePool.fourMark,
    };
  }

  // If custom JSON bank is uploaded and active
  if (useOnlyCustomBank && customBank && customBank.questions.length > 0) {
    const qList = customBank.questions;
    sourcePool = {
      oneMark: qList.filter((q) => q.marks === 1),
      twoMark: qList.filter((q) => q.marks === 2),
      fourMark: qList.filter((q) => q.marks === 4 || q.marks >= 3),
    };
    if (sourcePool.oneMark.length === 0) sourcePool.oneMark = qList;
    if (sourcePool.twoMark.length === 0) sourcePool.twoMark = qList;
    if (sourcePool.fourMark.length === 0) sourcePool.fourMark = qList;
  }

  // Letter Writing Question (Placed at the very LAST in Language papers)
  const letterQ: QuestionItem = LETTER_WRITING_QUESTIONS[subjectId] || LETTER_WRITING_QUESTIONS['kannada'];

  // Section Blueprint schema defined by user:
  // 30 Marks: 1M×4, 1M×4, 1M×3, 1M×3, 2M×4, 4M×2 (Total 20 Qs)
  // 40 Marks: 1M×5, 1M×5, 1M×4, 1M×4, 2M×5, 4M×3 (Total 26 Qs)
  // 50 Marks: 1M×5, 1M×5, 1M×5, 1M×5, 2M×7, 4M×4 (Total 31 Qs)
  interface SectionBlueprint {
    roman: string;
    title: string;
    marks: number;
    count: number;
    layout?: 'single' | 'two-column';
  }

  let blueprint: SectionBlueprint[];

  if (totalMarks === 30) {
    blueprint = [
      { roman: 'I', title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ', marks: 1, count: 4, layout: 'single' },
      { roman: 'II', title: isLanguage ? 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ / ಪದಗಳ ಅರ್ಥ' : 'ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳು / ಹೊಂದಿಸಿ ಬರೆಯಿರಿ', marks: 1, count: 4, layout: 'two-column' },
      { roman: 'III', title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 1, count: 3, layout: 'single' },
      { roman: 'IV', title: isLanguage ? 'ಸ್ವಂತ ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ / ವ್ಯಾಕರಣ' : 'ಸಂಕ್ಷಿಪ್ತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ', marks: 1, count: 3, layout: 'two-column' },
      { roman: 'V', title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 2, count: 4, layout: 'single' },
      { roman: 'VI', title: isLanguage ? 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ' : 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ', marks: 4, count: 2, layout: 'single' },
    ];
  } else if (totalMarks === 50) {
    blueprint = [
      { roman: 'I', title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ', marks: 1, count: 5, layout: 'single' },
      { roman: 'II', title: isLanguage ? 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ / ಪದಗಳ ಅರ್ಥ' : 'ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳು / ಹೊಂದಿಸಿ ಬರೆಯಿರಿ', marks: 1, count: 5, layout: 'two-column' },
      { roman: 'III', title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 1, count: 5, layout: 'single' },
      { roman: 'IV', title: isLanguage ? 'ಸ್ವಂತ ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ / ವ್ಯಾಕರಣ' : 'ಸಂಕ್ಷಿಪ್ತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ', marks: 1, count: 5, layout: 'two-column' },
      { roman: 'V', title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 2, count: 7, layout: 'single' },
      { roman: 'VI', title: isLanguage ? 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ' : 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ', marks: 4, count: 4, layout: 'single' },
    ];
  } else {
    // 40 Marks (Default) or custom
    blueprint = [
      { roman: 'I', title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ', marks: 1, count: 5, layout: 'single' },
      { roman: 'II', title: isLanguage ? 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ / ಪದಗಳ ಅರ್ಥ' : 'ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳು / ಹೊಂದಿಸಿ ಬರೆಯಿರಿ', marks: 1, count: 5, layout: 'two-column' },
      { roman: 'III', title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 1, count: 4, layout: 'single' },
      { roman: 'IV', title: isLanguage ? 'ಸ್ವಂತ ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ / ವ್ಯಾಕರಣ' : 'ಸಂಕ್ಷಿಪ್ತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ', marks: 1, count: 4, layout: 'two-column' },
      { roman: 'V', title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ', marks: 2, count: 5, layout: 'single' },
      { roman: 'VI', title: isLanguage ? 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ' : 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ', marks: 4, count: 3, layout: 'single' },
    ];
  }

  // If total marks is not 30, 40, or 50, use the mathematical solver (Only 1M, 2M, 4M - NEVER 3M or 5M)
  if (totalMarks !== 30 && totalMarks !== 40 && totalMarks !== 50) {
    const partitioned = solveMarksPartitionOnly1_2_4(totalMarks, config.questionCount || 20);
    const romanList = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    blueprint = partitioned.map((p, pIdx) => ({
      roman: romanList[pIdx] || `${pIdx + 1}`,
      title:
        p.marks === 1
          ? 'ವಸ್ತುನಿಷ್ಠ ಪ್ರಶ್ನೆಗಳು / ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ'
          : p.marks === 2
          ? 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ'
          : isLanguage
          ? 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ'
          : 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ',
      marks: p.marks,
      count: p.count,
      layout: (p.count >= 4 && p.marks === 1 ? 'two-column' : 'single') as 'two-column' | 'single',
    }));
  }

  let globalQuestionNumber = 1;
  let oneMarkIndex = 0;
  let twoMarkIndex = 0;
  let fourMarkIndex = 0;
  const sections: SectionItem[] = [];

  blueprint.forEach((sec, secIdx) => {
    let pool = sourcePool.oneMark;
    if (sec.marks === 2) pool = sourcePool.twoMark;
    if (sec.marks === 4) pool = sourcePool.fourMark;

    if (!pool || pool.length === 0) {
      pool = sourcePool.oneMark;
    }

    const isLastSection = secIdx === blueprint.length - 1;
    const questions: QuestionItem[] = [];

    for (let i = 0; i < sec.count; i++) {
      const isVeryLastQuestion = isLastSection && i === sec.count - 1;

      // User requirement:
      // "FOR LETTER WRITING GIVE IT ATLAST OF THE QUESTION SO THAT IT GETS A HALFP PAGE TO WRITE LETTER.
      // ( IN LANGUAGE PAPERS ONLY LETTER WRITING)"
      if (isVeryLastQuestion && isLanguage && sec.marks === 4) {
        questions.push({
          ...letterQ,
          id: `q-letter-${globalQuestionNumber}`,
          number: globalQuestionNumber++,
          marks: 4,
          isLetterWriting: true,
        });
      } else {
        let qIdx = 0;
        if (sec.marks === 1) {
          qIdx = (oneMarkIndex++) % pool.length;
        } else if (sec.marks === 2) {
          qIdx = (twoMarkIndex++) % pool.length;
        } else {
          qIdx = (fourMarkIndex++) % pool.length;
        }

        const srcQ = pool[qIdx];
        questions.push({
          id: `q-gen-${secIdx}-${i}-${globalQuestionNumber}`,
          number: globalQuestionNumber++,
          questionText: srcQ.questionText,
          lessonName: srcQ.lessonName,
          marks: sec.marks,
          answer: srcQ.answer,
          isLetterWriting: false,
        });
      }
    }

    const totalSecMarks = sec.count * sec.marks;
    sections.push({
      id: `sec-${sec.roman.toLowerCase()}`,
      roman: sec.roman,
      title: sec.title,
      formula: `${sec.count} × ${sec.marks} = ${totalSecMarks}`,
      marksPerQuestion: sec.marks,
      totalMarks: totalSecMarks,
      layout: sec.layout || 'single',
      questions,
    });
  });

  return {
    ...base,
    sections,
    matchSection: {
      ...base.matchSection,
      totalMarks: 0,
      pairs: [],
    },
  };
}
