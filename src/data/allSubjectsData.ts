export interface SubjectOption {
  id: string;
  nameKannada: string;
  nameEnglish: string;
  code: string;
  defaultTime: string;
}

export const ALL_SUBJECTS: SubjectOption[] = [
  { id: 'kannada', nameKannada: 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ - ಸಿರಿಗನ್ನಡ)', nameEnglish: 'Kannada (First Language)', code: 'KAN', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'english', nameKannada: 'ಇಂಗ್ಲಿಷ್ (English SL)', nameEnglish: 'English (Second Language)', code: 'ENG', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'hindi', nameKannada: 'ಹಿಂದಿ (Hindi TL)', nameEnglish: 'Hindi (Third Language)', code: 'HINDI', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'mathematics', nameKannada: 'ಗಣಿತ (ಗಣಿತ ಪ್ರಕಾಶ)', nameEnglish: 'Mathematics', code: 'MATHS', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'science', nameKannada: 'ವಿಜ್ಞಾನ ("ಕುತೂಹಲ" Curiosity)', nameEnglish: 'Science', code: 'SCIENCE', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'social', nameKannada: 'ಸಮಾಜ ವಿಜ್ಞಾನ (Social Science)', nameEnglish: 'Social Science', code: 'SOCIAL SCIENCE', defaultTime: '1 ಗಂಟೆ 30 ನಿಮಿಷ' },
  { id: 'value_education', nameKannada: 'ಮೌಲ್ಯ ಶಿಕ್ಷಣ (Value Education)', nameEnglish: 'Value Education', code: 'VALUE EDUCATION', defaultTime: '1 ಗಂಟೆ' },
];

export interface ClassOption {
  id: '6th' | '7th' | '8th';
  nameKannada: string;
  nameEnglish: string;
}

export const ALL_CLASSES: ClassOption[] = [
  { id: '6th', nameKannada: '6ನೇ ತರಗತಿ', nameEnglish: 'Class 6' },
  { id: '7th', nameKannada: '7ನೇ ತರಗತಿ', nameEnglish: 'Class 7' },
  { id: '8th', nameKannada: '8ನೇ ತರಗತಿ', nameEnglish: 'Class 8' },
];

export type ExamType = 'FA' | 'SA1' | 'SA2';

export interface LessonItem {
  id: string;
  name: string;
  type: string;
  part: 1 | 2; // 1 for SA1, 2 for SA2
}

