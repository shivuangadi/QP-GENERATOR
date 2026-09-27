import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookMarked,
  Layers,
  ChevronRight,
  Plus,
  FileCheck,
  Check,
  Award,
  List,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { getLessons, getSubjectAllPdfUrls, getSubjectPdfUrl, QUESTION_TYPES, SUBJECTS, toKannadaDigits } from '../data/syllabus';
import { SAMPLE_TEXTBOOKS, getInternalLessonTextbook, InternalLessonTextbook } from '../data/sampleTextbooks';
import { generateQuestionsFromTextbook } from '../services/aiGenerator';
import {
  deleteTextbookContent,
  getTextbookContents,
  getAllQuestions,
  saveQuestion,
  saveTextbookContent,
} from '../services/storage';
import {
  ClassId,
  DifficultyLevel,
  ExamId,
  Question,
  QuestionType,
  SubjectId,
  TextbookContent,
} from '../types';

export const TextbookImportView: React.FC = () => {
  // Navigation & Selection State
  const [classId, setClassId] = useState<ClassId>('6th');
  const [subjectId, setSubjectId] = useState<SubjectId>('science');
  const [examId, setExamId] = useState<ExamId>('SA-1');
  const [lessonNumber, setLessonNumber] = useState<number>(1);

  // Tab inside lesson view: 'content' | 'ai_gen' | 'bank_questions' | 'notes'
  const [activeLessonTab, setActiveLessonTab] = useState<'content' | 'ai_gen' | 'bank_questions'>('content');

  // Teacher custom notes for current lesson (internal only)
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [notesSaveStatus, setNotesSaveStatus] = useState<string | null>(null);
  const [showBooksDirectory, setShowBooksDirectory] = useState<boolean>(false);

  // AI Question Generation Form inside this view
  const [aiQuestionType, setAiQuestionType] = useState<QuestionType>('fill_blank');
  const [aiMarks, setAiMarks] = useState<number>(1);
  const [aiDifficulty, setAiDifficulty] = useState<DifficultyLevel>('medium');
  const [aiCount, setAiCount] = useState<number>(2);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [generatedAIQuestions, setGeneratedAIQuestions] = useState<Question[]>([]);

  // Current lesson list for selected class, subject, and exam
  const currentLessons = useMemo(() => {
    return getLessons(classId, subjectId, examId);
  }, [classId, subjectId, examId]);

  // Selected lesson info
  const selectedLessonInfo = useMemo(() => {
    return currentLessons.find((l) => l.number === lessonNumber) || currentLessons[0];
  }, [currentLessons, lessonNumber]);

  // Keep lesson number valid when class/subject/exam changes
  React.useEffect(() => {
    if (currentLessons.length > 0 && !currentLessons.some((l) => l.number === lessonNumber)) {
      setLessonNumber(currentLessons[0].number);
    }
  }, [currentLessons, lessonNumber]);

  // Retrieve the internal textbook entry
  const internalBook: InternalLessonTextbook | undefined = useMemo(() => {
    return getInternalLessonTextbook(classId, subjectId, lessonNumber);
  }, [classId, subjectId, lessonNumber]);

  const currentSubject = useMemo(() => {
    return SUBJECTS.find((s) => s.id === subjectId);
  }, [subjectId]);

  const currentSubjectAllUrls = useMemo(() => {
    return getSubjectAllPdfUrls(subjectId, classId);
  }, [subjectId, classId]);

  const officialPdfUrl = useMemo(() => {
    return getSubjectPdfUrl(subjectId, classId, examId) || internalBook?.sourceUrl;
  }, [subjectId, classId, examId, internalBook]);

  // Retrieve questions for this lesson from internal bank
  const allBankQuestions = useMemo(() => {
    return getAllQuestions();
  }, []);

  const lessonBankQuestions = useMemo(() => {
    return allBankQuestions.filter(
      (q) => q.classId === classId && q.subjectId === subjectId && q.lessonNumber === lessonNumber
    );
  }, [allBankQuestions, classId, subjectId, lessonNumber]);

  // AI Question Generation Handler directly from internal textbook
  const handleGenerateAI = async () => {
    setAiErrorMessage(null);

    const effectiveContent = internalBook?.excerpt || '';

    if (!effectiveContent || effectiveContent.trim().length < 20) {
      setAiErrorMessage('ಈ ಪಾಠದ ಆಂತರಿಕ ಪಠ್ಯ ವಿಷಯವು ಲಭ್ಯವಿಲ್ಲ.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const result = await generateQuestionsFromTextbook({
        classId,
        subjectId,
        examId,
        lessonNumber,
        lessonName: selectedLessonInfo ? selectedLessonInfo.name : 'ಅಧ್ಯಾಯ',
        textbookContent: effectiveContent,
        questionType: aiQuestionType,
        marks: aiMarks,
        difficulty: aiDifficulty,
        count: aiCount,
      });

      setGeneratedAIQuestions((prev) => [...result, ...prev]);
    } catch (err: any) {
      setAiErrorMessage(err.message || 'ಪ್ರಶ್ನೆ ರಚನೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Approve AI Question and save to Question Bank
  const handleApproveAIQuestion = (q: Question) => {
    saveQuestion({
      ...q,
      approved: true,
      isAIGenerated: true,
    });
    setGeneratedAIQuestions((prev) =>
      prev.map((item) => (item.id === q.id ? { ...item, approved: true } : item))
    );
  };

  // Remove question from review list
  const handleRemoveAIQuestion = (id: string) => {
    setGeneratedAIQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
              ಆಂತರಿಕ ಪಠ್ಯಕ್ರಮ ೨೦೨೬-೨೭ (Internal Curriculum)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTS) & DSERT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>ಆಂತರಿಕ ಅಧಿಕೃತ ಪಠ್ಯವಿಷಯ & ಪಠ್ಯಕ್ರಮ (Internal Syllabus & Textbooks)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ಕರ್ನಾಟಕ ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಅಧಿಕೃತ ಪರಿಷ್ಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳ (ಭಾಗ-೧ & ಭಾಗ-೨) ಅಧ್ಯಾಯಗಳು, ಪರಿಕಲ್ಪನೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೋತ್ತರಗಳು ಆಂತರಿಕವಾಗಿ ಲಭ್ಯವಿವೆ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowBooksDirectory(!showBooksDirectory)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <BookMarked className="w-4 h-4 text-amber-300" />
            <span>{showBooksDirectory ? 'ಗ್ರಂಥಾಲಯ ಮರೆಮಾಡಿ (Hide)' : '📚 ೨೦೨೬-೨೭ ಎಲ್ಲಾ ಪಠ್ಯಪುಸ್ತಕಗಳ ಡಿಜಿಟಲ್ ಲೈಬ್ರರಿ'}</span>
          </button>
          <div className="bg-blue-50 border border-blue-200 text-blue-900 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>೧೦೦% ಆಂತರಿಕ - ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ</span>
          </div>
        </div>
      </div>

      {/* Expandable Digital Textbook Library (All 7 Subjects - 6th & 7th Std) */}
      {showBooksDirectory && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-indigo-100 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-600" />
                <span>ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTS) ೨೦೨೬-೨೭ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳ ಪಟ್ಟಿ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಎಲ್ಲಾ ೭ ವಿಷಯಗಳ ಭಾಗ-೧ ಮತ್ತು ಭಾಗ-೨ ಅಧಿಕೃತ KTS PDF ಲಿಂಕ್‌ಗಳು:
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-800 font-bold px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
              ೭ ವಿಷಯಗಳು • ೬ & ೭ನೇ ತರಗತಿ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 6th Standard Books Column */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md">೬ನೇ</span>
                  <span>೬ನೇ ತರಗತಿ ನೂತನ ಪಠ್ಯಪುಸ್ತಕಗಳು (2026-27)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">KTS Official</span>
              </div>

              <div className="space-y-2.5">
                {SUBJECTS.map((sub) => {
                  const urls = getSubjectAllPdfUrls(sub.id, '6th');
                  return (
                    <div
                      key={sub.id}
                      className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-indigo-300 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{sub.nameKannada}</div>
                        <div className="text-[11px] text-slate-500">{sub.nameEnglish}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {urls.part1 && (
                          <a
                            href={urls.part1}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold transition-colors"
                            title="ಭಾಗ - ೧ (SA-1) ಅಧಿಕೃತ KTS PDF"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>ಭಾಗ ೧</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {urls.part2 && (
                          <a
                            href={urls.part2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-bold transition-colors"
                            title="ಭಾಗ - ೨ (SA-2) ಅಧಿಕೃತ KTS PDF"
                          >
                            <FileText className="w-3 h-3 text-indigo-600" />
                            <span>ಭಾಗ ೨</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {urls.full && (
                          <a
                            href={urls.full}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold transition-colors"
                            title="ಅಧಿಕೃತ ಸಮಗ್ರ PDF"
                          >
                            <FileText className="w-3 h-3 text-amber-600" />
                            <span>ಸಮಗ್ರ PDF</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7th Standard Books Column */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-md">೭ನೇ</span>
                  <span>೭ನೇ ತರಗತಿ ನೂತನ ಪಠ್ಯಪುಸ್ತಕಗಳು (2026-27)</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">KTS Official</span>
              </div>

              <div className="space-y-2.5">
                {SUBJECTS.map((sub) => {
                  const urls = getSubjectAllPdfUrls(sub.id, '7th');
                  return (
                    <div
                      key={sub.id}
                      className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-indigo-300 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{sub.nameKannada}</div>
                        <div className="text-[11px] text-slate-500">{sub.nameEnglish}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {urls.part1 && (
                          <a
                            href={urls.part1}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold transition-colors"
                            title="ಭಾಗ - ೧ (SA-1) ಅಧಿಕೃತ KTS PDF"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>ಭಾಗ ೧</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {urls.part2 && (
                          <a
                            href={urls.part2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-bold transition-colors"
                            title="ಭಾಗ - ೨ (SA-2) ಅಧಿಕೃತ KTS PDF"
                          >
                            <FileText className="w-3 h-3 text-indigo-600" />
                            <span>ಭಾಗ ೨</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {urls.full && (
                          <a
                            href={urls.full}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-bold transition-colors"
                            title="ಅಧಿಕೃತ ಸಮಗ್ರ PDF"
                          >
                            <FileText className="w-3 h-3 text-amber-600" />
                            <span>ಸಮಗ್ರ PDF</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Selector Ribbon: Class, Subject, Exam, Chapter */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Class Select */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೧. ತರಗತಿ (Class):
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value as ClassId)}
              className="w-full bg-white text-slate-900 text-sm font-bold rounded-lg px-3 py-2 font-kannada"
            >
              <option value="6th">೬ನೇ ತರಗತಿ (Class 6)</option>
              <option value="7th">೭ನೇ ತರಗತಿ (Class 7)</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೨. ವಿಷಯ (Subject):
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value as SubjectId)}
              className="w-full bg-white text-slate-900 text-sm font-bold rounded-lg px-3 py-2 font-kannada"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nameKannada}
                </option>
              ))}
            </select>
          </div>

          {/* Exam / Term Select */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೩. ಪರೀಕ್ಷಾ ಅವಧಿ (Term):
            </label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value as ExamId)}
              className="w-full bg-white text-slate-900 text-sm font-bold rounded-lg px-3 py-2 font-kannada"
            >
              <option value="SA-1">SA-1 (ಟರ್ಮ್ ೧ / ಭಾಗ - ೧)</option>
              <option value="SA-2">SA-2 (ಟರ್ಮ್ ೨ / ಭಾಗ - ೨)</option>
              <option value="ANNUAL">ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆ / ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳು (ಭಾಗ ೧ + ಭಾಗ ೨)</option>
            </select>
          </div>

          {/* Lesson Select */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              ೪. ಪಾಠ / ಅಧ್ಯಾಯ (Chapter):
            </label>
            <select
              value={lessonNumber}
              onChange={(e) => setLessonNumber(Number(e.target.value))}
              className="w-full bg-amber-50 text-slate-950 text-sm font-bold rounded-lg px-3 py-2 font-kannada border-2 border-amber-400"
            >
              {currentLessons.map((l) => (
                <option key={l.number} value={l.number}>
                  {l.exam === 'SA-1' ? '[ಭಾಗ ೧] ' : '[ಭಾಗ ೨] '}ಅಧ್ಯಾಯ {toKannadaDigits(l.number)}: {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Chapter Details & Content), Right Column (AI Question Generator & Bank) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: INTERNAL TEXTBOOK DETAILS & EXCERPT (7 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Lesson Title & Metadata Card */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {internalBook?.part || (examId === 'SA-1' ? 'ಭಾಗ - ೧' : 'ಭಾಗ - ೨')}
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    ಅಧ್ಯಾಯ {toKannadaDigits(lessonNumber)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {internalBook?.sourceBook || 'ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ ೨೦೨೬-೨೭'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentSubjectAllUrls.part1 && (
                    <a
                      href={currentSubjectAllUrls.part1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                      title="ಭಾಗ - ೧ (SA-1) ಅಧಿಕೃತ KTS PDF ತೆರೆಯಿರಿ"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>ಭಾಗ - ೧ PDF</span>
                      <ExternalLink className="w-2.5 h-2.5 text-blue-500" />
                    </a>
                  )}
                  {currentSubjectAllUrls.part2 && (
                    <a
                      href={currentSubjectAllUrls.part2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                      title="ಭಾಗ - ೨ (SA-2) ಅಧಿಕೃತ KTS PDF ತೆರೆಯಿರಿ"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ಭಾಗ - ೨ PDF</span>
                      <ExternalLink className="w-2.5 h-2.5 text-indigo-500" />
                    </a>
                  )}
                  {currentSubjectAllUrls.full && (
                    <a
                      href={currentSubjectAllUrls.full}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
                      title="ಅಧಿಕೃತ ಸಮಗ್ರ ಪಠ್ಯಪುಸ್ತಕ PDF ತೆರೆಯಿರಿ"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>ಸಮಗ್ರ PDF</span>
                      <ExternalLink className="w-2.5 h-2.5 text-amber-500" />
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {selectedLessonInfo?.name || 'ಅಧ್ಯಾಯ'}
              </h3>
            </div>

            {/* Inner Subtabs */}
            <div className="flex border-b border-slate-200 pb-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveLessonTab('content')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeLessonTab === 'content'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>೧. ಅಧಿಕೃತ ಪಠ್ಯ ಸಾರಾಂಶ & ಪರಿಕಲ್ಪನೆಗಳು</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLessonTab('bank_questions')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeLessonTab === 'bank_questions'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>೨. ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಪ್ರಶ್ನೆಗಳು ({lessonBankQuestions.length})</span>
              </button>
            </div>

            {/* Tab 1: Internal Textbook Content */}
            {activeLessonTab === 'content' && (
              <div className="space-y-4">
                {/* Key Concepts Tags */}
                {internalBook?.keyConcepts && internalBook.keyConcepts.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆಗಳು (Key Concepts):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {internalBook.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium shadow-2xs"
                        >
                          • {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Definitions Table */}
                {internalBook?.keyDefinitions && internalBook.keyDefinitions.length > 0 && (
                  <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>ಪ್ರಮುಖ ವ್ಯಾಖ್ಯೆಗಳು ಮತ್ತು ಪದಕೋಶ (Key Definitions):</span>
                    </span>
                    <div className="space-y-2">
                      {internalBook.keyDefinitions.map((def, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-200/80 text-xs">
                          <span className="font-bold text-amber-900 block mb-0.5">{def.term}:</span>
                          <span className="text-slate-700 leading-relaxed">{def.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Textbook Reading Excerpt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕದ ಸಾರಾಂಶ (Official Textbook Content):
                    </label>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ಆಂತರಿಕವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed font-kannada whitespace-pre-line max-h-[380px] overflow-y-auto shadow-inner">
                    {internalBook?.excerpt || (
                      <p className="text-slate-500 italic">
                        ಈ ಅಧ್ಯಾಯದ ಪಠ್ಯ ಸಾರಾಂಶವು ಸಿದ್ಧವಾಗಿದೆ. ಕೆಳಗಿನ ಪ್ರಶ್ನೆ ರಚನಾ ಸಾಧನದ ಮೂಲಕ ತಕ್ಷಣ ಪ್ರಶ್ನೆಗಳನ್ನು ರೂಪಿಸಬಹುದು.
                      </p>
                    )}
                  </div>
                </div>

                {/* Exam Focus Areas */}
                {internalBook?.focusAreas && internalBook.focusAreas.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-blue-900">ಪರೀಕ್ಷಾ ದೃಷ್ಟಿಕೋನ (Exam Focus):</span>
                    {internalBook.focusAreas.map((fa, idx) => (
                      <span key={idx} className="bg-blue-600 text-white font-medium px-2 py-0.5 rounded-md">
                        {fa}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Bank Questions for this Lesson */}
            {activeLessonTab === 'bank_questions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    ಈ ಪಾಠಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಪ್ರಶ್ನೆಗಳು ({lessonBankQuestions.length}):
                  </span>
                </div>

                {lessonBankQuestions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500">
                      ಈ ಪಾಠಕ್ಕೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ. ಬಲಭಾಗದ AI ರಚನಾ ಸಾಧನದ ಮೂಲಕ ತಕ್ಷಣ ರಚಿಸಿ!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {lessonBankQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">
                            {QUESTION_TYPES[q.questionType]?.titleKannada || q.questionType}
                          </span>
                          <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {toKannadaDigits(q.marks)} ಅಂಕ
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">
                          {idx + 1}. {q.questionText}
                        </p>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 pl-2">
                            {q.options.map((opt, i) => (
                              <div key={i}>• {opt}</div>
                            ))}
                          </div>
                        )}
                        {q.answer && (
                          <div className="text-[11px] bg-emerald-50 text-emerald-900 p-1.5 rounded border border-emerald-200 font-semibold">
                            ಉತ್ತರ: {q.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: DIRECT AI QUESTION GENERATOR (5 COLS)      */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ಆಂತರಿಕ ಪಠ್ಯಾಧಾರಿತ AI ಪ್ರಶ್ನೆ ರಚನೆ
                </h3>
                <p className="text-[11px] text-slate-500">
                  ಆಯ್ಕೆಮಾಡಿದ ‘{selectedLessonInfo?.name}’ ಪಾಠದ ಪಠ್ಯದಿಂದ ನೇರವಾಗಿ ಪ್ರಶ್ನೆ ರಚಿಸಿ
                </p>
              </div>
            </div>

            {aiErrorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{aiErrorMessage}</span>
              </div>
            )}

            {/* Question Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ೧. ಪ್ರಶ್ನೆ ಪ್ರಕಾರ (Question Type):
              </label>
              <select
                value={aiQuestionType}
                onChange={(e) => {
                  const t = e.target.value as QuestionType;
                  setAiQuestionType(t);
                  setAiMarks(QUESTION_TYPES[t]?.defaultMarks || 1);
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-2.5 py-2 font-kannada"
              >
                {Object.values(QUESTION_TYPES).map((qt) => (
                  <option key={qt.type} value={qt.type}>
                    {qt.titleKannada} ({qt.titleEnglish})
                  </option>
                ))}
              </select>
            </div>

            {/* Marks & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ೨. ಅಂಕಗಳು:
                </label>
                <select
                  value={aiMarks}
                  onChange={(e) => setAiMarks(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-2.5 py-1.5"
                >
                  <option value={1}>೧ ಅಂಕ</option>
                  <option value={2}>೨ ಅಂಕಗಳು</option>
                  <option value={3}>೩ ಅಂಕಗಳು</option>
                  <option value={4}>೪ ಅಂಕಗಳು</option>
                  <option value={5}>೫ ಅಂಕಗಳು</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ೩. ಕಠಿಣತೆಯ ಮಟ್ಟ:
                </label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-2.5 py-1.5"
                >
                  <option value="easy">ಸುಲಭ (Easy)</option>
                  <option value="medium">ಮಧ್ಯಮ (Medium)</option>
                  <option value="hard">ಕಠಿಣ (Hard)</option>
                </select>
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ೪. ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setAiCount(cnt)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      aiCount === cnt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toKannadaDigits(cnt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGeneratingAI
                  ? 'ಆಂತರಿಕ ಪಠ್ಯದಿಂದ ಪ್ರಶ್ನೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...'
                  : `ಆಂತರಿಕ ಪಠ್ಯದಿಂದ ಪ್ರಶ್ನೆ ರಚಿಸಿ (${toKannadaDigits(aiCount)})`}
              </span>
            </button>
          </div>

          {/* Generated AI Questions Review Card */}
          {generatedAIQuestions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ರಚಿತ ಹೊಸ ಪ್ರಶ್ನೆಗಳು ({generatedAIQuestions.length}):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setGeneratedAIQuestions([])}
                  className="text-[11px] text-slate-400 hover:text-red-600"
                >
                  ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ
                </button>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {generatedAIQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border transition-all space-y-2 text-xs ${
                      q.approved
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {QUESTION_TYPES[q.questionType]?.titleKannada || q.questionType}
                      </span>
                      <span className="font-extrabold text-blue-700">
                        {toKannadaDigits(q.marks)} ಅಂಕ
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 leading-snug">
                      {q.questionText}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                        {q.options.map((opt, i) => (
                          <div key={i}>{opt}</div>
                        ))}
                      </div>
                    )}

                    {q.answer && (
                      <div className="bg-emerald-100/70 text-emerald-950 p-1.5 rounded font-semibold text-[11px]">
                        ಉತ್ತರ: {q.answer}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {q.approved ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApproveAIQuestion(q)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ಬ್ಯಾಂಕ್‌ಗೆ ಸೇರಿಸಿ (Approve)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveAIQuestion(q.id)}
                        className="text-slate-400 hover:text-red-600 text-[11px]"
                      >
                        ತೆಗೆದುಹಾಕಿ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
