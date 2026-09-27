import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle,
  Copy,
  Layers,
} from 'lucide-react';
import { QUESTION_TYPES, SUBJECTS, toKannadaDigits } from '../data/syllabus';
import { DEFAULT_PATTERNS } from '../data/defaultPatterns';
import {
  deleteCustomPattern,
  getCustomPatterns,
  saveCustomPattern,
} from '../services/storage';
import {
  ClassId,
  ExamId,
  PaperPatternPreset,
  QuestionType,
  SectionConfig,
  SubjectId,
} from '../types';

export const PatternBuilderView: React.FC = () => {
  const [patterns, setPatterns] = useState<PaperPatternPreset[]>(() =>
    getCustomPatterns()
  );

  const [activePatternId, setActivePatternId] = useState<string>(
    patterns[0]?.id || 'pattern-40-standard'
  );

  const currentPattern = patterns.find((p) => p.id === activePatternId) || patterns[0];

  const [patternName, setPatternName] = useState(currentPattern?.name || 'ಹೊಸ ಮಾದರಿ');
  const [classId, setClassId] = useState<ClassId>(currentPattern?.classId || '6th');
  const [subjectId, setSubjectId] = useState<SubjectId>(currentPattern?.subjectId || 'science');
  const [examId, setExamId] = useState<ExamId>(currentPattern?.examId || 'SA-1');
  const [sections, setSections] = useState<SectionConfig[]>(
    currentPattern?.sections || []
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Switch pattern
  const handleSelectPattern = (id: string) => {
    const p = patterns.find((item) => item.id === id);
    if (!p) return;
    setActivePatternId(p.id);
    setPatternName(p.name);
    setClassId(p.classId);
    setSubjectId(p.subjectId);
    setExamId(p.examId);
    setSections([...p.sections]);
  };

  // Calculate total marks
  const totalCalculatedMarks = sections.reduce(
    (sum, s) => sum + s.questionCount * s.marksPerQuestion,
    0
  );

  // Update section
  const handleUpdateSection = (idx: number, updated: Partial<SectionConfig>) => {
    const list = [...sections];
    const item = { ...list[idx], ...updated };
    item.totalMarks = item.questionCount * item.marksPerQuestion;
    list[idx] = item;
    setSections(list);
  };

  // Add section
  const handleAddSection = () => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const nextRoman = romanNumerals[sections.length] || `Sec-${sections.length + 1}`;

    const newSec: SectionConfig = {
      id: 'sec-' + Date.now(),
      romanNumeral: nextRoman,
      title: 'ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ:',
      questionType: 'short_answer',
      marksPerQuestion: 2,
      questionCount: 4,
      totalMarks: 8,
    };
    setSections([...sections, newSec]);
  };

  // Delete section
  const handleDeleteSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  // Move section Up
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const list = [...sections];
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    setSections(list);
  };

  // Move section Down
  const handleMoveDown = (idx: number) => {
    if (idx >= sections.length - 1) return;
    const list = [...sections];
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    setSections(list);
  };

  // Save current pattern
  const handleSave = () => {
    const savedPreset: PaperPatternPreset = {
      id: activePatternId.startsWith('pattern-custom-') ? activePatternId : 'pattern-custom-' + Date.now(),
      name: patternName.trim() || 'ಕಸ್ಟಮ್ ಮಾದರಿ',
      classId,
      subjectId,
      examId,
      totalMarks: totalCalculatedMarks,
      sections,
      isCustom: true,
    };

    saveCustomPattern(savedPreset);
    setPatterns(getCustomPatterns());
    setActivePatternId(savedPreset.id);
    setToastMessage('ಪತ್ರಿಕೆ ಮಾದರಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create new blank pattern
  const handleCreateNew = () => {
    const newId = 'pattern-custom-' + Date.now();
    setActivePatternId(newId);
    setPatternName('ಹೊಸ ಕಸ್ಟಮ್ ಮಾದರಿ');
    setSections([
      {
        id: 'sec-1',
        romanNumeral: 'I',
        title: 'ಖಾಲಿ ಜಾಗಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ:',
        questionType: 'fill_blank',
        marksPerQuestion: 1,
        questionCount: 4,
        totalMarks: 4,
      },
      {
        id: 'sec-2',
        romanNumeral: 'II',
        title: 'ಒಂದು ವಾಕ್ಯದಲ್ಲಿ ಉತ್ತರಿಸಿ:',
        questionType: 'one_word_sentence',
        marksPerQuestion: 1,
        questionCount: 4,
        totalMarks: 4,
      },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-600" />
            <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಮಾದರಿ ರಚನೆ (Paper Pattern Builder)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ವಿಭಾಗಗಳ ಸಂಖ್ಯೆ, ಪ್ರಶ್ನೆಗಳ ಪ್ರಕಾರ, ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ ಮತ್ತು ಅಂಕಗಳ ಸೂತ್ರವನ್ನು ನಿಮ್ಮ ಶಾಲೆಯ ನಿಯಮಾವಳಿಗೆ ತಕ್ಕಂತೆ ರೂಪಿಸಿ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ ಹೊಸ ಮಾದರಿ ಸೃಷ್ಟಿಸಿ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: SAVED PATTERNS LIST (4 COLS)                */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>ಲಭ್ಯವಿರುವ ಮಾದರಿಗಳು ({patterns.length}):</span>
            </h3>

            <div className="space-y-2">
              {patterns.map((p) => {
                const isSelected = p.id === activePatternId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPattern(p.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-purple-50/70 border-purple-400 text-purple-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-kannada">{p.name}</span>
                      <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {toKannadaDigits(p.totalMarks)} ಅಂಕಗಳು
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1 font-normal">
                      {p.sections.length} ವಿಭಾಗಗಳು • {p.classId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: ACTIVE PATTERN EDITOR (8 COLS)             */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Pattern Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ಮಾದರಿಯ ಹೆಸರು (Pattern Name):
                </label>
                <input
                  type="text"
                  value={patternName}
                  onChange={(e) => setPatternName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-kannada font-medium text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ತರಗತಿ:
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value as ClassId)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
                >
                  <option value="6th">೬ನೇ ತರಗತಿ</option>
                  <option value="7th">೭ನೇ ತರಗತಿ</option>
                </select>
              </div>
            </div>

            {/* Total Marks Banner */}
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-purple-900">
                ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾದ ಒಟ್ಟು ಅಂಕಗಳು:
              </span>
              <span className="font-extrabold text-base text-purple-900 bg-white px-3 py-1 rounded-lg border border-purple-300">
                {totalCalculatedMarks} ಅಂಕಗಳು
              </span>
            </div>

            {/* Sections List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-800">
                ವಿಭಾಗಗಳ ವಿವರ (Sections Config):
              </h4>

              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sec.romanNumeral}
                        onChange={(e) =>
                          handleUpdateSection(idx, { romanNumeral: e.target.value })
                        }
                        className="w-12 border border-slate-300 rounded p-1 font-bold text-center bg-white text-blue-900"
                        title="ರೋಮನ್ ಅಂಕ"
                      />
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) =>
                          handleUpdateSection(idx, { title: e.target.value })
                        }
                        className="w-64 sm:w-80 border border-slate-300 rounded p-1 font-kannada bg-white"
                        placeholder="ವಿಭಾಗದ ಶೀರ್ಷಿಕೆ..."
                      />
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        title="ಮೇಲೆ ಸರಿಸಿ"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx >= sections.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        title="ಕೆಳಗೆ ಸರಿಸಿ"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(idx)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="ಅಳಿಸಿ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="text-slate-500 block mb-0.5">ಪ್ರಶ್ನೆ ಪ್ರಕಾರ:</label>
                      <select
                        value={sec.questionType}
                        onChange={(e) =>
                          handleUpdateSection(idx, {
                            questionType: e.target.value as QuestionType,
                          })
                        }
                        className="w-full border border-slate-300 rounded p-1 font-kannada bg-white"
                      >
                        {Object.values(QUESTION_TYPES).map((qt) => (
                          <option key={qt.type} value={qt.type}>
                            {qt.titleKannada}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-0.5">ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ:</label>
                      <input
                        type="number"
                        min={1}
                        value={sec.questionCount}
                        onChange={(e) =>
                          handleUpdateSection(idx, {
                            questionCount: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full border border-slate-300 rounded p-1 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-0.5">ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಅಂಕ:</label>
                      <input
                        type="number"
                        min={1}
                        value={sec.marksPerQuestion}
                        onChange={(e) =>
                          handleUpdateSection(idx, {
                            marksPerQuestion: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full border border-slate-300 rounded p-1 bg-white"
                      />
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-semibold text-slate-600">
                    ವಿಭಾಗದ ಒಟ್ಟು: {sec.questionCount} × {sec.marksPerQuestion} = {sec.questionCount * sec.marksPerQuestion} ಅಂಕಗಳು
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 border-2 border-dashed border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ ಹೊಸ ವಿಭಾಗ ಸೇರಿಸಿ</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>ಈ ಮಾದರಿಯನ್ನು ಉಳಿಸಿ (Save Pattern)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