// Comprehensive lessons map for Classes 6, 7, 8 for all 7 subjects partitioned by Part 1 and Part 2
export const SUBJECT_LESSONS_MAP: Record<string, Record<string, LessonItem[]>> = {
  kannada: {
    '6th': [
      // Part 1 (SA1)
      { id: 'nee_hoda', name: 'ನೀ ಹೋದ ಮರುದಿನ', type: 'ಪದ್ಯ', part: 1 },
      { id: 'gandharvasena', name: 'ಗಂಧರ್ವಸೇನ', type: 'ಗದ್ಯ', part: 1 },
      { id: 'avva', name: 'ಅವ್ವ', type: 'ಪದ್ಯ', part: 1 },
      { id: 'putti', name: 'ಮಂಗಳ ಗ್ರಹದಲ್ಲಿ ಪುಟ್ಟಿ', type: 'ಪದ್ಯ', part: 1 },
      { id: 'krishna_sudhama', name: 'ಕೃಷ್ಣ-ಸುಧಾಮ', type: 'ಗದ್ಯ', part: 1 },
      { id: 'besige', name: 'ಬೇಸಿಗೆ', type: 'ಪದ್ಯ', part: 1 },
      { id: 'rajkumar', name: 'ಡಾ. ರಾಜಕುಮಾರ್', type: 'ಗದ್ಯ', part: 1 },
      { id: 'magu_hannu', name: 'ಮಗು ಮತ್ತು ಹಣ್ಣುಗಳು', type: 'ಪದ್ಯ', part: 1 },
      { id: 'madivalayya', name: 'ಮಡಿವಾಳಿಯ ಕತ್ತೆ', type: 'ಪೂರಕ', part: 1 },
      // Part 2 (SA2)
      { id: 'siddhartha', name: 'ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', type: 'ಗದ್ಯ', part: 2 },
      { id: 'neeti_marga', name: 'ನೀತಿ ಮಾರ್ಗ (ಸರ್ವಜ್ಞ)', type: 'ಪದ್ಯ', part: 2 },
      { id: 'dheera_senani', name: 'ಧೀರ ಸೇನಾನಿ (ಮೇಜರ್ ಸಂದೀಪ್)', type: 'ಗದ್ಯ', part: 2 },
      { id: 'ambedkar', name: 'ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರ ಬಾಲ್ಯ', type: 'ಗದ್ಯ', part: 2 },
      { id: 'karunalu', name: 'ಕರುಣಾಳು ಬೆಳಕೆ (ಡಿ.ವಿ.ಜಿ)', type: 'ಪದ್ಯ', part: 2 },
      { id: 'yakshagana', name: 'ಯಕ್ಷಗಾನ ಕಲೆಯ ಸೊಬಗು', type: 'ಗದ್ಯ', part: 2 },
      { id: 'kannada_nadu', name: 'ಕನ್ನಡ ನಾಡು ನುಡಿ (ಕುವೆಂಪು)', type: 'ಪದ್ಯ', part: 2 },
    ],
    '7th': [
      // Part 1 (SA1)
      { id: 'puttajji', name: 'ಪುಟ್ಟಜ್ಜಿ ಪುಟ್ಟಜ್ಜಿ ಕತೆ ಹೇಳು', type: 'ಗದ್ಯ', part: 1 },
      { id: 'swatantrya', name: 'ಸ್ವಾತಂತ್ರ್ಯ ಸ್ವರ್ಗ (ಟ್ಯಾಗೋರ್)', type: 'ಪದ್ಯ', part: 1 },
      { id: 'vishveshwaraiah', name: 'ಭಾಗ್ಯದ ಶಿಲ್ಪಿ ಸರ್ ಎಂ.ವಿಶ್ವೇಶ್ವರಯ್ಯ', type: 'ಗದ್ಯ', part: 1 },
      { id: 'tayiya_madilu', name: 'ತಾಯಿಯ ಮಡಿಲು', type: 'ಪದ್ಯ', part: 1 },
      { id: 'pravasa', name: 'ಪ್ರವಾಸ ಪ್ರೇಮ (ಕಾರಂತ)', type: 'ಗದ್ಯ', part: 1 },
      { id: 'vachana', name: 'ವಚನಾಮೃತ (ಬಸವಣ್ಣ, ಅಕ್ಕಮಹಾದೇವಿ)', type: 'ಪದ್ಯ', part: 1 },
      // Part 2 (SA2)
      { id: 'chennamma', name: 'ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ', type: 'ಗದ್ಯ', part: 2 },
      { id: 'shramada_gourava', name: 'ಶ್ರಮದ ಗೌರವ', type: 'ಪದ್ಯ', part: 2 },
      { id: 'gida_netta', name: 'ಗಿಡ ನೆಟ್ಟ ಹುಡುಗ', type: 'ಗದ್ಯ', part: 2 },
      { id: 'kanakadasa', name: 'ಕನಕದಾಸರ ಕೀರ್ತನೆಗಳು', type: 'ಪದ್ಯ', part: 2 },
      { id: 'janapada', name: 'ಜನಪದ ಕಲೆಗಳ ವೈಭವ', type: 'ಗದ್ಯ', part: 2 },
      { id: 'harishchandra', name: 'ಸತ್ಯವಂತ ಹರಿಶ್ಚಂದ್ರ', type: 'ಪೂರಕ', part: 2 },
    ],
    '8th': [
      // Part 1 (SA1)
      { id: 'magada', name: 'ಮಗಧ ಸಾಮ್ರಾಜ್ಯದ ವೈಭವ', type: 'ಗದ್ಯ', part: 1 },
      { id: 'kannadigara_tay', name: 'ಕನ್ನಡಿಗರ ತಾಯಿ (ಕುವೆಂಪು)', type: 'ಪದ್ಯ', part: 1 },
      { id: 'sirigannada8', name: 'ಹೊಸಗನ್ನಡ ಕಾವ್ಯದ ಸೊಬಗು', type: 'ಪದ್ಯ', part: 1 },
      { id: 'talakadu', name: 'ತಲಕಾಡಿನ ಗಂಗರು ಮತ್ತು ಶಿಲ್ಪಕಲೆ', type: 'ಗದ್ಯ', part: 1 },
      // Part 2 (SA2)
      { id: 'bharata_shilpi', name: 'ಭಾರತರತ್ನ ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್', type: 'ಗದ್ಯ', part: 2 },
      { id: 'somanatha', name: 'ಸೋಮನಾಥಪುರದ ದೇವಾಲಯ', type: 'ಪೂರಕ', part: 2 },
      { id: 'bendre', name: 'ದ.ರಾ. ಬೇಂದ್ರೆಯವರ ಕವಿತೆಗಳು', type: 'ಪದ್ಯ', part: 2 },
      { id: 'halagali', name: 'ಹಲಗಲಿಯ ಬೇಡರ ದಂಗೆ', type: 'ಗದ್ಯ', part: 2 },
    ],
  },
  english: {
    '6th': [
      // Part 1 (SA1)
      { id: 'en-1', name: 'Prose: A Great Martyr Ever Cherished', type: 'Prose', part: 1 },
      { id: 'en-2', name: 'Poem: The Rainbow (Christina Rossetti)', type: 'Poem', part: 1 },
      { id: 'en-3', name: 'Prose: The King and The Spider', type: 'Prose', part: 1 },
      { id: 'en-4', name: 'Poem: Kindness to Animals', type: 'Poem', part: 1 },
      // Part 2 (SA2)
      { id: 'en-5', name: 'Prose: Anandi Gopal - India’s First Woman Doctor', type: 'Prose', part: 2 },
      { id: 'en-6', name: 'Poem: Sympathy (Charles Mackay)', type: 'Poem', part: 2 },
      { id: 'en-7', name: 'Prose: Wonders of the Forest', type: 'Prose', part: 2 },
      { id: 'en-8', name: 'Poem: Paper Boats (Tagore)', type: 'Poem', part: 2 },
    ],
    '7th': [
      { id: 'en7-1', name: 'Prose: The Three Questions', type: 'Prose', part: 1 },
      { id: 'en7-2', name: 'Poem: The Squirrel', type: 'Poem', part: 1 },
      { id: 'en7-3', name: 'Prose: A Gift of Chappals', type: 'Prose', part: 1 },
      { id: 'en7-4', name: 'Poem: The Rebel', type: 'Poem', part: 2 },
      { id: 'en7-5', name: 'Prose: Gopal and the Hilsa Fish', type: 'Prose', part: 2 },
      { id: 'en7-6', name: 'Poem: Trees', type: 'Poem', part: 2 },
    ],
    '8th': [
      { id: 'en8-1', name: 'Prose: The Best Christmas Present', type: 'Prose', part: 1 },
      { id: 'en8-2', name: 'Poem: The Ant and the Cricket', type: 'Poem', part: 1 },
      { id: 'en8-3', name: 'Prose: The Tsunami', type: 'Prose', part: 1 },
      { id: 'en8-4', name: 'Poem: Geography Lesson', type: 'Poem', part: 2 },
      { id: 'en8-5', name: 'Prose: Glimpses of the Past', type: 'Prose', part: 2 },
      { id: 'en8-6', name: 'Poem: The Last Bargain', type: 'Poem', part: 2 },
    ],
  },
  mathematics: {
    '6th': [
      // Part 1 (SA1)
      { id: 'ma-1', name: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ ಮತ್ತು ನಮ್ಮ ಸಂಖ್ಯೆಗಳು', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma-2', name: 'ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳು (Whole Numbers)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma-3', name: 'ಸಂಖ್ಯಾ ವಿನ್ಯಾಸಗಳ ಅನ್ವೇಷಣೆ (Patterns)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma-4', name: 'ಮೂಲ ರೇಖಾಗಣಿತೀಯ ಕಲ್ಪನೆಗಳು (Geometry)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      // Part 2 (SA2)
      { id: 'ma-5', name: 'ಪ್ರಾಥಮಿಕ ಆಕಾರಗಳನ್ನು ತಿಳಿಯುವುದು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma-6', name: 'ಪೂರ್ಣಾಂಕಗಳು (Integers)', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma-7', name: 'ಭಿನ್ನರಾಶಿಗಳು ಮತ್ತು ದಶಮಾಂಶಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma-8', name: 'ಕ್ಷೇತ್ರಗಣಿತ - ಸುತ್ತಳತೆ & ವಿಸ್ತೀರ್ಣ', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
    '7th': [
      { id: 'ma7-1', name: 'ಪೂರ್ಣಾಂಕಗಳು ಮತ್ತು ಗುಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma7-2', name: 'ಭಿನ್ನರಾಶಿಗಳು ಮತ್ತು ದಶಮಾಂಶಗಳು', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma7-3', name: 'ದತ್ತಾಂಶಗಳ ನಿರ್ವಹಣೆ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma7-4', name: 'ಸರಳ ಸಮೀಕರಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma7-5', name: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma7-6', name: 'ತ್ರಿಭುಜ ಮತ್ತು ಅದರ ಗುಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
    '8th': [
      { id: 'ma8-1', name: 'ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಗಳು (Rational Numbers)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma8-2', name: 'ರೇಖಾತ್ಮಕ ಸಮೀಕರಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma8-3', name: 'ಚತುರ್ಭುಜಗಳ ತಿಳುವಳಿಕೆ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'ma8-4', name: 'ವರ್ಗ ಮತ್ತು ವರ್ಗಮೂಲಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma8-5', name: 'ಘನ ಮತ್ತು ಘನಮೂಲಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'ma8-6', name: 'ಬೀಜೋಕ್ತಿಗಳು ಮತ್ತು ನಿತ್ಯಸಮೀಕರಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
  },
  science: {
    '6th': [
      // Part 1 (SA1)
      { id: 'sc-1', name: 'ವಿಜ್ಞಾನದ ಅದ್ಭುತ ಪ್ರಪಂಚ (World of Science)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc-2', name: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ (Living World)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc-3', name: 'ಮನದುಂಬಿದ ಊಟ: ಸ್ವಸ್ಥ ಶರೀರಕ್ಕೆ ಸೋಪಾನ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc-4', name: 'ಕಾಂತಗಳ ಅನ್ವೇಷಣೆ (Magnets)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      // Part 2 (SA2)
      { id: 'sc-5', name: 'ಉದ್ದದ ಅಳತೆ ಮತ್ತು ಚಲನೆ (Measurement)', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc-6', name: 'ನಮ್ಮ ಸುತ್ತಲಿನ ಸಾಮಗ್ರಿಗಳು (Materials)', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc-7', name: 'ತಾಪ ಮತ್ತು ಅದರ ಮಾಪನ', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc-8', name: 'ನೀರಿನ ಸ್ಥಿತಿಗಳು ಮತ್ತು ಪರಿಚಲನೆ', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
    '7th': [
      { id: 'sc7-1', name: 'ಸಸ್ಯಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Plants)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc7-2', name: 'ಪ್ರಾಣಿಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Animals)', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc7-3', name: 'ಶಾಖ ಮತ್ತು ತಾಪಮಾನ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc7-4', name: 'ಆಮ್ಲಗಳು, ಪ್ರತ್ಯಾಮ್ಲಗಳು ಮತ್ತು ಲವಣಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc7-5', name: 'ಭೌತ ಮತ್ತು ರಾಸಾಯನಿಕ ಬದಲಾವಣೆಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc7-6', name: 'ಜೀವಿಗಳಲ್ಲಿ ಉಸಿರಾಟ', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
    '8th': [
      { id: 'sc8-1', name: 'ಬೆಳೆ ಉತ್ಪಾದನೆ ಮತ್ತು ನಿರ್ವಹಣೆ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc8-2', name: 'ಸೂಕ್ಷ್ಮಜೀವಿಗಳು: ಮಿತ್ರ ಮತ್ತು ಶತ್ರು', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc8-3', name: 'ಕಲ್ಲಿದ್ದಲು ಮತ್ತು ಪೆಟ್ರೋಲಿಯಂ', type: 'ಅಧ್ಯಾಯ', part: 1 },
      { id: 'sc8-4', name: 'ದಹನ ಮತ್ತು ಜ್ವಾಲೆ', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc8-5', name: 'ಕೋಶ - ರಚನೆ ಮತ್ತು ಕಾರ್ಯಗಳು', type: 'ಅಧ್ಯಾಯ', part: 2 },
      { id: 'sc8-6', name: 'ಪ್ರಾಣಿಗಳಲ್ಲಿ ಸಂತಾನೋತ್ಪತ್ತಿ', type: 'ಅಧ್ಯಾಯ', part: 2 },
    ],
  },
  social: {
    '6th': [
      // Part 1 (SA1)
      { id: 'so-1', name: 'ನಮ್ಮ ಕರ್ನಾಟಕ (ಕಂದಾಯ ವಿಭಾಗಗಳು & ಸಂಪತ್ತು)', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so-2', name: 'ಇತಿಹಾಸ ಪರಿಚಯ ಮತ್ತು ಐತಿಹಾಸಿಕ ಆಧಾರಗಳು', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so-3', name: 'ಪ್ರಾಚೀನ ಸಿಂಧೂ ನಾಗರಿಕತೆ & ವೇದಕಾಲ', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so-4', name: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು (ನಕ್ಷೆ ಓದುವಿಕೆ)', type: 'ಭೂಗೋಳ', part: 1 },
      // Part 2 (SA2)
      { id: 'so-5', name: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಅಶೋಕನ ಧರ್ಮ', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so-6', name: 'ಗುಪ್ತರು ಮತ್ತು ವರ್ಧನರ ಕಾಲ', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so-7', name: 'ದಕ್ಷಿಣ ಭಾರತದ ಅರಸು ಮನೆತನಗಳು', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so-8', name: 'ನಮ್ಮ ಸಂವಿಧಾನ ಮತ್ತು ಪ್ರಜಾಪ್ರಭುತ್ವ', type: 'ಪೌರನೀತಿ', part: 2 },
    ],
    '7th': [
      { id: 'so7-1', name: 'ಉತ್ತರ ಭಾರತದ ರಜಪೂತ ಮನೆತನಗಳು', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so7-2', name: 'ಚೋಳರು ಮತ್ತು ಹೊಯ್ಸಳರು', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so7-3', name: 'ಭೂಮಿಯ ಆಂತರಿಕ ರಚನೆ & ಶಿಲೆಗಳು', type: 'ಭೂಗೋಳ', part: 1 },
      { id: 'so7-4', name: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಬಹಮನಿ', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so7-5', name: 'ಮೊಘಲರು ಮತ್ತು ಮರಾಠರು', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so7-6', name: 'ಸಂವಿಧಾನದ ಮೂಲಭೂತ ಹಕ್ಕುಗಳು', type: 'ಪೌರನೀತಿ', part: 2 },
    ],
    '8th': [
      { id: 'so8-1', name: 'ಭಾರತಕ್ಕೆ ಯುರೋಪಿಯನ್ನರ ಆಗಮನ', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so8-2', name: 'ಬ್ರಿಟಿಷ್ ಆಳ್ವಿಕೆಯ ವಿಸ್ತರಣೆ', type: 'ಇತಿಹಾಸ', part: 1 },
      { id: 'so8-3', name: 'ಭಾರತದ ನೈಸರ್ಗಿಕ ವಿಭಾಗಗಳು & ಮಣ್ಣುಗಳು', type: 'ಭೂಗೋಳ', part: 1 },
      { id: 'so8-4', name: '1857 ರ ಪ್ರಥಮ ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮ', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so8-5', name: 'ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಸುಧಾರಣೆಗಳು', type: 'ಇತಿಹಾಸ', part: 2 },
      { id: 'so8-6', name: 'ನಮ್ಮ ಸಂಸತ್ತು ಮತ್ತು ಶಾಸಕಾಂಗ', type: 'ಪೌರನೀತಿ', part: 2 },
    ],
  },
  hindi: {
    '6th': [
      { id: 'hi-1', name: 'वर्णमाला और सरल शब्द', type: 'पाठ', part: 1 },
      { id: 'hi-2', name: 'कविता: प्रार्थना', type: 'कविता', part: 1 },
      { id: 'hi-3', name: 'पाठ: मेरा घर और परिवार', type: 'पाठ', part: 1 },
      { id: 'hi-4', name: 'कविता: हमारे पशु-पक्षी', type: 'कविता', part: 2 },
      { id: 'hi-5', name: 'पाठ: मेरा देश भारत', type: 'पाठ', part: 2 },
      { id: 'hi-6', name: 'कहानी: चतुर खरगोश', type: 'कहानी', part: 2 },
    ],
    '7th': [
      { id: 'hi7-1', name: 'कविता: हम पंछी उन्मुक्त गगन के', type: 'कविता', part: 1 },
      { id: 'hi7-2', name: 'कहानी: दादी माँ', type: 'कहानी', part: 1 },
      { id: 'hi7-3', name: 'निबंध: हिमालय की बेटियाँ', type: 'निबंध', part: 1 },
      { id: 'hi7-4', name: 'कहानी: मिठाईवाला', type: 'कहानी', part: 2 },
      { id: 'hi7-5', name: 'पाठ: रक्त और हमारा शरीर', type: 'पाठ', part: 2 },
    ],
    '8th': [
      { id: 'hi8-1', name: 'कविता: ध्वनि', type: 'कविता', part: 1 },
      { id: 'hi8-2', name: 'कहानी: लाख की चूड़ियाँ', type: 'कहानी', part: 1 },
      { id: 'hi8-3', name: 'व्यंग्य: बस की यात्रा', type: 'व्यंग್ಯ', part: 1 },
      { id: 'hi8-4', name: 'कविता: दीवानों की हस्ती', type: 'कविता', part: 2 },
      { id: 'hi8-5', name: 'कहानी: चिट्ठियों की अनूठी दुनिया', type: 'कहानी', part: 2 },
    ],
  },
  value_education: {
    '6th': [
      { id: 've-1', name: 'ಸ್ವಯಂ ಅರಿವು ಮತ್ತು ಸತ್ಯತೆ (Truthfulness)', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've-2', name: 'ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ನೈತಿಕ ವರ್ತನೆ (Honesty)', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've-3', name: 'ಗುರುಹಿರಿಯರಿಗೆ ಗೌರವ ಮತ್ತು ಕೃತಜ್ಞತೆ', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've-4', name: 'ಪ್ರಾಣಿ ದಯೆ ಮತ್ತು ಪರಿಸರ ಸಂರಕ್ಷಣೆ', type: 'ಮೌಲ್ಯ', part: 2 },
      { id: 've-5', name: 'ದೇಶಭಕ್ತಿ ಮತ್ತು ರಾಷ್ಟ್ರಧ್ವಜದ ಮೌಲ್ಯಗಳು', type: 'ಮೌಲ್ಯ', part: 2 },
      { id: 've-6', name: 'ಧೈರ್ಯ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ದೃಢತೆ', type: 'ಮೌಲ್ಯ', part: 2 },
    ],
    '7th': [
      { id: 've7-1', name: 'ಕಾಯಕ ನಿಷ್ಠೆ (Dignity of Labour)', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've7-2', name: 'ನೈತಿಕ ಮೌಲ್ಯಗಳು ಮತ್ತು ಮಾನವೀಯತೆ', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've7-3', name: 'ಶಾಂತಿ, ಅಹಿಂಸೆ ಮತ್ತು ಸಾಮರಸ್ಯ', type: 'ಮೌಲ್ಯ', part: 2 },
      { id: 've7-4', name: 'ಡಿಜಿಟಲ್ ಜಾಗೃತಿ ಮತ್ತು ಸೈಬರ್ ಸುರಕ್ಷತೆ', type: 'ಮೌಲ್ಯ', part: 2 },
    ],
    '8th': [
      { id: 've8-1', name: 'ಸತ್ಯಶೋಧನೆ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ದೃಷ್ಟಿಕೋನ', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've8-2', name: 'ಸಂವಿಧಾನಿಕ ಮೌಲ್ಯಗಳು, ನ್ಯಾಯ ಮತ್ತು ಸಮಾನತೆ', type: 'ಮೌಲ್ಯ', part: 1 },
      { id: 've8-3', name: 'ಪರಿಸರ ಪ್ರಜ್ಞೆ ಮತ್ತು ಸುಸ್ಥಿರ ಅಭಿವೃದ್ಧಿ', type: 'ಮೌಲ್ಯ', part: 2 },
      { id: 've8-4', name: 'ನಾಯಕತ್ವ ಗುಣಗಳು ಮತ್ತು ಸಾಮಾಜಿಕ ಸೇವೆ', type: 'ಮೌಲ್ಯ', part: 2 },
    ],
  },
};

// Filter lessons based on Exam Type (FA, SA1, SA2)
export function getLessonsForExam(
  subjectId: string,
  classId: string,
  examType: ExamType
): LessonItem[] {
  const all = SUBJECT_LESSONS_MAP[subjectId]?.[classId] || [];
  if (examType === 'SA1') {
    return all.filter((l) => l.part === 1);
  }
  if (examType === 'SA2') {
    return all.filter((l) => l.part === 2);
  }
  // FA can use Part 1 by default
  return all.filter((l) => l.part === 1);
}
