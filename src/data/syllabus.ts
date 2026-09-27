import { ClassId, ExamId, QuestionType, SubjectId, SubjectInfo } from '../types';
import { getCustomLessonsStorage } from '../services/storage';

export interface QuestionTypeMeta {
  type: QuestionType;
  titleKannada: string;
  titleEnglish: string;
  defaultMarks: number;
  typicalHeader: string;
  hasOptions?: boolean;
  hasMatchPairs?: boolean;
  typicalLines: number;
}

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeMeta> = {
  fill_blank: {
    type: 'fill_blank',
    titleKannada: '೧. ಖಾಲಿ ಜಾಗ ತುಂಬಿರಿ',
    titleEnglish: 'Fill in the blanks',
    defaultMarks: 1,
    typicalHeader: 'ಕೆಳಗಿನ ಖಾಲಿ ಜಾಗಗಳನ್ನು ಸೂಕ್ತ ಪದಗಳಿಂದ ಭರ್ತಿ ಮಾಡಿ:',
    typicalLines: 1,
  },
  choose_correct: {
    type: 'choose_correct',
    titleKannada: '೨. ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    titleEnglish: 'Choose the correct answer',
    defaultMarks: 1,
    typicalHeader: 'ಕೊಟ್ಟಿರುವ ಆಯ್ಕೆಗಳಲ್ಲಿ ಸೂಕ್ತವಾದ ಉತ್ತರವನ್ನು ಆರಿಸಿ ಬರೆಯಿರಿ:',
    hasOptions: true,
    typicalLines: 2,
  },
  match_following: {
    type: 'match_following',
    titleKannada: '೩. ಹೊಂದಿಸಿ ಬರೆಯಿರಿ',
    titleEnglish: 'Match the following',
    defaultMarks: 4,
    typicalHeader: '‘ಎ’ ಗುಂಪಿಗೆ ‘ಬಿ’ ಗುಂಪನ್ನು ಹೊಂದಿಸಿ ಬರೆಯಿರಿ:',
    hasMatchPairs: true,
    typicalLines: 4,
  },
  one_word_sentence: {
    type: 'one_word_sentence',
    titleKannada: '೪. ಒಂದು ಪದ/ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ',
    titleEnglish: 'Answer in one word or sentence',
    defaultMarks: 1,
    typicalHeader: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಒಂದು ಪದ ಅಥವಾ ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ:',
    typicalLines: 2,
  },
  two_three_sentences: {
    type: 'two_three_sentences',
    titleKannada: '೫. ಎರಡು/ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ',
    titleEnglish: 'Answer in 2-3 sentences',
    defaultMarks: 2,
    typicalHeader: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಎರಡು ಅಥವಾ ಮೂರು ವಾಕ್ಯಗಳಲ್ಲಿ ಉತ್ತರಿಸಿ:',
    typicalLines: 4,
  },
  short_answer: {
    type: 'short_answer',
    titleKannada: '೬. ಸಂಕ್ಷಿಪ್ತ ಉತ್ತರ',
    titleEnglish: 'Short answer',
    defaultMarks: 2,
    typicalHeader: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಉತ್ತರಿಸಿ:',
    typicalLines: 4,
  },
  descriptive_answer: {
    type: 'descriptive_answer',
    titleKannada: '೭. ವಿವರಣಾತ್ಮಕ ಉತ್ತರ',
    titleEnglish: 'Descriptive answer',
    defaultMarks: 3,
    typicalHeader: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ವಿವರವಾಗಿ ಉತ್ತರಿಸಿ:',
    typicalLines: 6,
  },
  state_difference: {
    type: 'state_difference',
    titleKannada: '೮. ವ್ಯತ್ಯಾಸ ತಿಳಿಸಿ',
    titleEnglish: 'State the differences',
    defaultMarks: 2,
    typicalHeader: 'ಕೆಳಗಿನವುಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸಗಳನ್ನು ತಿಳಿಸಿ:',
    typicalLines: 4,
  },
  give_reason: {
    type: 'give_reason',
    titleKannada: '೯. ಕಾರಣ ನೀಡಿ',
    titleEnglish: 'Give scientific/historical reasons',
    defaultMarks: 2,
    typicalHeader: 'ಕೆಳಗಿನ ಹೇಳಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ವೈಜ್ಞಾನಿಕ/ಯುಕ್ತ ಕಾರಣಗಳನ್ನು ನೀಡಿ:',
    typicalLines: 4,
  },
  true_false: {
    type: 'true_false',
    titleKannada: '೧೦. ಸರಿಯೇ/ತಪ್ಪೇ',
    titleEnglish: 'True or False',
    defaultMarks: 1,
    typicalHeader: 'ಕೆಳಗಿನ ಹೇಳಿಕೆಗಳು ಸರಿಯೋ ತಪ್ಪೋ ಎಂದು ಗುರುತಿಸಿ:',
    typicalLines: 1,
  },
  mcq: {
    type: 'mcq',
    titleKannada: '೧೧. ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆ',
    titleEnglish: 'Multiple Choice Question',
    defaultMarks: 1,
    typicalHeader: 'ಕೆಳಗಿನ ಪ್ರತಿಯೊಂದು ಪ್ರಶ್ನೆಗೆ ನಾಲ್ಕು ಆಯ್ಕೆಗಳನ್ನು ನೀಡಲಾಗಿದೆ. ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಬರೆಯಿರಿ:',
    hasOptions: true,
    typicalLines: 2,
  },
  diagram_based: {
    type: 'diagram_based',
    titleKannada: '೧೨. ಚಿತ್ರಾಧಾರಿತ ಪ್ರಶ್ನೆ',
    titleEnglish: 'Diagram/Image based question',
    defaultMarks: 3,
    typicalHeader: 'ಕೆಳಗಿನ ಚಿತ್ರವನ್ನು ಗಮನಿಸಿ, ಕೇಳಲಾದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ/ಚಿತ್ರ ಬರೆದು ಭಾಗಗಳನ್ನು ಹೆಸರಿಸಿ:',
    typicalLines: 6,
  },
  activity_based: {
    type: 'activity_based',
    titleKannada: '೧೩. ಚಟುವಟಿಕೆ ಆಧಾರಿತ ಪ್ರಶ್ನೆ',
    titleEnglish: 'Activity/Project based question',
    defaultMarks: 3,
    typicalHeader: 'ಕೆಳಗಿನ ಚಟುವಟಿಕೆ/ಪ್ರಯೋಗವನ್ನು ವಿವರಿಸಿ:',
    typicalLines: 6,
  },
};

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'kannada',
    nameKannada: 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ - ಸಿರಿಗನ್ನಡ)',
    nameEnglish: 'Kannada (First Language - Sirigannada)',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20KANNADA%20FL%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20KANNADA%20FL%20Part%202%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20KANNADA%20FL%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20KANNADA%20FL%20Part%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (ಭಾಗ - ೧) - 6th KANNADA FL Part 1 2026-27
        { number: 1, name: 'ಪದ್ಯ: ನೀತಿ ಮಾರ್ಗ (ಸರ್ವಜ್ಞನ ತ್ರಿಪದಿಗಳು)', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        { number: 2, name: 'ಗದ್ಯ: ಸಿದ್ಧಾರ್ಥನ ಕರುಣೆ', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        { number: 3, name: 'ಪದ್ಯ: ಬೆಳೆಯುವ ಸಿರಿ ಮೊಳಕೆಯಲ್ಲಿ (ಸುಮತೀಂದ್ರ ನಾಡಿಗ)', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        { number: 4, name: 'ಗದ್ಯ: ಧೀರ ಸೇನಾನಿ (ಮೇಜರ್ ಸಂದೀಪ್ ಉನ್ನಿಕೃಷ್ಣನ್)', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        { number: 5, name: 'ಪದ್ಯ: ಗಿಡಮರ (ಡಾ. ಸಿದ್ಧಲಿಂಗಯ್ಯ)', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        { number: 6, name: 'ವ್ಯಾಕರಣ: ವರ್ಣಮಾಲೆ, ಸಂಧಿಕಾರ್ಯ (ಲೋಪ, ಆಗಮ, ಆದೇಶ)', exam: 'SA-1', subjectId: 'kannada', classId: '6th' },
        // SA-2 (ಭಾಗ - ೨) - 6th KANNADA FL Part 2 2026-27
        { number: 7, name: 'ಗದ್ಯ: ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರ ಬಾಲ್ಯ ಮತ್ತು ಆದರ್ಶ', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
        { number: 8, name: 'ಪದ್ಯ: ಕರುಣಾಳು ಬೆಳಕೆ (ಡಿ.ವಿ.ಜಿ)', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
        { number: 9, name: 'ಗದ್ಯ: ಯಕ್ಷಗಾನ ಕಲೆಯ ಸೊಬಗು ಮತ್ತು ವೈಭವ', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
        { number: 10, name: 'ಪದ್ಯ: ಕನ್ನಡ ನಾಡು ನುಡಿ (ಕುವೆಂಪು)', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
        { number: 11, name: 'ಪೂರಕ ಓದು: ಸ್ವಾಮಿ ವಿವೇಕಾನಂದರ ಚೈತನ್ಯ ನುಡಿಗಳು', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
        { number: 12, name: 'ವ್ಯಾಕರಣ: ನಾಮಪದ, ಲಿಂಗ, ವಚನ, ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು & ಸಮಾಸ', exam: 'SA-2', subjectId: 'kannada', classId: '6th' },
      ],
      '7th': [
        // SA-1 (ಭಾಗ - ೧) - 7th KANNADA FL Part 1 2026-27 (ಸಿರಿಗನ್ನಡ)
        { number: 1, name: 'ಗದ್ಯ: ಪುಟ್ಟಜ್ಜಿ ಪುಟ್ಟಜ್ಜಿ ಕತೆ ಹೇಳು (ಚಂದ್ರಶೇಖರ ಕಂಬಾರ)', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 2, name: 'ಪದ್ಯ: ಸ್ವಾತಂತ್ರ್ಯ ಸ್ವರ್ಗ (ರವೀಂದ್ರನಾಥ ಠಾಕೂರ್)', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 3, name: 'ಗದ್ಯ: ಭಾಗ್ಯದ ಶಿಲ್ಪಿ ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 4, name: 'ಪದ್ಯ: ತಾಯಿಯ ಮಡಿಲು', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 5, name: 'ಗದ್ಯ: ಪ್ರವಾಸ ಪ್ರೇಮ (ಶಿವರಾಮ ಕಾರಂತ)', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 6, name: 'ಪದ್ಯ: ವಚನಾಮೃತ (ಬಸವಣ್ಣ, ಅಕ್ಕಮಹಾದೇವಿ, ಅಲ್ಲಮಪ್ರಭು)', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        { number: 7, name: 'ವ್ಯಾಕರಣ: ಕನ್ನಡ ಸಂಧಿಗಳು ಮತ್ತು ತತ್ಸಮ-ತದ್ಭವಗಳು', exam: 'SA-1', subjectId: 'kannada', classId: '7th' },
        // SA-2 (ಭಾಗ - ೨) - 7th KANNADA FL Part 2 2026-27 (ಸಿರಿಗನ್ನಡ)
        { number: 8, name: 'ಗದ್ಯ: ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮನ ಸಾಹಸ ಮತ್ತು ದೇಶಪ್ರೇಮ', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 9, name: 'ಪದ್ಯ: ಶ್ರಮದ ಗೌರವ', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 10, name: 'ಗದ್ಯ: ಗಿಡ ನೆಟ್ಟ ಹುಡುಗ', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 11, name: 'ಪದ್ಯ: ಕವಿ-ಕಾವ್ಯ ಪರಿಚಯ (ಕನಕದಾಸರ ಕೀರ್ತನೆಗಳು)', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 12, name: 'ಗದ್ಯ: ಜನಪದ ಕಲೆಗಳ ವೈಭವ ಮತ್ತು ಸಂಸ್ಕೃತಿ', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 13, name: 'ಪೂರಕ ಓದು: ಸತ್ಯವಂತ ಹರಿಶ್ಚಂದ್ರ ಕಥೆ', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
        { number: 14, name: 'ವ್ಯಾಕರಣ: ಸಮಾಸಗಳು, ಕೃದಂತ, ತದ್ಧಿತಾಂತ ಮತ್ತು ವಾಕ್ಯ ಪ್ರಕಾರಗಳು', exam: 'SA-2', subjectId: 'kannada', classId: '7th' },
      ],
    },
  },
  {
    id: 'english',
    nameKannada: 'ಇಂಗ್ಲಿಷ್ (English SL)',
    nameEnglish: 'English (Second Language)',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20English%20SL%20Part%20-1%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20English%20SL%20Part%20-2%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20English%20SL%20Part%20-%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20English%20SL%20Part%20-%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (Part - 1)
        { number: 1, name: 'Prose: A Great Martyr Ever Cherished', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        { number: 2, name: 'Poem: The Rainbow (Christina Rossetti)', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        { number: 3, name: 'Prose: The King and The Spider', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        { number: 4, name: 'Poem: Kindness to Animals', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        { number: 5, name: 'Prose: Anandi Gopal - India’s First Woman Doctor', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        { number: 6, name: 'Grammar: Nouns, Pronouns, Adjectives & Articles', exam: 'SA-1', subjectId: 'english', classId: '6th' },
        // SA-2 (Part - 2)
        { number: 7, name: 'Prose: Kind Hearted Farmer', exam: 'SA-2', subjectId: 'english', classId: '6th' },
        { number: 8, name: 'Poem: Sympathy (Charles Mackay)', exam: 'SA-2', subjectId: 'english', classId: '6th' },
        { number: 9, name: 'Prose: Wonders of the Forest', exam: 'SA-2', subjectId: 'english', classId: '6th' },
        { number: 10, name: 'Poem: Paper Boats (Rabindranath Tagore)', exam: 'SA-2', subjectId: 'english', classId: '6th' },
        { number: 11, name: 'Prose: Where There is a Will There is a Way', exam: 'SA-2', subjectId: 'english', classId: '6th' },
        { number: 12, name: 'Grammar: Tenses, Prepositions, Conjunctions & Letter Writing', exam: 'SA-2', subjectId: 'english', classId: '6th' },
      ],
      '7th': [
        // SA-1 (Part - 1)
        { number: 1, name: 'Prose: The Three Questions (Leo Tolstoy)', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        { number: 2, name: 'Poem: The Squirrel (Mildred Bowers Armstrong)', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        { number: 3, name: 'Prose: A Gift of Chappals', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        { number: 4, name: 'Poem: The Rebel (D. J. Enright)', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        { number: 5, name: 'Prose: Gopal and the Hilsa Fish', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        { number: 6, name: 'Grammar: Direct & Indirect Speech, Question Tags, Conjunctions', exam: 'SA-1', subjectId: 'english', classId: '7th' },
        // SA-2 (Part - 2)
        { number: 7, name: 'Prose: Quality (John Galsworthy)', exam: 'SA-2', subjectId: 'english', classId: '7th' },
        { number: 8, name: 'Poem: Trees (Shirley Bauer)', exam: 'SA-2', subjectId: 'english', classId: '7th' },
        { number: 9, name: 'Prose: Expert Detectives', exam: 'SA-2', subjectId: 'english', classId: '7th' },
        { number: 10, name: 'Poem: Mystery of the Talking Fan', exam: 'SA-2', subjectId: 'english', classId: '7th' },
        { number: 11, name: 'Prose: The Invention of Vita-Wonk', exam: 'SA-2', subjectId: 'english', classId: '7th' },
        { number: 12, name: 'Grammar: Active and Passive Voice, Story Writing & Formal Letters', exam: 'SA-2', subjectId: 'english', classId: '7th' },
      ],
    },
  },
  {
    id: 'hindi',
    nameKannada: 'ಹಿಂದಿ (Hindi TL)',
    nameEnglish: 'Hindi (Third Language)',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20Hindi%20TL%20Part-1%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20Hindi%20TL%20Part-2%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20HINDI%20TL%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20HINDI%20TL%20Part%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (Part - 1)
        { number: 1, name: 'ವರ್ಣಮಾಲಾ ಮತ್ತು ಸರಳ ಶಬ್ದಗಳು (वर्णमाला और सरल शब्द)', exam: 'SA-1', subjectId: 'hindi', classId: '6th' },
        { number: 2, name: 'ಪ್ರಾರ್ಥನಾ (कविता: प्रार्थना)', exam: 'SA-1', subjectId: 'hindi', classId: '6th' },
        { number: 3, name: 'ಮೇರಾ ಘರ್ ಮತ್ತು ಪರಿವಾರ್ (पाठ: मेरा घर और परिवार)', exam: 'SA-1', subjectId: 'hindi', classId: '6th' },
        { number: 4, name: 'ಹಮಾರೇ ಪಶು-ಪಕ್ಷಿ (कविता: हमारे पशु-पक्षी)', exam: 'SA-1', subjectId: 'hindi', classId: '6th' },
        { number: 5, name: 'ಸಂಖ್ಯಾ ಜ್ಞಾನ ೧ ರಿಂದ ೨೦ (गिनती: 1 से 20)', exam: 'SA-1', subjectId: 'hindi', classId: '6th' },
        // SA-2 (Part - 2)
        { number: 6, name: 'ಮೇರಾ ದೇಶ ಭಾರತ (पाठ: मेरा देश भारत)', exam: 'SA-2', subjectId: 'hindi', classId: '6th' },
        { number: 7, name: 'ಚತುರ ಖರಗೋಷ್ (कहानी: चतुर खरगोश)', exam: 'SA-2', subjectId: 'hindi', classId: '6th' },
        { number: 8, name: 'ಅಚ್ಛಾ ಬಾಲಕ್ (पाठ: अच्छा बालक)', exam: 'SA-2', subjectId: 'hindi', classId: '6th' },
        { number: 9, name: 'ಮೇಲಾ (ಪಾಠ: ಗಾವಂ ಕಾ ಮೇಲಾ / मेला)', exam: 'SA-2', subjectId: 'hindi', classId: '6th' },
        { number: 10, name: 'ವ್ಯಾಕರಣ: ಸಂಜ್ಞಾ, ಸರ್ವನಾಮ, ಲಿಂಗ, ವಚನ ಮತ್ತು ವಿಲೋಮ ಶಬ್ದಗಳು', exam: 'SA-2', subjectId: 'hindi', classId: '6th' },
      ],
      '7th': [
        // SA-1 (Part - 1)
        { number: 1, name: 'ಹಮ್ ಪಂಛೀ ಉನ್ಮುಕ್ತ ಗಗನ್ ಕೇ (कविता: हम पंछी उन्मुक्त गगन के)', exam: 'SA-1', subjectId: 'hindi', classId: '7th' },
        { number: 2, name: 'ದಾದೀ ಮಾँ (कहानी: दादी माँ)', exam: 'SA-1', subjectId: 'hindi', classId: '7th' },
        { number: 3, name: 'ಹಿಮಾಲಯ ಕೀ ಬೇಟಿಯಾँ (निबंध: हिमालय की बेटियाँ)', exam: 'SA-1', subjectId: 'hindi', classId: '7th' },
        { number: 4, name: 'ಕಠಪುತಲೀ (कविता: कठपुतली)', exam: 'SA-1', subjectId: 'hindi', classId: '7th' },
        { number: 5, name: 'ಸಂಖ್ಯಾ ಜ್ಞಾನ ೨೧ ರಿಂದ ೫೦ (गिनती: 21 से 50)', exam: 'SA-1', subjectId: 'hindi', classId: '7th' },
        // SA-2 (Part - 2)
        { number: 6, name: 'ಮಿಠಾಯೀವಾಲಾ (कहानी: मिठाईवाला)', exam: 'SA-2', subjectId: 'hindi', classId: '7th' },
        { number: 7, name: 'ರಕ್ತ ಔರ್ ಹಮಾರಾ ಶರೀರ್ (पाठ: रक्त और हमारा शरीर)', exam: 'SA-2', subjectId: 'hindi', classId: '7th' },
        { number: 8, name: 'ಪಾಪಾ ಖೋ ಗಯೇ (नाटक: पापा खो गए)', exam: 'SA-2', subjectId: 'hindi', classId: '7th' },
        { number: 9, name: 'ಶಾಮ - ಏಕ್ ಕಿಸಾನ್ (कविता: शाम - एक किसान)', exam: 'SA-2', subjectId: 'hindi', classId: '7th' },
        { number: 10, name: 'ವ್ಯಾಕರಣ: ವಿಲೋಮ ಶಬ್ದ, ಮುಹಾವರೆ, ವಾಕ್ಯ ರಚನಾ ಮತ್ತು ಪತ್ರ ಲೇಖನ', exam: 'SA-2', subjectId: 'hindi', classId: '7th' },
      ],
    },
  },
  {
    id: 'mathematics',
    nameKannada: 'ಗಣಿತ (ಗಣಿತ ಪ್ರಕಾಶ - UÀtÂvÀ ¥ÀæPÁ±)',
    nameEnglish: 'Mathematics (Ganita Prakasha)',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20Maths%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20Maths%20Part%202%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20Maths%20Part%20-%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20Maths%20Part%20-%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (ಭಾಗ - ೧) - 6th Kannada Maths Part 1 (ಗಣಿತ ಪ್ರಕಾಶ)
        { number: 1, name: 'ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಆಟ ಮತ್ತು ನಮ್ಮ ಸಂಖ್ಯೆಗಳು (Knowing Our Numbers)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        { number: 2, name: 'ಪೂರ್ಣ ಸಂಖ್ಯೆಗಳು (Whole Numbers)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        { number: 3, name: 'ಸಂಖ್ಯಾ ವಿನ್ಯಾಸಗಳ ಅನ್ವೇಷಣೆ (Playing with Numbers & Patterns)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        { number: 4, name: 'ಮೂಲ ರೇಖಾಗಣಿತೀಯ ಕಲ್ಪನೆಗಳು (Basic Geometrical Ideas)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        { number: 5, name: 'ಪ್ರಾಥಮಿಕ ಆಕಾರಗಳನ್ನು ತಿಳಿಯುವುದು (Understanding Elementary Shapes)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        { number: 6, name: 'ಪೂರ್ಣಾಂಕಗಳು (Integers)', exam: 'SA-1', subjectId: 'mathematics', classId: '6th' },
        // SA-2 (ಭಾಗ - ೨) - 6th Kannada Maths Part 2 (ಗಣಿತ ಪ್ರಕಾಶ)
        { number: 7, name: 'ಭಿನ್ನರಾಶಿಗಳು (Fractions)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 8, name: 'ದಶಮಾಂಶಗಳು (Decimals)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 9, name: 'ದತ್ತಾಂಶಗಳ ನಿರ್ವಹಣೆ (Data Handling)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 10, name: 'ಕ್ಷೇತ್ರಗಣಿತ - ಸುತ್ತಳತೆ ಮತ್ತು ವಿಸ್ತೀರ್ಣ (Mensuration)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 11, name: 'ಬೀಜಗಣಿತದ ಪರಿಚಯ (Introduction to Algebra)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 12, name: 'ಅನುಪಾತ ಮತ್ತು ಸಮಾನುಪಾತ (Ratio and Proportion)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
        { number: 13, name: 'ಸಮ್ಮಿತಿ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ರೇಖಾಗಣಿತ (Symmetry & Practical Geometry)', exam: 'SA-2', subjectId: 'mathematics', classId: '6th' },
      ],
      '7th': [
        // SA-1 (ಭಾಗ - ೧) - 7th Kannada Maths Part - 1 (ಗಣಿತ ಪ್ರಕಾಶ)
        { number: 1, name: 'ಪೂರ್ಣಾಂಕಗಳು (Integers)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 2, name: 'ಭಿನ್ನರಾಶಿಗಳು ಮತ್ತು ದಶಮಾಂಶಗಳು (Fractions and Decimals)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 3, name: 'ದತ್ತಾಂಶಗಳ ನಿರ್ವಹಣೆ (Data Handling)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 4, name: 'ಸರಳ ಸಮೀಕರಣಗಳು (Simple Equations)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 5, name: 'ರೇಖೆಗಳು ಮತ್ತು ಕೋನಗಳು (Lines and Angles)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 6, name: 'ತ್ರಿಭುಜ ಮತ್ತು ಅದರ ಗುಣಗಳು (The Triangle and its Properties)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        { number: 7, name: 'ತ್ರಿಭುಜಗಳ ಸರ್ವಸಮತೆ (Congruence of Triangles)', exam: 'SA-1', subjectId: 'mathematics', classId: '7th' },
        // SA-2 (ಭಾಗ - ೨) - 7th Kannada Maths Part - 2 (ಗಣಿತ ಪ್ರಕಾಶ)
        { number: 8, name: 'ರಾಶಿಗಳ ಹೋಲಿಕೆ (Comparing Quantities)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 9, name: 'ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಗಳು (Rational Numbers)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 10, name: 'ಪ್ರಾಯೋಗಿಕ ರೇಖಾಗಣಿತ (Practical Geometry)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 11, name: 'ಪರಿಧಿ ಮತ್ತು ವಿಸ್ತೀರ್ಣ (Perimeter and Area)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 12, name: 'ಬೀಜೋಕ್ತಿಗಳು (Algebraic Expressions)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 13, name: 'ಘಾತಗಳು ಮತ್ತು ಘಾತಾಂಕಗಳು (Exponents and Powers)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
        { number: 14, name: 'ಸಮ್ಮಿತಿ ಮತ್ತು ಘನ ಆಕಾರಗಳ ವೀಕ್ಷಣೆ (Symmetry & Visualising Shapes)', exam: 'SA-2', subjectId: 'mathematics', classId: '7th' },
      ],
    },
  },
  {
    id: 'science',
    nameKannada: 'ವಿಜ್ಞಾನ ("ಕುತೂಹಲ" Curiosity 2026-27)',
    nameEnglish: 'Science ("Curiosity" Revised)',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20Science%20Part%20-%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20Science%20Part%20-%202%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20Science%20Part%20-%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20Science%20Part%20-%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (ಭಾಗ - ೧) - 6th Kannada Science Part - 1 "ಕುತೂಹಲ" (Curiosity)
        { number: 1, name: 'ವಿಜ್ಞಾನದ ಅದ್ಭುತ ಪ್ರಪಂಚ (The Wonderful World of Science)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        { number: 2, name: 'ಜೀವಜಗತ್ತಿನಲ್ಲಿ ವೈವಿಧ್ಯತೆ (Diversity in the Living World)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        { number: 3, name: 'ಮನದುಂಬಿದ ಊಟ: ಸ್ವಸ್ಥ ಶರೀರಕ್ಕೆ ಸೋಪಾನ (Mindful Eating)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        { number: 4, name: 'ಕಾಂತಗಳ ಅನ್ವೇಷಣೆ (Exploring Magnets)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        { number: 5, name: 'ಉದ್ದದ ಅಳತೆ ಮತ್ತು ಚಲನೆ (Measurement of Length & Motion)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        { number: 6, name: 'ನಮ್ಮ ಸುತ್ತಲಿನ ಸಾಮಗ್ರಿಗಳು (Materials Around Us)', exam: 'SA-1', subjectId: 'science', classId: '6th' },
        // SA-2 (ಭಾಗ - ೨) - 6th Kannada Science Part - 2 "ಕುತೂಹಲ" (Curiosity)
        { number: 7, name: 'ತಾಪ ಮತ್ತು ಅದರ ಮಾಪನ (Temperature & Its Measurement)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
        { number: 8, name: 'ನೀರಿನ ಸ್ಥಿತಿಗಳ ಮೂಲಕ ಒಂದು ಪಯಣ (A Journey through States of Water)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
        { number: 9, name: 'ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಬೇರ್ಪಡಿಸುವ ವಿಧಾನಗಳು (Methods of Separation)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
        { number: 10, name: 'ಜೀವಿಗಳು: ಅವುಗಳ ಗುಣಗಳ ಅನ್ವೇಷಣೆ (Living Beings: Characteristics)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
        { number: 11, name: 'ನಿಸರ್ಗದ ಸಂಪತ್ತು (Nature’s Treasures)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
        { number: 12, name: 'ಭೂಮಿಯಿಂದ ಆಚೆಗೆ (Beyond Earth)', exam: 'SA-2', subjectId: 'science', classId: '6th' },
      ],
      '7th': [
        // SA-1 (ಭಾಗ - ೧) - 7th Kannada Science Part - 1 "ಕುತೂಹಲ"
        { number: 1, name: 'ಸಸ್ಯಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Plants)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 2, name: 'ಪ್ರಾಣಿಗಳಲ್ಲಿ ಪೋಷಣೆ (Nutrition in Animals)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 3, name: 'ಶಾಖ ಮತ್ತು ತಾಪಮಾನ (Heat and Temperature)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 4, name: 'ಆಮ್ಲಗಳು, ಪ್ರತ್ಯಾಮ್ಲಗಳು ಮತ್ತು ಲವಣಗಳು (Acids, Bases & Salts)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 5, name: 'ಭೌತ ಮತ್ತು ರಾಸಾಯನಿಕ ಬದಲಾವಣೆಗಳು (Physical & Chemical Changes)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 6, name: 'ಜೀವಿಗಳಲ್ಲಿ ಉಸಿರಾಟ (Respiration in Organisms)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        { number: 7, name: 'ಹವಾಮಾನ, ವಾಯುಗುಣ ಮತ್ತು ಹೊಂದಾಣಿಕೆಗಳು (Weather & Climate)', exam: 'SA-1', subjectId: 'science', classId: '7th' },
        // SA-2 (ಭಾಗ - ೨) - 7th Kannada Science Part - 2 "ಕುತೂಹಲ"
        { number: 8, name: 'ಪ್ರಾಣಿ ಮತ್ತು ಸಸ್ಯಗಳಲ್ಲಿ ಸಾಗಾಣಿಕೆ (Transportation in Animals & Plants)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 9, name: 'ಸಸ್ಯಗಳಲ್ಲಿ ಸಂತಾನೋತ್ಪತ್ತಿ (Reproduction in Plants)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 10, name: 'ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion and Time)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 11, name: 'ವಿದ್ಯುತ್ ಪ್ರವಾಹ ಮತ್ತು ಅದರ ಪರಿಣಾಮಗಳು (Electric Current & Effects)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 12, name: 'ಬೆಳಕು (Light)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 13, name: 'ಕಾಡುಗಳು: ನಮ್ಮ ಜೀವಸೆಲೆ (Forests: Our Lifeline)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
        { number: 14, name: 'ತ್ಯಾಜ್ಯ ನೀರಿನ ಕಥೆ (Wastewater Story)', exam: 'SA-2', subjectId: 'science', classId: '7th' },
      ],
    },
  },
  {
    id: 'social',
    nameKannada: 'ಸಮಾಜ ವಿಜ್ಞಾನ (Social Science)',
    nameEnglish: 'Social Science',
    officialPdfUrls: {
      '6th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20SS%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/6th%20Kannada%20SS%20Part%202%202026-27.pdf',
      },
      '7th': {
        part1: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20SS%20Part%201%202026-27.pdf',
        part2: 'https://textbooks.karnataka.gov.in/uploads/7th%20Kannada%20SS%20Part%202%202026-27.pdf',
      },
    },
    lessons: {
      '6th': [
        // SA-1 (ಭಾಗ - ೧) - 6th Kannada SS Part 1
        { number: 1, name: 'ನಮ್ಮ ಕರ್ನಾಟಕ (ಕಂದಾಯ ವಿಭಾಗಗಳು & ಪ್ರಾಕೃತಿಕ ಸಂಪತ್ತು)', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        { number: 2, name: 'ಇತಿಹಾಸ ಪರಿಚಯ ಮತ್ತು ಐತಿಹಾಸಿಕ ಆಧಾರಗಳು', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        { number: 3, name: 'ಪ್ರಾಚೀನ ಸಿಂಧೂ ನಾಗರಿಕತೆ ಮತ್ತು ವೇದಕಾಲದ ಸಮಾಜ', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        { number: 4, name: 'ಸನಾತನ ಧರ್ಮ, ಜೈನ ಮತ್ತು ಬೌದ್ಧ ಧರ್ಮಗಳ ಉದಯ', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        { number: 5, name: 'ಗ್ಲೋಬ್ ಮತ್ತು ಭೂಪಟಗಳು (ನಕ್ಷೆಗಳ ಓದುವಿಕೆ)', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        { number: 6, name: 'ಪೌರನೀತಿ: ಕುಟುಂಬ, ಸಮಾಜ ಮತ್ತು ನಾಗರಿಕ ಕರ್ತವ್ಯಗಳು', exam: 'SA-1', subjectId: 'social', classId: '6th' },
        // SA-2 (ಭಾಗ - ೨) - 6th Kannada SS Part 2
        { number: 7, name: 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಕುಶಾನರು (ಅಶೋಕನ ಧರ್ಮ)', exam: 'SA-2', subjectId: 'social', classId: '6th' },
        { number: 8, name: 'ಗುಪ್ತರು ಮತ್ತು ವರ್ಧನರ ಕಾಲದ ಸುವರ್ಣ ಯುಗ', exam: 'SA-2', subjectId: 'social', classId: '6th' },
        { number: 9, name: 'ದಕ್ಷಿಣ ಭಾರತದ ಹೆಮ್ಮೆಯ ಅರಸು ಮನೆತನಗಳು (ಶಾತವಾಹನರು, ಕದಂಬರು, ಗಂಗರು)', exam: 'SA-2', subjectId: 'social', classId: '6th' },
        { number: 10, name: 'ಏಷ್ಯಾ ಖಂಡ - ಪ್ರಾಕೃತಿಕ ಲಕ್ಷಣಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳು', exam: 'SA-2', subjectId: 'social', classId: '6th' },
        { number: 11, name: 'ಸ್ಥಳೀಯ ಸ್ವಯಂ ಸರ್ಕಾರ (ಗ್ರಾಮ ಪಂಚಾಯತಿ & ಪುರಸಭೆ)', exam: 'SA-2', subjectId: 'social', classId: '6th' },
        { number: 12, name: 'ಭಾರತದ ಸಂವಿಧಾನದ ಪೀಠಿಕೆ ಮತ್ತು ಪ್ರಜಾಪ್ರಭುತ್ವದ ಮೌಲ್ಯಗಳು', exam: 'SA-2', subjectId: 'social', classId: '6th' },
      ],
      '7th': [
        // SA-1 (ಭಾಗ - ೧) - 7th Kannada SS Part 1
        { number: 1, name: 'ಉತ್ತರ ಭಾರತದ ರಜಪೂತ ಮನೆತನಗಳು ಮತ್ತು ಸಂಸ್ಕೃತಿ', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 2, name: 'ದಕ್ಷಿಣ ಭಾರತದ ಚೋಳರು ಮತ್ತು ಹೊಯ್ಸಳರ ವಾಸ್ತುಶಿಲ್ಪ', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 3, name: 'ದೆಹಲಿ ಸುಲ್ತಾನರ ಆಳ್ವಿಕೆ ಮತ್ತು ಸಾಮಾಜಿಕ ಬದಲಾವಣೆ', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 4, name: 'ಭಕ್ತಿ ಪಂಥ ಮತ್ತು ಸೂಫಿ ಸಂತರು (ಕನಕದಾಸ, ಪುರಂದರದಾಸ, ಕಬೀರ)', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 5, name: 'ಭೂಮಿಯ ಆಂತರಿಕ ರಚನೆ ಮತ್ತು ಶಿಲೆಗಳ ವಿಧಗಳು', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 6, name: 'ವಾತಾವರಣ, ಹವಾಮಾನ ಮತ್ತು ಮಾರುತಗಳು', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        { number: 7, name: 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿಪಾಸ್ತಿಗಳ ಸಂರಕ್ಷಣೆ ಮತ್ತು ನಾಗರಿಕ ಪ್ರಜ್ಞೆ', exam: 'SA-1', subjectId: 'social', classId: '7th' },
        // SA-2 (ಭಾಗ - ೨) - 7th Kannada SS Part 2
        { number: 8, name: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಬಹಮನಿ ಸುಲ್ತಾನರು', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 9, name: 'ಮೊಘಲರು ಮತ್ತು ಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜರ ಮರಾಠ ಸಾಮ್ರಾಜ್ಯ', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 10, name: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಸುಧಾರಕರು', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 11, name: 'ಜಲಗೋಳ ಮತ್ತು ಜೀವಿಗೋಳ ಸಂರಕ್ಷಣೆ', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 12, name: 'ಸಂವಿಧಾನದ ಮೂಲಭೂತ ಹಕ್ಕುಗಳು ಮತ್ತು ಕರ್ತವ್ಯಗಳು', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 13, name: 'ರಾಜ್ಯ ಸರ್ಕಾರದ ಅಂಗಗಳು: ಶಾಸಕಾಂಗ, ಕಾರ್ಯಾಂಗ, ನ್ಯಾಯಾಂಗ', exam: 'SA-2', subjectId: 'social', classId: '7th' },
        { number: 14, name: 'ರಸ್ತೆ ಸುರಕ್ಷತೆ, ಸಂಚಾರ ನಿಯಮಗಳು ಮತ್ತು ಗ್ರಾಹಕ ಜಾಗೃತಿ', exam: 'SA-2', subjectId: 'social', classId: '7th' },
      ],
    },
  },
  {
    id: 'value_education',
    nameKannada: 'ಮೌಲ್ಯ ಶಿಕ್ಷಣ (Value Education 2026-27)',
    nameEnglish: 'Value Education',
    officialPdfUrls: {
      '6th': 'https://textbooks.karnataka.gov.in/uploads/Grade_6_Final_2026-27_1780659750.pdf',
      '7th': 'https://textbooks.karnataka.gov.in/uploads/Grade_7__Final_2026-27_1780659750.pdf',
    },
    lessons: {
      '6th': [
        // SA-1 (ಭಾಗ - ೧) - KTS ಅಧಿಕೃತ ಪುಸ್ತಕ (Grade_6_Final_2026-27)
        { number: 1, name: 'ಸ್ವಯಂ ಅರಿವು ಮತ್ತು ಸತ್ಯತೆ (Self-Awareness & Truthfulness)', exam: 'SA-1', subjectId: 'value_education', classId: '6th' },
        { number: 2, name: 'ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ನೈತಿಕ ವರ್ತನೆ (Honesty & Ethical Conduct)', exam: 'SA-1', subjectId: 'value_education', classId: '6th' },
        { number: 3, name: 'ಗುರುಹಿರಿಯರಿಗೆ ಗೌರವ ಮತ್ತು ಕೃತಜ್ಞತೆ (Respect & Gratitude)', exam: 'SA-1', subjectId: 'value_education', classId: '6th' },
        { number: 4, name: 'ಸ್ವಚ್ಛತೆ, ಆರೋಗ್ಯ ಮತ್ತು ನೈರ್ಮಲ್ಯ (Cleanliness & Hygiene)', exam: 'SA-1', subjectId: 'value_education', classId: '6th' },
        { number: 5, name: 'ಸಮಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಶಿಸ್ತು (Time Management & Discipline)', exam: 'SA-1', subjectId: 'value_education', classId: '6th' },
        // SA-2 (ಭಾಗ - ೨)
        { number: 6, name: 'ಪ್ರಾಣಿ ದಯೆ ಮತ್ತು ಪರಿಸರ ಸಂರಕ್ಷಣೆ (Compassion for Animals & Nature)', exam: 'SA-2', subjectId: 'value_education', classId: '6th' },
        { number: 7, name: 'ಸ್ನೇಹ, ಸಹಕಾರ ಮತ್ತು ಪರಸ್ಪರ ಗೌರವ (Friendship & Cooperation)', exam: 'SA-2', subjectId: 'value_education', classId: '6th' },
        { number: 8, name: 'ದೇಶಭಕ್ತಿ ಮತ್ತು ರಾಷ್ಟ್ರಧ್ವಜದ ಮೌಲ್ಯಗಳು (Patriotism & National Pride)', exam: 'SA-2', subjectId: 'value_education', classId: '6th' },
        { number: 9, name: 'ಧೈರ್ಯ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ದೃಢತೆ (Courage & Self-Confidence)', exam: 'SA-2', subjectId: 'value_education', classId: '6th' },
        { number: 10, name: 'ಉತ್ತಮ ಹವ್ಯಾಸಗಳು ಮತ್ತು ನಾಗರಿಕ ಜವಾಬ್ದಾರಿ (Good Habits & Civic Duty)', exam: 'SA-2', subjectId: 'value_education', classId: '6th' },
      ],
      '7th': [
        // SA-1 (ಭಾಗ - ೧) - KTS ಅಧಿಕೃತ ಪುಸ್ತಕ (Grade_7__Final_2026-27)
        { number: 1, name: 'ನನ್ನ ಕೆಲಸ, ನನ್ನ ಹೆಮ್ಮೆ - ಕಾಯಕ ನಿಷ್ಠೆ (Dignity of Labour & Work Ethics)', exam: 'SA-1', subjectId: 'value_education', classId: '7th' },
        { number: 2, name: 'ನೈತಿಕ ಮೌಲ್ಯಗಳು ಮತ್ತು ಮಾನವೀಯತೆ (Moral Values & Humanity)', exam: 'SA-1', subjectId: 'value_education', classId: '7th' },
        { number: 3, name: 'ಸಹಿಷ್ಣುತೆ ಮತ್ತು ಸರ್ವಧರ್ಮ ಸಮಭಾವ (Tolerance & Harmony)', exam: 'SA-1', subjectId: 'value_education', classId: '7th' },
        { number: 4, name: 'ನಾಯಕತ್ವದ ಗುಣಗಳು ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ (Leadership & Responsibility)', exam: 'SA-1', subjectId: 'value_education', classId: '7th' },
        { number: 5, name: 'ಸಾಮಾಜಿಕ ಸೇವೆ ಮತ್ತು ಸಹಾನುಭೂತಿ (Social Service & Empathy)', exam: 'SA-1', subjectId: 'value_education', classId: '7th' },
        // SA-2 (ಭಾಗ - ೨)
        { number: 6, name: 'ಸಂವಿಧಾನಿಕ ಮೌಲ್ಯಗಳು ಮತ್ತು ಸಮಾನತೆ (Constitutional Values & Equality)', exam: 'SA-2', subjectId: 'value_education', classId: '7th' },
        { number: 7, name: 'ಶಾಂತಿ, ಅಹಿಂಸೆ ಮತ್ತು ಸಂಘರ್ಷ ಪರಿಹಾರ (Peace & Non-Violence)', exam: 'SA-2', subjectId: 'value_education', classId: '7th' },
        { number: 8, name: 'ಡಿಜಿಟಲ್ ಜಾಗೃತಿ ಮತ್ತು ಸೈಬರ್ ಸುರಕ್ಷತೆ (Digital Ethics & Safe Internet)', exam: 'SA-2', subjectId: 'value_education', classId: '7th' },
        { number: 9, name: 'ಭಾವನೆಗಳ ಸಮತೋಲನ ಮತ್ತು ಸಕಾರಾತ್ಮಕ ಚಿಂತನೆ (Emotional Resilience)', exam: 'SA-2', subjectId: 'value_education', classId: '7th' },
        { number: 10, name: 'ಮಹಾಪುರುಷರ ಜೀವನಾದರ್ಶಗಳು (Life Lessons from Great Personalities)', exam: 'SA-2', subjectId: 'value_education', classId: '7th' },
      ],
    },
  },
];

export function getSubjectById(subjectId: SubjectId): SubjectInfo | undefined {
  return SUBJECTS.find((s) => s.id === subjectId);
}

export function getSubjectPdfUrl(
  subjectId: SubjectId,
  classId: ClassId,
  examId?: ExamId
): string | undefined {
  const subject = getSubjectById(subjectId);
  if (!subject || !subject.officialPdfUrls) return undefined;
  const entry = (subject.officialPdfUrls as any)?.[classId];
  if (!entry) return undefined;
  if (typeof entry === 'string') return entry;
  if (examId === 'SA-1') return entry.part1 || entry.full;
  if (examId === 'SA-2') return entry.part2 || entry.full;
  return entry.full || entry.part1 || entry.part2;
}

export function getSubjectAllPdfUrls(
  subjectId: SubjectId,
  classId: ClassId
): { part1?: string; part2?: string; full?: string } {
  const subject = getSubjectById(subjectId);
  if (!subject || !subject.officialPdfUrls) return {};
  const entry = (subject.officialPdfUrls as any)?.[classId];
  if (!entry) return {};
  if (typeof entry === 'string') return { full: entry };
  return entry;
}

export function getLessons(
  classId: ClassId,
  subjectId: SubjectId,
  examId?: ExamId
) {
  // Always use the authoritative 2026-27 KTS curriculum from SUBJECTS
  const subject = getSubjectById(subjectId);
  if (!subject) return [];
  const lessons = (subject.lessons as any)?.[classId] || [];

  if (examId && examId !== 'ANNUAL') {
    return lessons.filter((l: any) => l.exam === examId);
  }
  return lessons;
}

// Convert English numbers to Kannada Unicode numerals
export function toKannadaDigits(num: number | string): string {
  const kannadaDigits = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
  return String(num).replace(/[0-9]/g, (digit) => kannadaDigits[parseInt(digit, 10)]);
}

// Kannada Sub-question letters: ಅ, ಆ, ಇ, ಈ, ಉ, ಊ, ಋ, ಎ, ಏ, ಐ
export const KANNADA_SUB_LETTERS = ['ಅ)', 'ಆ)', 'ಇ)', 'ಈ)', 'ಉ)', 'ಊ)', 'ಋ)', 'ಎ)', 'ಏ)', 'ಐ)'];
export const ENGLISH_SUB_LETTERS = ['a)', 'b)', 'c)', 'd)', 'e)', 'f)', 'g)', 'h)', 'i)', 'j)'];
