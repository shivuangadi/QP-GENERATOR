import React, { useState } from 'react';
import { PaperState } from '../data/kannadaPaperData';
import { Award, Printer, X, Plus, Trash2, Download } from 'lucide-react';

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  marksObtained: number;
}

interface ResultsModalProps {
  paper: PaperState;
  isOpen: boolean;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalMarks = paper.header.totalMarks || 40;

  const [students, setStudents] = useState<StudentRecord[]>([
    { id: '1', rollNo: '101', name: 'ಅನನ್ಯಾ ಪಾಟೀಲ್', marksObtained: 38 },
    { id: '2', rollNo: '102', name: 'ಚೇತನ್ ಕುಮಾರ್', marksObtained: 34 },
    { id: '3', rollNo: '103', name: 'ದರ್ಶನ್ ಗೌಡ', marksObtained: 29 },
    { id: '4', rollNo: '104', name: 'ಭವಾನಿ ಆರ್', marksObtained: 39 },
    { id: '5', rollNo: '105', name: 'ಮಂಜುನಾಥ್ ಎಸ್', marksObtained: 25 },
    { id: '6', rollNo: '106', name: 'ರೋಹಿತ್ ಶರ್ಮಾ', marksObtained: 31 },
  ]);

  const [newRollNo, setNewRollNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newMarks, setNewMarks] = useState<number>(30);

