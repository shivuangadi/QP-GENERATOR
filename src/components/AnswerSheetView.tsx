import React from 'react';
import { PaperState, QuestionItem } from '../data/kannadaPaperData';
import { CheckCircle2, Printer, Trash2, FileText } from 'lucide-react';

interface AnswerSheetViewProps {
  paper: PaperState;
  onRemove?: () => void;
  onPrint?: () => void;
}

export const AnswerSheetView: React.FC<AnswerSheetViewProps> = ({
  paper,
  onRemove,
  onPrint,
}) => {
  const { header, sections, matchSection } = paper;

  const isLetterQuestion = (q: QuestionItem) => {
    return (
      q.isLetterWriting ||
      q.lessonName.includes('ಪತ್ರ') ||
      q.questionText.includes('ಪತ್ರ') ||
      q.questionText.toLowerCase().includes('letter')
    );
  };

  return (
    <div
      id="answer-sheet-canvas"
      className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl relative box-border mt-8 page-break-before"
      style={{
        border: '1px solid #1e40af',
        padding: '4px',
      }}
    >
      {/* On-Screen Action Banner (Hidden in Print) */}
      <div className="no-print bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-2.5 sm:px-4 rounded-t flex flex-wrap items-center justify-between gap-2 shadow-sm border-b border-emerald-600">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-300" />
          <span className="font-bold text-sm sm:text-base text-amber-200">
            ಮಾದರಿ ಕೀಲಿ ಉತ್ತರ ಪತ್ರಿಕೆ (Official Scoring Key — Only Answers)
          </span>
          <span className="bg-emerald-600/80 text-[11px] px-2 py-0.5 rounded font-sans font-semibold border border-emerald-400/40">
            ಉತ್ತರಗಳು ಮಾತ್ರ (Answers Only)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrint && (
            <button
              onClick={onPrint}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              title="ಈಗಲೇ ಮುದ್ರಿಸಿ (Print Preview)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ಮುದ್ರಿಸಿ (Print)</span>
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors shadow-xs"
              title="ಉತ್ತರ ಪತ್ರಿಕೆಯನ್ನು ಮರೆಮಾಡಿ (Hide Answer Sheet)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ತೆಗೆದುಹಾಕಿ</span>
            </button>
          )}
        </div>
      </div>

      {/* Inner Golden Border */}
      <div
        className="w-full h-full p-4 sm:p-7 relative box-border bg-white"
        style={{
          border: '1px solid #c89b3c',
        }}
      >
        {/* ========================================================= */}
        {/* 1. OFFICIAL DOCUMENT HEADER                               */}
        {/* ========================================================= */}
        <div className="text-center pb-2 mb-3 border-b-2 border-emerald-800">
          <p className="text-[12px] sm:text-[13px] font-semibold text-[#046c4e] tracking-wider mb-0.5">
            {header.deptName}
          </p>

          <h2 className="text-base sm:text-xl font-bold text-slate-950 my-0.5">
            {header.schoolName}
          </h2>

          <div className="inline-block bg-emerald-50 border border-emerald-400 px-4 py-0.5 rounded-full my-1 shadow-2xs">
            <h1 className="text-sm sm:text-base font-extrabold text-emerald-950">
              {header.examTitle} — ಮಾದರಿ ಕೀಲಿ ಉತ್ತರಗಳು & ಮೌಲ್ಯಮಾಪನ ಸೂಚಿ (MODEL ANSWER KEY)
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs sm:text-[13px] text-slate-700 mt-2 px-2 border-t border-slate-300 pt-1">
            <span><strong>ತರಗತಿ:</strong> {header.classSection}</span>
            <span><strong>ವಿಷಯ:</strong> {header.subject}</span>
            <span><strong>ದಿನಾಂಕ:</strong> {header.date}</span>
            <span><strong>ಒಟ್ಟು ಅಂಕಗಳು:</strong> {header.totalMarks}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MATCH THE FOLLOWING SECTION (ONLY ANSWERS)            */}
        {/* ========================================================= */}
        {matchSection && matchSection.pairs && matchSection.pairs.length > 0 && (
          <div className="mb-4 border border-emerald-300 rounded p-2.5 bg-emerald-50/40 avoid-break">
            <div className="font-bold text-xs sm:text-sm text-emerald-950 mb-1.5 flex justify-between border-b border-emerald-200 pb-1">
              <span>
                ವಿಭಾಗ {matchSection.roman}. {matchSection.title} (ಕೀಲಿ ಉತ್ತರಗಳು)
              </span>
              <span className="font-mono text-emerald-800">{matchSection.formula}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {matchSection.pairs.map((p, idx) => (
                <div key={idx} className="bg-white p-2 border border-emerald-200 rounded shadow-2xs flex items-center justify-between">
                  <span className="font-bold text-slate-800 min-w-[20px]">{p.leftNum || `${idx + 1}.`}</span>
                  <span className="text-emerald-800 font-extrabold text-xs sm:text-sm">{p.answer}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-1">[1M]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. QUESTION SECTIONS: ONLY ANSWERS (NO QUESTION TEXT)     */}
        {/* ========================================================= */}
        <div className="space-y-3.5">
          {sections.map((sec) => {
            const isOneMarkOnly = sec.marksPerQuestion === 1;

            return (
              <div
                key={sec.id}
                className="border border-slate-300 rounded overflow-hidden avoid-break"
              >
                {/* Section Header */}
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-200 flex justify-between items-center">
                  <span>
                    ವಿಭಾಗ {sec.roman}. {sec.title} (ಉತ್ತರಗಳು)
                  </span>
                  <span className="font-mono text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                    {sec.formula}
                  </span>
                </div>

                {/* Answers Only List */}
                <div className="p-2.5 sm:p-3 bg-white">
                  {/* If short 1-mark section, render responsive 2-column or list */}
                  <div className={`grid ${isOneMarkOnly ? 'grid-cols-1 sm:grid-cols-2 gap-2' : 'grid-cols-1 gap-2.5'}`}>
                    {sec.questions.map((q) => {
                      const isLetter = isLetterQuestion(q);

                      return (
                        <div
                          key={q.id}
                          className="flex items-start gap-2 bg-emerald-50/50 border border-emerald-200/80 rounded p-2 text-xs sm:text-[13px] avoid-break"
                        >
                          {/* Question Number */}
                          <span className="font-bold text-blue-950 font-mono min-w-[24px] sm:min-w-[28px] text-sm pt-0.5">
                            {q.number}.
                          </span>

                          {/* ONLY THE ANSWER */}
                          <div className="flex-grow space-y-1">
                            <div className="flex items-start gap-1.5 text-emerald-950 font-semibold leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>
                                {q.answer || 'ಸೂಕ್ತ ಉತ್ತರಕ್ಕೆ ಪೂರ್ಣ ಅಂಕ ನೀಡುವುದು.'}
                              </span>
                            </div>

                            {/* Special letter writing valuation guideline */}
                            {isLetter && (
                              <div className="mt-1.5 pt-1.5 border-t border-emerald-300/80 text-[11px] text-emerald-900 bg-emerald-100/70 p-2 rounded">
                                <p className="font-bold text-emerald-950 mb-0.5">
                                  📝 ಪತ್ರ ಲೇಖನ ಮೌಲ್ಯಮಾಪನ ಅಂಕ ಹಂಚಿಕೆ ಸೂಚಿ:
                                </p>
                                <ul className="list-disc list-inside space-y-0.5">
                                  <li>ಸ್ಥಳ, ದಿನಾಂಕ, ವಿಳಾಸ & ಸಂಬೋಧನೆ ಕ್ರಮ — <strong>1 ಅಂಕ</strong></li>
                                  <li>ಪತ್ರದ ಒಡಲು & ವಿಷಯ ನಿರೂಪಣೆ — <strong>2 ಅಂಕಗಳು</strong></li>
                                  <li>ಮುಕ್ತಾಯ, ವಂದನೆಗಳು & ಭಾಷಾ ಶುದ್ಧತೆ — <strong>1 ಅಂಕ</strong></li>
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Marks Badge */}
                          <span className="text-[11px] font-bold text-slate-700 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 flex-shrink-0 self-start">
                            {q.marks}M
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 4. EVALUATOR SIGNATURE FOOTER                             */}
        {/* ========================================================= */}
        <div className="pt-6 mt-6 border-t-2 border-slate-400 flex flex-wrap justify-between items-center text-xs text-slate-700 avoid-break font-medium">
          <div>
            <p>ಮೌಲ್ಯಮಾಪಕರ ಸಹಿ : __________________</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(ಹೆಸರು & ದಿನಾಂಕ)</p>
          </div>
          <div>
            <p>ವಿಷಯ ಶಿಕ್ಷಕರ ಸಹಿ : __________________</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(ವಿಷಯ ಬೋಧಕರು)</p>
          </div>
          <div>
            <p>ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಹಿ & ಮೊಹರು : __________________</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(ಶಾಲಾ ಸೀಲು)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
