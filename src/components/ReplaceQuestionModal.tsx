import React, { useState } from 'react';
import { X, RefreshCw, Check, AlertCircle, PlusCircle, Edit3, Shuffle, Sparkles } from 'lucide-react';
import { getReplacementCandidates } from '../services/generator';
import { Question, QuestionPaper } from '../types';

interface ReplaceQuestionModalProps {
  question: Question;
  paper: QuestionPaper;
  onReplace: (originalId: string, newQuestion: Question) => void;
  onClose: () => void;
}

export const ReplaceQuestionModal: React.FC<ReplaceQuestionModalProps> = ({
  question,
  paper,
  onReplace,
  onClose,
}) => {
  const candidates = getReplacementCandidates(question, paper);
  const [activeTab, setActiveTab] = useState<'bank' | 'edit' | 'custom'>('bank');
  
  // Custom question state
  const [customText, setCustomText] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [customMarks, setCustomMarks] = useState(question.marks);

  // Edit current question in-place state
  const [editText, setEditText] = useState(question.questionText);
  const [editAnswer, setEditAnswer] = useState(question.answer || '');
  const [editMarks, setEditMarks] = useState(question.marks);

  const handleSelectCandidate = (candidate: Question) => {
    onReplace(question.id, candidate);
    onClose();
  };

  // Instant random swap with a candidate
  const handleRandomSwap = () => {
    if (candidates.length === 0) return;
    const randomPick = candidates[Math.floor(Math.random() * candidates.length)];
    onReplace(question.id, randomPick);
    onClose();
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    const updated: Question = {
      ...question,
      questionText: editText.trim(),
      answer: editAnswer.trim() || undefined,
      marks: editMarks,
    };
    onReplace(question.id, updated);
    onClose();
  };

  const handleAddCustom = () => {
    if (!customText.trim()) return;
    const newQ: Question = {
      ...question,
      id: 'custom-' + Date.now(),
      questionText: customText.trim(),
      answer: customAnswer.trim() || undefined,
      marks: customMarks,
      isDemo: false,
    };
    onReplace(question.id, newQ);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs font-kannada">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-blue-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base sm:text-lg">
              ಪ್ರಶ್ನೆ ಬದಲಿಸಿ / ತಿದ್ದುಪಡಿ ಮಾಡಿ (Change Question)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white hover:bg-blue-700/60 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Question summary */}
        <div className="bg-blue-50/80 border-b border-blue-200 p-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-blue-900">
              ಪ್ರಸ್ತುತ ಪ್ರಶ್ನೆ (Current Question):
            </span>
            <div className="flex items-center gap-1.5">
              <span className="bg-white text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200 text-xs">
                ಪಾಠ: {question.lessonName}
              </span>
              <span className="bg-blue-600 text-white font-semibold px-2 py-0.5 rounded text-xs">
                {question.marks} ಅಂಕ
              </span>
            </div>
          </div>
          <p className="text-slate-900 font-medium leading-relaxed">{question.questionText}</p>
          {question.answer && (
            <p className="text-emerald-700 text-xs mt-1 font-medium">
              ಉತ್ತರ: {question.answer}
            </p>
          )}
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bank'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ಬ್ಯಾಂಕ್‌ನಿಂದ ಪರ್ಯಾಯ ಪ್ರಶ್ನೆಗಳು ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ಈ ಪ್ರಶ್ನೆಯನ್ನು ತಿದ್ದಿ (Edit Text)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ಹೊಸ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-grow">
          {/* TAB 1: BANK CANDIDATES */}
          {activeTab === 'bank' && (
            <div className="space-y-3">
              {candidates.length > 0 && (
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-600">
                    ಕೆಳಗಿನ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ತಕ್ಷಣ ಬದಲಾಯಿಸಿ:
                  </span>
                  <button
                    onClick={handleRandomSwap}
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs"
                    title="ಲಭ್ಯವಿರುವ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಯಾದೃಚ್ಛಿಕವಾಗಿ ಆರಿಸಿ"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>ಯಾದೃಚ್ಛಿಕವಾಗಿ ಬದಲಾಯಿಸಿ (Auto-Swap)</span>
                  </button>
                </div>
              )}

              {candidates.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">
                      ಈ ಮಾನದಂಡಕ್ಕೆ ತಕ್ಕಂತೆ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಬೇರೆ ಸಿದ್ಧ ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿಲ್ಲ.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      ಮೇಲಿನ <strong>‘ಈ ಪ್ರಶ್ನೆಯನ್ನು ತಿದ್ದಿ’</strong> ಅಥವಾ <strong>‘ಹೊಸ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ’</strong> ಟ್ಯಾಬ್ ಬಳಸಿ ತಕ್ಷಣ ಬದಲಾಯಿಸಬಹುದು.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {candidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="border border-slate-200 rounded-xl p-3.5 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-grow">
                        <p className="text-sm font-medium text-slate-900 font-kannada leading-relaxed">
                          {cand.questionText}
                        </p>
                        {cand.answer && (
                          <p className="text-xs text-emerald-700 font-medium">
                            ಉತ್ತರ: <span className="font-semibold">{cand.answer}</span>
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            ಪಾಠ: {cand.lessonName}
                          </span>
                          <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                            {cand.marks} ಅಂಕ
                          </span>
                          <span className="text-slate-400">• ಕಠಿಣತೆ: {cand.difficulty}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectCandidate(cand)}
                        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ಈ ಪ್ರಶ್ನೆ ಹಾಕಿ</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT CURRENT QUESTION */}
          {activeTab === 'edit' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ಪ್ರಶ್ನೆಯ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ನೇರವಾಗಿ ತಿದ್ದಿ:
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-kannada bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ಅಂಕ (Marks):
                  </label>
                  <input
                    type="number"
                    value={editMarks}
                    onChange={(e) => setEditMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ಸರಿಯಾದ ಉತ್ತರ (Answer Key):
                  </label>
                  <input
                    type="text"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    placeholder="ಉತ್ತರ..."
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-kannada"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-200 font-medium"
                >
                  ರದ್ದು
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ತಿದ್ದುಪಡಿಯನ್ನು ಅನ್ವಯಿಸಿ</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM NEW QUESTION */}
          {activeTab === 'custom' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ಹೊಸ ಪ್ರಶ್ನೆ ವಿವರ (Kannada):
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="ನಿಮ್ಮದೇ ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                  rows={3}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 font-kannada bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ಅಂಕ (Marks):
                  </label>
                  <input
                    type="number"
                    value={customMarks}
                    onChange={(e) => setCustomMarks(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ಉತ್ತರ (ಐಚ್ಛಿಕ):
                  </label>
                  <input
                    type="text"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="ಸರಿಯಾದ ಉತ್ತರ..."
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white font-kannada"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-200 font-medium"
                >
                  ರದ್ದು
                </button>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ಈ ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಸೇರಿಸಿ</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            ಮುಚ್ಚಿ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
