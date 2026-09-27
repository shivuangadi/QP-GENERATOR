import React from 'react';
import { PaperState } from '../data/kannadaPaperData';
import { ExamType } from '../data/allSubjectsData';
import { calculateBlueprintForPaper } from '../services/blueprintService';
import { Grid, Printer, Trash2, Download } from 'lucide-react';

interface BlueprintViewProps {
  paper: PaperState;
  classId?: '6th' | '7th' | '8th';
  subjectId?: string;
  examType?: ExamType;
  selectedChapters?: string[];
  onRemove?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  paper,
  classId,
  subjectId,
  examType,
  selectedChapters,
  onRemove,
  onPrint,
  onDownload,
}) => {
  const { header } = paper;

  // Dynamically calculate blueprint fetching exact classwise and subjectwise chapters
  const bp = calculateBlueprintForPaper(paper, classId, subjectId, examType, selectedChapters);

  const {
    rows,
    totalKnowledge,
    totalUnderstanding,
    totalApplication,
    totalSkill,
    grandTotal,
    count1M,
    count2M,
    count4M,
  } = bp;

  return (
    <div
      id="blueprint-canvas"
      className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl relative box-border mt-8 page-break-before"
      style={{
        border: '1px solid #1e40af',
        padding: '4px',
      }}
    >
      {/* On-Screen Action Banner (Hidden in Print) */}
      <div className="no-print bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-2.5 sm:px-4 rounded-t flex flex-wrap items-center justify-between gap-2 shadow-sm border-b border-purple-700">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-purple-300" />
          <span className="font-bold text-sm sm:text-base text-amber-200">
            ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ಅಧಿಕೃತ ನೀಲಿ ನಕ್ಷೆ (BLUE PRINT)
          </span>
          <span className="bg-purple-700/80 text-[11px] px-2 py-0.5 rounded font-sans font-semibold border border-purple-400/40">
            {bp.classKannada} - {bp.subjectKannada}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors shadow-xs"
              title="PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (Download PDF)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF ಡೌನ್‌ಲೋಡ್</span>
            </button>
          )}
          {onPrint && (
            <button
              onClick={onPrint}
              className="bg-purple-400 hover:bg-purple-300 text-slate-950 font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs"
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
              title="ನೀಲಿ ನಕ್ಷೆಯನ್ನು ಮರೆಮಾಡಿ (Hide Blueprint)"
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
        {/* 1. DOCUMENT HEADER                                        */}
        {/* ========================================================= */}
        <div className="text-center pb-2 mb-3 border-b-2 border-purple-900">
          <p className="text-[12px] sm:text-[13px] font-semibold text-[#046c4e] tracking-wider mb-0.5">
            {header.deptName}
          </p>

          <h2 className="text-base sm:text-xl font-bold text-slate-950 my-0.5">
            {header.schoolName}
          </h2>

          <div className="inline-block bg-purple-50 border border-purple-400 px-4 py-0.5 rounded-full my-1 shadow-2xs">
            <h1 className="text-sm sm:text-base font-extrabold text-purple-950">
              {header.examTitle} — ಅಧಿಕೃತ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ನೀಲಿ ನಕ್ಷೆ (OFFICIAL BLUE PRINT)
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs sm:text-[13px] text-slate-700 mt-2 px-2 border-t border-slate-300 pt-1">
            <span><strong>ತರಗತಿ:</strong> {header.classSection || bp.classKannada}</span>
            <span><strong>ವಿಷಯ:</strong> {header.subject || bp.subjectKannada}</span>
            <span><strong>ಪರೀಕ್ಷೆ:</strong> {bp.examType}</span>
            <span><strong>ಒಟ್ಟು ಅಂಕಗಳು:</strong> {grandTotal}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. OBJECTIVES SUMMARY CARDS                               */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-center avoid-break">
          <div className="border border-sky-300 bg-sky-50/70 p-2 rounded shadow-2xs">
            <p className="text-xs font-bold text-sky-950">ಜ್ಞಾನ (Knowledge)</p>
            <p className="text-base sm:text-lg font-black text-sky-900">{totalKnowledge} ಅಂಕ</p>
            <p className="text-[10px] text-slate-600 font-semibold font-mono">
              {Math.round((totalKnowledge / (grandTotal || 1)) * 100)}%
            </p>
          </div>
          <div className="border border-emerald-300 bg-emerald-50/70 p-2 rounded shadow-2xs">
            <p className="text-xs font-bold text-emerald-950">ತಿಳುವಳಿಕೆ (Understanding)</p>
            <p className="text-base sm:text-lg font-black text-emerald-900">{totalUnderstanding} ಅಂಕ</p>
            <p className="text-[10px] text-slate-600 font-semibold font-mono">
              {Math.round((totalUnderstanding / (grandTotal || 1)) * 100)}%
            </p>
          </div>
          <div className="border border-amber-300 bg-amber-50/70 p-2 rounded shadow-2xs">
            <p className="text-xs font-bold text-amber-950">ಅನ್ವಯ (Application)</p>
            <p className="text-base sm:text-lg font-black text-amber-900">{totalApplication} ಅಂಕ</p>
            <p className="text-[10px] text-slate-600 font-semibold font-mono">
              {Math.round((totalApplication / (grandTotal || 1)) * 100)}%
            </p>
          </div>
          <div className="border border-purple-300 bg-purple-50/70 p-2 rounded shadow-2xs">
            <p className="text-xs font-bold text-purple-950">ಕೌಶಲ (Skill / Drawing)</p>
            <p className="text-base sm:text-lg font-black text-purple-900">{totalSkill} ಅಂಕ</p>
            <p className="text-[10px] text-slate-600 font-semibold font-mono">
              {Math.round((totalSkill / (grandTotal || 1)) * 100)}%
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. DETAILED BLUEPRINT MATRIX TABLE (CLASSWISE & SUBJECT)  */}
        {/* ========================================================= */}
        <div className="overflow-x-auto border border-slate-700 rounded mb-4 avoid-break">
          <table className="w-full text-xs sm:text-[13px] text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-900 text-white text-center font-bold">
                <th className="p-1.5 border border-slate-700 w-10">ಕ್ರ.ಸಂ</th>
                <th className="p-1.5 border border-slate-700 text-left">ಪಾಠದ ಹೆಸರು / ಘಟಕ (Chapters)</th>
                <th className="p-1.5 border border-slate-700 bg-sky-900 text-sky-100">ಜ್ಞಾನ (K)</th>
                <th className="p-1.5 border border-slate-700 bg-emerald-900 text-emerald-100">ತಿಳುವಳಿಕೆ (U)</th>
                <th className="p-1.5 border border-slate-700 bg-amber-900 text-amber-100">ಅನ್ವಯ (A)</th>
                <th className="p-1.5 border border-slate-700 bg-purple-900 text-purple-100">ಕೌಶಲ (S)</th>
                <th className="p-1.5 border border-slate-700 bg-slate-950 font-bold">ಒಟ್ಟು ಅಂಕ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-300 hover:bg-slate-50 text-center">
                  <td className="p-1.5 border border-slate-300 font-bold">{idx + 1}</td>
                  <td className="p-1.5 border border-slate-300 text-left font-semibold text-slate-900">
                    {row.chapter}
                  </td>
                  <td className="p-1.5 border border-slate-300 font-mono text-slate-800">{row.knowledge}</td>
                  <td className="p-1.5 border border-slate-300 font-mono text-slate-800">{row.understanding}</td>
                  <td className="p-1.5 border border-slate-300 font-mono text-slate-800">{row.application}</td>
                  <td className="p-1.5 border border-slate-300 font-mono text-slate-800">{row.skill}</td>
                  <td className="p-1.5 border border-slate-300 font-bold bg-slate-100 font-mono text-slate-950">
                    {row.total}
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-slate-200 font-black text-center text-slate-950 border-t-2 border-slate-800">
                <td colSpan={2} className="p-2 border border-slate-400 text-right pr-4">
                  ಒಟ್ಟು ಅಂಕಗಳು (Grand Total):
                </td>
                <td className="p-2 border border-slate-400 font-mono">{totalKnowledge}</td>
                <td className="p-2 border border-slate-400 font-mono">{totalUnderstanding}</td>
                <td className="p-2 border border-slate-400 font-mono">{totalApplication}</td>
                <td className="p-2 border border-slate-400 font-mono">{totalSkill}</td>
                <td className="p-2 border border-slate-400 font-mono text-base text-blue-950 bg-amber-200 font-black">
                  {grandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* 4. QUESTION TYPE & WEIGHTAGE SUMMARY                     */}
        {/* ========================================================= */}
        <div className="border border-slate-400 rounded p-2.5 bg-slate-50 mb-4 avoid-break text-xs">
          <h4 className="font-bold text-slate-900 mb-1.5">ಪ್ರಶ್ನೆಗಳ ವಿಧ ಮತ್ತು ಅಂಕ ಹಂಚಿಕೆ (Question Weightage):</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-1.5 border rounded">
              <span className="text-slate-600 block">1 ಅಂಕದ ಪ್ರಶ್ನೆಗಳು</span>
              <span className="font-bold text-slate-900">{count1M} ಪ್ರಶ್ನೆಗಳು = {count1M * 1} ಅಂಕ</span>
            </div>
            <div className="bg-white p-1.5 border rounded">
              <span className="text-slate-600 block">2 ಅಂಕಗಳ ಪ್ರಶ್ನೆಗಳು</span>
              <span className="font-bold text-slate-900">{count2M} ಪ್ರಶ್ನೆಗಳು = {count2M * 2} ಅಂಕ</span>
            </div>
            <div className="bg-white p-1.5 border rounded">
              <span className="text-slate-600 block">4 ಅಂಕಗಳ ಪ್ರಶ್ನೆಗಳು / ಕೌಶಲ</span>
              <span className="font-bold text-slate-900">{count4M} ಪ್ರಶ್ನೆಗಳು = {count4M * 4} ಅಂಕ</span>
            </div>
            <div className="bg-blue-50 p-1.5 border border-blue-300 rounded font-bold text-blue-950">
              <span className="block">ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು & ಅಂಕ</span>
              <span>{count1M + count2M + count4M} ಪ್ರಶ್ನೆಗಳು = {grandTotal} ಅಂಕ</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. SIGNATURE FOOTER                                       */}
        {/* ========================================================= */}
        <div className="pt-6 mt-6 border-t-2 border-slate-400 flex flex-wrap justify-between items-center text-xs text-slate-700 avoid-break font-medium">
          <div>
            <p>ವಿಷಯ ಶಿಕ್ಷಕರ ಸಹಿ : __________________</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಸಿದ್ಧಪಡಿಸಿದವರು)</p>
          </div>
          <div>
            <p>ಪರೀಕ್ಷಾ ಸಂಯೋಜಕರ ಸಹಿ : __________________</p>
            <p className="text-[10px] text-slate-500 mt-0.5">(ಪರೀಕ್ಷಾ ಉಸ್ತುವಾರಿ)</p>
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
