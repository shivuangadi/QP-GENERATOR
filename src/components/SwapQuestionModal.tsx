import React, { useState } from 'react';
import { QuestionItem, QUESTION_POOL } from '../data/kannadaPaperData';
import { RefreshCw, Check, X, Plus } from 'lucide-react';

interface SwapQuestionModalProps {
  question: QuestionItem;
  sectionType: 'fill_blank' | 'word_meaning' | 'own_sentence' | 'one_sentence' | 'two_three_sentences' | 'four_five_sentences';
  isOpen: boolean;
  onClose: () => void;
  onSelect: (newQuestion: QuestionItem) => void;
}

export const SwapQuestionModal: React.FC<SwapQuestionModalProps> = ({
  question,
  sectionType,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  const pool = QUESTION_POOL[sectionType] || [];
  const [customText, setCustomText] = useState(question.questionText);
  const [customAnswer, setCustomAnswer] = useState(question.answer);
  const [customLesson, setCustomLesson] = useState(question.lessonName);
  const [tab, setTab] = useState<'bank' | 'custom'>('bank');

  const handleSelectFromPool = (item: QuestionItem) => {
    onSelect({
      ...item,
      id: question.id,
      number: question.number,
      marks: question.marks,
    });
    onClose();
  };

  const handleApplyCustom = () => {
    onSelect({
      ...question,
      questionText: customText,
      answer: customAnswer,
      lessonName: customLesson,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden font-kannada animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0f2744] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              ಪ್ರಶ್ನೆ {question.number} ಬದಲಾಯಿಸಿ (Swap Question)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Question Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs sm:text-sm text-slate-800">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">
            ಪ್ರಸ್ತುತ ಪ್ರಶ್ನೆ (Current Question):
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">{question.questionText}</p>
            <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-medium flex-shrink-0">
              {question.lessonName}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setTab('bank')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              tab === 'bank'
                ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ಪ್ರಶ್ನೆ ಕೋಶದಿಂದ ಆರಿಸಿ (From Question Bank)
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              tab === 'custom'
                ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ಸ್ವಂತ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ (Type Custom Question)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {tab === 'bank' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                ಕೆಳಗಿನ ಪರ್ಯಾಯ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯ್ಕೆಮಾಡಿ:
              </p>
              {pool.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">
                  ಪರ್ಯಾಯ ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿಲ್ಲ.
                </p>
              )}
              {pool.map((alt, idx) => (
                <div
                  key={alt.id || idx}
                  onClick={() => handleSelectFromPool(alt)}
                  className={`border rounded-lg p-3 text-xs sm:text-sm cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/60 ${
                    alt.questionText === question.questionText
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 leading-snug">
                      {idx + 1}. {alt.questionText}
                    </p>
                    <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-medium flex-shrink-0">
                      {alt.lessonName}
                    </span>
                  </div>
                  {alt.answer && (
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      ಉತ್ತರ: <span className="text-slate-700 font-sans">{alt.answer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ಪಾಠದ ಹೆಸರು (Lesson Name):
                </label>
                <input
                  type="text"
                  value={customLesson}
                  onChange={(e) => setCustomLesson(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-blue-500"
                  placeholder="ಉದಾ: ಗಂಧರ್ವಸೇನ"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ಪ್ರಶ್ನೆ ಪಠ್ಯ (Question Text):
                </label>
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-blue-500"
                  placeholder="ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ಮಾದರಿ ಉತ್ತರ (Model Answer):
                </label>
                <textarea
                  rows={2}
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-blue-500"
                  placeholder="ಮಾದರಿ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                />
              </div>
              <button
                onClick={handleApplyCustom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                ಪ್ರಶ್ನೆಯನ್ನು ಉಳಿಸಿ ಮತ್ತು ಅನ್ವಯಿಸಿ
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
          >
            ರದ್ದುಮಾಡಿ (Cancel)
          </button>
        </div>
      </div>
    </div>
  );
};
