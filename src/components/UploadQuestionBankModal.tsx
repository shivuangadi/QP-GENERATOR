import React, { useState, useMemo } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Plus,
  Trash2,
  Eye,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ClassId,
  DifficultyLevel,
  ExamId,
  Question,
  QuestionType,
  SubjectId,
} from '../types';
import {
  QUESTION_TYPES,
  SUBJECTS,
  getLessons,
  toKannadaDigits,
} from '../data/syllabus';
import { saveBulkQuestions, saveQuestion, getAllQuestions } from '../services/storage';

interface UploadQuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated?: () => void;
  initialClass?: ClassId;
  initialSubject?: SubjectId;
}

type TabType = 'csv' | 'paste' | 'json' | 'single' | 'guide';

export const UploadQuestionBankModal: React.FC<UploadQuestionBankModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated,
  initialClass = '6th',
  initialSubject = 'science',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('csv');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // -------------------------------------------------------------
  // CSV UPLOAD STATE
  // -------------------------------------------------------------
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCsvQuestions, setParsedCsvQuestions] = useState<Question[]>([]);
  const [csvParseErrors, setCsvParseErrors] = useState<string[]>([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

  // -------------------------------------------------------------
  // BULK PASTE STATE
  // -------------------------------------------------------------
  const [pasteClass, setPasteClass] = useState<ClassId>(initialClass);
  const [pasteSubject, setPasteSubject] = useState<SubjectId>(initialSubject);
  const [pasteExam, setPasteExam] = useState<ExamId>('SA-1');
  const [pasteLessonNum, setPasteLessonNum] = useState<number>(1);
  const [pasteType, setPasteType] = useState<QuestionType>('fill_blank');
  const [pasteMarks, setPasteMarks] = useState<number>(1);
  const [pasteDifficulty, setPasteDifficulty] = useState<DifficultyLevel>('medium');
  const [pastedRawText, setPastedRawText] = useState<string>('');

  // -------------------------------------------------------------
  // JSON UPLOAD STATE
  // -------------------------------------------------------------
  const [parsedJsonQuestions, setParsedJsonQuestions] = useState<Question[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // SINGLE QUESTION STATE
  // -------------------------------------------------------------
  const [singleClass, setSingleClass] = useState<ClassId>(initialClass);
  const [singleSubject, setSingleSubject] = useState<SubjectId>(initialSubject);
  const [singleExam, setSingleExam] = useState<ExamId>('SA-1');
  const [singleLessonNum, setSingleLessonNum] = useState<number>(1);
  const [singleType, setSingleType] = useState<QuestionType>('fill_blank');
  const [singleText, setSingleText] = useState('');
  const [singleAnswer, setSingleAnswer] = useState('');
  const [singleExplanation, setSingleExplanation] = useState('');
  const [singleMarks, setSingleMarks] = useState<number>(1);
  const [singleDifficulty, setSingleDifficulty] = useState<DifficultyLevel>('medium');
  const [singleOptions, setSingleOptions] = useState<string[]>([
    'ಎ) ',
    'ಬಿ) ',
    'ಸಿ) ',
    'ಡಿ) ',
  ]);

  // Lessons for single form & paste form
  const pasteLessons = useMemo(() => {
    return getLessons(pasteClass, pasteSubject, pasteExam);
  }, [pasteClass, pasteSubject, pasteExam]);

  const singleLessons = useMemo(() => {
    return getLessons(singleClass, singleSubject, singleExam);
  }, [singleClass, singleSubject, singleExam]);

  // Auto-adjust lesson number if out of range
  React.useEffect(() => {
    if (pasteLessons.length > 0 && !pasteLessons.some((l) => l.number === pasteLessonNum)) {
      setPasteLessonNum(pasteLessons[0].number);
    }
  }, [pasteLessons, pasteLessonNum]);

  React.useEffect(() => {
    if (singleLessons.length > 0 && !singleLessons.some((l) => l.number === singleLessonNum)) {
      setSingleLessonNum(singleLessons[0].number);
    }
  }, [singleLessons, singleLessonNum]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // CSV PARSER HELPER
  // -------------------------------------------------------------
  const parseCSVTokens = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let token = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          token += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(token.trim());
        token = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(token.trim());
        token = '';
        if (row.length > 0 && row.some((c) => c.length > 0)) {
          lines.push(row);
        }
        row = [];
      } else {
        token += char;
      }
    }
    if (token.length > 0 || row.length > 0) {
      row.push(token.trim());
      if (row.some((c) => c.length > 0)) {
        lines.push(row);
      }
    }
    return lines;
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setIsProcessingCsv(true);
    setCsvParseErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const grid = parseCSVTokens(text);

        if (grid.length < 2) {
          setCsvParseErrors(['CSV ಫೈಲ್‌ನಲ್ಲಿ ಕನಿಷ್ಠ ೧ ಹೆಡರ್ ಮತ್ತು ೧ ಪ್ರಶ್ನೆ ಸಾಲು ಇರಬೇಕು.']);
          setParsedCsvQuestions([]);
          setIsProcessingCsv(false);
          return;
        }

        const headers = grid[0].map((h) => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
        // Map columns
        const classIdx = headers.findIndex((h) => h.includes('class') || h.includes('grade'));
        const subjectIdx = headers.findIndex((h) => h.includes('subject'));
        const examIdx = headers.findIndex((h) => h.includes('exam') || h.includes('term'));
        const lessonNumIdx = headers.findIndex((h) => h.includes('lessonnumber') || h.includes('lessonno') || h.includes('chapter'));
        const lessonNameIdx = headers.findIndex((h) => h.includes('lessonname') || h.includes('chaptername'));
        const typeIdx = headers.findIndex((h) => h.includes('questiontype') || h.includes('type'));
        const textIdx = headers.findIndex((h) => h.includes('questiontext') || h.includes('question') || h.includes('text'));
        const answerIdx = headers.findIndex((h) => h.includes('answer'));
        const marksIdx = headers.findIndex((h) => h.includes('marks') || h.includes('mark'));
        const diffIdx = headers.findIndex((h) => h.includes('difficulty') || h.includes('level'));
        const optionsIdx = headers.findIndex((h) => h.includes('options') || h.includes('choices'));

        if (textIdx === -1) {
          setCsvParseErrors(['"QuestionText" ಅಥವಾ "Question" ಕಾಲಮ್ ಹೆಡರ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮಾದರಿ ಟೆಂಪ್ಲೇಟ್ ಪರಿಶೀಲಿಸಿ.']);
          setParsedCsvQuestions([]);
          setIsProcessingCsv(false);
          return;
        }

        const validQuestions: Question[] = [];
        const errors: string[] = [];

        for (let r = 1; r < grid.length; r++) {
          const row = grid[r];
          const rawText = row[textIdx]?.trim();
          if (!rawText) continue;

          // Parse class
          let rowClass: ClassId = '6th';
          if (classIdx !== -1 && row[classIdx]) {
            const rawCls = row[classIdx].trim().toLowerCase();
            if (rawCls.includes('7') || rawCls.includes('೭')) rowClass = '7th';
          }

          // Parse subject
          let rowSubject: SubjectId = 'science';
          if (subjectIdx !== -1 && row[subjectIdx]) {
            const rawSub = row[subjectIdx].trim().toLowerCase();
            if (rawSub.includes('kan') || rawSub.includes('ಕನ್ನಡ')) rowSubject = 'kannada';
            else if (rawSub.includes('eng') || rawSub.includes('ಇಂಗ್ಲಿಷ್')) rowSubject = 'english';
            else if (rawSub.includes('hin') || rawSub.includes('ಹಿಂದಿ')) rowSubject = 'hindi';
            else if (rawSub.includes('math') || rawSub.includes('ಗಣಿತ')) rowSubject = 'mathematics';
            else if (rawSub.includes('sci') || rawSub.includes('ವಿಜ್ಞಾನ')) rowSubject = 'science';
            else if (rawSub.includes('soc') || rawSub.includes('ಸಮಾಜ')) rowSubject = 'social';
            else if (rawSub.includes('moral') || rawSub.includes('value') || rawSub.includes('ಮೌಲ್ಯ')) rowSubject = 'value_education';
          }

          // Parse exam
          let rowExam: ExamId = 'SA-1';
          if (examIdx !== -1 && row[examIdx]) {
            const rawExam = row[examIdx].trim().toUpperCase();
            if (rawExam.includes('SA-2') || rawExam.includes('SA2') || rawExam.includes('ಭಾಗ-೨')) rowExam = 'SA-2';
            else if (rawExam.includes('ANNUAL') || rawExam.includes('ವಾರ್ಷಿಕ')) rowExam = 'ANNUAL';
          }

          // Lesson Number & Name
          const rowLessonNum = lessonNumIdx !== -1 ? parseInt(row[lessonNumIdx], 10) || 1 : 1;
          const lessonsList = getLessons(rowClass, rowSubject, rowExam);
          const foundLesson = lessonsList.find((l) => l.number === rowLessonNum);
          const rowLessonName =
            (lessonNameIdx !== -1 && row[lessonNameIdx]?.trim()) ||
            foundLesson?.name ||
            `ಪಾಠ ${rowLessonNum}`;

          // Type
          let rowType: QuestionType = 'fill_blank';
          if (typeIdx !== -1 && row[typeIdx]) {
            const rawT = row[typeIdx].trim().toLowerCase();
            const matchedType = Object.values(QUESTION_TYPES).find(
              (qt) => qt.type.toLowerCase() === rawT || qt.titleKannada.includes(rawT)
            );
            if (matchedType) {
              rowType = matchedType.type;
            } else if (rawT.includes('mcq') || rawT.includes('ಬಹು ಆಯ್ಕೆ')) {
              rowType = 'mcq';
            } else if (rawT.includes('ಒಂದು ವಾಕ್ಯ') || rawT.includes('1 word')) {
              rowType = 'one_word_sentence';
            } else if (rawT.includes('ಹೊಂದಿಸಿ') || rawT.includes('match')) {
              rowType = 'match_following';
            } else if (rawT.includes('ಸರಿ') || rawT.includes('ತಪ್ಪು') || rawT.includes('true')) {
              rowType = 'true_false';
            } else if (rawT.includes('ಚಿತ್ರ') || rawT.includes('diagram')) {
              rowType = 'diagram_based';
            }
          }

          // Marks & Diff
          const rowMarks = marksIdx !== -1 ? parseInt(row[marksIdx], 10) || 1 : 1;
          let rowDiff: DifficultyLevel = 'medium';
          if (diffIdx !== -1 && row[diffIdx]) {
            const rawD = row[diffIdx].trim().toLowerCase();
            if (rawD.includes('easy') || rawD.includes('ಸುಲಭ')) rowDiff = 'easy';
            else if (rawD.includes('hard') || rawD.includes('ಕಷ್ಟ')) rowDiff = 'hard';
          }

          // Options (for MCQ)
          let rowOptions: string[] | undefined = undefined;
          if (optionsIdx !== -1 && row[optionsIdx]) {
            const rawOpts = row[optionsIdx].split(/[;|]/).map((o) => o.trim()).filter(Boolean);
            if (rawOpts.length > 0) rowOptions = rawOpts;
          }

          const q: Question = {
            id: `custom-csv-${Date.now()}-${r}`,
            classId: rowClass,
            subjectId: rowSubject,
            examId: rowExam,
            lessonNumber: rowLessonNum,
            lessonName: rowLessonName,
            questionType: rowType,
            questionText: rawText,
            answer: answerIdx !== -1 ? row[answerIdx]?.trim() : undefined,
            marks: rowMarks,
            difficulty: rowDiff,
            options: rowOptions,
          };

          validQuestions.push(q);
        }

        setParsedCsvQuestions(validQuestions);
        setCsvParseErrors(errors);
        setIsProcessingCsv(false);
      } catch (err: any) {
        setCsvParseErrors([`ಫೈಲ್ ಓದಲು ವಿಫಲವಾಗಿದೆ: ${err?.message || 'ಅಜ್ಞಾತ ದೋಷ'}`]);
        setIsProcessingCsv(false);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmCsvImport = () => {
    if (parsedCsvQuestions.length === 0) return;
    const count = saveBulkQuestions(parsedCsvQuestions);
    setNotification({
      type: 'success',
      message: `ಯಶಸ್ವಿಯಾಗಿ ${count} ಪ್ರಶ್ನೆಗಳನ್ನು ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ!`,
    });
    setParsedCsvQuestions([]);
    setCsvFile(null);
    onQuestionsUpdated?.();
  };

  // -------------------------------------------------------------
  // BULK PASTE HANDLER
  // -------------------------------------------------------------
  // Parse text lines into question items
  const parsedPastedItems = useMemo(() => {
    if (!pastedRawText.trim()) return [];
    const lines = pastedRawText.split('\n');
    const items: string[] = [];
    let current = '';

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (current) {
          items.push(current.trim());
          current = '';
        }
        return;
      }
      // Check if line starts with a number (e.g. "1.", "1)", "೧.", "೧)")
      const isNumbered = /^[0-9೧-೯]+[\.\)\-]\s+/.test(trimmed);
      if (isNumbered) {
        if (current) {
          items.push(current.trim());
        }
        current = trimmed.replace(/^[0-9೧-೯]+[\.\)\-]\s+/, '');
      } else {
        if (current) {
          current += ' ' + trimmed;
        } else {
          current = trimmed;
        }
      }
    });
    if (current) {
      items.push(current.trim());
    }
    return items.filter((item) => item.length > 2);
  }, [pastedRawText]);

  const handleConfirmPasteImport = () => {
    if (parsedPastedItems.length === 0) return;
    const lesson = pasteLessons.find((l) => l.number === pasteLessonNum);
    const lessonName = lesson ? lesson.name : `ಪಾಠ ${pasteLessonNum}`;

    const newQuestions: Question[] = parsedPastedItems.map((text, idx) => ({
      id: `custom-paste-${Date.now()}-${idx}`,
      classId: pasteClass,
      subjectId: pasteSubject,
      examId: pasteExam,
      lessonNumber: pasteLessonNum,
      lessonName: lessonName,
      questionType: pasteType,
      questionText: text,
      marks: pasteMarks,
      difficulty: pasteDifficulty,
    }));

    const count = saveBulkQuestions(newQuestions);
    setNotification({
      type: 'success',
      message: `ಯಶಸ್ವಿಯಾಗಿ ${count} ಪ್ರಶ್ನೆಗಳನ್ನು "${lessonName}" ಪಾಠಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ!`,
    });
    setPastedRawText('');
    onQuestionsUpdated?.();
  };

  // -------------------------------------------------------------
  // JSON UPLOAD HANDLER
  // -------------------------------------------------------------
  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          // validate questions
          const valid = data.filter(
            (q) => q && typeof q === 'object' && q.questionText && q.classId && q.subjectId
          );
          if (valid.length === 0) {
            setJsonError('JSON ಫೈಲ್‌ನಲ್ಲಿ ಯಾವುದೇ ಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.');
            setParsedJsonQuestions([]);
          } else {
            setParsedJsonQuestions(valid);
          }
        } else {
          setJsonError('JSON ಫೈಲ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿ (Array) ಇರಬೇಕು.');
        }
      } catch (err: any) {
        setJsonError(`JSON ಫೈಲ್ ಓದಲು ವಿಫಲವಾಗಿದೆ: ${err?.message || 'ಅಮಾನ್ಯ ಫಾರ್ಮ್ಯಾಟ್'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmJsonImport = () => {
    if (parsedJsonQuestions.length === 0) return;
    const count = saveBulkQuestions(parsedJsonQuestions);
    setNotification({
      type: 'success',
      message: `ಯಶಸ್ವಿಯಾಗಿ ${count} ಪ್ರಶ್ನೆಗಳನ್ನು JSON ನಿಂದ ಆಮದು ಮಾಡಿಕೊಳ್ಳಲಾಗಿದೆ!`,
    });
    setParsedJsonQuestions([]);
    onQuestionsUpdated?.();
  };

  // -------------------------------------------------------------
  // SINGLE QUESTION HANDLER
  // -------------------------------------------------------------
  const handleSaveSingleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleText.trim()) return;

    const lesson = singleLessons.find((l) => l.number === singleLessonNum);
    const lessonName = lesson ? lesson.name : `ಪಾಠ ${singleLessonNum}`;

    const newQ: Question = {
      id: `custom-single-${Date.now()}`,
      classId: singleClass,
      subjectId: singleSubject,
      examId: singleExam,
      lessonNumber: singleLessonNum,
      lessonName: lessonName,
      questionType: singleType,
      questionText: singleText.trim(),
      answer: singleAnswer.trim() || undefined,
      explanation: singleExplanation.trim() || undefined,
      marks: singleMarks,
      difficulty: singleDifficulty,
      options:
        singleType === 'mcq' || singleType === 'choose_correct'
          ? singleOptions.filter((o) => o.trim().length > 2)
          : undefined,
    };

    saveQuestion(newQ);
    setNotification({
      type: 'success',
      message: `ಪ್ರಶ್ನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ! (${lessonName})`,
    });
    setSingleText('');
    setSingleAnswer('');
    setSingleExplanation('');
    onQuestionsUpdated?.();
  };

  // -------------------------------------------------------------
  // CSV TEMPLATE DOWNLOAD
  // -------------------------------------------------------------
  const handleDownloadTemplate = () => {
    const headers = [
      'Class',
      'Subject',
      'Exam',
      'LessonNumber',
      'LessonName',
      'QuestionType',
      'QuestionText',
      'Answer',
      'Marks',
      'Difficulty',
      'Options',
    ];
    const sampleRows = [
      [
        '6th',
        'science',
        'SA-1',
        '1',
        'ಆಹಾರ: ಇದು ಎಲ್ಲಿಂದ ದೊರಕುತ್ತದೆ?',
        'fill_blank',
        'ಜೇನುನೊಣಗಳು ಹೂವುಗಳಿಂದ ________ ಯನ್ನು ಸಂಗ್ರಹಿಸಿ ಜೇನುತುಪ್ಪವನ್ನಾಗಿ ಪರಿವರ್ತಿಸುತ್ತವೆ.',
        'ಮಕರಂದ (Nectar)',
        '1',
        'easy',
        '',
      ],
      [
        '6th',
        'science',
        'SA-1',
        '1',
        'ಆಹಾರ: ಇದು ಎಲ್ಲಿಂದ ದೊರಕುತ್ತದೆ?',
        'mcq',
        'ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಸಸ್ಯಾಹಾರಿ ಪ್ರಾಣಿಗೆ ಉದಾಹರಣೆ ಯಾವುದು?',
        'ಜಿಂಕೆ',
        '1',
        'easy',
        'ಎ) ಹುಲಿ; ಬಿ) ಸಿಂಹ; ಸಿ) ಜಿಂಕೆ; ಡಿ) ಚಿರತೆ',
      ],
      [
        '7th',
        'mathematics',
        'SA-1',
        '1',
        'ಪೂರ್ಣಾಂಕಗಳು',
        'short_answer',
        '(-೮) + (+೧೨) ರ ಬೆಲೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.',
        '+೪',
        '2',
        'medium',
        '',
      ],
      [
        '6th',
        'kannada',
        'SA-1',
        '2',
        'ಪುಟ್ಟಜ್ಜಿ ಪುಟ್ಟಜ್ಜಿ ಕಥೆ ಹೇಳು',
        'two_three_sentences',
        'ಪುಟ್ಟಜ್ಜಿಯ ಬಳಿ ಮಕ್ಕಳು ಏಕೆ ಕಥೆ ಹೇಳಲು ಹಠ ಹಿಡಿದರು?',
        'ಪುಟ್ಟಜ್ಜಿಯ ಕಥೆಗಳು ಸ್ವಾರಸ್ಯಕರವಾಗಿದ್ದವು ಮತ್ತು ಆಕರ್ಷಕವಾಗಿದ್ದವು.',
        '2',
        'medium',
        '',
      ],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );
    const a = document.createElement('a');
    a.href = encodeURI(csvContent);
    a.download = 'karnataka_question_bank_template.csv';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-kannada">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700/80 border border-blue-400/50 flex items-center justify-center shadow-inner">
              <Upload className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ & ಆಮದು (Upload Question Bank)
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Excel/CSV, Word/ಪಠ್ಯ ಪೇಸ್ಟ್, ಅಥವಾ JSON ಮೂಲಕ ನಿಮ್ಮ ಸ್ವಂತ ಪ್ರಶ್ನೆಗಳನ್ನು ಆಮದು ಮಾಡಿ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance notification / Alert message */}
        {notification && (
          <div
            className={`p-3.5 px-5 text-xs flex items-center justify-between transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-b border-rose-200'
                : 'bg-blue-50 text-blue-900 border-b border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span className="font-semibold">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs underline hover:opacity-80"
            >
              ಮುಚ್ಚಿ
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === 'csv'
                ? 'bg-white text-blue-700 border-slate-200 -mb-px'
                : 'bg-slate-200/80 text-slate-700 border-transparent hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>೧. Excel / CSV ಅಪ್‌ಲೋಡ್</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === 'paste'
                ? 'bg-white text-blue-700 border-slate-200 -mb-px'
                : 'bg-slate-200/80 text-slate-700 border-transparent hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>೨. ವೇಗದ ಪಠ್ಯ / Word ಪೇಸ್ಟ್</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === 'json'
                ? 'bg-white text-blue-700 border-slate-200 -mb-px'
                : 'bg-slate-200/80 text-slate-700 border-transparent hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-purple-600" />
            <span>೩. JSON ಬ್ಯಾಕಪ್</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === 'single'
                ? 'bg-white text-blue-700 border-slate-200 -mb-px'
                : 'bg-slate-200/80 text-slate-700 border-transparent hover:bg-slate-200'
            }`}
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>೪. ಹೊಸ ಪ್ರಶ್ನೆ ಫಾರ್ಮ್</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 font-semibold rounded-t-lg flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === 'guide'
                ? 'bg-white text-blue-700 border-slate-200 -mb-px'
                : 'bg-slate-200/80 text-slate-700 border-transparent hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            <span>೫. ಮಾರ್ಗದರ್ಶಿ (Guide)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ======================================================== */}
          {/* TAB 1: CSV UPLOAD                                        */}
          {/* ======================================================== */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    Excel ಅಥವಾ Google Sheets ನಿಂದ CSV ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಿದ ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿಯನ್ನು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಆಮದು ಮಾಡಿಕೊಳ್ಳಿ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV ಮಾದರಿ ಡೌನ್‌ಲೋಡ್ (Template)</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  ನಿಮ್ಮ CSV ಫೈಲ್ ಅನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್: .csv (UTF-8 ಎನ್‌ಕೋಡಿಂಗ್ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ)
                </p>

                <div className="mt-4">
                  <label className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>ಕಂಪ್ಯೂಟರ್‌ನಿಂದ CSV ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {csvFile && (
                  <p className="text-xs text-blue-800 font-bold mt-2">
                    ಆಯ್ಕೆಮಾಡಿದ ಫೈಲ್: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Parsing status / Errors */}
              {csvParseErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>ದೋಷಗಳು:</span>
                  </div>
                  {csvParseErrors.map((err, i) => (
                    <p key={i}>• {err}</p>
                  ))}
                </div>
              )}

              {/* Preview Table if questions were parsed */}
              {parsedCsvQuestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h5 className="text-sm font-bold text-slate-800">
                        ಪತ್ತೆಯಾದ ಪ್ರಶ್ನೆಗಳ ಮುನ್ನೋಟ ({parsedCsvQuestions.length} ಪ್ರಶ್ನೆಗಳು)
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmCsvImport}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ಖಚಿತಪಡಿಸಿ ಆಮದು ಮಾಡಿ ({parsedCsvQuestions.length})</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2">ಕ್ರ.ಸಂ.</th>
                          <th className="p-2">ತರಗತಿ & ವಿಷಯ</th>
                          <th className="p-2">ಪಾಠ</th>
                          <th className="p-2">ಪ್ರಕಾರ</th>
                          <th className="p-2">ಪ್ರಶ್ನೆ ವಿವರ</th>
                          <th className="p-2">ಅಂಕ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedCsvQuestions.map((q, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-slate-500 font-mono">{idx + 1}</td>
                            <td className="p-2 font-medium">
                              {q.classId} • {q.subjectId}
                            </td>
                            <td className="p-2 text-slate-700 truncate max-w-[140px]" title={q.lessonName}>
                              #{q.lessonNumber} {q.lessonName}
                            </td>
                            <td className="p-2 text-slate-600">{q.questionType}</td>
                            <td className="p-2 font-kannada text-slate-800 max-w-[280px] truncate" title={q.questionText}>
                              {q.questionText}
                            </td>
                            <td className="p-2 font-bold text-blue-700">{q.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: BULK TEXT PASTE                                   */}
          {/* ======================================================== */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="text-sm font-bold text-amber-950">
                  MS Word, Notepad ಅಥವಾ WhatsApp ನಿಂದ ಪ್ರಶ್ನೆಗಳನ್ನು ನೇರವಾಗಿ ಪೇಸ್ಟ್ ಮಾಡಿ
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  ಕೆಳಗೆ ತರಗತಿ, ವಿಷಯ ಮತ್ತು ಪಾಠವನ್ನು ಆರಿಸಿ, ನಂತರ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ. ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದೊಂದು ಪ್ರಶ್ನೆ ಅಥವಾ 1, 2, 3 ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ನಮೂದಿಸಬಹುದು.
                </p>
              </div>

              {/* Target Metadata Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ತರಗತಿ:</label>
                  <select
                    value={pasteClass}
                    onChange={(e) => setPasteClass(e.target.value as ClassId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    <option value="6th">೬ನೇ ತರಗತಿ</option>
                    <option value="7th">೭ನೇ ತರಗತಿ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ವಿಷಯ:</label>
                  <select
                    value={pasteSubject}
                    onChange={(e) => setPasteSubject(e.target.value as SubjectId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameKannada}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಅವಧಿ / ಪರೀಕ್ಷೆ:</label>
                  <select
                    value={pasteExam}
                    onChange={(e) => setPasteExam(e.target.value as ExamId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    <option value="SA-1">ಭಾಗ-೧ (SA-1)</option>
                    <option value="SA-2">ಭಾಗ-೨ (SA-2)</option>
                    <option value="ANNUAL">ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆ (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಪಾಠ / ಅಧ್ಯಾಯ:</label>
                  <select
                    value={pasteLessonNum}
                    onChange={(e) => setPasteLessonNum(parseInt(e.target.value, 10))}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    {pasteLessons.map((l) => (
                      <option key={l.number} value={l.number}>
                        {l.number}. {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಪ್ರಶ್ನೆ ಪ್ರಕಾರ:</label>
                  <select
                    value={pasteType}
                    onChange={(e) => setPasteType(e.target.value as QuestionType)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    {Object.values(QUESTION_TYPES).map((qt) => (
                      <option key={qt.type} value={qt.type}>
                        {qt.titleKannada} ({qt.defaultMarks} ಅಂಕ)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಅಂಕ:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={pasteMarks}
                    onChange={(e) => setPasteMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಕಾಠಿಣ್ಯತೆ:</label>
                  <select
                    value={pasteDifficulty}
                    onChange={(e) => setPasteDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    <option value="easy">ಸುಲಭ (Easy)</option>
                    <option value="medium">ಮಧ್ಯಮ (Medium)</option>
                    <option value="hard">ಕಷ್ಟ (Hard)</option>
                  </select>
                </div>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <label>ಪ್ರಶ್ನೆಗಳನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ:</label>
                  <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                    {parsedPastedItems.length} ಪ್ರಶ್ನೆಗಳು ಪತ್ತೆಯಾಗಿವೆ
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={pastedRawText}
                  onChange={(e) => setPastedRawText(e.target.value)}
                  placeholder={`ಉದಾಹರಣೆಗೆ:
1. ಸಸ್ಯಗಳು ತಮ್ಮ ಆಹಾರವನ್ನು ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಕ್ರಿಯೆಯ ಮೂಲಕ ತಯಾರಿಸುತ್ತವೆ.
2. ಎಲೆಗಳ ಹಸಿರು ಬಣ್ಣಕ್ಕೆ ಕ್ಲೋರೋಫಿಲ್ ವರ್ಣಕ ಕಾರಣ.
3. ಜೇನುನೊಣಗಳು ಹೂವುಗಳಿಂದ ಮಕರಂದವನ್ನು ಸಂಗ್ರಹಿಸುತ್ತವೆ.`}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-kannada focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Confirm Import Button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500">
                  ಪ್ರತಿ ಸಂಖ್ಯೆ ಅಥವಾ ಹೊಸ ಸಾಲಿನ ವಾಕ್ಯವನ್ನು ಪ್ರತ್ಯೇಕ ಪ್ರಶ್ನೆಯಾಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ.
                </p>
                <button
                  type="button"
                  disabled={parsedPastedItems.length === 0}
                  onClick={handleConfirmPasteImport}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{parsedPastedItems.length} ಪ್ರಶ್ನೆಗಳನ್ನು ಆಮದು ಮಾಡಿ</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: JSON BACKUP                                       */}
          {/* ======================================================== */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="text-sm font-bold text-purple-950">
                  ಹಿಂದೆ ರಫ್ತು (Export) ಮಾಡಿದ JSON ಬ್ಯಾಕಪ್ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ
                </h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  ಇನ್ನೊಂದು ಕಂಪ್ಯೂಟರ್ ಅಥವಾ ಮೊಬೈಲ್‌ನಿಂದ ಬ್ಯಾಕಪ್ ಮಾಡಿದ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಮರುಸ್ಥಾಪಿಸಿ.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-purple-50/40 transition-colors">
                <FileCode className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  ನಿಮ್ಮ JSON ಬ್ಯಾಕಪ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ
                </p>
                <div className="mt-4">
                  <label className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>JSON ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (.json)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleJsonFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              {parsedJsonQuestions.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-950">
                      {parsedJsonQuestions.length} ಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು ಪತ್ತೆಯಾಗಿವೆ!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmJsonImport}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    ಮರುಸ್ಥಾಪಿಸಿ & ಆಮದು ಮಾಡಿ
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SINGLE QUESTION FORM                              */}
          {/* ======================================================== */}
          {activeTab === 'single' && (
            <form onSubmit={handleSaveSingleQuestion} className="space-y-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ತರಗತಿ:</label>
                  <select
                    value={singleClass}
                    onChange={(e) => setSingleClass(e.target.value as ClassId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    <option value="6th">೬ನೇ ತರಗತಿ</option>
                    <option value="7th">೭ನೇ ತರಗತಿ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ವಿಷಯ:</label>
                  <select
                    value={singleSubject}
                    onChange={(e) => setSingleSubject(e.target.value as SubjectId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameKannada}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಅವಧಿ:</label>
                  <select
                    value={singleExam}
                    onChange={(e) => setSingleExam(e.target.value as ExamId)}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    <option value="SA-1">ಭಾಗ-೧ (SA-1)</option>
                    <option value="SA-2">ಭಾಗ-೨ (SA-2)</option>
                    <option value="ANNUAL">ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆ (All)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಪಾಠ:</label>
                  <select
                    value={singleLessonNum}
                    onChange={(e) => setSingleLessonNum(parseInt(e.target.value, 10))}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    {singleLessons.map((l) => (
                      <option key={l.number} value={l.number}>
                        {l.number}. {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಪ್ರಶ್ನೆ ಪ್ರಕಾರ:</label>
                  <select
                    value={singleType}
                    onChange={(e) => {
                      const t = e.target.value as QuestionType;
                      setSingleType(t);
                      const m = QUESTION_TYPES[t];
                      if (m) setSingleMarks(m.defaultMarks);
                    }}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    {Object.values(QUESTION_TYPES).map((qt) => (
                      <option key={qt.type} value={qt.type}>
                        {qt.titleKannada}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಅಂಕ:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={singleMarks}
                    onChange={(e) => setSingleMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ಕಾಠಿಣ್ಯತೆ:</label>
                  <select
                    value={singleDifficulty}
                    onChange={(e) => setSingleDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full border border-slate-300 rounded-lg p-1.5"
                  >
                    <option value="easy">ಸುಲಭ (Easy)</option>
                    <option value="medium">ಮಧ್ಯಮ (Medium)</option>
                    <option value="hard">ಕಷ್ಟ (Hard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-xs text-slate-700 mb-1">
                  ಪ್ರಶ್ನೆ ಪಠ್ಯ (Question Text): *
                </label>
                <textarea
                  rows={3}
                  required
                  value={singleText}
                  onChange={(e) => setSingleText(e.target.value)}
                  placeholder="ಕನ್ನಡ ಯೂನಿಕೋಡ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm font-kannada"
                />
              </div>

              {/* Options if MCQ */}
              {(singleType === 'mcq' || singleType === 'choose_correct') && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block font-semibold text-xs text-slate-700">
                    ಆಯ್ಕೆಗಳು (MCQ Options):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {singleOptions.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...singleOptions];
                          next[i] = e.target.value;
                          setSingleOptions(next);
                        }}
                        className="w-full border border-slate-300 rounded-lg p-1.5 font-kannada"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-xs text-slate-700 mb-1">
                  ಮಾದರಿ ಉತ್ತರ (Sample Answer / Key):
                </label>
                <input
                  type="text"
                  value={singleAnswer}
                  onChange={(e) => setSingleAnswer(e.target.value)}
                  placeholder="ಮೌಲ್ಯಮಾಪನ ಸೂಚಿ ಅಥವಾ ಸರಿಯಾದ ಉತ್ತರ..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs sm:text-sm font-kannada"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್‌ಗೆ ಸೇರಿಸಿ (Add Question)</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 5: STEP-BY-STEP GUIDE                                */}
          {/* ======================================================== */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-900 text-sm mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>ಸ್ವಂತ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ</span>
                </h4>
                <p className="text-blue-800 text-xs">
                  ಶಿಕ್ಷಕರು ತಮ್ಮ ಶಾಲಾ ಪರೀಕ್ಷೆಗಳು ಅಥವಾ ಹೆಚ್ಚುವರಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಹೇಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು ಎಂಬುದರ ವಿವರ ಇಲ್ಲಿದೆ:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      ೧
                    </span>
                    <span>Excel ಅಥವಾ CSV ಮೂಲಕ ಅಪ್‌ಲೋಡ್</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    ಮೇಲಿನ "೧. Excel / CSV ಅಪ್‌ಲೋಡ್" ಟ್ಯಾಬ್‌ನಲ್ಲಿ <strong>CSV ಮಾದರಿ ಡೌನ್‌ಲೋಡ್</strong> ಮಾಡಿ. ಅದರಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ನಮೂದಿಸಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಕಾಲಮ್‌ಗಳು: <code className="bg-slate-200 px-1 rounded">Class, Subject, Exam, LessonNumber, QuestionText, Marks</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                      ೨
                    </span>
                    <span>Word / Text ನಿಂದ ಪೇಸ್ಟ್ ಮಾಡಿ</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    ನಿಮ್ಮ ಬಳಿ Word ಫೈಲ್ ಅಥವಾ ಟೆಕ್ಸ್ಟ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, "೨. ವೇಗದ ಪಠ್ಯ ಪೇಸ್ಟ್" ಟ್ಯಾಬ್ ಆಯ್ಕೆಮಾಡಿ. ತರಗತಿ ಹಾಗೂ ಪಾಠ ಆರಿಸಿ, ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿಯನ್ನು ಒಟ್ಟಿಗೆ ಪೇಸ್ಟ್ ಮಾಡಿ ಆಮದು ಮಾಡಿಕೊಳ್ಳಿ.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                      ೩
                    </span>
                    <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚನೆಯಲ್ಲಿ ಬಳಕೆ</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ತಯಾರಿಸುವಾಗ ತಾನಾಗಿಯೇ ಆಯ್ಕೆ ಪಟ್ಟಿಯಲ್ಲಿ ಬರುತ್ತವೆ! ಅವುಗಳನ್ನು ನೀವು ಪತ್ರಿಕೆಯಲ್ಲಿ ಬಳಸಬಹುದು.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      ೪
                    </span>
                    <span>ಪ್ರಶ್ನೆಗಳ ನಿರ್ವಹಣೆ & ರಫ್ತು</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    "೩. ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್" ಮೆನುವಿನಲ್ಲಿ ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಪ್ರಶ್ನೆಗಳನ್ನು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ತಿದ್ದಬಹುದು (Edit), ಅಳಿಸಬಹುದು (Delete), ಅಥವಾ ಬೇರೆ ಕಂಪ್ಯೂಟರ್‌ಗಾಗಿ ರಫ್ತು (Export) ಮಾಡಿಕೊಳ್ಳಬಹುದು.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-3.5 px-6 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪಠ್ಯಕ್ರಮ ೨೦೨೬-೨೭ • ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಸಿಸ್ಟಮ್
          </span>
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-colors"
          >
            ಮುಕ್ತಾಯ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