  const calculateGrade = (marks: number) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return { grade: 'A+', text: 'ಉತ್ಕೃಷ್ಟ (Outstanding)', color: 'text-emerald-700 bg-emerald-100' };
    if (percentage >= 75) return { grade: 'A', text: 'ಉತ್ತಮ (Very Good)', color: 'text-blue-700 bg-blue-100' };
    if (percentage >= 60) return { grade: 'B+', text: 'ಪ್ರಥಮ (First Class)', color: 'text-cyan-700 bg-cyan-100' };
    if (percentage >= 40) return { grade: 'B', text: 'ತೃಪ್ತಿದಾಯಕ (Pass)', color: 'text-amber-700 bg-amber-100' };
    return { grade: 'C', text: 'ಸುಧಾರಣೆ ಅಗತ್ಯ (Needs Improvement)', color: 'text-red-700 bg-red-100' };
  };

  const handleAddStudent = () => {
    if (!newName.trim()) return;
    setStudents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        rollNo: newRollNo.trim() || String(prev.length + 101),
        name: newName.trim(),
        marksObtained: Math.min(totalMarks, Math.max(0, Number(newMarks) || 0)),
      },
    ]);
    setNewName('');
    setNewRollNo('');
    setNewMarks(30);
  };

  const handleRemoveStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateMarks = (id: string, marks: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, marksObtained: Math.min(totalMarks, Math.max(0, marks)) } : s
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const highestMarks = students.length > 0 ? Math.max(...students.map((s) => s.marksObtained)) : 0;
  const avgMarks =
    students.length > 0
      ? (students.reduce((sum, s) => sum + s.marksObtained, 0) / students.length).toFixed(1)
      : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-kannada">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0f2744] text-white px-6 py-4 flex items-center justify-between flex-shrink-0 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base sm:text-lg">
              ವಿದ್ಯಾರ್ಥಿ ಫಲಿತಾಂಶ ಪಟ್ಟಿ (Student Results & Marks Sheet)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Printer className="w-4 h-4" />
              ಫಲಿತಾಂಶ ಮುದ್ರಿಸಿ (Print)
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-900 bg-white" id="results-sheet">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
              {paper.header.deptName}
            </p>
            <h2 className="text-xl font-bold text-slate-950 my-1">
              {paper.header.schoolName}
            </h2>
            <div className="inline-block bg-pink-50 border border-pink-300 px-4 py-0.5 rounded-full my-1">
              <h3 className="text-sm font-bold text-pink-950">
                {paper.header.examTitle} — ವಿದ್ಯಾರ್ಥಿ ಮೌಲ್ಯಾಂಕನ & ಫಲಿತಾಂಶ ಪಟ್ಟಿ
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              ತರಗತಿ: {paper.header.classSection} | ವಿಷಯ: {paper.header.subject} | ಗರಿಷ್ಠ ಅಂಕಗಳು: {totalMarks}
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 text-center no-print">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold">ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳು</p>
              <p className="text-lg font-bold text-slate-900">{students.length}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <p className="text-xs text-emerald-800 font-semibold">ಗರಿಷ್ಠ ಅಂಕ (Highest)</p>
              <p className="text-lg font-bold text-emerald-950">
                {highestMarks} / {totalMarks}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg">
              <p className="text-xs text-blue-800 font-semibold">ತರಗತಿಯ ಸರಾಸರಿ (Average)</p>
              <p className="text-lg font-bold text-blue-950">{avgMarks}</p>
            </div>
          </div>

          {/* Add Student Bar - no-print */}
          <div className="bg-slate-50 border border-slate-300 p-3 rounded-xl flex flex-wrap items-center gap-2 text-xs sm:text-sm no-print">
            <input
              type="text"
              placeholder="ನೋಂದಣಿ ಸಂ. (Roll No)"
              value={newRollNo}
              onChange={(e) => setNewRollNo(e.target.value)}
              className="w-28 border border-slate-300 rounded-md p-1.5 bg-white"
            />
            <input
              type="text"
              placeholder="ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-grow border border-slate-300 rounded-md p-1.5 bg-white"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-600 font-semibold">ಪಡೆದ ಅಂಕ:</span>
              <input
                type="number"
                min={0}
                max={totalMarks}
                value={newMarks}
                onChange={(e) => setNewMarks(Number(e.target.value))}
                className="w-16 border border-slate-300 rounded-md p-1.5 text-center font-bold bg-white"
              />
              <span className="text-xs text-slate-500">/{totalMarks}</span>
            </div>
            <button
              onClick={handleAddStudent}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              ಸೇರಿಸಿ
            </button>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto border border-slate-700">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-center font-bold">
                  <th className="p-2 border border-slate-700 w-12">ಕ್ರ.ಸಂ</th>
                  <th className="p-2 border border-slate-700 w-24">ನೋಂದಣಿ ಸಂ.</th>
                  <th className="p-2 border border-slate-700 text-left">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                  <th className="p-2 border border-slate-700 w-28">ಪಡೆದ ಅಂಕ ({totalMarks})</th>
                  <th className="p-2 border border-slate-700 w-20">ಶೇಕಡಾವಾರು</th>
                  <th className="p-2 border border-slate-700 w-32">ಗ್ರೇಡ್ & ವಿವರ</th>
                  <th className="p-2 border border-slate-700 w-12 no-print">ಕ್ರಿಯೆ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const percentage = Math.round((student.marksObtained / totalMarks) * 100);
                  const { grade, text, color } = calculateGrade(student.marksObtained);
                  return (
                    <tr key={student.id} className="border-b border-slate-300 hover:bg-slate-50 text-center">
                      <td className="p-2 border border-slate-300 font-bold">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-mono">{student.rollNo}</td>
                      <td className="p-2 border border-slate-300 text-left font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="p-2 border border-slate-300">
                        <input
                          type="number"
                          min={0}
                          max={totalMarks}
                          value={student.marksObtained}
                          onChange={(e) => handleUpdateMarks(student.id, Number(e.target.value))}
                          className="w-16 border border-slate-300 rounded p-1 text-center font-bold bg-white text-blue-900 font-mono"
                        />
                      </td>
                      <td className="p-2 border border-slate-300 font-mono font-bold">
                        {percentage}%
                      </td>
                      <td className="p-2 border border-slate-300">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${color}`}>
                          {grade} • {text}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 no-print">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="ಅಳಿಸಿ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-400 flex justify-between text-xs text-slate-700">
            <span>ವಿಷಯ ಶಿಕ್ಷಕರ ಸಹಿ</span>
            <span>ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಹಿ & ಮೊಹರು</span>
          </div>
        </div>

        {/* Modal Footer */}
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
