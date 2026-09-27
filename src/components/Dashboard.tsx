import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Layers,
  CheckSquare,
  Square,
  Shuffle,
  AlertCircle,
  FileCheck,
  Check,
  Lock,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  FileText,
  CheckCircle2,
  BookMarked,
  X,
  Upload,
} from 'lucide-react';
import { UploadQuestionBankModal } from './UploadQuestionBankModal';
import { getLessons, getSubjectPdfUrl, getSubjectAllPdfUrls, SUBJECTS, toKannadaDigits } from '../data/syllabus';
import { DEFAULT_PATTERNS } from '../data/defaultPatterns';
import { getCustomPatterns } from '../services/storage';
import {
  AnswerSpaceType,
  ClassId,
  DifficultyLevel,
  ExamId,
  QuestionPaper,
  SectionConfig,
  SubjectId,
} from '../types';
import { generateQuestionPaper } from '../services/generator';
import { balanceSectionsForTarget, lockAndAutoAdjustMarks } from '../services/paperBalancer';

interface DashboardProps {
  onPaperGenerated: (paper: QuestionPaper) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onPaperGenerated }) => {
  // 1. Core Selection Controls
  const [selectedClass, setSelectedClass] = useState<ClassId>('6th');
  const [selectedExam, setSelectedExam] = useState<ExamId>('SA-1');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [academicYear] = useState('2026-27');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [examTime, setExamTime] = useState('೨:೦೦ ಗಂಟೆಗಳು');

  // 2. Fixed Marks (30, 40, 50 marks are fixed & locked)
  const [fixedMarks, setFixedMarks] = useState<number>(40);
  // Custom total number of questions typed by the user
  const [typedTotalQuestions, setTypedTotalQuestions] = useState<number>(20);

  // 3. Lessons Selection
  // Allow teachers to view all chapters (Part 1 & Part 2 together) or filter by part
  const [lessonPartScope, setLessonPartScope] = useState<'all' | 'part1' | 'part2'>('all');
  const [showSyllabusExplorer, setShowSyllabusExplorer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // All lessons for the selected subject and class across both parts
  const allSubjectLessons = useMemo(() => {
    return getLessons(selectedClass, selectedSubject, 'ANNUAL');
  }, [selectedClass, selectedSubject]);

  // Lessons displayed in the selection grid based on lessonPartScope
  const displayedLessons = useMemo(() => {
    if (lessonPartScope === 'part1') {
      return allSubjectLessons.filter((l) => l.exam === 'SA-1');
    }
    if (lessonPartScope === 'part2') {
      return allSubjectLessons.filter((l) => l.exam === 'SA-2');
    }
    return allSubjectLessons;
  }, [allSubjectLessons, lessonPartScope]);

  // Alias for backward compatibility
  const availableLessons = displayedLessons;

  // Default all lessons checked
  const [selectedLessonNumbers, setSelectedLessonNumbers] = useState<number[]>([]);

  // Initialize/sync lessons when displayedLessons change
  React.useEffect(() => {
    setSelectedLessonNumbers(displayedLessons.map((l) => l.number));
  }, [displayedLessons]);

  // 4. Pattern / Blueprint & Active Sections
  const customPatterns = getCustomPatterns();
  const [selectedPatternId, setSelectedPatternId] = useState<string>('pattern-40-standard');
  const [activeSections, setActiveSections] = useState<SectionConfig[]>(() => {
    const found = DEFAULT_PATTERNS.find((p) => p.id === 'pattern-40-standard') || DEFAULT_PATTERNS[0];
    return found.sections.map((s) => ({ ...s }));
  });

  // Keep activeSections in sync when pattern changes
  const handlePatternChange = (patternId: string) => {
    setSelectedPatternId(patternId);
    const all = [...DEFAULT_PATTERNS, ...customPatterns];
    const found = all.find((p) => p.id === patternId);
    if (found) {
      setActiveSections(found.sections.map((s) => ({ ...s })));
      setFixedMarks(found.totalMarks);
      setTypedTotalQuestions(found.sections.reduce((s, sec) => s + sec.questionCount, 0));
    }
  };

  // When user types the total number of questions directly in the input box:
  // "customising no of question let me type it, and 30, 40, 50 marks are fixed , even I changed the number of questions the selected marks must be unchanged"
  const handleTypeTotalQuestions = (val: number) => {
    const safeQ = Math.max(1, val);
    setTypedTotalQuestions(safeQ);
    if (safeQ >= 5) {
      const result = balanceSectionsForTarget(safeQ, fixedMarks, activeSections);
      setActiveSections(result.sections);
    }
  };

  // Adjust question count for a specific section - keeps fixedMarks strictly unchanged
  const handleSectionCountChange = (secId: string, delta: number) => {
    const target = activeSections.find((s) => s.id === secId);
    if (!target) return;
    const newCount = Math.max(0, target.questionCount + delta);
    const updated = lockAndAutoAdjustMarks(fixedMarks, secId, newCount, activeSections);
    setActiveSections(updated);
    setTypedTotalQuestions(updated.reduce((sum, s) => sum + s.questionCount, 0));
  };

  // Set explicit count for a specific section - keeps fixedMarks strictly unchanged
  const handleSectionCountInput = (secId: string, count: number) => {
    const safeCount = Math.max(0, count);
    const updated = lockAndAutoAdjustMarks(fixedMarks, secId, safeCount, activeSections);
    setActiveSections(updated);
    setTypedTotalQuestions(updated.reduce((sum, s) => sum + s.questionCount, 0));
  };

  // When fixed marks button (30, 40, 50) is clicked:
  const handleSelectFixedMarks = (m: number) => {
    setFixedMarks(m);
    const targetQ = typedTotalQuestions > 0 ? typedTotalQuestions : (m === 30 ? 15 : m === 40 ? 20 : 25);
    const result = balanceSectionsForTarget(targetQ, m, activeSections);
    setActiveSections(result.sections);
    setTypedTotalQuestions(result.totalQuestions);
    setExamTime(m >= 40 ? '೨:೦೦ ಗಂಟೆಗಳು' : '೧:೩೦ ಗಂಟೆ');
  };

  // Auto-rebalance sections to match fixed marks and typed questions
  const handleRebalanceSections = () => {
    const result = balanceSectionsForTarget(typedTotalQuestions, fixedMarks, activeSections);
    setActiveSections(result.sections);
    setTypedTotalQuestions(result.totalQuestions);
  };

  // Computed total questions & marks from active sections
  const computedTotalQuestions = useMemo(() => {
    return activeSections.reduce((sum, s) => sum + s.questionCount, 0);
  }, [activeSections]);

  const computedTotalMarks = useMemo(() => {
    return activeSections.reduce((sum, s) => sum + (s.questionCount * s.marksPerQuestion), 0);
  }, [activeSections]);

  // 5. Answer Space Style
  const [answerSpace, setAnswerSpace] = useState<AnswerSpaceType>('auto');

  // 6. Difficulty & Lesson Distribution
  const [difficultySetting, setDifficultySetting] = useState<'balanced' | 'easy' | 'hard'>('balanced');
  const [lessonBalanceSetting, setLessonBalanceSetting] = useState<'balanced' | 'random'>('balanced');
  const [paperVersion, setPaperVersion] = useState<string>('A');

  // Error validation message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle single lesson
  const toggleLesson = (num: number) => {
    if (selectedLessonNumbers.includes(num)) {
      setSelectedLessonNumbers(selectedLessonNumbers.filter((n) => n !== num));
    } else {
      setSelectedLessonNumbers([...selectedLessonNumbers, num]);
    }
  };

  // Select all lessons
  const handleSelectAllLessons = () => {
    setSelectedLessonNumbers(availableLessons.map((l) => l.number));
  };

  // Clear all lessons
  const handleClearAllLessons = () => {
    setSelectedLessonNumbers([]);
  };

  // Random lessons selection
  const handleRandomLessons = () => {
    if (availableLessons.length <= 3) {
      handleSelectAllLessons();
      return;
    }
    const shuffled = [...availableLessons].sort(() => 0.5 - Math.random());
    const count = Math.max(3, Math.floor(availableLessons.length * 0.6));
    setSelectedLessonNumbers(shuffled.slice(0, count).map((l) => l.number));
  };

  // Handle Generate Paper
  const handleGenerate = () => {
    setErrorMessage(null);

    if (selectedLessonNumbers.length === 0) {
      setErrorMessage('ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಪಾಠವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Please select at least one lesson).');
      return;
    }

    if (computedTotalQuestions === 0) {
      setErrorMessage('ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }

    setIsGenerating(true);

    try {
      const result = generateQuestionPaper({
        classId: selectedClass,
        subjectId: selectedSubject,
        examId: selectedExam,
        selectedLessons: selectedLessonNumbers,
        totalMarks: fixedMarks,
        customSections: activeSections.filter((s) => s.questionCount > 0),
        patternId: selectedPatternId,
        lessonBalance: lessonBalanceSetting,
        answerSpaceType: answerSpace,
        paperVersion,
      });

      onPaperGenerated(result.paper);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚನೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* ======================================================== */}
      {/* 1. PROFESSIONAL BLUE TEACHER DASHBOARD HEADER           */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-blue-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-700/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-blue-950 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Karnataka State Board
              </span>
              <span className="text-blue-200 text-xs font-medium">
                DSERT / KSEAB ಮಾದರಿ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-kannada">
              ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚನಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              ತರಗತಿ ೬ ಮತ್ತು ೭ ಕ್ಕೆ ನಿಖರ ಪಠ್ಯಕ್ರಮಾನುಸಾರ SA-1 / SA-2 ಪತ್ರಿಕೆಗಳನ್ನು ಕ್ಷಣಮಾತ್ರದಲ್ಲಿ ಸಿದ್ಧಪಡಿಸಿ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-950/60 border border-blue-600/60 p-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-blue-300 block font-semibold">
                ಶೈಕ್ಷಣಿಕ ವರ್ಷ
              </span>
              <span className="text-base font-bold text-amber-300">
                {academicYear}
              </span>
            </div>
            <div className="bg-blue-950/60 border border-blue-600/60 p-2.5 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] uppercase text-blue-300 block font-semibold">
                ಮಾಧ್ಯಮ
              </span>
              <span className="text-sm font-bold text-emerald-300">
                ಕನ್ನಡ ಮಾಧ್ಯಮ
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. PRIMARY CONTROL GRID (CLASS, EXAM, SUBJECT, ETC)     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Class Select */}
          <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-700/50">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೧. ತರಗತಿ (Class):
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassId)}
              className="w-full bg-white text-slate-900 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 font-kannada shadow-inner"
            >
              <option value="6th">೬ನೇ ತರಗತಿ (Class 6)</option>
              <option value="7th">೭ನೇ ತರಗತಿ (Class 7)</option>
            </select>
          </div>

          {/* Exam Select */}
          <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-700/50">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೨. ಪರೀಕ್ಷೆ (Examination):
            </label>
            <select
              value={selectedExam}
              onChange={(e) => {
                const newExam = e.target.value as ExamId;
                setSelectedExam(newExam);
                if (newExam === 'SA-1') setLessonPartScope('part1');
                else if (newExam === 'SA-2') setLessonPartScope('part2');
                else setLessonPartScope('all');
              }}
              className="w-full bg-white text-slate-900 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 font-kannada shadow-inner"
            >
              <option value="SA-1">SA-1 (ಟರ್ಮ್ ೧ - ಭಾಗ ೧)</option>
              <option value="SA-2">SA-2 (ಟರ್ಮ್ ೨ - ಭಾಗ ೨)</option>
              <option value="ANNUAL">ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆ / ಎಲ್ಲಾ ಪಾಠಗಳು (ಭಾಗ ೧ + ಭಾಗ ೨ - All Chapters)</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-700/50">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೩. ವಿಷಯ (Subject):
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full bg-white text-slate-900 text-sm font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 font-kannada shadow-inner"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nameKannada} ({sub.nameEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* Paper Version */}
          <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-700/50">
            <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
              ೪. ಆವೃತ್ತಿ (Paper Version):
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['A', 'B', 'C', 'D'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPaperVersion(v)}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                    paperVersion === v
                      ? 'bg-amber-400 text-blue-950 shadow-xs ring-2 ring-white/50'
                      : 'bg-blue-900/80 text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date, Time, and Marks Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-700/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-blue-200 font-semibold">ದಿನಾಂಕ:</span>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-white text-slate-900 text-xs font-semibold px-2 py-1 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-blue-200 font-semibold">ಸಮಯಾವಧಿ:</span>
            <input
              type="text"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              className="bg-white text-slate-900 text-xs font-semibold px-2 py-1 rounded w-32 font-kannada"
            />
          </div>

          {/* Marks & Question Count Preset Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-end">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <div className="flex items-center gap-1 text-xs text-blue-200 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>ಸ್ಥಿರ ಅಂಕಗಳು:</span>
              </div>
              <div className="flex items-center gap-1">
                {[30, 40, 50].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectFixedMarks(m)}
                    className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                      fixedMarks === m
                        ? 'bg-amber-400 text-blue-950 ring-2 ring-white/60 shadow-sm'
                        : 'bg-blue-950/60 text-white hover:bg-blue-800'
                    }`}
                  >
                    <span>{toKannadaDigits(m)} ಅಂಕ</span>
                    {fixedMarks === m && <Lock className="w-3 h-3 text-blue-950" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-blue-700/60">
              <Layers className="w-4 h-4 text-emerald-300" />
              <span className="text-xs text-blue-200 font-semibold whitespace-nowrap">
                ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ ಟೈಪ್ ಮಾಡಿ:
              </span>
              <div className="flex items-center gap-1.5 bg-blue-950/70 p-0.5 rounded-lg border border-emerald-500/50">
                <input
                  type="number"
                  min={5}
                  max={45}
                  value={typedTotalQuestions}
                  onChange={(e) => handleTypeTotalQuestions(parseInt(e.target.value, 10) || 0)}
                  className="w-12 bg-white text-slate-900 text-center font-black text-xs px-1 py-1 rounded border-2 border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300 shadow-inner"
                  title="ನಿಮಗೆ ಅಗತ್ಯವಿರುವ ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ"
                />
                <span className="text-[11px] text-emerald-300 font-bold pr-1">ಪ್ರಶ್ನೆ</span>
              </div>
              <div className="hidden lg:flex items-center gap-1">
                {[10, 15, 20, 25].map((qCount) => (
                  <button
                    key={qCount}
                    type="button"
                    onClick={() => handleTypeTotalQuestions(qCount)}
                    className={`px-1.5 py-0.5 text-[11px] font-bold rounded ${
                      computedTotalQuestions === qCount
                        ? 'bg-emerald-400 text-slate-950 ring-1 ring-white/60'
                        : 'bg-blue-950/60 text-emerald-100 hover:bg-blue-800'
                    }`}
                  >
                    {toKannadaDigits(qCount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revised Syllabus Notice */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-4 py-2.5 rounded-xl text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-start md:items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 md:mt-0" />
          <div>
            <span className="font-bold text-emerald-950 mr-1.5">
              ೨೦೨೬-೨೭ ಸಾಲಿನ ನೂತನ ಪಠ್ಯಕ್ರಮ (KTS Official - ೭ ವಿಷಯಗಳು):
            </span>
            <span className="text-emerald-900">
              ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಕನ್ನಡ (ಸಿರಿಗನ್ನಡ), ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ (ವಲ್ಲರಿ/ತಿಲಕ್), ಗಣಿತ, ವಿಜ್ಞಾನ (೬ನೇ "ಕುತೂಹಲ" ೧೨ ಅಧ್ಯಾಯಗಳು), ಸಮಾಜ ವಿಜ್ಞಾನ ಹಾಗೂ ಮೌಲ್ಯ ಶಿಕ್ಷಣ (Value Education) ಎಲ್ಲಾ ೭ ವಿಷಯಗಳು ಸಿದ್ಧವಾಗಿವೆ.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getSubjectPdfUrl(selectedSubject, selectedClass, selectedExam) && (
            <a
              href={getSubjectPdfUrl(selectedSubject, selectedClass, selectedExam)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1 rounded-lg border border-red-700 shadow-xs transition-colors"
              title="ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘದ (KTS) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ PDF ತೆರೆಯಿರಿ"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>ಅಧಿಕೃತ {selectedClass === '6th' ? '೬ನೇ' : '೭ನೇ'} KTS PDF</span>
              <ExternalLink className="w-3 h-3 text-red-100" />
            </a>
          )}
          <span className="text-[11px] bg-emerald-200/80 text-emerald-950 font-extrabold px-2.5 py-1 rounded-md border border-emerald-300 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-800" />
            <span>ನಿಗದಿತ ಅಂಕಗಳು: {toKannadaDigits(fixedMarks)} (ಸ್ಥಿರ)</span>
          </span>
        </div>
      </div>

      {/* Official KTS Textbook Links Banner for currently selected subject */}
      {(() => {
        const bookUrls = getSubjectAllPdfUrls(selectedSubject, selectedClass);
        const hasUrls = bookUrls.part1 || bookUrls.part2 || bookUrls.full;
        const currentSubjectObj = SUBJECTS.find((s) => s.id === selectedSubject);
        if (!hasUrls) return null;

        return (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border border-blue-200 rounded-xl p-3.5 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-lg font-bold shadow-xs text-base">
                📖
              </div>
              <div>
                <h4 className="text-xs font-black text-blue-950 uppercase tracking-wide">
                  ಕರ್ನಾಟಕ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTS) ೨೦೨೬-೨೭ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳು:
                </h4>
                <p className="text-xs text-slate-700 mt-0.5">
                  <span className="font-bold text-blue-900">{currentSubjectObj?.nameKannada}</span> ({selectedClass === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ'}) - ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು / ವೀಕ್ಷಿಸಲು:
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {bookUrls.part1 && (
                <a
                  href={bookUrls.part1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  title="ಭಾಗ - ೧ (SA-1) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ PDF ತೆರೆಯಿರಿ"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-200" />
                  <span>ಭಾಗ - ೧ (SA-1) PDF</span>
                  <ExternalLink className="w-3 h-3 text-blue-200" />
                </a>
              )}
              {bookUrls.part2 && (
                <a
                  href={bookUrls.part2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  title="ಭಾಗ - ೨ (SA-2) ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ PDF ತೆರೆಯಿರಿ"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-200" />
                  <span>ಭಾಗ - ೨ (SA-2) PDF</span>
                  <ExternalLink className="w-3 h-3 text-indigo-200" />
                </a>
              )}
              {bookUrls.full && (
                <a
                  href={bookUrls.full}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  title="ಅಧಿಕೃತ ಸಮಗ್ರ ಪಠ್ಯಪುಸ್ತಕ PDF ತೆರೆಯಿರಿ"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-200" />
                  <span>ಸಮಗ್ರ ಪಠ್ಯಪುಸ್ತಕ PDF</span>
                  <ExternalLink className="w-3 h-3 text-amber-200" />
                </a>
              )}
            </div>
          </div>
        );
      })()}

      {/* Special Banner for Value Education Official Books */}
      {selectedSubject === 'value_education' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-3.5 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-lg font-bold shadow-xs text-base">
              🌟
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                ಮೌಲ್ಯ ಶಿಕ್ಷಣ (Value Education) ೬ ಮತ್ತು ೭ನೇ ತರಗತಿ ಅಧಿಕೃತ KTS PDF:
              </h4>
              <p className="text-xs text-amber-900 mt-0.5">
                ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಿಂದ ನೇರ ಪಠ್ಯಪುಸ್ತಕ PDF ಲಿಂಕ್‌ಗಳು.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://textbooks.karnataka.gov.in/uploads/Grade_6_Final_2026-27_1780659750.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>೬ನೇ ತರಗತಿ ಮೌಲ್ಯ ಶಿಕ್ಷಣ PDF</span>
              <ExternalLink className="w-3 h-3 text-amber-200" />
            </a>
            <a
              href="https://textbooks.karnataka.gov.in/uploads/Grade_7__Final_2026-27_1780659750.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>೭ನೇ ತರಗತಿ ಮೌಲ್ಯ ಶಿಕ್ಷಣ PDF</span>
              <ExternalLink className="w-3 h-3 text-orange-200" />
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LESSON SELECTION SECTION                              */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        {/* Reassurance Banner: No Question Bank upload needed */}
        <div className="mb-4 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-xl text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-emerald-950 text-sm">
                ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ (No Upload Needed):
              </span>
              <p className="text-emerald-900 mt-0.5">
                ೨೦೨೬-೨೭ ಸಾಲಿನ ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಎಲ್ಲಾ ೭ ವಿಷಯಗಳ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳ (ಭಾಗ-೧ & ಭಾಗ-೨) ಅಧ್ಯಾಯಗಳು ಹಾಗೂ ಪ್ರಶ್ನೋತ್ತರಗಳು ಈಗಾಗಲೇ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಅಳವಡಿಸಲ್ಪಟ್ಟಿವೆ. ಕೆಳಗಿನಿಂದ ನೇರವಾಗಿ ಪಾಠಗಳನ್ನು ಆರಿಸಿ ಪತ್ರಿಕೆ ರಚಿಸಿ.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowSyllabusExplorer(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
            >
              <BookMarked className="w-4 h-4 text-emerald-200" />
              <span>ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳ ಪಟ್ಟಿ</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4 text-blue-200" />
              <span>ಸ್ವಂತ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>ಪಾಠಗಳ ಆಯ್ಕೆ (Select Lessons/Chapters)</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                {selectedLessonNumbers.length} / {displayedLessons.length} ಆಯ್ಕೆಯಾಗಿದೆ
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ನಿಮ್ಮ ಪರೀಕ್ಷೆಗೆ ಅಗತ್ಯವಿರುವ ಪಾಠಗಳನ್ನು ಇಲ್ಲಿ ಟಿಕ್ ಮಾಡಿ
            </p>
          </div>

          {/* Part Filter Tabs (All / Part 1 / Part 2) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLessonPartScope('all');
                setSelectedLessonNumbers(allSubjectLessons.map((l) => l.number));
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lessonPartScope === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳು ({allSubjectLessons.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setLessonPartScope('part1');
                const part1Nums = allSubjectLessons.filter((l) => l.exam === 'SA-1').map((l) => l.number);
                setSelectedLessonNumbers(part1Nums);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lessonPartScope === 'part1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              ಭಾಗ - ೧ (SA-1: {allSubjectLessons.filter((l) => l.exam === 'SA-1').length})
            </button>
            <button
              type="button"
              onClick={() => {
                setLessonPartScope('part2');
                const part2Nums = allSubjectLessons.filter((l) => l.exam === 'SA-2').map((l) => l.number);
                setSelectedLessonNumbers(part2Nums);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                lessonPartScope === 'part2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              ಭಾಗ - ೨ (SA-2: {allSubjectLessons.filter((l) => l.exam === 'SA-2').length})
            </button>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={handleSelectAllLessons}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium flex items-center gap-1"
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>ಎಲ್ಲವೂ [All]</span>
            </button>
            <button
              type="button"
              onClick={handleClearAllLessons}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium flex items-center gap-1"
            >
              <Square className="w-3.5 h-3.5 text-slate-500" />
              <span>ತೆರವು [Clear]</span>
            </button>
            <button
              type="button"
              onClick={handleRandomLessons}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-medium flex items-center gap-1"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-600" />
              <span>ಯಾದೃಚ್ಛಿಕ</span>
            </button>
          </div>
        </div>

        {/* Lesson Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4 max-h-[340px] overflow-y-auto pr-1">
          {displayedLessons.map((lesson) => {
            const isChecked = selectedLessonNumbers.includes(lesson.number);
            const isPart1 = lesson.exam === 'SA-1';
            return (
              <label
                key={lesson.number}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs sm:text-sm ${
                  isChecked
                    ? 'bg-blue-50/70 border-blue-300 text-blue-950 font-medium shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleLesson(lesson.number)}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500 h-4 w-4 flex-shrink-0"
                />
                <div className="flex-grow font-kannada leading-tight">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="font-bold text-slate-800">
                      ಪಾಠ {toKannadaDigits(lesson.number)}:
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isPart1
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {isPart1 ? 'ಭಾಗ - ೧ (SA-1)' : 'ಭಾಗ - ೨ (SA-2)'}
                    </span>
                  </div>
                  <span className="text-slate-900 font-medium">{lesson.name}</span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lessonBalanceSetting === 'balanced'}
              onChange={(e) =>
                setLessonBalanceSetting(e.target.checked ? 'balanced' : 'random')
              }
              className="rounded text-blue-600"
            />
            <span className="font-medium text-slate-800">
              ಆಯ್ಕೆಮಾಡಿದ ಎಲ್ಲಾ ಪಾಠಗಳಿಂದ ಸಮಾನಾಂತರವಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಹಂಚಿಕೆ ಮಾಡಿ (Lesson Balance)
            </span>
          </label>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SECTION-WISE QUESTION COUNT CONTROLS                  */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>ವಿಭಾಗವಾರು ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ ಹೊಂದಿಸಿ (Number of Questions per Section)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ನಿಗದಿತ <strong className="text-amber-800">{toKannadaDigits(fixedMarks)} ಅಂಕಗಳು</strong> ಬದಲಾಗುವುದಿಲ್ಲ. ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಪ್ರತೀ ವಿಭಾಗದಲ್ಲಿ ಬದಲಾಯಿಸಿ:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Direct Type Question Count Input */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2 py-1 rounded-xl text-xs">
              <span className="text-slate-700 font-bold">ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ:</span>
              <input
                type="number"
                min={5}
                max={45}
                value={typedTotalQuestions}
                onChange={(e) => handleTypeTotalQuestions(parseInt(e.target.value, 10) || 0)}
                className="w-12 bg-white text-slate-900 text-center font-black text-sm px-1 py-0.5 rounded border border-blue-400 focus:outline-none"
                title="ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ"
              />
              <span className="text-slate-500 font-medium">({toKannadaDigits(computedTotalQuestions)})</span>
            </div>

            {/* Fixed Marks Pill */}
            <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-amber-900 font-bold">ನಿಗದಿತ ಅಂಕ:</span>
              <span className="font-black text-amber-950 text-sm">
                {toKannadaDigits(fixedMarks)}
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-950 font-extrabold px-1.5 py-0.2 rounded">
                ಸ್ಥಿರ
              </span>
            </div>

            <button
              type="button"
              onClick={handleRebalanceSections}
              className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 font-bold px-2.5 py-1.5 rounded-lg border border-blue-300 flex items-center gap-1 transition-colors"
              title="ಆಯ್ಕೆ ಮಾಡಿದ ಅಂಕಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಸಮತೋಲನಗೊಳಿಸಿ"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>ಅಂಕ ಸಮತೋಲನ</span>
            </button>
          </div>
        </div>

        {/* Section List with Question Count Steppers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeSections.map((sec) => (
            <div
              key={sec.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                sec.questionCount > 0
                  ? 'bg-slate-50/70 border-slate-300'
                  : 'bg-slate-50/30 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-0.5 min-w-0 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-blue-900 bg-blue-100 text-xs px-2 py-0.5 rounded">
                    {sec.romanNumeral}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {sec.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 pl-0.5 flex items-center gap-2">
                  <span>ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ: {toKannadaDigits(sec.marksPerQuestion)} ಅಂಕ</span>
                  <span>•</span>
                  <span className="text-blue-700 font-semibold">
                    ವಿಭಾಗದ ಒಟ್ಟು ಅಂಕ: {toKannadaDigits(sec.questionCount * sec.marksPerQuestion)}
                  </span>
                </div>
              </div>

              {/* Question Count Stepper */}
              <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-slate-300 rounded-lg p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleSectionCountChange(sec.id, -1)}
                  disabled={sec.questionCount <= 0}
                  className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಒಂದು ಕಡಿಮೆ ಮಾಡಿ"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={sec.questionCount}
                  onChange={(e) =>
                    handleSectionCountInput(sec.id, parseInt(e.target.value, 10) || 0)
                  }
                  className="w-10 text-center font-bold text-sm text-slate-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleSectionCountChange(sec.id, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition-colors"
                  title="ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಒಂದು ಹೆಚ್ಚಿಸಿ"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. PAPER PATTERN, ANSWER SPACE & DIFFICULTY SETTINGS     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pattern Preset */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಮಾದರಿ (Pattern Preset):</span>
          </label>
          <select
            value={selectedPatternId}
            onChange={(e) => handlePatternChange(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium font-kannada"
          >
            {DEFAULT_PATTERNS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            {customPatterns
              .filter((p) => !DEFAULT_PATTERNS.some((dp) => dp.id === p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ಕಸ್ಟಮ್)
                </option>
              ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-2">
            ವಿವಿಧ ವಿಭಾಗಗಳ ಅಂಕಗಳ ವಿನ್ಯಾಸವನ್ನು ‘ಪತ್ರಿಕೆ ಮಾದರಿ’ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತಿದ್ದಿಕೊಳ್ಳಬಹುದು.
          </p>
        </div>

        {/* Answer Space Setting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            ಉತ್ತರ ಬರೆಯಲು ಸ್ಥಳ (Answer Space):
          </label>
          <div className="space-y-1.5 text-xs text-slate-700">
            {[
              { id: 'auto', label: 'ಸ್ವಯಂ ಸ್ಥಳ (Automatic balanced lines)' },
              { id: 'by_marks', label: 'ಅಂಕಗಳಿಗೆ ಅನುಗುಣವಾಗಿ (1m: 2 lines, 2m: 4 lines...)' },
              { id: 'ruled', label: 'ಗೆರೆಯ ಸ್ಥಳ (Notebook Ruled lines)' },
              { id: 'none', label: 'ಸ್ಥಳ ಬೇಡ (Only Question Paper)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerSpace"
                  value={opt.id}
                  checked={answerSpace === opt.id}
                  onChange={(e) => setAnswerSpace(e.target.value as AnswerSpaceType)}
                  className="text-blue-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            ಕಠಿಣತೆಯ ಮಟ್ಟ (Difficulty Balance):
          </label>
          <div className="space-y-1.5 text-xs text-slate-700">
            {[
              { id: 'balanced', label: 'ಸಮತೋಲಿತ (೪೦% ಸರಳ, ೪೦% ಮಧ್ಯಮ, ೨೦% ಕಠಿಣ)' },
              { id: 'easy', label: 'ಸರಳ (ಹೆಚ್ಚು ಸುಲಭ ಪ್ರಶ್ನೆಗಳು)' },
              { id: 'hard', label: 'ಕಠಿಣ (ಉನ್ನತ ಮಟ್ಟದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಪ್ರಶ್ನೆಗಳು)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value={opt.id}
                  checked={difficultySetting === opt.id}
                  onChange={(e) =>
                    setDifficultySetting(e.target.value as 'balanced' | 'easy' | 'hard')
                  }
                  className="text-blue-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-3.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. BIG GENERATE BUTTON                                   */}
      {/* ======================================================== */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto min-w-[340px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-base sm:text-lg py-3.5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
        >
          <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚಿಸಿ (Generate Paper)</span>
        </button>
        <p className="text-xs text-slate-500 mt-2">
          ಪತ್ರಿಕೆ ಸಿದ್ಧವಾದ ನಂತರ ನೀವು ಪ್ರತಿಯೊಂದು ಪ್ರಶ್ನೆಯನ್ನು ಸಂಪಾದಿಸಬಹುದು ಅಥವಾ ಬದಲಾಯಿಸಬಹುದು.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 6. SYLLABUS & CHAPTERS EXPLORER MODAL                    */}
      {/* ======================================================== */}
      {showSyllabusExplorer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookMarked className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    ೨೦೨೬-೨೭ ಸಾಲಿನ ನೂತನ ಪಠ್ಯಕ್ರಮ ಅಧ್ಯಾಯಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ (Syllabus Explorer)
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕ ಸಂಘ (KTS) - ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಎಲ್ಲಾ ೭ ವಿಷಯಗಳು
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSyllabusExplorer(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="ಮುಚ್ಚಿ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>ಯಾವುದೇ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ:</strong> ಕೆಳಗಿನ ಎಲ್ಲಾ ಪಾಠಗಳು ಮೊದಲೇ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಅಳವಡಿಸಲ್ಪಟ್ಟಿವೆ. ನೀವು ಯಾವುದೇ ವಿಷಯವನ್ನು ಆರಿಸಿ ತಕ್ಷಣವೇ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಸಿದ್ಧಪಡಿಸಬಹುದು.
                </span>
              </div>

              {/* Subject Cards Grid */}
              <div className="space-y-4">
                {SUBJECTS.map((sub) => {
                  const lessons6 = sub.lessons['6th'] || [];
                  const lessons7 = sub.lessons['7th'] || [];
                  const pdfUrls6 = getSubjectAllPdfUrls(sub.id, '6th');
                  const pdfUrls7 = getSubjectAllPdfUrls(sub.id, '7th');

                  return (
                    <div
                      key={sub.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                            <span>{sub.nameKannada}</span>
                            <span className="text-xs text-slate-500 font-normal">({sub.nameEnglish})</span>
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubject(sub.id);
                              setSelectedClass('6th');
                              setLessonPartScope('all');
                              setShowSyllabusExplorer(false);
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-md"
                          >
                            ೬ನೇ ತರಗತಿಗೆ ಆರಿಸಿ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubject(sub.id);
                              setSelectedClass('7th');
                              setLessonPartScope('all');
                              setShowSyllabusExplorer(false);
                            }}
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-md"
                          >
                            ೭ನೇ ತರಗತಿಗೆ ಆರಿಸಿ
                          </button>
                        </div>
                      </div>

                      {/* 6th and 7th Chapters Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* 6th std */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between font-bold text-slate-800 pb-1 border-b border-slate-100">
                            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[11px]">
                              ೬ನೇ ತರಗತಿ ({lessons6.length} ಅಧ್ಯಾಯಗಳು)
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {pdfUrls6.part1 && (
                                <a
                                  href={pdfUrls6.part1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-0.5"
                                >
                                  ಭಾಗ-೧ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {pdfUrls6.part2 && (
                                <a
                                  href={pdfUrls6.part2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-0.5"
                                >
                                  ಭಾಗ-೨ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {pdfUrls6.full && (
                                <a
                                  href={pdfUrls6.full}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-700 hover:underline flex items-center gap-0.5"
                                >
                                  ಸಮಗ್ರ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                          <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
                            {lessons6.map((l) => (
                              <li key={l.number} className="flex items-start gap-1.5 text-slate-700 leading-tight">
                                <span className={`text-[9px] font-bold px-1 py-0.2 rounded mt-0.5 ${
                                  l.exam === 'SA-1' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {l.exam === 'SA-1' ? 'ಭಾಗ ೧' : 'ಭಾಗ ೨'}
                                </span>
                                <span>{toKannadaDigits(l.number)}. {l.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 7th std */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between font-bold text-slate-800 pb-1 border-b border-slate-100">
                            <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded text-[11px]">
                              ೭ನೇ ತರಗತಿ ({lessons7.length} ಅಧ್ಯಾಯಗಳು)
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {pdfUrls7.part1 && (
                                <a
                                  href={pdfUrls7.part1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-0.5"
                                >
                                  ಭಾಗ-೧ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {pdfUrls7.part2 && (
                                <a
                                  href={pdfUrls7.part2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-0.5"
                                >
                                  ಭಾಗ-೨ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {pdfUrls7.full && (
                                <a
                                  href={pdfUrls7.full}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-700 hover:underline flex items-center gap-0.5"
                                >
                                  ಸಮಗ್ರ PDF <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                          <ul className="space-y-1 max-h-36 overflow-y-auto pr-1">
                            {lessons7.map((l) => (
                              <li key={l.number} className="flex items-start gap-1.5 text-slate-700 leading-tight">
                                <span className={`text-[9px] font-bold px-1 py-0.2 rounded mt-0.5 ${
                                  l.exam === 'SA-1' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {l.exam === 'SA-1' ? 'ಭಾಗ ೧' : 'ಭಾಗ ೨'}
                                </span>
                                <span>{toKannadaDigits(l.number)}. {l.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSyllabusExplorer(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl transition-colors"
              >
                ಸರಿ, ಅರ್ಥವಾಯಿತು (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Question Bank Modal */}
      <UploadQuestionBankModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        initialClass={selectedClass}
        initialSubject={selectedSubject}
      />
    </div>
  );
};
