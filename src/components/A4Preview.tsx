import React from 'react';
import {
  KANNADA_SUB_LETTERS,
  ENGLISH_SUB_LETTERS,
  toKannadaDigits,
  getSubjectById,
} from '../data/syllabus';
import { QuestionPaper, Question } from '../types';

interface A4PreviewProps {
  paper: QuestionPaper;
  onEditQuestion?: (question: Question) => void;
  scale?: number;
  interactive?: boolean;
}

export const A4Preview: React.FC<A4PreviewProps> = ({
  paper,
  onEditQuestion,
  scale = 1,
  interactive = true,
}) => {
  const isKannadaNum = paper.numberingFormat === 'kannada';

  // Format question number
  const formatQNum = (n: number) => {
    return isKannadaNum ? toKannadaDigits(n) + '.' : `${n}.`;
  };

  // Format marks display
  const formatMarks = (n: number) => {
    return isKannadaNum ? toKannadaDigits(n) : String(n);
  };

  let globalQuestionNumber = 0;

  // Determine line count for answer space
  const getLineCount = (q: Question) => {
    if (paper.answerSpaceType === 'none') return 0;
    if (q.answerSpaceLines !== undefined && q.answerSpaceLines > 0) {
      return q.answerSpaceLines;
    }
    if (paper.answerSpaceType === 'ruled') {
      return 3;
    }
    if (paper.answerSpaceType === 'by_marks' || paper.answerSpaceType === 'auto') {
      if (q.marks <= 1) return q.questionType === 'fill_blank' ? 0 : 2;
      if (q.marks === 2) return 4;
      if (q.marks === 3) return 6;
      return 8;
    }
    return 0;
  };

  return (
    <div
      className="a4-preview-page font-kannada text-slate-900 border border-slate-300 print:border-none"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {/* ========================================================= */}
      {/* 1. OFFICIAL KARNATAKA EXAMINATION PAPER HEADER           */}
      {/* ========================================================= */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-700 font-medium">
          {paper.headerInfo.deptName || 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ - ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ'}
        </p>

        <h2 className="text-xl sm:text-2xl font-bold tracking-normal text-slate-950 my-1 font-kannada">
          {paper.headerInfo.schoolName}
        </h2>

        <div className="inline-block bg-blue-50 border border-blue-200 px-4 py-0.5 rounded-full my-1">
          <h3 className="text-sm sm:text-base font-bold text-blue-900">
            {paper.headerInfo.examTitle}
          </h3>
        </div>

        <p className="text-sm font-semibold text-slate-800">
          {paper.headerInfo.subTitle}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. STUDENT & EXAM PARTICULARS TABLE                      */}
      {/* ========================================================= */}
      {paper.headerInfo.showStudentTable && (
        <div className="mb-5 overflow-hidden border border-slate-700 text-xs sm:text-sm">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-slate-600 bg-slate-50/70">
                <td className="p-1.5 border-r border-slate-600 font-semibold w-1/4">
                  ತರಗತಿ: <span className="font-normal font-kannada">{paper.classId === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ'}</span>
                </td>
                <td className="p-1.5 border-r border-slate-600 font-semibold w-1/4">
                  ವಿಷಯ: <span className="font-normal font-kannada">{getSubjectById(paper.subjectId as any)?.nameKannada || paper.subjectId}</span>
                </td>
                <td className="p-1.5 border-r border-slate-600 font-semibold w-1/4">
                  ದಿನಾಂಕ: <span className="font-normal">{paper.headerInfo.date || paper.date}</span>
                </td>
                <td className="p-1.5 font-semibold w-1/4">
                  ಸಮಯ: <span className="font-normal">{paper.headerInfo.time || paper.time}</span>
                </td>
              </tr>
              <tr className="border-b border-slate-600">
                <td colSpan={2} className="p-1.5 border-r border-slate-600">
                  ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು: <span className="text-slate-400 font-light">_______________________________</span>
                </td>
                <td className="p-1.5 border-r border-slate-600 font-semibold">
                  ನೋಂದಣಿ ಸಂಖ್ಯೆ: <span className="text-slate-400 font-light">___________</span>
                </td>
                <td className="p-1.5 font-semibold text-right text-blue-900">
                  ಗರಿಷ್ಠ ಅಂಕಗಳು: <span className="font-bold text-base">{formatMarks(paper.totalMarks)}</span>
                </td>
              </tr>
              <tr className="bg-slate-50/50">
                <td colSpan={2} className="p-1 border-r border-slate-600 text-[11px] text-slate-600">
                  ಪಡೆದ ಅಂಕಗಳು (ಅಕ್ಷರಗಳಲ್ಲಿ): _________________________
                </td>
                <td colSpan={2} className="p-1 text-[11px] text-slate-600 text-right">
                  ಮೌಲ್ಯಮಾಪಕರ ಸಹಿ: _________________
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* General Instructions */}
      {paper.headerInfo.generalInstructions && paper.headerInfo.generalInstructions.length > 0 && (
        <div className="mb-4 text-xs text-slate-700 bg-slate-50/50 p-2 border border-slate-200 rounded">
          <p className="font-semibold text-slate-900 mb-0.5">ಸಾಮಾನ್ಯ ಸೂಚನೆಗಳು:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {paper.headerInfo.generalInstructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SECTIONS & QUESTIONS                                  */}
      {/* ========================================================= */}
      <div className="space-y-5">
        {paper.sections.map((section, sIdx) => {
          const sectionTotalMarks = section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
          const formulaStr = `${formatMarks(section.questions.length)} × ${formatMarks(
            section.config.marksPerQuestion
          )} = ${formatMarks(sectionTotalMarks)}`;

          return (
            <div key={section.config.id || sIdx} className="avoid-break mb-4">
              {/* Section Header with light-blue official style */}
              <div className="bg-sky-100/80 border border-sky-300/80 px-3 py-1.5 rounded-sm flex items-center justify-between text-slate-900 font-bold mb-3 shadow-xs">
                <span className="text-sm sm:text-base font-kannada">
                  {section.config.romanNumeral}. {section.config.title}
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-sky-950 bg-sky-200/80 px-2 py-0.5 rounded border border-sky-400/40">
                  {formulaStr}
                </span>
              </div>

              {/* Questions in Section */}
              <div className="space-y-3.5 pl-1 sm:pl-2">
                {section.questions.map((q) => {
                  globalQuestionNumber++;
                  const currentQNum = globalQuestionNumber;
                  const lineCount = getLineCount(q);

                  return (
                    <div
                      key={q.id}
                      className={`relative group avoid-break ${
                        interactive
                          ? 'hover:bg-blue-50/40 p-1.5 -m-1.5 rounded transition-colors cursor-pointer'
                          : ''
                      }`}
                      onClick={() => interactive && onEditQuestion && onEditQuestion(q)}
                    >
                      {/* Teacher-only tag if enabled */}
                      {paper.showTeacherTags && (
                        <div className="no-print inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded mb-1">
                          <span>ಪಾಠ: {q.lessonName}</span>
                          <span>•</span>
                          <span>ಅಂಕ: {q.marks}</span>
                          <span>•</span>
                          <span>ಕಠಿಣತೆ: {q.difficulty}</span>
                          {q.isAIGenerated && (
                            <span className="bg-indigo-100 text-indigo-700 px-1 rounded font-semibold">
                              AI Generated
                            </span>
                          )}
                          {q.isDemo && (
                            <span className="bg-slate-200 text-slate-700 px-1 rounded">
                              Demo Question
                            </span>
                          )}
                        </div>
                      )}

                      {/* Question Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-grow">
                          <span className="font-bold text-slate-950 text-sm sm:text-base min-w-[24px]">
                            {formatQNum(currentQNum)}
                          </span>
                          <div className="text-sm sm:text-base leading-relaxed text-slate-900 font-kannada flex-grow">
                            {q.questionText}
                          </div>
                        </div>

                        {/* Marks badge */}
                        <div className="text-right flex-shrink-0 text-xs sm:text-sm font-semibold text-slate-700 pt-0.5">
                          [{formatMarks(q.marks)}]
                        </div>
                      </div>

                      {/* Options (MCQ / Choose correct) */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2 ml-7 text-xs sm:text-sm text-slate-800 font-kannada">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-1">
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Match following pairs */}
                      {q.matchPairs && q.matchPairs.length > 0 && (
                        <div className="mt-2 ml-7 max-w-md border border-slate-400 text-xs sm:text-sm">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-400 font-semibold text-slate-800">
                                <th className="p-1 text-left border-r border-slate-400 w-1/2">
                                  ಗುಂಪು ‘ಎ’
                                </th>
                                <th className="p-1 text-left w-1/2">ಗುಂಪು ‘ಬಿ’</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.matchPairs.map((pair, pIdx) => (
                                <tr key={pIdx} className="border-b border-slate-300 last:border-none">
                                  <td className="p-1 border-r border-slate-400 font-kannada">
                                    {pair.left}
                                  </td>
                                  <td className="p-1 font-kannada">{pair.right}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Diagram / Image if attached */}
                      {q.imageUrl && (
                        <div
                          className={`mt-2 ml-7 my-1 ${
                            q.imagePosition === 'center'
                              ? 'text-center'
                              : q.imagePosition === 'right'
                              ? 'flex justify-end'
                              : ''
                          }`}
                        >
                          <img
                            src={q.imageUrl}
                            alt="Question Diagram"
                            className="max-h-48 border border-slate-300 rounded shadow-xs object-contain"
                            style={{ width: q.imageWidth ? `${q.imageWidth}%` : undefined }}
                          />
                          {q.imageCaption && (
                            <p className="text-[11px] text-slate-500 mt-1 italic">
                              {q.imageCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Answer space ruled lines */}
                      {lineCount > 0 && (
                        <div
                          className="mt-2 ml-7 answer-ruled-lines rounded-xs"
                          style={{ height: `${lineCount * 27}px` }}
                          aria-label="Answer space ruled lines"
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 4. FOOTER & SIGNATURES                                    */}
      {/* ========================================================= */}
      <div className="mt-8 pt-4 border-t border-slate-400 text-xs text-slate-700 avoid-break">
        <div className="flex items-center justify-between font-semibold">
          <span>ಒಟ್ಟು ಅಂಕಗಳು: {formatMarks(paper.totalMarks)}</span>
          <span className="text-slate-500">*** ಶುಭವಾಗಲಿ ***</span>
          <span>ಮುಖ್ಯ ಶಿಕ್ಷಕರ ಸಹಿ & ಮೊಹರು</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚನಾ ಸಾಧನ - By S R Angadi (2026-27)</span>
          <span>ಪುಟ ೧ / ೧ (A4 Portrait)</span>
        </div>
      </div>
    </div>
  );
};
