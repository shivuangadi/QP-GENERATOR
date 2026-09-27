import React from 'react';
import { PaperState, QuestionItem, SectionItem } from '../data/kannadaPaperData';
import { RotateCw, CheckCircle2 } from 'lucide-react';
import { AnswerSpaceOption } from '../services/smartPaperGenerator';
import { ExamType } from '../data/allSubjectsData';

interface KannadaPaperPreviewProps {
  paper: PaperState;
  answerSpaceType?: AnswerSpaceOption;
  examType?: ExamType;
  onSwapQuestion: (question: QuestionItem, sectionType: any) => void;
  onShuffleMatch: () => void;
}

export const KannadaPaperPreview: React.FC<KannadaPaperPreviewProps> = ({
  paper,
  answerSpaceType = 'dotted_2',
  examType = 'SA1',
  onSwapQuestion,
  onShuffleMatch,
}) => {
  const { header, instructions, sections, matchSection, showAnswers } = paper;

  const hasTypedSchoolName = header.schoolName && header.schoolName.trim().length > 0;

  // Extract Class without division/section (User: "NOT NECESSARY TO MENTION DIVISION IN QP")
  const classOnly = header.classSection ? header.classSection.split('/')[0].trim() : '6ನೇ ತರಗತಿ';

  // Helper to determine if a section or question is "Fill in the Blanks"
  const isFillInTheBlanks = (section: SectionItem, q: QuestionItem): boolean => {
    const secTitle = section.title.toLowerCase();
    const isSecFill = secTitle.includes('ಬಿಟ್ಟ ಸ್ಥಳ') || secTitle.includes('fill') || secTitle.includes('ಖಾಲಿ ಜಾಗ');
    const hasBlankInText = q.questionText.includes('____') || q.questionText.includes('......') || q.questionText.includes('.....');
    return isSecFill || hasBlankInText;
  };

  // Helper to determine if a question is Letter Writing
  const isLetterQuestion = (q: QuestionItem): boolean => {
    return Boolean(
      q.isLetterWriting ||
      q.questionText.includes('ಪತ್ರ') ||
      q.questionText.includes('letter') ||
      q.questionText.includes('पत्र') ||
      (q.lessonName && (q.lessonName.includes('ಪತ್ರ') || q.lessonName.includes('Letter')))
    );
  };

  // User requirement:
  // "DOTTED LINE: FOR FILL IN THE BLANKS DONT GIVE BELOW THE QUESTIN, GIVE ENOUGH SPACE TO WRITE THERE ONLY,
  // AND FOR 1MARK QUESTION GIVE 1 LINE AND FOR 2 MARKS QUESTION GIVE 2 LINES, AND FOR 4 MARKS QUE GIVE 4LINES"
  // "IF TWO LINES ARE THER THEN THE DIFFERENCE SHOULD BE 0.85CM"
  // "NO 3 MARKS AND 5 MARKS QUESTIONS"
  // "FOR LETTER WRITING GIVE IT ATLAST OF THE QUESTION SO THAT IT GETS A HALFP PAGE TO WRITE LETTER. ( IN LANGUAGE PAPERS ONLY LETTER WRITING)"
  const getLineCount = (section: SectionItem, q: QuestionItem): number => {
    if (answerSpaceType === 'none') return 0;
    if (answerSpaceType === 'box') return 0;

    // FOR FILL IN THE BLANKS DONT GIVE BELOW THE QUESTION!
    if (isFillInTheBlanks(section, q)) {
      return 0;
    }

    // FOR LETTER WRITING GIVE IT A HALF PAGE (14 lines of 0.85cm = 11.9cm)
    if (isLetterQuestion(q)) {
      return 14;
    }

    // 1 mark = 1 line, 2 marks = 2 lines, 4 marks = 4 lines (NO 3 or 5 marks)
    if (q.marks === 1) return 1;
    if (q.marks === 2) return 2;
    if (q.marks >= 4) return 4;
    return 2;
  };

  // Render question text with wide space for blanks in fill in the blanks
  const renderQuestionText = (text: string, isFillBlank: boolean) => {
    if (!isFillBlank) {
      return <span className="text-slate-900 font-medium">{text}</span>;
    }

    // If text has underline or dots, replace with generous writing space
    const blankRegex = /_{3,}|\.{4,}/g;
    if (blankRegex.test(text)) {
      const parts = text.split(blankRegex);
      return (
        <span className="text-slate-900 font-medium inline-block">
          {parts.map((part, pIdx) => (
            <React.Fragment key={pIdx}>
              {part}
              {pIdx < parts.length - 1 && (
                <span
                  className="inline-block border-b-2 border-dotted border-slate-700 min-w-[160px] sm:min-w-[200px] mx-1 text-center align-bottom"
                  title="ಉತ್ತರ ಬರೆಯಲು ಜಾಗ"
                >
                  &nbsp;
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return <span className="text-slate-900 font-medium">{text}</span>;
  };

  return (
    <div className="w-full flex justify-center py-3 sm:py-6 px-1 sm:px-4">
      {/* Outer A4 Canvas Container with id for PDF and Print */}
      <div
        id="a4-paper-canvas"
        className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl relative box-border"
        style={{
          border: '1px solid #2563eb',
          padding: '4px',
        }}
      >
        {/* Inner Golden Border */}
        <div
          className="w-full h-full p-4 sm:p-7 relative box-border"
          style={{
            border: '1px solid #c89b3c',
          }}
        >
          {/* ========================================================= */}
          {/* 1. PAPER HEADER                                           */}
          {/* ========================================================= */}
          <div className="text-center pb-2 mb-3">
            <p className="text-[12px] sm:text-[13px] font-semibold text-[#046c4e] tracking-wider mb-0.5">
              {header.deptName}
            </p>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a3161] my-0.5">
              {header.examTitle}
            </h1>

            {/* School Name: Dotted lines disappear immediately after writing in the space provided! */}
            <div className="mt-2 min-h-[28px] flex items-center justify-center">
              {hasTypedSchoolName ? (
                <h2 className="text-base sm:text-xl font-bold text-slate-950 inline-block tracking-normal">
                  {header.schoolName}
                </h2>
              ) : (
                <span className="text-slate-400 font-light select-none tracking-widest text-sm sm:text-base">
                  ................................................................................................
                </span>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. STUDENT & EXAM PARTICULARS TABLE (ENGLISH NUMBERS)    */}
          {/* Full one line for student name; no division; no "ಪರೀಕ್ಷೆ: SA1" */}
          {/* ========================================================= */}
          <div className="border border-slate-700 border-t-2 border-t-emerald-700 mb-3 text-xs sm:text-[13px] overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                {/* Full one line space to write Student Name */}
                <tr className="border-b border-slate-500">
                  <td colSpan={3} className="p-2 font-medium">
                    <div className="flex items-center w-full">
                      <span className="font-semibold text-slate-900 whitespace-nowrap mr-2">
                        ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು :
                      </span>
                      <span className="flex-grow border-b border-dotted border-slate-500 min-h-[22px] px-2 text-slate-900 font-normal">
                        {header.studentName || ''}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Class (without Division), Subject, Roll Number */}
                <tr className="border-b border-slate-500">
                  <td className="p-1.5 border-r border-slate-500 w-4/12 font-medium">
                    ತರಗತಿ: <span className="font-semibold text-slate-900">{classOnly}</span>
                  </td>
                  <td className="p-1.5 border-r border-slate-500 w-5/12 font-medium">
                    ವಿಷಯ: <span className="font-semibold text-slate-900">{header.subject}</span>
                  </td>
                  <td className="p-1.5 w-3/12 font-medium">
                    ನೋಂದಣಿ ಸಂ. : <span className="font-normal text-slate-800 font-sans">{header.rollNumber || '__________'}</span>
                  </td>
                </tr>

                {/* Date, Time, Max Marks & Marks Obtained */}
                <tr>
                  <td className="p-1.5 border-r border-slate-500 font-medium">
                    ದಿನಾಂಕ : <span className="font-semibold text-slate-900 font-sans">{header.date}</span>
                  </td>
                  <td className="p-1.5 border-r border-slate-500 font-medium">
                    ಸಮಯ : <span className="font-normal text-slate-800 font-sans">{header.time}</span>
                  </td>
                  <td className="p-1.5 font-medium">
                    ಗರಿಷ್ಠ ಅಂಕ : <span className="font-bold text-slate-950 font-sans mr-2">{header.totalMarks}</span>
                    <span className="text-slate-600 font-sans">|</span> ಪಡೆದ ಅಂಕ : <span className="font-bold font-sans">_____</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ========================================================= */}
          {/* 3. GENERAL INSTRUCTIONS (ENGLISH DIGITS 1, 2, 3...)      */}
          {/* ========================================================= */}
          <div
            className="mb-4 p-2 sm:p-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-800"
            style={{
              border: '1px dotted #94a3b8',
              backgroundColor: '#fffdfa',
            }}
          >
            <p className="font-bold text-slate-900 mb-0.5">ಸೂಚನೆಗಳು :</p>
            <p className="leading-snug">
              {instructions.join(' ')}
            </p>
          </div>

          {/* ========================================================= */}
          {/* 4. SECTIONS & QUESTIONS                                  */}
          {/* ========================================================= */}
          <div className="space-y-4">
            {sections.map((section, sIdx) => {
              const isTwoCol = section.layout === 'two-column';

              return (
                <div key={section.id || sIdx} className="avoid-break">
                  {/* Section Header */}
                  <div className="flex items-center justify-between border-l-4 border-l-blue-700 bg-sky-50/70 px-2.5 py-1 mb-2">
                    <span className="font-bold text-sm sm:text-base text-slate-950">
                      {section.roman}. {section.title}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 font-sans">
                      {section.formula}
                    </span>
                  </div>

                  {/* Section Questions */}
                  <div
                    className={
                      isTwoCol
                        ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pl-1 sm:pl-2'
                        : 'space-y-3 pl-1 sm:pl-2'
                    }
                  >
                    {section.questions.map((q) => {
                      const isFillBlank = isFillInTheBlanks(section, q);
                      const lines = getLineCount(section, q);

                      return (
                        <div key={q.id} className="text-xs sm:text-[14px] leading-relaxed group avoid-break">
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-1 flex-grow">
                              <span className="font-bold text-slate-950 min-w-[20px] font-sans">
                                {q.number}.
                              </span>
                              {renderQuestionText(q.questionText, isFillBlank)}
                              {q.lessonName && (
                                <span className="no-print inline-block text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-medium ml-1">
                                  {q.lessonName}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => onSwapQuestion(q, 'fill_blank')}
                              title="ಪ್ರಶ್ನೆ ಬದಲಾಯಿಸಿ"
                              className="no-print p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Revealed Model Answer */}
                          {showAnswers && (
                            <div className="mt-1 ml-5 flex items-center gap-1.5 text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span><strong>ಉತ್ತರ:</strong> {q.answer || 'ಉತ್ತರವನ್ನು ವಿದ್ಯಾರ್ಥಿಯ ವಾಕ್ಯಕ್ಕೆ ನೀಡುವುದು.'}</span>
                            </div>
                          )}

                          {/* DOTTED LINES: 1 line for 1 mark, 2 lines for 2 marks, 4 lines for 4 marks.
                              0.85cm distance between each line. NO lines for fill-in-blanks.
                              HALF PAGE (14 lines = ~12cm) for Letter Writing in Language papers! */}
                          {lines > 0 && !showAnswers && (
                            <div className={`mt-1.5 ${isLetterQuestion(q) ? 'ml-2 sm:ml-4' : 'ml-5'} space-y-0`} aria-label="Answer space dotted lines">
                              {isLetterQuestion(q) && (
                                <div className="mb-1 text-[11px] font-bold text-slate-700 italic flex items-center justify-between border-b border-dotted border-slate-300 pb-0.5">
                                  <span>✍️ ಪತ್ರ ಲೇಖನಕ್ಕೆ ನಿಗದಿತ ಅರ್ಧ ಪುಟದ ಜಾಗ (Space for Letter Writing - Half Page):</span>
                                  <span className="text-[10px] text-slate-500 font-sans">0.85cm ಅಂತರದ ಗೆರೆಗಳು (14 ಸಾಲುಗಳು)</span>
                                </div>
                              )}
                              {Array.from({ length: lines }).map((_, lineIdx) => (
                                <div
                                  key={lineIdx}
                                  style={{
                                    height: '0.85cm',
                                    borderBottom: '1.2px dotted #64748b',
                                    width: '100%',
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Blank Box Space to Type / Write */}
                          {answerSpaceType === 'box' && !showAnswers && !isFillBlank && (
                            <div
                              className={`mt-2 ${isLetterQuestion(q) ? 'ml-2 sm:ml-4' : 'ml-5'} border border-dashed border-slate-400 bg-slate-50/40 rounded p-1.5`}
                              style={{ height: isLetterQuestion(q) ? '12cm' : `${Math.max(48, q.marks * 28)}px` }}
                            >
                              <span className="text-[10px] text-slate-400 italic">
                                {isLetterQuestion(q)
                                  ? '✍️ ಪತ್ರ ಲೇಖನಕ್ಕೆ ನಿಗದಿತ ಜಾಗ (Letter Writing Space - Half Page Box)...'
                                  : 'ಉತ್ತರ ಬರೆಯಲು ಜಾಗ (Answer Box)...'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Insert Section II Match table if this is the first section and match pairs exist */}
                  {sIdx === 0 && matchSection.pairs && matchSection.pairs.length > 0 && (
                    <div className="mt-4 avoid-break">
                      <div className="flex items-center justify-between border-l-4 border-l-blue-700 bg-sky-50/70 px-2.5 py-1 mb-2">
                        <span className="font-bold text-sm sm:text-base text-slate-950">
                          {matchSection.roman}. {matchSection.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-800 font-sans">
                            {matchSection.formula}
                          </span>
                          <button
                            onClick={onShuffleMatch}
                            title="ಹೊಂದಿಸಿ ಬರೆಯಿರಿ ಜೋಡಿಗಳನ್ನು ಬದಲಾಯಿಸಿ"
                            className="no-print text-[11px] bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold flex items-center gap-1 shadow-2xs"
                          >
                            <RotateCw className="w-3 h-3 text-slate-600" />
                            ಬದಲಾಯಿಸಿ
                          </button>
                        </div>
                      </div>

                      {/* Match Table */}
                      <div className="pl-1 sm:pl-2">
                        <div className="max-w-2xl border border-slate-600 text-xs sm:text-[13px]">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-600 font-bold text-slate-900">
                                <th className="p-1.5 border-r border-slate-600 text-center w-1/3">
                                  ಅ ಪಟ್ಟಿ
                                </th>
                                <th className="p-1.5 border-r border-slate-600 text-center w-1/3">
                                  ಆ ಪಟ್ಟಿ
                                </th>
                                <th className="p-1.5 text-center w-1/3">ಉತ್ತರ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matchSection.pairs.map((p, idx) => (
                                <tr key={idx} className="border-b border-slate-400 last:border-none">
                                  <td className="p-1.5 border-r border-slate-600 font-medium">
                                    <span className="font-bold font-sans mr-1">{p.leftNum}</span>
                                    {p.left}
                                  </td>
                                  <td className="p-1.5 border-r border-slate-600 font-medium">
                                    <span className="font-bold font-sans mr-1">{p.rightNum}</span>
                                    {p.right}
                                  </td>
                                  <td className="p-1.5 font-medium">
                                    <span className="font-bold font-sans mr-1">{p.answerNum}</span>
                                    {showAnswers ? (
                                      <span className="text-blue-900 font-bold bg-blue-50 px-1 py-0.5 rounded">
                                        {p.answer}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 select-none">.............</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* 5. FOOTER & WATERMARK                                     */}
          {/* Note: "ಶುಭವಾಗಲಿ / ಶಿಕ್ಷಕರ ಸಹಿ / ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಹಿ"       */}
          {/* have been completely REMOVED as requested!               */}
          {/* Only "SHRI. S R ANGADI 9731 766 727" remains.             */}
          {/* ========================================================= */}
          <div className="mt-8 pt-4 border-t border-slate-400 text-center avoid-break">
            <span className="text-[12px] font-extrabold tracking-widest text-slate-900 uppercase font-sans">
              SHRI. S R ANGADI 9731 766 727
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
