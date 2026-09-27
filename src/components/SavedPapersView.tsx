import React, { useState } from 'react';
import {
  Archive,
  Eye,
  Copy,
  Printer,
  Trash2,
  Calendar,
  Award,
  BookOpen,
  Search,
  CheckCircle,
} from 'lucide-react';
import { deletePaper, duplicatePaper, getSavedPapers } from '../services/storage';
import { QuestionPaper } from '../types';
import { toKannadaDigits } from '../data/syllabus';

interface SavedPapersViewProps {
  onOpenPaper: (paper: QuestionPaper) => void;
  onPrintPaper: (paper: QuestionPaper) => void;
}

export const SavedPapersView: React.FC<SavedPapersViewProps> = ({
  onOpenPaper,
  onPrintPaper,
}) => {
  const [papers, setPapers] = useState<QuestionPaper[]>(() => getSavedPapers());
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPapers = papers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.paperName.toLowerCase().includes(q) ||
      p.classId.toLowerCase().includes(q) ||
      p.subjectId.toLowerCase().includes(q) ||
      p.examId.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`‘${name}’ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯನ್ನು ಖಚಿತವಾಗಿ ಅಳಿಸಲು ಬಯಸುವಿರಾ?`)) {
      deletePaper(id);
      setPapers(getSavedPapers());
      showToast('ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯನ್ನು ಅಳಿಸಲಾಗಿದೆ.');
    }
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicatePaper(id);
    if (copy) {
      setPapers(getSavedPapers());
      showToast('ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯನ್ನು ನಕಲಿಸಲಾಗಿದೆ (Duplicated).');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Archive className="w-6 h-6 text-amber-600" />
            <span>ಉಳಿಸಿದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು (Saved Papers History)</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredPapers.length} ಪತ್ರಿಕೆಗಳು
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ನೀವು ಸಿದ್ಧಪಡಿಸಿ ಉಳಿಸಿದ ಎಲ್ಲಾ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಇಲ್ಲಿ ವೀಕ್ಷಿಸಿ, ತಿದ್ದಿ, ನಕಲು ಮಾಡಿ ಅಥವಾ ಮರು ಮುದ್ರಿಸಿ
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ಪತ್ರಿಕೆಯ ಹೆಸರನ್ನು ಹುಡುಕಿ..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-kannada"
          />
        </div>
      </div>

      {/* Grid of Saved Papers */}
      {filteredPapers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-base">ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಉಳಿಸಿಲ್ಲ.</p>
          <p className="text-xs text-slate-400 mt-1">
            ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚಿಸಿ, ‘ಉಳಿಸಿ (Save)’ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => {
            const totalQ = paper.sections.reduce(
              (sum, s) => sum + s.questions.length,
              0
            );

            return (
              <div
                key={paper.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{paper.date || paper.headerInfo.date}</span>
                    </span>
                    <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded">
                      {paper.examId}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base font-kannada line-clamp-2">
                    {paper.paperName}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {paper.classId === '6th' ? '೬ನೇ ತರಗತಿ' : '೭ನೇ ತರಗತಿ'}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {paper.subjectId}
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                      {toKannadaDigits(paper.totalMarks)} ಅಂಕಗಳು
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {totalQ} ಪ್ರಶ್ನೆಗಳು
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onOpenPaper(paper)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 shadow-2xs"
                      title="ತೆರೆಯಿರಿ & ಸಂಪಾದಿಸಿ"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ತೆರೆಯಿರಿ</span>
                    </button>
                    <button
                      onClick={() => onPrintPaper(paper)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1"
                      title="ಮುದ್ರಿಸಿ"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>ಮುದ್ರಿಸಿ</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDuplicate(paper.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                      title="ನಕಲಿಸಿ (Duplicate)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(paper.id, paper.paperName)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                      title="ಅಳಿಸಿ (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
