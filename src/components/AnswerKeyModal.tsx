import React from 'react';
import { PaperState } from '../data/kannadaPaperData';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface AnswerKeyModalProps {
  paper: PaperState;
  isOpen: boolean;
  onClose: () => void;
}

export const AnswerKeyModal: React.FC<AnswerKeyModalProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-kannada">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Hidden in print */}
        <div className="bg-[#0f2744] text-white px-6 py-4 flex items-center justify-between flex-shrink-0 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base sm:text-lg">
              ಮಾದರಿ ಉತ್ತರ ಪತ್ರಿಕೆ & ಮೌಲ್ಯಮಾಪನ ಸೂಚಿ (Answer Key)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Printer className="w-4 h-4" />
              ಉತ್ತರ ಪತ್ರಿಕೆ ಮುದ್ರಿಸಿ (Print)
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Answer Key Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white" id="answer-key-sheet">
          {/* Official Document Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
              {paper.header.deptName}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 my-1">
              {paper.header.schoolName}
            </h2>
            <div className="inline-block bg-emerald-50 border border-emerald-300 px-4 py-1 rounded-full my-1">
              <h3 className="text-sm font-bold text-emerald-950">
                {paper.header.examTitle} — ಮಾದರಿ ಉತ್ತರ ಪತ್ರಿಕೆ & ಮೌಲ್ಯಮಾಪನ ಸೂಚಿ
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              ತರಗತಿ: {paper.header.classSection} | ವಿಷಯ: {paper.header.subject} | ಒಟ್ಟು ಅಂಕ: {paper.header.totalMarks}
            </p>
          </div>

          {/* Section II Match the following key */}
          {paper.matchSection && paper.matchSection.pairs && paper.matchSection.pairs.length > 0 && (
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                ವಿಭಾಗ {paper.matchSection.roman}. {paper.matchSection.title} (ಕೀಲಿ ಉತ್ತರಗಳು)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {paper.matchSection.pairs.map((p, idx) => (
                  <div key={idx} className="bg-white p-2 border rounded shadow-xs flex items-center justify-between">
                    <span className="font-bold text-slate-800">{p.leftNum || `${idx + 1}.`}</span>
                    <span className="text-emerald-800 font-extrabold text-sm">{p.answer}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[1M]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All other sections: ONLY ANSWERS */}
          <div className="space-y-4">
            {paper.sections.map((sec) => (
              <div key={sec.id} className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-200 flex justify-between">
                  <span>
                    ವಿಭಾಗ {sec.roman}. {sec.title} (ಉತ್ತರಗಳು ಮಾತ್ರ)
                  </span>
                  <span>{sec.formula}</span>
                </div>
                <div className="p-3 space-y-2 divide-y divide-slate-100 bg-white">
                  {sec.questions.map((q) => (
                    <div key={q.id} className="pt-2 first:pt-0 text-xs sm:text-sm">
                      <div className="flex items-start gap-2.5 bg-emerald-50/60 border border-emerald-200 p-2 rounded text-emerald-950">
                        <span className="font-bold text-blue-950 min-w-[24px] font-mono text-sm pt-0.5">
                          {q.number}.
                        </span>
                        <div className="flex-grow font-semibold flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{q.answer || 'ಸೂಕ್ತ ಉತ್ತರಕ್ಕೆ ಪೂರ್ಣ ಅಂಕ ನೀಡುವುದು.'}</span>
                        </div>
                        <span className="text-slate-600 font-mono text-xs font-bold bg-white px-1.5 py-0.5 rounded border border-slate-300 flex-shrink-0">
                          {q.marks}M
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key Footer */}
          <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-600">
            <span>ಮೌಲ್ಯಮಾಪಕರ ಸಹಿ : __________________</span>
            <span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ : __________________</span>
          </div>
        </div>

        {/* Modal Footer - Hidden in print */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
          >
            ಮುಚ್ಚಿ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
