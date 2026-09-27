import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit3,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Star,
  Sparkles,
} from 'lucide-react';
import { QUESTION_TYPES, SUBJECTS, getLessons, toKannadaDigits } from '../data/syllabus';
import { getAllQuestions, saveQuestion, deleteQuestion } from '../services/storage';
import { UploadQuestionBankModal } from './UploadQuestionBankModal';
import {
  ClassId,
  DifficultyLevel,
  ExamId,
  Question,
  QuestionType,
  SubjectId,
} from '../types';

export const QuestionBankView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(() => getAllQuestions());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterExam, setFilterExam] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all'); // 'all' | 'custom' | 'official'

  // Modal for Adding / Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form State
  const [formClass, setFormClass] = useState<ClassId>('6th');
  const [formSubject, setFormSubject] = useState<SubjectId>('science');
  const [formExam, setFormExam] = useState<ExamId>('SA-1');
  const [formLessonNum, setFormLessonNum] = useState<number>(1);
  const [formLessonName, setFormLessonName] = useState<string>('');
  const [formType, setFormType] = useState<QuestionType>('fill_blank');
  const [formText, setFormText] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formMarks, setFormMarks] = useState<number>(1);
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('medium');
  const [formOptions, setFormOptions] = useState<string[]>(['ಎ) ', 'ಬಿ) ', 'ಸಿ) ', 'ಡಿ) ']);

  // Lessons for current form selection
  const currentLessons = useMemo(() => {
    return getLessons(formClass, formSubject, formExam);
  }, [formClass, formSubject, formExam]);

  // Sync lesson name when lesson number or lessons change
  React.useEffect(() => {
    const l = currentLessons.find((item) => item.number === formLessonNum);
    if (l) {
      setFormLessonName(l.name);
    } else if (currentLessons.length > 0) {
      setFormLessonNum(currentLessons[0].number);
      setFormLessonName(currentLessons[0].name);
    }
  }, [currentLessons, formLessonNum]);

  // Question counts
  const customCount = useMemo(() => {
    return questions.filter((q) => q.id.startsWith('custom') || !q.isDemo).length;
  }, [questions]);

  const officialCount = useMemo(() => {
    return questions.filter((q) => !q.id.startsWith('custom') && !!q.isDemo).length;
  }, [questions]);

  // Filtered List
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const isCustom = q.id.startsWith('custom') || !q.isDemo;
      if (filterSource === 'custom' && !isCustom) return false;
      if (filterSource === 'official' && isCustom) return false;

      if (filterClass !== 'all' && q.classId !== filterClass) return false;
      if (filterSubject !== 'all' && q.subjectId !== filterSubject) return false;
      if (filterExam !== 'all' && q.examId !== filterExam) return false;
      if (filterType !== 'all' && q.questionType !== filterType) return false;
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchAns = q.answer?.toLowerCase().includes(query);
        const matchLesson = q.lessonName.toLowerCase().includes(query);
        return matchText || matchAns || matchLesson;
      }
      return true;
    });
  }, [questions, filterSource, filterClass, filterSubject, filterExam, filterType, filterDifficulty, searchQuery]);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormAnswer('');
    setFormExplanation('');
    setFormMarks(1);
    setFormDifficulty('medium');
    setFormOptions(['ಎ) ', 'ಬಿ) ', 'ಸಿ) ', 'ಡಿ) ']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormClass(q.classId);
    setFormSubject(q.subjectId);
    setFormExam(q.examId);
    setFormLessonNum(q.lessonNumber);
    setFormLessonName(q.lessonName);
    setFormType(q.questionType);
    setFormText(q.questionText);
    setFormAnswer(q.answer || '');
    setFormExplanation(q.explanation || '');
    setFormMarks(q.marks);
    setFormDifficulty(q.difficulty);
    setFormOptions(q.options || ['ಎ) ', 'ಬಿ) ', 'ಸಿ) ', 'ಡಿ) ']);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('ಈ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲು ಖಚಿತಪಡಿಸಿ?')) {
      deleteQuestion(id);
      setQuestions(getAllQuestions());
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const saved = saveQuestion({
      id: editingQuestion ? editingQuestion.id : 'custom-' + Date.now(),
      classId: formClass,
      subjectId: formSubject,
      examId: formExam,
      lessonNumber: formLessonNum,
      lessonName: formLessonName,
      questionType: formType,
      questionText: formText.trim(),
      answer: formAnswer.trim() || undefined,
      explanation: formExplanation.trim() || undefined,
      marks: formMarks,
      difficulty: formDifficulty,
      options:
        formType === 'mcq' || formType === 'choose_correct'
          ? formOptions.filter((o) => o.trim().length > 2)
          : undefined,
      isDemo: false,
    });

    setQuestions(getAllQuestions());
    setIsModalOpen(false);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `question-bank-karnataka-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((q) => saveQuestion(q));
          setQuestions(getAllQuestions());
          alert(`ಯಶಸ್ವಿಯಾಗಿ ${imported.length} ಪ್ರಶ್ನೆಗಳನ್ನು ಆಮದು ಮಾಡಿಕೊಳ್ಳಲಾಗಿದೆ!`);
        }
      } catch (err) {
        alert('ಫೈಲ್ ಓದಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ JSON ಫೈಲ್ ಬಳಸಿ.');
      }
    };
    reader.readAsText(file);
  };

  // Download CSV template
  const handleDownloadCSVTemplate = () => {
    const headers = ['Class', 'Subject', 'Exam', 'LessonNumber', 'LessonName', 'QuestionType', 'QuestionText', 'Answer', 'Marks', 'Difficulty'];
    const rows = [
      ['6th', 'science', 'SA-1', '1', 'ಆಹಾರ: ಇದು ಎಲ್ಲಿಂದ ದೊರಕುತ್ತದೆ?', 'fill_blank', 'ಜೇನುನೊಣಗಳು ಹೂವುಗಳಿಂದ ________ ಯನ್ನು ಸಂಗ್ರಹಿಸುತ್ತವೆ.', 'ಮಕರಂದ', '1', 'easy'],
      ['7th', 'mathematics', 'SA-1', '1', 'ಪೂರ್ಣಾಂಕಗಳು', 'short_answer', '(-೩) + (+೫) ರ ಬೆಲೆ ಎಷ್ಟು?', '+೨', '2', 'medium'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csvContent);
    a.download = 'karnataka_question_bank_template.csv';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ವ್ಯವಸ್ಥಾಪನೆ (Question Bank)</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredQuestions.length} ಪ್ರಶ್ನೆಗಳು
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪಠ್ಯಕ್ರಮ ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ, ತಿದ್ದಿ, ಅಥವಾ ಹೊಸ ಪ್ರಶ್ನೆಗಳನ್ನು ಸೇರಿಸಿ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ (Upload Question Bank)</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-slate-300"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>ಹೊಸ ಪ್ರಶ್ನೆ (Add Single)</span>
          </button>

          <button
            onClick={handleDownloadCSVTemplate}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl flex items-center gap-1"
            title="Download CSV Template for bulk question creation"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV ಮಾದರಿ</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl flex items-center gap-1"
            title="Export Question Bank to JSON"
          >
            <Download className="w-4 h-4" />
            <span>ರಫ್ತು (Export)</span>
          </button>
        </div>
      </div>

      {/* Notice & Upload Guide Banner */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-950 text-sm">
              ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ (No Upload Needed):
            </span>
            <p className="text-emerald-900 mt-0.5">
              ಕರ್ನಾಟಕ ೨೦೨೬-೨೭ ಸಾಲಿನ ೬ ಮತ್ತು ೭ನೇ ತರಗತಿಯ ಎಲ್ಲಾ ೭ ವಿಷಯಗಳ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳ (ಭಾಗ-೧ & ಭಾಗ-೨) ಪ್ರಶ್ನೋತ್ತರಗಳು ಮೊದಲೇ ಸಿದ್ಧವಾಗಿವೆ. ನೀವು ನಿಮ್ಮದೇ ಆದ ಸ್ವಂತ ಶಾಲೆಯ ಪ್ರಶ್ನೆಗಳನ್ನು Excel/CSV ಅಥವಾ Word ಮೂಲಕ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಬಯಸಿದರೆ ಕೆಳಗಿನ ಬಟನ್ ಬಳಸಿ.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap flex-shrink-0 text-xs"
        >
          <Upload className="w-4 h-4 text-emerald-200" />
          <span>ಸ್ವಂತ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ಕನ್ನಡ ಯೂನಿಕೋಡ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆ, ಉತ್ತರ ಅಥವಾ ಪಾಠದ ಹೆಸರನ್ನು ಹುಡುಕಿ..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-kannada"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">ಮೂಲ (Source):</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5 font-medium bg-slate-50"
            >
              <option value="all">ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ({questions.length})</option>
              <option value="custom">ನನ್ನ ಕಸ್ಟಮ್ / ಅಪ್‌ಲೋಡ್ ({customCount})</option>
              <option value="official">ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ({officialCount})</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">ತರಗತಿ:</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5"
            >
              <option value="all">ಎಲ್ಲಾ ತರಗತಿಗಳು</option>
              <option value="6th">೬ನೇ ತರಗತಿ</option>
              <option value="7th">೭ನೇ ತರಗತಿ</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">ವಿಷಯ:</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5"
            >
              <option value="all">ಎಲ್ಲಾ ವಿಷಯಗಳು</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameKannada}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">ಪರೀಕ್ಷೆ:</label>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5"
            >
              <option value="all">ಎಲ್ಲಾ (ಭಾಗ ೧ & ೨ - All)</option>
              <option value="SA-1">SA-1 (ಟರ್ಮ್ ೧ / ಭಾಗ ೧)</option>
              <option value="SA-2">SA-2 (ಟರ್ಮ್ ೨ / ಭಾಗ ೨)</option>
              <option value="ANNUAL">ವಾರ್ಷಿಕ (ANNUAL)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">ಪ್ರಶ್ನೆ ಪ್ರಕಾರ:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5"
            >
              <option value="all">ಎಲ್ಲಾ ಪ್ರಕಾರಗಳು</option>
              {Object.values(QUESTION_TYPES).map((qt) => (
                <option key={qt.type} value={qt.type}>
                  {qt.titleKannada}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">ಕಠಿಣತೆ:</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-1.5"
            >
              <option value="all">ಎಲ್ಲವೂ</option>
              <option value="easy">ಸರಳ</option>
              <option value="medium">ಮಧ್ಯಮ</option>
              <option value="hard">ಕಠಿಣ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold">ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.</p>
            <p className="text-xs text-slate-400 mt-1">
              ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ ಅಥವಾ ಮೇಲಿನ ‘ಹೊಸ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ’ ಬಟನ್ ಬಳಸಿ.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-2xs transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-grow">
                  <span className="font-bold text-slate-400 text-xs mt-0.5">
                    #{idx + 1}
                  </span>
                  <div className="flex-grow">
                    <p className="text-sm sm:text-base font-medium text-slate-900 font-kannada leading-relaxed">
                      {q.questionText}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <span key={oIdx} className="bg-slate-50 p-1 rounded border border-slate-200">
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}

                    {q.answer && (
                      <p className="text-xs text-emerald-700 mt-2">
                        ಉತ್ತರ (Answer): <span className="font-semibold">{q.answer}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                    title="ಸಂಪಾದಿಸಿ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    title="ಅಳಿಸಿ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded">
                  {q.classId === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ'}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">
                  ವಿಷಯ: {q.subjectId}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">
                  {q.examId}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">
                  ಪಾಠ: {q.lessonName}
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                  {q.marks} ಅಂಕ
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">
                  ಕಠಿಣತೆ: {q.difficulty}
                </span>
                {(q.id.startsWith('custom') || !q.isDemo) && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                    <span>ನನ್ನ ಪ್ರಶ್ನೆ (Custom Upload)</span>
                  </span>
                )}
                {q.isDemo && (
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-semibold">
                    ಮಾದರಿ ಪ್ರಶ್ನೆ (Demo)
                  </span>
                )}
                {q.isAIGenerated && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                    AI ಆಧಾರಿತ
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 font-kannada">
            <div className="bg-blue-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg">
                {editingQuestion ? 'ಪ್ರಶ್ನೆ ಸಂಪಾದಿಸಿ (Edit Question)' : 'ಹೊಸ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ (Add Question)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ತರಗತಿ:</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value as ClassId)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="6th">೬ನೇ ತರಗತಿ</option>
                    <option value="7th">೭ನೇ ತರಗತಿ</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ವಿಷಯ:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as SubjectId)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameKannada}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ಪರೀಕ್ಷೆ:</label>
                  <select
                    value={formExam}
                    onChange={(e) => setFormExam(e.target.value as ExamId)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="SA-1">SA-1</option>
                    <option value="SA-2">SA-2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">ಪಾಠ (Chapter):</label>
                <select
                  value={formLessonNum}
                  onChange={(e) => setFormLessonNum(parseInt(e.target.value, 10))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
                >
                  {currentLessons.map((l) => (
                    <option key={l.number} value={l.number}>
                      ಪಾಠ {l.number}: {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ಪ್ರಶ್ನೆ ಪ್ರಕಾರ:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as QuestionType)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
                  >
                    {Object.values(QUESTION_TYPES).map((qt) => (
                      <option key={qt.type} value={qt.type}>
                        {qt.titleKannada}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ಅಂಕಗಳು:</label>
                  <input
                    type="number"
                    value={formMarks}
                    onChange={(e) => setFormMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ಕಠಿಣತೆ:</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="easy">ಸರಳ</option>
                    <option value="medium">ಮಧ್ಯಮ</option>
                    <option value="hard">ಕಠಿಣ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ಪ್ರಶ್ನೆಯ ಪಠ್ಯ (Question Text):
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                  rows={3}
                  required
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-kannada"
                />
              </div>

              {/* MCQ Options if MCQ */}
              {(formType === 'mcq' || formType === 'choose_correct') && (
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700 block">ನಾಲ್ಕು ಆಯ್ಕೆಗಳು:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {formOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        className="border border-slate-300 rounded p-1.5 font-kannada"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ಸರಿಯಾದ ಉತ್ತರ (Answer Key):
                </label>
                <input
                  type="text"
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ..."
                  className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700"
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  ಪ್ರಶ್ನೆ ಉಳಿಸಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Question Bank Suite Modal */}
      <UploadQuestionBankModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onQuestionsUpdated={() => setQuestions(getAllQuestions())}
        initialClass={filterClass !== 'all' ? (filterClass as ClassId) : '6th'}
        initialSubject={filterSubject !== 'all' ? (filterSubject as SubjectId) : 'science'}
      />
    </div>
  );
};
