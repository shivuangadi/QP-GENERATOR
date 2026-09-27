import React, { useState } from 'react';
import { PaperState, QuestionItem } from '../data/kannadaPaperData';
import { Edit3, Check, X, Save, Trash2, Plus } from 'lucide-react';

interface EditQuestionModalProps {
  paper: PaperState;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPaper: PaperState) => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  paper,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [workingPaper, setWorkingPaper] = useState<PaperState>(() =>
    JSON.parse(JSON.stringify(paper))
  );

  const handleHeaderChange = (field: keyof typeof workingPaper.header, value: any) => {
    setWorkingPaper((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const handleQuestionChange = (
    sectionId: string,
    questionId: string,
    field: keyof QuestionItem,
    value: any
  ) => {
    setWorkingPaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              [field]: value,
            };
          }),
        };
      }),
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setWorkingPaper((prev) => {
      const updated = [...prev.instructions];
      updated[index] = value;
      return { ...prev, instructions: updated };
    });
  };

  const handleSave = () => {
    onSave(workingPaper);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print font-kannada">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0f2744] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base sm:text-lg">
              ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಸಂಪಾದಿಸಿ / ಟೈಪ್ ಮಾಡಿ (Edit Question Paper)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs sm:text-sm">
          {/* Header Info Settings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
              <span>1. ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಗಳು (Paper Header Details)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ಶಾಲೆಯ ಹೆಸರು:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.schoolName}
                  onChange={(e) => handleHeaderChange('schoolName', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ಪರೀಕ್ಷೆಯ ಹೆಸರು:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.examTitle}
                  onChange={(e) => handleHeaderChange('examTitle', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ವಿಷಯ:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.subject}
                  onChange={(e) => handleHeaderChange('subject', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ತರಗತಿ / ವಿಭಾಗ:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.classSection}
                  onChange={(e) => handleHeaderChange('classSection', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ದಿನಾಂಕ:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.date}
                  onChange={(e) => handleHeaderChange('date', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  ಸಮಯ:
                </label>
                <input
                  type="text"
                  value={workingPaper.header.time}
                  onChange={(e) => handleHeaderChange('time', e.target.value)}
                  className="w-full border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
              2. ಸಾಮಾನ್ಯ ಸೂಚನೆಗಳು (General Instructions)
            </h4>
            <div className="space-y-2">
              {workingPaper.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-slate-500">{idx + 1}.</span>
                  <input
                    type="text"
                    value={inst}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    className="flex-grow border border-slate-300 rounded-md p-2 bg-white focus:outline-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sections and Questions */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              3. ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಮಾದರಿ ಉತ್ತರಗಳು (Questions & Answers)
            </h4>

            {workingPaper.sections.map((sec) => (
              <div
                key={sec.id}
                className="border border-slate-300 rounded-xl overflow-hidden shadow-xs"
              >
                <div className="bg-sky-50 px-4 py-2.5 border-b border-sky-200 flex items-center justify-between font-bold text-slate-900">
                  <span>
                    {sec.roman}. {sec.title}
                  </span>
                  <span className="text-xs bg-sky-200/80 px-2 py-0.5 rounded text-sky-950 font-mono">
                    {sec.formula}
                  </span>
                </div>

                <div className="p-4 space-y-3 divide-y divide-slate-100">
                  {sec.questions.map((q) => (
                    <div key={q.id} className="pt-3 first:pt-0 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-700 min-w-[24px] pt-1.5">
                          {q.number}.
                        </span>
                        <div className="flex-grow space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={q.questionText}
                              onChange={(e) =>
                                handleQuestionChange(
                                  sec.id,
                                  q.id,
                                  'questionText',
                                  e.target.value
                                )
                              }
                              className="flex-grow border border-slate-300 rounded-md p-2 font-medium text-slate-900 focus:outline-blue-500"
                              placeholder="ಪ್ರಶ್ನೆ ಪಠ್ಯ..."
                            />
                            <input
                              type="text"
                              value={q.lessonName}
                              onChange={(e) =>
                                handleQuestionChange(
                                  sec.id,
                                  q.id,
                                  'lessonName',
                                  e.target.value
                                )
                              }
                              className="w-36 border border-slate-300 rounded-md p-2 text-xs font-semibold text-cyan-800 bg-cyan-50 focus:outline-blue-500"
                              placeholder="ಪಾಠದ ಹೆಸರು..."
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={q.answer}
                              onChange={(e) =>
                                handleQuestionChange(sec.id, q.id, 'answer', e.target.value)
                              }
                              className="w-full border border-slate-200 rounded-md p-1.5 text-xs text-slate-600 bg-slate-50 focus:outline-blue-500"
                              placeholder="ಮಾದರಿ ಉತ್ತರ (Model Answer)..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-slate-500">
            ಬದಲಾವಣೆಗಳನ್ನು ಮಾಡಿದ ನಂತರ 'ಉಳಿಸಿ' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              ರದ್ದುಮಾಡಿ (Cancel)
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              ಉಳಿಸಿ (Save Changes)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
