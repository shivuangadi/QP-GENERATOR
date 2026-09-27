import React, { useState } from 'react';
import {
  Printer,
  Download,
  Save,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { QUESTION_TYPES, toKannadaDigits } from '../data/syllabus';
import { savePaper } from '../services/storage';
import { getReplacementCandidates, validateQuestionPaper } from '../services/generator';
import {
  AnswerSpaceType,
  NumberingFormat,
  PaperSection,
  Question,
  QuestionPaper,
  QuestionType,
  SectionConfig,
} from '../types';
import { A4Preview } from './A4Preview';
import { ReplaceQuestionModal } from './ReplaceQuestionModal';

interface PaperEditorProps {
  paper: QuestionPaper;
  onUpdatePaper: (updated: QuestionPaper) => void;
  onNewPaper: () => void;
}

export const PaperEditor: React.FC<PaperEditorProps> = ({
  paper,
  onUpdatePaper,
  onNewPaper,
}) => {
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [replacingQuestion, setReplacingQuestion] = useState<Question | null>(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<string | null>(null); // section id
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.85);

  // New question form state
  const [newQText, setNewQText] = useState('');
  const [newQAnswer, setNewQAnswer] = useState('');
  const [newQMarks, setNewQMarks] = useState(1);
  const [newQType, setNewQType] = useState<QuestionType>('fill_blank');

  // New section form state
  const [newSecRoman, setNewSecRoman] = useState('VIII');
  const [newSecTitle, setNewSecTitle] = useState('ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ:');
  const [newSecType, setNewSecType] = useState<QuestionType>('short_answer');
  const [newSecMarks, setNewSecMarks] = useState(2);

  // Validation
  const validation = validateQuestionPaper(paper);

  // Edit in-place
  const handleUpdateQuestion = (sectionIdx: number, qIdx: number, updatedQ: Question) => {
    const newSections = [...paper.sections];
    newSections[sectionIdx].questions[qIdx] = updatedQ;
    onUpdatePaper({
      ...paper,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete question
  const handleDeleteQuestion = (sectionIdx: number, qIdx: number) => {
    const newSections = [...paper.sections];
    newSections[sectionIdx].questions.splice(qIdx, 1);
    onUpdatePaper({
      ...paper,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    });
  };

  // Move Question Up
  const handleMoveUp = (sectionIdx: number, qIdx: number) => {
    if (qIdx === 0) return;
    const newSections = [...paper.sections];
    const qList = [...newSections[sectionIdx].questions];
    [qList[qIdx - 1], qList[qIdx]] = [qList[qIdx], qList[qIdx - 1]];
    newSections[sectionIdx].questions = qList;
    onUpdatePaper({ ...paper, sections: newSections });
  };

  // Move Question Down
  const handleMoveDown = (sectionIdx: number, qIdx: number) => {
    const newSections = [...paper.sections];
    const qList = [...newSections[sectionIdx].questions];
    if (qIdx >= qList.length - 1) return;
    [qList[qIdx], qList[qIdx + 1]] = [qList[qIdx + 1], qList[qIdx]];
    newSections[sectionIdx].questions = qList;
    onUpdatePaper({ ...paper, sections: newSections });
  };

  // Replace Question from bank
  const handleReplaceQuestion = (originalId: string, replacement: Question) => {
    const newSections = paper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => (q.id === originalId ? replacement : q)),
    }));
    onUpdatePaper({ ...paper, sections: newSections });
  };

  // Quick 1-click swap
  const [quickSwapToast, setQuickSwapToast] = useState<string | null>(null);

  const handleQuickSwap = (q: Question) => {
    const candidates = getReplacementCandidates(q, paper);
    if (candidates.length === 0) {
      setReplacingQuestion(q);
      return;
    }
    const randomPick = candidates[Math.floor(Math.random() * candidates.length)];
    handleReplaceQuestion(q.id, randomPick);
    setQuickSwapToast(`ಪ್ರಶ್ನೆಯನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ: ${randomPick.lessonName}`);
    setTimeout(() => setQuickSwapToast(null), 3000);
  };

  // Add Question to Section
  const handleAddQuestionSubmit = (sectionId: string) => {
    if (!newQText.trim()) return;

    const newSections = paper.sections.map((sec) => {
      if (sec.config.id === sectionId) {
        const newQ: Question = {
          id: 'user-q-' + Date.now(),
          classId: paper.classId,
          subjectId: paper.subjectId,
          examId: paper.examId,
          lessonNumber: 1,
          lessonName: 'ಸಾಮಾನ್ಯ',
          questionType: newQType,
          questionText: newQText.trim(),
          answer: newQAnswer.trim() || undefined,
          marks: newQMarks,
          difficulty: 'medium',
          isDemo: false,
        };
        return {
          ...sec,
          questions: [...sec.questions, newQ],
        };
      }
      return sec;
    });

    onUpdatePaper({ ...paper, sections: newSections });
    setShowAddQuestionModal(null);
    setNewQText('');
    setNewQAnswer('');
  };

  // Add Section to Paper
  const handleAddSectionSubmit = () => {
    if (!newSecTitle.trim()) return;

    const newConfig: SectionConfig = {
      id: 'sec-' + Date.now(),
      romanNumeral: newSecRoman.trim() || 'VIII',
      title: newSecTitle.trim(),
      questionType: newSecType,
      marksPerQuestion: newSecMarks,
      questionCount: 0,
      totalMarks: 0,
    };

    const newSection: PaperSection = {
      config: newConfig,
      questions: [],
    };

    onUpdatePaper({
      ...paper,
      sections: [...paper.sections, newSection],
    });

    setShowAddSectionModal(false);
  };

  // Save Paper
  const handleSave = () => {
    savePaper(paper);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Print Paper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1600px] mx-auto p-3 sm:p-5 font-kannada">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ! (Saved Successfully)</span>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-4 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-600" />
              <span>{paper.paperName}</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                {paper.classId === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ'} • {paper.examId}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              <span>
                ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು:{' '}
                <strong className="text-slate-900">
                  {paper.sections.reduce((sum, s) => sum + s.questions.length, 0)}
                </strong>
              </span>
              <span>
                ಒಟ್ಟು ಅಂಕಗಳು:{' '}
                <strong className="text-blue-700 font-bold text-sm">
                  {validation.totalQuestionMarks} / {paper.totalMarks}
                </strong>
              </span>
              <span>ವಿಭಾಗಗಳು: {paper.sections.length}</span>
            </div>
          </div>

          {/* Quick Settings & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Numbering Format */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-slate-600 pl-1 text-[11px]">ಸಂಖ್ಯೆ:</span>
              <button
                onClick={() =>
                  onUpdatePaper({
                    ...paper,
                    numberingFormat:
                      paper.numberingFormat === 'kannada' ? 'arabic' : 'kannada',
                  })
                }
                className="px-2 py-1 bg-white rounded shadow-2xs font-semibold text-blue-900"
              >
                {paper.numberingFormat === 'kannada' ? '೧, ೨, ೩ (ಕನ್ನಡ)' : '1, 2, 3 (English)'}
              </button>
            </div>

            {/* Answer Space Dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <span className="text-slate-600 pl-1 text-[11px]">ಗೆರೆ:</span>
              <select
                value={paper.answerSpaceType}
                onChange={(e) =>
                  onUpdatePaper({
                    ...paper,
                    answerSpaceType: e.target.value as AnswerSpaceType,
                  })
                }
                className="bg-white border-none rounded py-1 px-1.5 font-medium text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">ಸ್ಥಳ ಬೇಡ (No space)</option>
                <option value="ruled">ಗೆರೆಯ ಸ್ಥಳ (Ruled lines)</option>
                <option value="by_marks">ಅಂಕಗಳಿಗೆ ಅನುಗುಣವಾಗಿ (By marks)</option>
                <option value="auto">ಸ್ವಯಂ ಸ್ಥಳ (Auto)</option>
              </select>
            </div>

            {/* Teacher Tags Toggle */}
            <button
              onClick={() =>
                onUpdatePaper({ ...paper, showTeacherTags: !paper.showTeacherTags })
              }
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                paper.showTeacherTags
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ಟ್ಯಾಗ್ಸ್ {paper.showTeacherTags ? 'ಆನ್' : 'ಆಫ್'}
            </button>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setMobileTab('editor')}
                className={`px-3 py-1 rounded-md ${
                  mobileTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700'
                }`}
              >
                ಸಂಪಾದನೆ
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`px-3 py-1 rounded-md ${
                  mobileTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700'
                }`}
              >
                ಮುನ್ನೋಟ (A4)
              </button>
            </div>

            {/* Main Action Buttons */}
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>ಉಳಿಸಿ (Save)</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>ಮುದ್ರಿಸಿ (Print)</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
              title="Print dialog opens - choose 'Save as PDF' as destination"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Swap Toast Alert */}
        {quickSwapToast && (
          <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{quickSwapToast}</span>
            </div>
            <button
              onClick={() => setQuickSwapToast(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Validation Warning Alert */}
        {!validation.isValid && (
          <div className="mt-3 bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">ಗಮನಿಸಿ (Validation Alert): </span>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT PANEL: QUESTION PAPER EDITOR (7 COLS ON DESKTOP)          */}
        {/* ============================================================== */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-4 no-print ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Quick Header Editor Accordion */}
          <details className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
            <summary className="font-bold text-sm text-slate-800 cursor-pointer flex items-center justify-between">
              <span>ಶಾಲೆಯ ಹೆಸರು & ಹೆಡರ್ ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ</span>
              <span className="text-xs text-blue-600 font-normal">ಸಂಪಾದಿಸಿ ▾</span>
            </summary>
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5">
                  ಶಾಲೆಯ ಹೆಸರು:
                </label>
                <input
                  type="text"
                  value={paper.headerInfo.schoolName}
                  onChange={(e) =>
                    onUpdatePaper({
                      ...paper,
                      headerInfo: { ...paper.headerInfo, schoolName: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 font-kannada font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">
                    ಪರೀಕ್ಷಾ ಶೀರ್ಷಿಕೆ:
                  </label>
                  <input
                    type="text"
                    value={paper.headerInfo.examTitle}
                    onChange={(e) =>
                      onUpdatePaper({
                        ...paper,
                        headerInfo: { ...paper.headerInfo, examTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded p-1.5 font-kannada font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">
                    ಉಪ ಶೀರ್ಷಿಕೆ:
                  </label>
                  <input
                    type="text"
                    value={paper.headerInfo.subTitle}
                    onChange={(e) =>
                      onUpdatePaper({
                        ...paper,
                        headerInfo: { ...paper.headerInfo, subTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded p-1.5 font-kannada"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">
                    ದಿನಾಂಕ:
                  </label>
                  <input
                    type="text"
                    value={paper.headerInfo.date}
                    onChange={(e) =>
                      onUpdatePaper({
                        ...paper,
                        headerInfo: { ...paper.headerInfo, date: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-0.5">
                    ಸಮಯ:
                  </label>
                  <input
                    type="text"
                    value={paper.headerInfo.time}
                    onChange={(e) =>
                      onUpdatePaper({
                        ...paper,
                        headerInfo: { ...paper.headerInfo, time: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded p-1.5 font-kannada"
                  />
                </div>
              </div>
            </div>
          </details>

          {/* Section List & Questions */}
          <div className="space-y-4">
            {paper.sections.map((section, sIdx) => {
              const isAddingToThisSec = showAddQuestionModal === section.config.id;

              return (
                <div
                  key={section.config.id || sIdx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                >
                  {/* Section Title Bar */}
                  <div className="bg-sky-50 border-b border-sky-200 px-3.5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-blue-900 bg-blue-100 text-xs px-2 py-0.5 rounded">
                        {section.config.romanNumeral}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 font-kannada">
                        {section.config.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-blue-600 text-white font-semibold px-2 py-0.5 rounded">
                        {section.questions.length} ಪ್ರಶ್ನೆಗಳು
                      </span>
                      <button
                        onClick={() =>
                          setShowAddQuestionModal(
                            isAddingToThisSec ? null : section.config.id
                          )
                        }
                        className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 px-2 py-0.5 rounded flex items-center gap-0.5 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ಪ್ರಶ್ನೆ ಸೇರಿಸಿ</span>
                      </button>
                    </div>
                  </div>

                  {/* Add Question to this Section Form */}
                  {isAddingToThisSec && (
                    <div className="bg-blue-50/70 p-3 border-b border-blue-200 space-y-2 text-xs">
                      <span className="font-bold text-blue-950 block">
                        ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಸೇರಿಸಿ:
                      </span>
                      <textarea
                        value={newQText}
                        onChange={(e) => setNewQText(e.target.value)}
                        placeholder="ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                        rows={2}
                        className="w-full border border-slate-300 rounded p-2 text-sm font-kannada"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-600 font-medium">ಅಂಕ:</label>
                          <input
                            type="number"
                            value={newQMarks}
                            onChange={(e) => setNewQMarks(parseInt(e.target.value, 10) || 1)}
                            className="w-full border border-slate-300 rounded p-1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 font-medium">ಉತ್ತರ ಕೀ:</label>
                          <input
                            type="text"
                            value={newQAnswer}
                            onChange={(e) => setNewQAnswer(e.target.value)}
                            placeholder="ಉತ್ತರ..."
                            className="w-full border border-slate-300 rounded p-1 font-kannada"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setShowAddQuestionModal(null)}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700"
                        >
                          ರದ್ದು
                        </button>
                        <button
                          onClick={() => handleAddQuestionSubmit(section.config.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                        >
                          ಸೇರಿಸಿ
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Questions in Section */}
                  <div className="divide-y divide-slate-100">
                    {section.questions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ. ಮೇಲಿನ ‘ಪ್ರಶ್ನೆ ಸೇರಿಸಿ’ ಬಟನ್ ಬಳಸಿ.
                      </div>
                    ) : (
                      section.questions.map((q, qIdx) => {
                        const isEditing = editingQuestionId === q.id;

                        return (
                          <div
                            key={q.id}
                            className={`p-3 transition-colors ${
                              isEditing ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'
                            }`}
                          >
                            {/* Question Details / Inline Edit */}
                            {isEditing ? (
                              <div className="space-y-2 text-xs">
                                <label className="font-semibold text-slate-800">
                                  ಪ್ರಶ್ನೆ ಪಠ್ಯ ಸಂಪಾದನೆ:
                                </label>
                                <textarea
                                  value={q.questionText}
                                  onChange={(e) =>
                                    handleUpdateQuestion(sIdx, qIdx, {
                                      ...q,
                                      questionText: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="w-full text-sm border border-slate-300 rounded p-2 font-kannada focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-slate-600 font-medium">ಅಂಕ:</label>
                                    <input
                                      type="number"
                                      value={q.marks}
                                      onChange={(e) =>
                                        handleUpdateQuestion(sIdx, qIdx, {
                                          ...q,
                                          marks: parseInt(e.target.value, 10) || 1,
                                        })
                                      }
                                      className="w-full border border-slate-300 rounded p-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-slate-600 font-medium">
                                      ಉತ್ತರ ಬರೆಯಲು ಲೈನುಗಳ ಸಂಖ್ಯೆ:
                                    </label>
                                    <input
                                      type="number"
                                      value={q.answerSpaceLines || 0}
                                      onChange={(e) =>
                                        handleUpdateQuestion(sIdx, qIdx, {
                                          ...q,
                                          answerSpaceLines: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      placeholder="0 for default"
                                      className="w-full border border-slate-300 rounded p-1"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-slate-600 font-medium">ಉತ್ತರ ಕೀ:</label>
                                  <input
                                    type="text"
                                    value={q.answer || ''}
                                    onChange={(e) =>
                                      handleUpdateQuestion(sIdx, qIdx, {
                                        ...q,
                                        answer: e.target.value,
                                      })
                                    }
                                    className="w-full border border-slate-300 rounded p-1 font-kannada"
                                  />
                                </div>

                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={() => setEditingQuestionId(null)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                                  >
                                    ಪೂರ್ಣಗೊಳಿಸಿ (Done)
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-slate-700 text-xs mt-0.5">
                                      {qIdx + 1}.
                                    </span>
                                    <p className="text-xs sm:text-sm text-slate-900 font-kannada leading-relaxed">
                                      {q.questionText}
                                    </p>
                                  </div>
                                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0">
                                    [{q.marks} ಅಂಕ]
                                  </span>
                                </div>

                                {q.answer && (
                                  <p className="text-[11px] text-emerald-700 mt-1 pl-4">
                                    ಉತ್ತರ: <span className="font-medium">{q.answer}</span>
                                  </p>
                                )}

                                {/* Action Buttons per Question */}
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <span>ಪಾಠ: {q.lessonName}</span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {/* 1-Click Quick Swap */}
                                    <button
                                      type="button"
                                      onClick={() => handleQuickSwap(q)}
                                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                      title="ಬೇರೆ ಪ್ರಶ್ನೆಯೊಂದಿಗೆ ತಕ್ಷಣ ಬದಲಾಯಿಸಿ"
                                    >
                                      <Shuffle className="w-3 h-3 text-amber-700" />
                                      <span>ತಕ್ಷಣ ಬದಲಿಸಿ</span>
                                    </button>

                                    {/* Replace Modal */}
                                    <button
                                      type="button"
                                      onClick={() => setReplacingQuestion(q)}
                                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                      title="ಪ್ರಶ್ನೆ ಬದಲಿಸಿ / ಪರ್ಯಾಯ ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ"
                                    >
                                      <RefreshCw className="w-3 h-3 text-blue-700" />
                                      <span>ಬದಲಿಸಿ</span>
                                    </button>

                                    {/* Edit */}
                                    <button
                                      type="button"
                                      onClick={() => setEditingQuestionId(q.id)}
                                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium flex items-center gap-0.5"
                                      title="ಪ್ರಶ್ನೆ ಸಂಪಾದಿಸಿ"
                                    >
                                      <Edit2 className="w-3 h-3 text-slate-600" />
                                      <span>ತಿದ್ದಿ</span>
                                    </button>

                                    {/* Move Up */}
                                    <button
                                      type="button"
                                      onClick={() => handleMoveUp(sIdx, qIdx)}
                                      disabled={qIdx === 0}
                                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                                      title="ಮೇಲೆ ಸರಿಸಿ"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Move Down */}
                                    <button
                                      type="button"
                                      onClick={() => handleMoveDown(sIdx, qIdx)}
                                      disabled={qIdx >= section.questions.length - 1}
                                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                                      title="ಕೆಳಗೆ ಸರಿಸಿ"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteQuestion(sIdx, qIdx)}
                                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                      title="ಅಳಿಸಿ (Delete Question)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Section Button */}
          <div className="pt-2">
            {showAddSectionModal ? (
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm space-y-3 text-xs">
                <h4 className="font-bold text-sm text-slate-900">
                  ಹೊಸ ವಿಭಾಗ ರಚಿಸಿ (Add New Section)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700">ರೋಮನ್ ಅಂಕ:</label>
                    <input
                      type="text"
                      value={newSecRoman}
                      onChange={(e) => setNewSecRoman(e.target.value)}
                      placeholder="VIII, IX..."
                      className="w-full border border-slate-300 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಅಂಕ:</label>
                    <input
                      type="number"
                      value={newSecMarks}
                      onChange={(e) => setNewSecMarks(parseInt(e.target.value, 10) || 1)}
                      className="w-full border border-slate-300 rounded p-1.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">ವಿಭಾಗದ ಶೀರ್ಷಿಕೆ:</label>
                  <input
                    type="text"
                    value={newSecTitle}
                    onChange={(e) => setNewSecTitle(e.target.value)}
                    placeholder="ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ..."
                    className="w-full border border-slate-300 rounded p-1.5 font-kannada"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowAddSectionModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded"
                  >
                    ರದ್ದು
                  </button>
                  <button
                    onClick={handleAddSectionSubmit}
                    className="px-4 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                  >
                    ವಿಭಾಗ ಸೇರಿಸಿ
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 text-blue-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ ಹೊಸ ವಿಭಾಗ ಸೇರಿಸಿ (Add Section)</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: LIVE A4 PREVIEW (5 COLS ON XL, 6 ON LG)          */}
        {/* ============================================================== */}
        <div
          className={`lg:col-span-6 xl:col-span-7 ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Zoom & Page Info Controls */}
          <div className="flex items-center justify-between bg-slate-100 border border-slate-200 p-2 rounded-t-xl text-xs text-slate-700 no-print">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>A4 ಮುದ್ರಣ ಮುನ್ನೋಟ (Live A4 Preview)</span>
            </span>

            <div className="flex items-center space-x-2">
              <span>ಪ್ರಮಾಣ:</span>
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.6, s - 0.05))}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-bold"
              >
                -
              </button>
              <span className="font-medium min-w-[36px] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1.1, s + 0.05))}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-bold"
              >
                +
              </button>
              <button
                onClick={() => setPreviewScale(1)}
                className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs"
              >
                100%
              </button>
            </div>
          </div>

          {/* Sheet Preview Container with overflow scroll for comfortable viewing */}
          <div className="bg-slate-200/80 p-2 sm:p-4 rounded-b-xl overflow-x-auto min-h-[600px] flex justify-center shadow-inner">
            <A4Preview paper={paper} scale={previewScale} interactive={true} />
          </div>
        </div>
      </div>

      {/* Replacement Modal */}
      {replacingQuestion && (
        <ReplaceQuestionModal
          question={replacingQuestion}
          paper={paper}
          onReplace={handleReplaceQuestion}
          onClose={() => setReplacingQuestion(null)}
        />
      )}
    </div>
  );
};
