export interface HeaderConfig {
  deptName: string;
  examTitle: string;
  subTitle: string;
  schoolName: string;
  classSection: string;
  studentName: string;
  rollNumber: string;
  date: string;
  time: string;
  subject: string;
  academicYear: string;
  totalMarks: number;
}

export interface QuestionItem {
  id: string;
  number: number;
  questionText: string;
  lessonName: string;
  marks: number;
  answer: string;
  options?: string[];
  explanation?: string;
  isLetterWriting?: boolean;
}

export interface MatchPair {
  leftNum: string;
  left: string;
  rightNum: string;
  right: string;
  answerNum: string;
  answer: string;
}

export interface MatchSection {
  id: string;
  roman: string;
  title: string;
  formula: string;
  totalMarks: number;
  pairs: MatchPair[];
}

export interface SectionItem {
  id: string;
  roman: string;
  title: string;
  formula: string;
  marksPerQuestion: number;
  totalMarks: number;
  layout?: 'single' | 'two-column';
  questions: QuestionItem[];
}

export interface PaperState {
  header: HeaderConfig;
  instructions: string[];
  sections: SectionItem[];
  matchSection: MatchSection;
  showAnswers: boolean;
  selectedLessons: string[];
}

export const KANNADA_LESSONS = [
  { id: 'nee_hoda', name: 'ನೀ ಹೋದ ಮರುದಿನ', type: 'ಪದ್ಯ' },
  { id: 'gandharvasena', name: 'ಗಂಧರ್ವಸೇನ', type: 'ಗದ್ಯ' },
  { id: 'avva', name: 'ಅವ್ವ', type: 'ಪದ್ಯ' },
  { id: 'putti', name: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ', type: 'ಪದ್ಯ' },
  { id: 'krishna_sudhama', name: 'ಕೃಷ್ಣ-ಸುಧಾಮ', type: 'ಗದ್ಯ' },
  { id: 'besige', name: 'ಬೇಸಿಗೆ', type: 'ಪದ್ಯ' },
  { id: 'rajkumar', name: 'ಡಾ. ರಾಜಕುಮಾರ್', type: 'ಗದ್ಯ' },
  { id: 'magu_hannu', name: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು', type: 'ಪದ್ಯ' },
  { id: 'madivalayya', name: 'ಮಡಿವಾಳಿಯ ಕತ್ತೆ', type: 'ಪೂರಕ' },
  { id: 'siddhartha', name: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', type: 'ಗದ್ಯ' },
  { id: 'neeti_marga', name: 'ನೀತಿ ಮಾರ್ಗ', type: 'ಪದ್ಯ' },
  { id: 'dheera_senani', name: 'ಧೀರ ಸೇನಾನಿ', type: 'ಗದ್ಯ' },
];

// Initial Exact 40 Marks Paper State matching the 40 marks blueprint
export const INITIAL_40_MARKS_PAPER: PaperState = {
  header: {
    deptName: 'ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ',
    examTitle: 'ಪ್ರಥಮ ಸಂಕಲನಾತ್ಮಕ ಪರೀಕ್ಷೆ (SA-1)',
    subTitle: '',
    schoolName: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ',
    classSection: '6ನೇ ತರಗತಿ',
    studentName: '',
    rollNumber: '',
    date: '05-09-2026',
    time: '2 ಗಂಟೆ',
    subject: 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ)',
    academicYear: '2026-27',
    totalMarks: 40,
  },
  instructions: [
    '1) ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿರಿ.',
    '2) ಬಿಟ್ಟ ಸ್ಥಳಗಳಿಗೆ ಸೂಕ್ತ ಪದಗಳಿಂದ ಉತ್ತರಿಸಿರಿ.',
    '3) ಪ್ರಶ್ನೆಗಳನ್ನು ಓದಿ ಅರ್ಥಮಾಡಿಕೊಂಡು ಉತ್ತರಿಸಿರಿ.',
    '4) ಪತ್ರ ಲೇಖನಕ್ಕೆ ನಿಗದಿತ ಅರ್ಧ ಪುಟದ ಜಾಗದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿರಿ.',
  ],
  selectedLessons: [
    'ನೀ ಹೋದ ಮರುದಿನ',
    'ಗಂಧರ್ವಸೇನ',
    'ಅವ್ವ',
    'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
    'ಕೃಷ್ಣ-ಸುಧಾಮ',
    'ಬೇಸಿಗೆ',
    'ಡಾ. ರಾಜಕುಮಾರ್',
    'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು',
    'ಮಡಿವಾಳಿಯ ಕತ್ತೆ',
  ],
  matchSection: {
    id: 'sec-match',
    roman: 'II',
    title: 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ',
    formula: '0 × 0 = 0',
    totalMarks: 0,
    pairs: [],
  },
  showAnswers: false,
  sections: [
    {
      id: 'sec-1',
      roman: 'I',
      title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ',
      formula: '5 × 1 = 5',
      marksPerQuestion: 1,
      totalMarks: 5,
      layout: 'single',
      questions: [
        {
          id: 'q-1',
          number: 1,
          questionText: '‘ನೀ ಹೋದ ಮರುದಿನ’ ಪದ್ಯದ ಕವಿ ________.',
          lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
          marks: 1,
          answer: 'ಸಿದ್ಧಲಿಂಗಯ್ಯ (ಅಥವಾ ಚೆನ್ನವೀರ ಕಣವಿ)',
        },
        {
          id: 'q-2',
          number: 2,
          questionText: 'ರಾಜನು _____ ವನ್ನು ಅಲ್ಲಿಗೇ ಪರಿಸಮಾಪ್ತಿಗೊಳಿಸಿದನು.',
          lessonName: 'ಗಂಧರ್ವಸೇನ',
          marks: 1,
          answer: 'ಒಡ್ಯೋಲಗ',
        },
        {
          id: 'q-3',
          number: 3,
          questionText: '‘ಅವ್ವ’ ಎಂದರೆ _______.',
          lessonName: 'ಅವ್ವ',
          marks: 1,
          answer: 'ತಾಯಿ',
        },
        {
          id: 'q-4',
          number: 4,
          questionText: 'ಪುಟ್ಟಿ ಹೋಗಲು ಬಯಸುವ ಗ್ರಹ ________.',
          lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
          marks: 1,
          answer: 'ಮಂಗಳ ಗ್ರಹ',
        },
        {
          id: 'q-5',
          number: 5,
          questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಹುಟ್ಟೂರು ________.',
          lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
          marks: 1,
          answer: 'ಗಾಜನೂರು',
        },
      ],
    },
    {
      id: 'sec-2',
      roman: 'II',
      title: 'ಪದಗಳ ಅರ್ಥ ಬರೆಯಿರಿ',
      formula: '5 × 1 = 5',
      marksPerQuestion: 1,
      totalMarks: 5,
      layout: 'two-column',
      questions: [
        {
          id: 'q-6',
          number: 6,
          questionText: 'ಒಡ್ಯೋಲಗ',
          lessonName: 'ಗಂಧರ್ವಸೇನ',
          marks: 1,
          answer: 'ರಾಜಸಭೆ / ಸಭೆ',
        },
        {
          id: 'q-7',
          number: 7,
          questionText: 'ಮರುದಿನ',
          lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
          marks: 1,
          answer: 'ಮುಂದಿನ ದಿನ / ಮಾರನೆಯ ದಿನ',
        },
        {
          id: 'q-8',
          number: 8,
          questionText: 'ವಿಶ್ರಾಂತಿ',
          lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
          marks: 1,
          answer: 'ಆರಾಮ / ದಣಿವು ಆರಿಸಿಕೊಳ್ಳುವುದು',
        },
        {
          id: 'q-9',
          number: 9,
          questionText: 'ಸಂಭ್ರಮ',
          lessonName: 'ಬೇಸಿಗೆ',
          marks: 1,
          answer: 'ಉತ್ಸಾಹ / ಸಂತೋಷ / ಆನಂದ',
        },
        {
          id: 'q-10',
          number: 10,
          questionText: 'ಮೂರ್ಖತನ',
          lessonName: 'ಗಂಧರ್ವಸೇನ',
          marks: 1,
          answer: 'ಅವಿವೇಕ / ತಿಳಿವಳಿಕೆಯಿಲ್ಲದಿರುವುದು',
        },
      ],
    },
    {
      id: 'sec-3',
      roman: 'III',
      title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ',
      formula: '4 × 1 = 4',
      marksPerQuestion: 1,
      totalMarks: 4,
      layout: 'single',
      questions: [
        {
          id: 'q-11',
          number: 11,
          questionText: 'ಮಗುವಿಗೆ ಹಣ್ಣುಗಳು ಏನನ್ನು ನೀಡುತ್ತವೆ?',
          lessonName: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು',
          marks: 1,
          answer: 'ಮಗುವಿಗೆ ಹಣ್ಣುಗಳು ಶಕ್ತಿ, ಪೋಷಕಾಂಶ ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ನೀಡುತ್ತವೆ.',
        },
        {
          id: 'q-12',
          number: 12,
          questionText: 'ಸುಧಾಮ ಯಾವುದನ್ನು ಮಾನವಧರ್ಮ ಎನ್ನುತ್ತಾನೆ?',
          lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
          marks: 1,
          answer: 'ಕಷ್ಟದಲ್ಲಿರುವವರಿಗೆ ಸಹಾಯ ಮಾಡುವುದು ಮತ್ತು ಸ್ನೇಹ ಉಳಿಸಿಕೊಳ್ಳುವುದನ್ನು ಮಾನವಧರ್ಮ ಎನ್ನುತ್ತಾನೆ.',
        },
        {
          id: 'q-13',
          number: 13,
          questionText: 'ಗಂಧರ್ವ ಸೇನ ಯಾರು?',
          lessonName: 'ಗಂಧರ್ವಸೇನ',
          marks: 1,
          answer: 'ಗಂಧರ್ವ ಸೇನನು ಮಡಿವಾಳಿಯ ಸಾಕಿದ ಕತ್ತೆ.',
        },
        {
          id: 'q-14',
          number: 14,
          questionText: 'ಸಿದ್ಧಾರ್ಥನ ತಂದೆಯ ಹೆಸರೇನು?',
          lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
          marks: 1,
          answer: 'ಸಿದ್ಧಾರ್ಥನ ತಂದೆಯ ಹೆಸರು ಶುದ್ಧೋದನ ಮಹಾರಾಜ.',
        },
      ],
    },
    {
      id: 'sec-4',
      roman: 'IV',
      title: 'ಸ್ವಂತ ವಾಕ್ಯ ರಚಿಸಿ / ವ್ಯಾಕರಣ',
      formula: '4 × 1 = 4',
      marksPerQuestion: 1,
      totalMarks: 4,
      layout: 'two-column',
      questions: [
        {
          id: 'q-15',
          number: 15,
          questionText: 'ತಾಯಿ',
          lessonName: 'ಅವ್ವ',
          marks: 1,
          answer: 'ತಾಯಿಯು ತನ್ನ ಮಕ್ಕಳಿಗೆ ಪ್ರೀತಿ ವಾತ್ಸಲ್ಯವನ್ನು ಧಾರೆಯೆರೆಯುತ್ತಾಳೆ.',
        },
        {
          id: 'q-16',
          number: 16,
          questionText: 'ಕರ್ತವ್ಯ',
          lessonName: 'ಬೇಸಿಗೆ',
          marks: 1,
          answer: 'ವಿದ್ಯಾರ್ಥಿಗಳು ಶ್ರದ್ಧೆಯಿಂದ ಅಭ್ಯಾಸ ಮಾಡುವುದು ಅವರ ಪ್ರಮುಖ ಕರ್ತವ್ಯ.',
        },
        {
          id: 'q-17',
          number: 17,
          questionText: 'ನೆನಪು',
          lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
          marks: 1,
          answer: 'ನನ್ನ ಬಾಲ್ಯದ ಗೆಳೆಯರು ಸದಾ ನನ್ನ ನೆನಪಿನಲ್ಲಿ ಇರುತ್ತಾರೆ.',
        },
        {
          id: 'q-18',
          number: 18,
          questionText: 'ಸ್ನೇಹ',
          lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
          marks: 1,
          answer: 'ಕೃಷ್ಣ ಮತ್ತು ಸುಧಾಮನ ನಿಸ್ವಾರ್ಥ ಸ್ನೇಹ ಜಗತ್ತಿಗೆ ಮಾದರಿಯಾಗಿದೆ.',
        },
      ],
    },
    {
      id: 'sec-5',
      roman: 'V',
      title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ',
      formula: '5 × 2 = 10',
      marksPerQuestion: 2,
      totalMarks: 10,
      layout: 'single',
      questions: [
        {
          id: 'q-19',
          number: 19,
          questionText: 'ಸೂರ್ಯನಿಂದ ಮಕ್ಕಳು ಕಲಿಯಬೇಕಾದ ಪಾಠವೇನು?',
          lessonName: 'ಬೇಸಿಗೆ',
          marks: 2,
          answer: 'ಸೂರ್ಯನು ಪ್ರತಿದಿನ ತಪ್ಪದೆ ಉದಯಿಸಿ ಲೋಕಕ್ಕೆಲ್ಲ ಬೆಳಕು ಮತ್ತು ಚೈತನ್ಯ ನೀಡುವಂತೆ, ನಾವೂ ನಿರಂತರವಾಗಿ ಶ್ರಮಿಸಿ ಸಮಾಜಕ್ಕೆ ಉಪಕಾರಿಯಾಗಬೇಕು.',
        },
        {
          id: 'q-20',
          number: 20,
          questionText: 'ರಾಜಕುಮಾರರಿಗೆ ದೊರೆತ ಯಾವುದಾದರೂ ಎರಡು ಪ್ರಶಸ್ತಿ/ಬಿರುದುಗಳನ್ನು ಹೆಸರಿಸಿ.',
          lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
          marks: 2,
          answer: 'ಕರ್ನಾಟಕ ರತ್ನ, ದಾದಾ ಸಾಹೇಬ್ ಫಾಲ್ಕೆ ಪ್ರಶಸ್ತಿ ಮತ್ತು ಪದ್ಮಭೂಷಣ ಬಿರುದುಗಳು ದೊರೆತಿವೆ.',
        },
        {
          id: 'q-21',
          number: 21,
          questionText: 'ತಾಯಿಯ ಮಹತ್ವವನ್ನು ‘ಅವ್ವ’ ಪಾಠದ ಆಧಾರದಲ್ಲಿ ಎರಡು ವಾಕ್ಯ ಬರೆಯಿರಿ.',
          lessonName: 'ಅವ್ವ',
          marks: 2,
          answer: 'ತಾಯಿಯು ತನ್ನ ಕಷ್ಟಗಳನ್ನು ಮರೆತು ಮಕ್ಕಳನ್ನು ಪ್ರೀತಿಯಿಂದ ಸಾಕುತ್ತಾಳೆ. ಜಗತ್ತಿನಲ್ಲಿ ತಾಯಿಯ ಪ್ರೀತಿಗೆ ಸರಿಸಾಟಿಯಾದದ್ದು ಯಾವುದೂ ಇಲ್ಲ.',
        },
        {
          id: 'q-22',
          number: 22,
          questionText: 'ಸುಧಾಮನ ಪತ್ನಿ ಅವನನ್ನು ಕೃಷ್ಣನ ಬಳಿ ಏಕೆ ಕಳುಹಿಸಿದಳು?',
          lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
          marks: 2,
          answer: 'ಮನೆಯಲ್ಲಿ ವಿಪರೀತ ಬಡತನವಿದ್ದು, ಮಕ್ಕಳಿಗೆ ಊಟಕ್ಕೂ ಗತಿಯಿಲ್ಲದಾಗ, ದ್ವಾರಕೆಯ ರಾಜನಾದ ಬಾಲ್ಯಸ್ನೇಹಿತ ಶ್ರೀಕೃಷ್ಣನನ್ನು ಭೇಟಿಯಾಗಿ ನೆರವು ಪಡೆಯಲು ಕಳುಹಿಸಿದಳು.',
        },
        {
          id: 'q-23',
          number: 23,
          questionText: 'ಸಿದ್ಧಾರ್ಥ ಮತ್ತು ದೇವದತ್ತರ ನಡುವೆ ಹಂಸದ ವಿಷಯದಲ್ಲಿ ಉಂಟಾದ ವಿವಾದವೇನು?',
          lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
          marks: 2,
          answer: 'ದೇವದತ್ತನು ಹಂಸವನ್ನು ಬಾಣದಿಂದ ಹೊಡೆದುದರಿಂದ ತನ್ನದೆಂದನು; ಸಿದ್ಧಾರ್ಥನು ಹಂಸದ ಪ್ರಾಣ ಉಳಿಸಿದ ತನಗೆ ಸೇರಬೇಕೆಂದು ವಾದಿಸಿದನು.',
        },
      ],
    },
    {
      id: 'sec-6',
      roman: 'VI',
      title: 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ',
      formula: '3 × 4 = 12',
      marksPerQuestion: 4,
      totalMarks: 12,
      layout: 'single',
      questions: [
        {
          id: 'q-24',
          number: 24,
          questionText: '‘ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ’ ಪದ್ಯದ ಆಶಯವನ್ನು ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.',
          lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
          marks: 4,
          answer: 'ಮಕ್ಕಳಲ್ಲಿ ವೈಜ್ಞಾನಿಕ ಕುತೂಹಲ, ಬಾಹ್ಯಾಕಾಶ ಅನ್ವೇಷಣೆ ಮತ್ತು ಹೊಸ ಲೋಕಗಳನ್ನು ತಿಳಿಯುವ ಹಂಬಲವನ್ನು ಬೆಳೆಸುವುದು ಈ ಪದ್ಯದ ಪ್ರಮುಖ ಆಶಯವಾಗಿದೆ.',
        },
        {
          id: 'q-25',
          number: 25,
          questionText: 'ಕೃಷ್ಣನು ಸುಧಾಮನಿಗೆ ಮನೆ ಕಟ್ಟಿಸಿಕೊಟ್ಟ ಸಂದರ್ಭವನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ.',
          lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
          marks: 4,
          answer: 'ಸುಧಾಮನು ಕೃಷ್ಣನಿಂದ ಏನನ್ನೂ ಬೇಡದೆ ಪ್ರೀತಿಯಿಂದ ಅವಲಕ್ಕಿಯನ್ನು ನೀಡಿದನು. ಅವನ ನಿಸ್ವಾರ್ಥ ಭಕ್ತಿ ಮತ್ತು ಸ್ನೇಹವನ್ನು ಮೆಚ್ಚಿದ ಶ್ರೀಕೃಷ್ಣನು, ಸುಧಾಮ ಊರಿಗೆ ಮರಳುವಷ್ಟರಲ್ಲಿ ಸುಂದರ ಅರಮನೆಯಂತಹ ಮನೆಯನ್ನು ನಿರ್ಮಿಸಿಕೊಟ್ಟಿದ್ದನು.',
        },
        {
          id: 'q-26',
          number: 26,
          questionText: 'ಮೂರು ದಿನಗಳ ರಜೆ ಕೋರಿ ನಿಮ್ಮ ಶಾಲೆಯ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರಿಗೆ ರಜಾ ಪತ್ರವನ್ನು ಬರೆಯಿರಿ.',
          lessonName: 'ಪತ್ರ ಲೇಖನ (Letter Writing)',
          marks: 4,
          answer: 'ಸ್ಥಳ, ದಿನಾಂಕ, ಇವರಿಗೆ: ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು, ಮಾನ್ಯರೇ, ವಿಷಯ: ರಜೆ ಕೋರಿ, ಪತ್ರದ ಒಡಲು (ಕಾರಣಗಳು), ವಂದನೆಗಳೊಂದಿಗೆ, ತಮ್ಮ ವಿಧೇಯ ವಿದ್ಯಾರ್ಥಿ ಸಹಿ.',
          isLetterWriting: true,
        },
      ],
    },
  ],
};

// Alternative questions bank for instant shuffling and replacement
export const QUESTION_POOL: Record<string, QuestionItem[]> = {
  fill_blank: [
    {
      id: 'pool-fb-1',
      number: 0,
      questionText: '‘ನೀ ಹೋದ ಮರುದಿನ’ ಪದ್ಯದ ಕವಿ ________.',
      lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
      marks: 1,
      answer: 'ಸಿದ್ಧಲಿಂಗಯ್ಯ',
    },
    {
      id: 'pool-fb-2',
      number: 0,
      questionText: 'ರಾಜನು _____ ವನ್ನು ಅಲ್ಲಿಗೇ ಪರಿಸಮಾಪ್ತಿಗೊಳಿಸಿದನು.',
      lessonName: 'ಗಂಧರ್ವಸೇನ',
      marks: 1,
      answer: 'ಒಡ್ಯೋಲಗ',
    },
    {
      id: 'pool-fb-3',
      number: 0,
      questionText: '‘ಅವ್ವ’ ಎಂದರೆ _______.',
      lessonName: 'ಅವ್ವ',
      marks: 1,
      answer: 'ತಾಯಿ',
    },
    {
      id: 'pool-fb-4',
      number: 0,
      questionText: 'ಪುಟ್ಟಿ ಹೋಗಲು ಬಯಸುವ ಗ್ರಹ ________.',
      lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
      marks: 1,
      answer: 'ಮಂಗಳ ಗ್ರಹ',
    },
    {
      id: 'pool-fb-5',
      number: 0,
      questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಮೊದಲ ಚಲನಚಿತ್ರ ________.',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 1,
      answer: 'ಬೇಡರ ಕಣ್ಣಪ್ಪ',
    },
    {
      id: 'pool-fb-6',
      number: 0,
      questionText: 'ಸುಧಾಮನು ಶ್ರೀಕೃಷ್ಣನಿಗೆ ಕಾಣಿಕೆಯಾಗಿ ತಂದಿದ್ದು ________.',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 1,
      answer: 'ಅವಲಕ್ಕಿ (ಪೃಥುಕ)',
    },
    {
      id: 'pool-fb-7',
      number: 0,
      questionText: 'ಬೇಸಿಗೆಯ ಋತುವಿನಲ್ಲಿ ಸೂರ್ಯನು ________ ಪ್ರಖರತೆಯಿಂದ ಸುಡುತ್ತಾನೆ.',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 1,
      answer: 'ತೀವ್ರ / ಬೆಂಕಿಯಂತಹ',
    },
    {
      id: 'pool-fb-8',
      number: 0,
      questionText: 'ಸಿದ್ಧಾರ್ಥನು ಗಾಯಗೊಂಡ ________ ಪಕ್ಷಿಯನ್ನು ಪ್ರೀತಿಯಿಂದ ರಕ್ಷಿಸಿದನು.',
      lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
      marks: 1,
      answer: 'ಹಂಸ',
    },
  ],
  word_meaning: [
    {
      id: 'pool-wm-1',
      number: 0,
      questionText: 'ಒಡ್ಯೋಲಗ',
      lessonName: 'ಗಂಧರ್ವಸೇನ',
      marks: 1,
      answer: 'ರಾಜಸಭೆ / ಸಭೆ',
    },
    {
      id: 'pool-wm-2',
      number: 0,
      questionText: 'ಮರುದಿನ',
      lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
      marks: 1,
      answer: 'ಮುಂದಿನ ದಿನ / ಮಾರನೆಯ ದಿನ',
    },
    {
      id: 'pool-wm-3',
      number: 0,
      questionText: 'ವಿಶ್ರಾಂತಿ',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 1,
      answer: 'ಆರಾಮ / ದಣಿವು ಆರಿಸಿಕೊಳ್ಳುವುದು',
    },
    {
      id: 'pool-wm-4',
      number: 0,
      questionText: 'ಸಂಭ್ರಮ',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 1,
      answer: 'ಉತ್ಸಾಹ / ಆನಂದ',
    },
    {
      id: 'pool-wm-5',
      number: 0,
      questionText: 'ಅಕ್ಕರೆ',
      lessonName: 'ಅವ್ವ',
      marks: 1,
      answer: 'ಪ್ರೀತಿ / ವಾತ್ಸಲ್ಯ',
    },
    {
      id: 'pool-wm-6',
      number: 0,
      questionText: 'ಧರೆ',
      lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
      marks: 1,
      answer: 'ಭೂಮಿ',
    },
    {
      id: 'pool-wm-7',
      number: 0,
      questionText: 'ಖ್ಯಾತಿ',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 1,
      answer: 'ಕೀರ್ತಿ / ಹೆಸರು',
    },
    {
      id: 'pool-wm-8',
      number: 0,
      questionText: 'ಕರುಣೆ',
      lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
      marks: 1,
      answer: 'ದಯೆ / ಅನುಕಂಪ',
    },
  ],
  own_sentence: [
    {
      id: 'pool-os-1',
      number: 0,
      questionText: 'ತಾಯಿ',
      lessonName: 'ಅವ್ವ',
      marks: 1,
      answer: 'ತಾಯಿಯು ತನ್ನ ಮಕ್ಕಳಿಗೆ ಪ್ರೀತಿ ವಾತ್ಸಲ್ಯವನ್ನು ನೀಡುತ್ತಾಳೆ.',
    },
    {
      id: 'pool-os-2',
      number: 0,
      questionText: 'ಮೂರ್ಖತನ',
      lessonName: 'ಗಂಧರ್ವಸೇನ',
      marks: 1,
      answer: 'ಸತ್ಯ ತಿಳಿಯದೆ ದುಡುಕುವುದು ಮೂರ್ಖತನ.',
    },
    {
      id: 'pool-os-3',
      number: 0,
      questionText: 'ಕರ್ತವ್ಯ',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 1,
      answer: 'ಪೋಷಕರನ್ನು ಗೌರವಿಸುವುದು ನಮ್ಮ ಕರ್ತವ್ಯ.',
    },
    {
      id: 'pool-os-4',
      number: 0,
      questionText: 'ನೆನಪು',
      lessonName: 'ನೀ ಹೋದ ಮರುದಿನ',
      marks: 1,
      answer: 'ಗುರುಗಳ ಮಾರ್ಗದರ್ಶನ ಸದಾ ನೆನಪಿನಲ್ಲಿರಬೇಕು.',
    },
    {
      id: 'pool-os-5',
      number: 0,
      questionText: 'ಸ್ನೇಹ',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 1,
      answer: 'ಕೃಷ್ಣ ಮತ್ತು ಸುಧಾಮನ ಸ್ನೇಹ ಜಗತ್ತಿಗೆ ಮಾದರಿಯಾಗಿದೆ.',
    },
    {
      id: 'pool-os-6',
      number: 0,
      questionText: 'ಪರಿಶ್ರಮ',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 1,
      answer: 'ನಿರಂತರ ಪರಿಶ್ರಮದಿಂದ ಯಶಸ್ಸು ಸಾಧಿಸಬಹುದು.',
    },
  ],
  one_sentence: [
    {
      id: 'pool-one-1',
      number: 0,
      questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಹುಟ್ಟೂರು ಯಾವುದು?',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 1,
      answer: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಹುಟ್ಟೂರು ಗಾಜನೂರು.',
    },
    {
      id: 'pool-one-2',
      number: 0,
      questionText: 'ಮಗುವಿಗೆ ಹಣ್ಣುಗಳು ಏನನ್ನು ನೀಡುತ್ತವೆ?',
      lessonName: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು',
      marks: 1,
      answer: 'ಮಗುವಿಗೆ ಹಣ್ಣುಗಳು ಶಕ್ತಿ ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ನೀಡುತ್ತವೆ.',
    },
    {
      id: 'pool-one-3',
      number: 0,
      questionText: 'ಸುಧಾಮ ಯಾವುದನ್ನು ಮಾನವಧರ್ಮ ಎನ್ನುತ್ತಾನೆ?',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 1,
      answer: 'ಕಷ್ಟದಲ್ಲಿರುವವರಿಗೆ ಸಹಾಯ ಮಾಡುವುದೇ ಮಾನವಧರ್ಮ.',
    },
    {
      id: 'pool-one-4',
      number: 0,
      questionText: 'ಗಂಧರ್ವ ಸೇನ ಯಾರು?',
      lessonName: 'ಗಂಧರ್ವಸೇನ',
      marks: 1,
      answer: 'ಗಂಧರ್ವ ಸೇನನು ಮಡಿವಾಳಿಯ ಕತ್ತೆ.',
    },
    {
      id: 'pool-one-5',
      number: 0,
      questionText: 'ಪುಟ್ಟಿಯು ರಾಕೆಟ್ ಏರಿ ಎಲ್ಲಿಗೆ ಹೊರಟಳು?',
      lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
      marks: 1,
      answer: 'ಪುಟ್ಟಿಯು ರಾಕೆಟ್ ಏರಿ ಮಂಗಳ ಗ್ರಹಕ್ಕೆ ಹೊರಟಳು.',
    },
    {
      id: 'pool-one-6',
      number: 0,
      questionText: 'ಬೇಸಿಗೆಯ ನಂತರ ಯಾವ ಋತುವು ಪ್ರಕೃತಿಯನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ?',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 1,
      answer: 'ವರ್ಷ ಋತು (ಮಳೆಗಾಲ) ಪ್ರಕೃತಿಯನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ.',
    },
    {
      id: 'pool-one-7',
      number: 0,
      questionText: 'ಸಿದ್ಧಾರ್ಥನ ತಂದೆಯ ಹೆಸರೇನು?',
      lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
      marks: 1,
      answer: 'ಶುದ್ಧೋದನ ಮಹಾರಾಜ.',
    },
  ],
  two_three_sentences: [
    {
      id: 'pool-two-1',
      number: 0,
      questionText: 'ಸೂರ್ಯನಿಂದ ಮಕ್ಕಳು ಕಲಿಯಬೇಕಾದ ಪಾಠವೇನು?',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 2,
      answer: 'ಸೂರ್ಯನು ಪ್ರತಿದಿನ ತಪ್ಪದೆ ಉದಯಿಸಿ ಪ್ರಪಂಚಕ್ಕೆ ಬೆಳಕು ಮತ್ತು ಕರ್ತವ್ಯ ಪ್ರಜ್ಞೆ ನೀಡುವಂತೆ, ನಾವೂ ನಿಷ್ಠೆಯಿಂದ ನಮ್ಮ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಬೇಕು.',
    },
    {
      id: 'pool-two-2',
      number: 0,
      questionText: 'ರಾಜಕುಮಾರರಿಗೆ ದೊರೆತ ಯಾವುದಾದರೂ ಎರಡು ಪ್ರಶಸ್ತಿ/ಬಿರುದುಗಳನ್ನು ಹೆಸರಿಸಿ.',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 2,
      answer: 'ಕರ್ನಾಟಕ ರತ್ನ, ದಾದಾ ಸಾಹೇಬ್ ಫಾಲ್ಕೆ ಪ್ರಶಸ್ತಿ, ಪದ್ಮಭೂಷಣ ಬಿರುದುಗಳು.',
    },
    {
      id: 'pool-two-3',
      number: 0,
      questionText: 'ತಾಯಿಯ ಮಹತ್ವವನ್ನು ‘ಅವ್ವ’ ಪಾಠದ ಆಧಾರದಲ್ಲಿ ಎರಡು ವಾಕ್ಯ ಬರೆಯಿರಿ.',
      lessonName: 'ಅವ್ವ',
      marks: 2,
      answer: 'ತಾಯಿಯ ಪ್ರೀತಿ ನಿಸ್ವಾರ್ಥವಾದುದು; ಅವಳು ತನ್ನ ಕಷ್ಟಗಳನ್ನು ಬದಿಗೊತ್ತಿ ಮಕ್ಕಳ ಸುಖಕ್ಕಾಗಿ ಸದಾ ಶ್ರಮಿಸುತ್ತಾಳೆ.',
    },
    {
      id: 'pool-two-4',
      number: 0,
      questionText: 'ಸುಧಾಮನ ಪತ್ನಿ ಅವನನ್ನು ಕೃಷ್ಣನ ಬಳಿ ಏಕೆ ಕಳುಹಿಸಿದಳು?',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 2,
      answer: 'ಬಡತನದ ಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸಿಕೊಳ್ಳಲು ಮತ್ತು ಬಾಲ್ಯ ಸ್ನೇಹಿತನಾದ ಶ್ರೀಕೃಷ್ಣನನ್ನು ಭೇಟಿಯಾಗಿ ನೆರವು ಪಡೆಯಲು ಕಳುಹಿಸಿದಳು.',
    },
    {
      id: 'pool-two-5',
      number: 0,
      questionText: 'ಗಂಧರ್ವಸೇನ ಸತ್ತನೆಂದು ಕೇಳಿ ರಾಜ ಮತ್ತು ಮಂತ್ರಿಗಳು ಮಾಡಿದ ಮೂರ್ಖತನವೇನು?',
      lessonName: 'ಗಂಧರ್ವಸೇನ',
      marks: 2,
      answer: 'ಗಂಧರ್ವಸೇನ ಯಾರೆಂದು ವಿಚಾರಿಸದೆ ಆತ ಮಹಾನ್ ವ್ಯಕ್ತಿಯೆಂದು ತಿಳಿದು ಅರಮನೆಯಲ್ಲಿ ಶೋಕಾಚರಣೆ ಮಾಡಿ ಕಣ್ಣೀರಿಟ್ಟರು.',
    },
    {
      id: 'pool-two-6',
      number: 0,
      questionText: 'ಸಿದ್ಧಾರ್ಥ ಮತ್ತು ದೇವದತ್ತರ ನಡುವೆ ಹಂಸದ ವಿಷಯದಲ್ಲಿ ಉಂಟಾದ ವಾದವೇನು?',
      lessonName: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ',
      marks: 2,
      answer: 'ದೇವದತ್ತನು ಹಂಸವನ್ನು ತಾನು ಬಾಣ ಹೊಡೆದು ಉರುಳಿಸಿದ್ದರಿಂದ ಅದು ತನಗೆ ಸೇರಬೇಕೆಂದನು; ಸಿದ್ಧಾರ್ಥನು ಅದರ ಪ್ರಾಣ ಉಳಿಸಿದ್ದರಿಂದ ತನಗೆ ಸೇರಬೇಕೆಂದು ವಾದಿಸಿದನು.',
    },
  ],
  four_five_sentences: [
    {
      id: 'pool-four-1',
      number: 0,
      questionText: '‘ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ’ ಪದ್ಯದ ಆಶಯವನ್ನು ವಿವರಿಸಿ.',
      lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
      marks: 4,
      answer: 'ಮಕ್ಕಳಲ್ಲಿ ವೈಜ್ಞಾನಿಕ ಅನ್ವೇಷಣಾ ಮನೋಭಾವ, ಬಾಹ್ಯಾಕಾಶದ ಕೌತುಕಗಳನ್ನು ಅರಿಯುವ ಆಸಕ್ತಿ ಮತ್ತು ಕನಸುಗಳನ್ನು ನನಸಾಗಿಸುವ ಛಲವನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುವುದು ಈ ಪದ್ಯದ ಉದ್ದೇಶ.',
    },
    {
      id: 'pool-four-2',
      number: 0,
      questionText: 'ಕೃಷ್ಣನು ಸುಧಾಮನಿಗೆ ಮನೆ ಕಟ್ಟಿಸಿಕೊಟ್ಟ ಸಂದರ್ಭವನ್ನು ವಿವರಿಸಿ.',
      lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
      marks: 4,
      answer: 'ಸುಧಾಮನು ಕೃಷ್ಣನ ಬಳಿ ಏನನ್ನೂ ಅಪೇಕ್ಷಿಸದೆ ಭಕ್ತಿಯಿಂದ ಅವಲಕ್ಕಿ ಸಮರ್ಪಿಸಿದನು. ಅವನ ನಿಸ್ವಾರ್ಥತೆಗೆ ಶ್ರೀಕೃಷ್ಣನು ಒಲಿದು, ಸುಧಾಮ ಊರಿಗೆ ಮರಳುವ ಹೊತ್ತಿಗೆ ಬಡ ಗುಡಿಸಲನ್ನು ಭವ್ಯ ಮಹಡಿಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿದ್ದನು.',
    },
    {
      id: 'pool-four-3',
      number: 0,
      questionText: '‘ಬೇಸಿಗೆ’ ಪದ್ಯದ ಸಾರಾಂಶ ಬರೆದು, ಅದರಿಂದ ದೊರೆಯುವ ಸಂದೇಶವನ್ನು ತಿಳಿಸಿ.',
      lessonName: 'ಬೇಸಿಗೆ',
      marks: 4,
      answer: 'ಬೇಸಿಗೆಯ ಪ್ರಖರ ಬಿಸಿಲು ಭೂಮಿಯನ್ನು ಕಾಯಿಸಿದರೂ ನಂತರ ತಂಪಾದ ಮಳೆಯಾಗಲು ಇದು ಕಾರಣವಾಗುತ್ತದೆ. ಜೀವನದಲ್ಲಿ ಬರುವ ಕಷ್ಟಗಳು ಮುಂದಿನ ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿಗೆ ನಾಂದಿ ಎಂಬುದು ಸಂದೇಶ.',
    },
    {
      id: 'pool-four-4',
      number: 0,
      questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಸರಳತೆ ಮತ್ತು ನಾಡು-ನುಡಿಗೆ ಸಲ್ಲಿಸಿದ ಸೇವೆಯನ್ನು ವಿವರಿಸಿ.',
      lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
      marks: 4,
      answer: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರು ಮೇರು ನಟರಾಗಿದ್ದರೂ ಅಭಿಮಾನಿಗಳನ್ನು ದೇವರು ಎಂದು ಗೌರವಿಸುತ್ತಿದ್ದರು. ಗೋಕಾಕ್ ಚಳವಳಿಯ ನೇತೃತ್ವ ವಹಿಸಿ ಕನ್ನಡ ನಾಡು-ನುಡಿಗೆ ಅಪಾರ ಕೊಡುಗೆ ನೀಡಿದರು.',
    },
  ],
};

// Alternate match pairs
export const MATCH_POOLS = [
  [
    { leftNum: '1.', left: 'ಅವ್ವ', rightNum: 'A.', right: 'ರಾಜಕುಮಾರ್', answerNum: '1.', answer: 'C (ತಾಯಿಯ ಪ್ರೇಮ)' },
    { leftNum: '2.', left: 'ಮುತ್ತುರಾಜ', rightNum: 'B.', right: 'ಮಂಗಳ ಗ್ರಹ', answerNum: '2.', answer: 'A (ರಾಜಕುಮಾರ್)' },
    { leftNum: '3.', left: 'ಪುಟ್ಟಿ', rightNum: 'C.', right: 'ತಾಯಿಯ ಪ್ರೇಮ', answerNum: '3.', answer: 'B (ಮಂಗಳ ಗ್ರಹ)' },
    { leftNum: '4.', left: 'ಗಂಧರ್ವಸೇನ', rightNum: 'D.', right: 'ಮಡಿವಾಳಿಯ ಕತ್ತೆ', answerNum: '4.', answer: 'D (ಮಡಿವಾಳಿಯ ಕತ್ತೆ)' },
  ],
  [
    { leftNum: '1.', left: 'ಶ್ರೀಕೃಷ್ಣ', rightNum: 'A.', right: 'ಹಂಸ ರಕ್ಷಣೆ', answerNum: '1.', answer: 'B (ದ್ವಾರಕಾಧೀಶ)' },
    { leftNum: '2.', left: 'ಸುಧಾಮ', rightNum: 'B.', right: 'ದ್ವಾರಕಾಧೀಶ', answerNum: '2.', answer: 'C (ಅವಲಕ್ಕಿ ಕಾಣಿಕೆ)' },
    { leftNum: '3.', left: 'ಸಿದ್ಧಾರ್ಥ', rightNum: 'C.', right: 'ಅವಲಕ್ಕಿ ಕಾಣಿಕೆ', answerNum: '3.', answer: 'A (ಹಂಸ ರಕ್ಷಣೆ)' },
    { leftNum: '4.', left: 'ಗಾಜನೂರು', rightNum: 'D.', right: 'ರಾಜಕುಮಾರ್ ಹುಟ್ಟೂರು', answerNum: '4.', answer: 'D (ರಾಜಕುಮಾರ್ ಹುಟ್ಟೂರು)' },
  ],
];

// Generator for 30 Marks Paper matching the 30 marks blueprint:
// 1M×4, 1M×4, 1M×3, 1M×3, 2M×4, 4M×2 (Total 20 Qs)
export function get30MarksPaper(): PaperState {
  return {
    ...INITIAL_40_MARKS_PAPER,
    header: {
      ...INITIAL_40_MARKS_PAPER.header,
      totalMarks: 30,
      time: '1 ಗಂಟೆ 30 ನಿಮಿಷ',
    },
    matchSection: {
      id: 'sec-match',
      roman: 'II',
      title: 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ',
      formula: '0 × 0 = 0',
      totalMarks: 0,
      pairs: [],
    },
    sections: [
      {
        id: 'sec-1',
        roman: 'I',
        title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ',
        formula: '4 × 1 = 4',
        marksPerQuestion: 1,
        totalMarks: 4,
        layout: 'single',
        questions: INITIAL_40_MARKS_PAPER.sections[0].questions.slice(0, 4),
      },
      {
        id: 'sec-2',
        roman: 'II',
        title: 'ಪದಗಳ ಅರ್ಥ ಬರೆಯಿರಿ',
        formula: '4 × 1 = 4',
        marksPerQuestion: 1,
        totalMarks: 4,
        layout: 'two-column',
        questions: INITIAL_40_MARKS_PAPER.sections[1].questions.slice(0, 4).map((q, idx) => ({ ...q, number: idx + 5 })),
      },
      {
        id: 'sec-3',
        roman: 'III',
        title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ',
        formula: '3 × 1 = 3',
        marksPerQuestion: 1,
        totalMarks: 3,
        layout: 'single',
        questions: INITIAL_40_MARKS_PAPER.sections[2].questions.slice(0, 3).map((q, idx) => ({ ...q, number: idx + 9 })),
      },
      {
        id: 'sec-4',
        roman: 'IV',
        title: 'ಸ್ವಂತ ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ / ವ್ಯಾಕರಣ',
        formula: '3 × 1 = 3',
        marksPerQuestion: 1,
        totalMarks: 3,
        layout: 'two-column',
        questions: INITIAL_40_MARKS_PAPER.sections[3].questions.slice(0, 3).map((q, idx) => ({ ...q, number: idx + 12 })),
      },
      {
        id: 'sec-5',
        roman: 'V',
        title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ',
        formula: '4 × 2 = 8',
        marksPerQuestion: 2,
        totalMarks: 8,
        layout: 'single',
        questions: INITIAL_40_MARKS_PAPER.sections[4].questions.slice(0, 4).map((q, idx) => ({ ...q, number: idx + 15 })),
      },
      {
        id: 'sec-6',
        roman: 'VI',
        title: 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ',
        formula: '2 × 4 = 8',
        marksPerQuestion: 4,
        totalMarks: 8,
        layout: 'single',
        questions: [
          {
            ...INITIAL_40_MARKS_PAPER.sections[5].questions[0],
            number: 19,
          },
          {
            ...INITIAL_40_MARKS_PAPER.sections[5].questions[2], // Letter writing question
            number: 20,
            isLetterWriting: true,
          },
        ],
      },
    ],
  };
}

// Generator for 50 Marks Paper matching the 50 marks blueprint:
// 1M×5, 1M×5, 1M×5, 1M×5, 2M×7, 4M×4 (Total 31 Qs)
export function get50MarksPaper(): PaperState {
  return {
    ...INITIAL_40_MARKS_PAPER,
    header: {
      ...INITIAL_40_MARKS_PAPER.header,
      totalMarks: 50,
      time: '2 ಗಂಟೆ',
    },
    matchSection: {
      id: 'sec-match',
      roman: 'II',
      title: 'ಹೊಂದಿಸಿ ಬರೆಯಿರಿ',
      formula: '0 × 0 = 0',
      totalMarks: 0,
      pairs: [],
    },
    sections: [
      {
        id: 'sec-1',
        roman: 'I',
        title: 'ಕೆಳಗಿನ ಬಿಟ್ಟ ಸ್ಥಳಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ತುಂಬಿರಿ',
        formula: '5 × 1 = 5',
        marksPerQuestion: 1,
        totalMarks: 5,
        layout: 'single',
        questions: INITIAL_40_MARKS_PAPER.sections[0].questions.slice(0, 5),
      },
      {
        id: 'sec-2',
        roman: 'II',
        title: 'ಪದಗಳ ಅರ್ಥ ಬರೆಯಿರಿ',
        formula: '5 × 1 = 5',
        marksPerQuestion: 1,
        totalMarks: 5,
        layout: 'two-column',
        questions: INITIAL_40_MARKS_PAPER.sections[1].questions.slice(0, 5).map((q, idx) => ({ ...q, number: idx + 6 })),
      },
      {
        id: 'sec-3',
        roman: 'III',
        title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ',
        formula: '5 × 1 = 5',
        marksPerQuestion: 1,
        totalMarks: 5,
        layout: 'single',
        questions: [
          ...INITIAL_40_MARKS_PAPER.sections[2].questions,
          {
            id: 'q-50m-extra1',
            number: 15,
            questionText: 'ಬೇಸಿಗೆಯ ನಂತರ ಯಾವ ಋತುವು ಪ್ರಕೃತಿಯನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ?',
            lessonName: 'ಬೇಸಿಗೆ',
            marks: 1,
            answer: 'ವರ್ಷ ಋತು (ಮಳೆಗಾಲ) ಪ್ರಕೃತಿಯನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ.',
          },
        ].map((q, idx) => ({ ...q, number: idx + 11 })),
      },
      {
        id: 'sec-4',
        roman: 'IV',
        title: 'ಸ್ವಂತ ವಾಕ್ಯದಲ್ಲಿ ಬರೆಯಿರಿ / ವ್ಯಾಕರಣ',
        formula: '5 × 1 = 5',
        marksPerQuestion: 1,
        totalMarks: 5,
        layout: 'two-column',
        questions: [
          ...INITIAL_40_MARKS_PAPER.sections[3].questions,
          {
            id: 'q-50m-extra2',
            number: 20,
            questionText: 'ಪರಿಶ್ರಮ',
            lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
            marks: 1,
            answer: 'ನಿರಂತರ ಪರಿಶ್ರಮದಿಂದ ಜೀವನದಲ್ಲಿ ಯಶಸ್ಸು ಸಾಧಿಸಬಹುದು.',
          },
        ].map((q, idx) => ({ ...q, number: idx + 16 })),
      },
      {
        id: 'sec-5',
        roman: 'V',
        title: 'ಎರಡು-ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ',
        formula: '7 × 2 = 14',
        marksPerQuestion: 2,
        totalMarks: 14,
        layout: 'single',
        questions: [
          ...INITIAL_40_MARKS_PAPER.sections[4].questions,
          {
            id: 'q-50m-extra-2m-1',
            number: 26,
            questionText: 'ಗಂಧರ್ವಸೇನನ ಕಥೆಯಿಂದ ನಮಗೆ ದೊರೆಯುವ ಮುಖ್ಯ ನೀತಿಪಾಠವೇನು?',
            lessonName: 'ಗಂಧರ್ವಸೇನ',
            marks: 2,
            answer: 'ಯಾವುದೇ ವಿಷಯದ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ವಿಚಾರಿಸದೆ ಮೂರ್ಖರಂತೆ ಕಣ್ಣುಮುಚ್ಚಿ ನಂಬಬಾರದು.',
          },
          {
            id: 'q-50m-extra-2m-2',
            number: 27,
            questionText: 'ಲೋಪಸಂಧಿ ಎಂದರೇನು? ಒಂದು ಉದಾಹರಣೆ ನೀಡಿ.',
            lessonName: 'ವ್ಯಾಕರಣ',
            marks: 2,
            answer: 'ಸ್ವರದ ಮುಂದೆ ಸ್ವರ ಬಂದು ಅರ್ಥ ಕೆಡದಂತೆ ಪೂರ್ವ ಸ್ವರ ಬಿಟ್ಟುಹೋಗುವುದೇ ಲೋಪಸಂಧಿ. ಉದಾ: ಊರೂರು = ಊರು + ಊರು.',
          },
        ].map((q, idx) => ({ ...q, number: idx + 21 })),
      },
      {
        id: 'sec-6',
        roman: 'VI',
        title: 'ನಾಲ್ಕು-ಐದು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಪತ್ರ ಲೇಖನ',
        formula: '4 × 4 = 16',
        marksPerQuestion: 4,
        totalMarks: 16,
        layout: 'single',
        questions: [
          {
            id: 'q-50m-4m-1',
            number: 28,
            questionText: '‘ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ’ ಪದ್ಯದ ಆಶಯವನ್ನು ನಿಮ್ಮ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ.',
            lessonName: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ',
            marks: 4,
            answer: 'ಮಕ್ಕಳಲ್ಲಿ ವೈಜ್ಞಾನಿಕ ಅನ್ವೇಷಣಾ ಮನೋಭಾವ ಮತ್ತು ಹೊಸ ಲೋಕಗಳನ್ನು ತಿಳಿಯುವ ಹಂಬಲವನ್ನು ಬೆಳೆಸುವುದು ಇದರ ಆಶಯ.',
          },
          {
            id: 'q-50m-4m-2',
            number: 29,
            questionText: 'ಕೃಷ್ಣನು ಸುಧಾಮನಿಗೆ ಮನೆ ಕಟ್ಟಿಸಿಕೊಟ್ಟ ಸಂದರ್ಭವನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ.',
            lessonName: 'ಕೃಷ್ಣ-ಸುಧಾಮ',
            marks: 4,
            answer: 'ಸುಧಾಮನು ನಿಷ್ಕಾಮ ಭಕ್ತಿಯಿಂದ ಅವಲಕ್ಕಿ ನೀಡಿದನು. ಶ್ರೀಕೃಷ್ಣನು ಅವನ ಬಡ ಗುಡಿಸಲನ್ನು ಭವ್ಯ ಅರಮನೆಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿದನು.',
          },
          {
            id: 'q-50m-4m-3',
            number: 30,
            questionText: 'ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಸರಳತೆ ಮತ್ತು ವ್ಯಕ್ತಿತ್ವದ ಬಗ್ಗೆ ನಾಲ್ಕು ವಾಕ್ಯ ಬರೆಯಿರಿ.',
            lessonName: 'ಡಾ. ರಾಜಕುಮಾರ್',
            marks: 4,
            answer: 'ಅವರು ಅತ್ಯಂತ ನಮ್ರ ಹಾಗೂ ಸರಳ ವ್ಯಕ್ತಿಯಾಗಿದ್ದರು. ಕನ್ನಡ ನಾಡು-ನುಡಿಯ ಸೇವೆಗೆ ಸದಾ ಮುಂಚೂಣಿಯಲ್ಲಿದ್ದರು. ಅಭಿಮಾನಿಗಳನ್ನು ದೇವರು ಎಂದು ಗೌರವಿಸುತ್ತಿದ್ದರು.',
          },
          {
            id: 'q-50m-4m-4',
            number: 31,
            questionText: 'ಮೂರು ದಿನಗಳ ರಜೆ ಕೋರಿ ನಿಮ್ಮ ಶಾಲೆಯ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರಿಗೆ ರಜಾ ಪತ್ರವನ್ನು ಬರೆಯಿರಿ.',
            lessonName: 'ಪತ್ರ ಲೇಖನ (Letter Writing)',
            marks: 4,
            answer: 'ಸ್ಥಳ, ದಿನಾಂಕ, ಇವರಿಗೆ: ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು, ಮಾನ್ಯರೇ, ವಿಷಯ: ರಜೆ ಕೋರಿ, ಪತ್ರದ ಒಡಲು (ಕಾರಣಗಳು), ವಂದನೆಗಳೊಂದಿಗೆ, ತಮ್ಮ ವಿಧೇಯ ವಿದ್ಯಾರ್ಥಿ ಸಹಿ.',
            isLetterWriting: true,
          },
        ],
      },
    ],
  };
}

// Blue Print Data Model
export interface BlueprintRow {
  chapter: string;
  knowledge: number;
  understanding: number;
  application: number;
  skill: number;
  total: number;
}

export const BLUEPRINT_DATA: BlueprintRow[] = [
  { chapter: 'ನೀ ಹೋದ ಮರುದಿನ', knowledge: 1, understanding: 1, application: 1, skill: 0, total: 3 },
  { chapter: 'ಗಂಧರ್ವಸೇನ', knowledge: 1, understanding: 2, application: 2, skill: 1, total: 6 },
  { chapter: 'ಅವ್ವ', knowledge: 1, understanding: 2, application: 1, skill: 1, total: 5 },
  { chapter: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ', knowledge: 1, understanding: 1, application: 0, skill: 4, total: 6 },
  { chapter: 'ಕೃಷ್ಣ-ಸುಧಾಮ', knowledge: 1, understanding: 3, application: 2, skill: 2, total: 8 },
  { chapter: 'ಬೇಸಿಗೆ', knowledge: 1, understanding: 2, application: 1, skill: 3, total: 7 },
  { chapter: 'ಡಾ. ರಾಜಕುಮಾರ್', knowledge: 1, understanding: 1, application: 1, skill: 0, total: 3 },
  { chapter: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು', knowledge: 1, understanding: 1, application: 0, skill: 0, total: 2 },
];
