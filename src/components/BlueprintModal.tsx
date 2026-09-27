import React from 'react';
import { PaperState, BLUEPRINT_DATA } from '../data/kannadaPaperData';
import { Printer, X, Grid } from 'lucide-react';

interface BlueprintModalProps {
  paper: PaperState;
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalKnowledge = BLUEPRINT_DATA.reduce((sum, r) => sum + r.knowledge, 0);
  const totalUnderstanding = BLUEPRINT_DATA.reduce((sum, r) => sum + r.understanding, 0);
  const totalApplication = BLUEPRINT_DATA.reduce((sum, r) => sum + r.application, 0);
  const totalSkill = BLUEPRINT_DATA.reduce((sum, r) => sum + r.skill, 0);
  const totalSum = totalKnowledge + totalUnderstanding + totalApplication + totalSkill;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-kannada">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Hidden in print */}
        <div className="bg-[#0f2744] text-white px-6 py-4 flex items-center justify-between flex-shrink-0 no-print">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base sm:text-lg">
              ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ನೀಲಿ ನಕ್ಷೆ (Blue Print)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Printer className="w-4 h-4" />
              ನೀಲಿ ನಕ್ಷೆ ಮುದ್ರಿಸಿ (Print)
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Blueprint Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-white" id="blueprint-sheet">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
              {paper.header.deptName}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 my-1">
              {paper.header.schoolName}
            </h2>
            <div className="inline-block bg-purple-50 border border-purple-300 px-4 py-1 rounded-full my-1">
              <h3 className="text-sm font-bold text-purple-950">
                {paper.header.examTitle} — ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ಅಧಿಕೃತ ನೀಲಿ ನಕ್ಷೆ (BLUE PRINT)
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              ತರಗತಿ: {paper.header.classSection} | ವಿಷಯ: {paper.header.subject} | ಒಟ್ಟು ಅಂಕ: {paper.header.totalMarks}
            </p>
          </div>

          {/* Objectives Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="border border-sky-200 bg-sky-50/60 p-2.5 rounded-lg">
              <p className="text-xs font-semibold text-sky-900">ಜ್ಞಾನ (Knowledge)</p>
              <p className="text-lg font-bold text-sky-950">{totalKnowledge} ಅಂಕ</p>
              <p className="text-[11px] text-slate-500">
                {Math.round((totalKnowledge / totalSum) * 100)}%
              </p>
            </div>
            <div className="border border-emerald-200 bg-emerald-50/60 p-2.5 rounded-lg">
              <p className="text-xs font-semibold text-emerald-900">ತಿಳುವಳಿಕೆ (Understanding)</p>
              <p className="text-lg font-bold text-emerald-950">{totalUnderstanding} ಅಂಕ</p>
              <p className="text-[11px] text-slate-500">
                {Math.round((totalUnderstanding / totalSum) * 100)}%
              </p>
            </div>
            <div className="border border-amber-200 bg-amber-50/60 p-2.5 rounded-lg">
              <p className="text-xs font-semibold text-amber-900">ಅನ್ವಯ (Application)</p>
              <p className="text-lg font-bold text-amber-950">{totalApplication} ಅಂಕ</p>
              <p className="text-[11px] text-slate-500">
                {Math.round((totalApplication / totalSum) * 100)}%
              </p>
            </div>
            <div className="border border-purple-200 bg-purple-50/60 p-2.5 rounded-lg">
              <p className="text-xs font-semibold text-purple-900">ಕೌಶಲ (Skill)</p>
              <p className="text-lg font-bold text-purple-950">{totalSkill} ಅಂಕ</p>
              <p className="text-[11px] text-slate-500">
                {Math.round((totalSkill / totalSum) * 100)}%
              </p>
            </div>
          </div>

          {/* Detailed Matrix Table */}
          <div className="overflow-x-auto border border-slate-700">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-center font-bold">
                  <th className="p-2 border border-slate-700 w-12">ಕ್ರ.ಸಂ</th>
                  <th className="p-2 border border-slate-700 text-left">ಪಾಠದ ಹೆಸರು (ಘಟಕ)</th>
                  <th className="p-2 border border-slate-700 bg-sky-900">ಜ್ಞಾನ (K)</th>
                  <th className="p-2 border border-slate-700 bg-emerald-900">ತಿಳುವಳಿಕೆ (U)</th>
                  <th className="p-2 border border-slate-700 bg-amber-900">ಅನ್ವಯ (A)</th>
                  <th className="p-2 border border-slate-700 bg-purple-900">ಕೌಶಲ (S)</th>
                  <th className="p-2 border border-slate-700 bg-slate-900">ಒಟ್ಟು ಅಂಕ</th>
                </tr>
              </thead>
              <tbody>
                {BLUEPRINT_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-300 hover:bg-slate-50 text-center">
                    <td className="p-2 border border-slate-300 font-bold">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 text-left font-semibold text-slate-900">
                      {row.chapter}
                    </td>
                    <td className="p-2 border border-slate-300 font-mono">{row.knowledge}</td>
                    <td className="p-2 border border-slate-300 font-mono">{row.understanding}</td>
                    <td className="p-2 border border-slate-300 font-mono">{row.application}</td>
                    <td className="p-2 border border-slate-300 font-mono">{row.skill}</td>
                    <td className="p-2 border border-slate-300 font-bold bg-slate-100 font-mono">
                      {row.total}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-slate-200 font-bold text-center text-slate-950 border-t-2 border-slate-800">
                  <td colSpan={2} className="p-2 border border-slate-400 text-right pr-4">
                    ಒಟ್ಟು ಅಂಕಗಳು (Total):
                  </td>
                  <td className="p-2 border border-slate-400 font-mono">{totalKnowledge}</td>
                  <td className="p-2 border border-slate-400 font-mono">{totalUnderstanding}</td>
                  <td className="p-2 border border-slate-400 font-mono">{totalApplication}</td>
                  <td className="p-2 border border-slate-400 font-mono">{totalSkill}</td>
                  <td className="p-2 border border-slate-400 font-mono text-base text-blue-900 bg-slate-300">
                    {totalSum}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer signatures */}
          <div className="pt-8 border-t border-slate-400 flex justify-between text-xs text-slate-700">
            <span>ವಿಷಯ ಶಿಕ್ಷಕರ ಸಹಿ</span>
            <span>ಪರೀಕ್ಷಾ ಸಂಯೋಜಕರ ಸಹಿ</span>
            <span>ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಹಿ & ಮೊಹರು</span>
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
