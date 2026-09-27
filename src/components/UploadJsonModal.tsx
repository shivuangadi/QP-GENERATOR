import React, { useState } from 'react';
import { Upload, Download, FileJson, Check, X, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ALL_CLASSES, ALL_SUBJECTS, ExamType } from '../data/allSubjectsData';
import { QuestionItem } from '../data/kannadaPaperData';

export interface CustomUploadedBank {
  classId: '6th' | '7th' | '8th';
  subjectId: string;
  examType: ExamType;
  questions: QuestionItem[];
  uploadedAt: string;
  filename: string;
}

interface UploadJsonModalProps {
  isOpen: boolean;
  currentClass: '6th' | '7th' | '8th';
  currentSubject: string;
  currentExamType: ExamType;
  useOnlyJsonBank: boolean;
  activeJsonBank: CustomUploadedBank | null;
  onClose: () => void;
  onApplyBank: (bank: CustomUploadedBank | null, useOnlyJson: boolean) => void;
}

export const UploadJsonModal: React.FC<UploadJsonModalProps> = ({
  isOpen,
  currentClass,
  currentSubject,
  currentExamType,
  useOnlyJsonBank,
  activeJsonBank,
  onClose,
  onApplyBank,
}) => {
  if (!isOpen) return null;

  const [targetClass, setTargetClass] = useState<'6th' | '7th' | '8th'>(currentClass);
  const [targetSubject, setTargetSubject] = useState<string>(currentSubject);
  const [targetExam, setTargetExam] = useState<ExamType>(currentExamType);
  const [onlyJsonMode, setOnlyJsonMode] = useState<boolean>(useOnlyJsonBank);

  const [parsedBank, setParsedBank] = useState<CustomUploadedBank | null>(activeJsonBank);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const json = JSON.parse(content);

        let questionsList: QuestionItem[] = [];

        // Support { questions: [...] } or direct array [...]
        if (Array.isArray(json)) {
          questionsList = json;
        } else if (json && Array.isArray(json.questions)) {
          questionsList = json.questions;
        } else {
          throw new Error('JSON format invalid: expected an array of questions or an object with "questions" array.');
        }

        // Validate questions
        const validQuestions: QuestionItem[] = questionsList.map((q: any, idx: number) => ({
          id: q.id || `custom-q-${idx + 1}`,
          number: idx + 1,
          questionText: q.questionText || q.text || q.question || `ಪ್ರಶ್ನೆ ${idx + 1}`,
          lessonName: q.lessonName || q.chapter || q.lesson || 'ಸಾಮಾನ್ಯ',
          marks: Number(q.marks) || 1,
          answer: q.answer || q.modelAnswer || '',
        }));

        if (validQuestions.length === 0) {
          throw new Error('No valid questions found in uploaded JSON file.');
        }

        setParsedBank({
          classId: (json.classId as any) || targetClass,
          subjectId: json.subjectId || targetSubject,
          examType: (json.examType as any) || targetExam,
          questions: validQuestions,
          uploadedAt: new Date().toLocaleTimeString(),
          filename: file.name,
        });
        setOnlyJsonMode(true);
      } catch (err: any) {
        setErrorMsg(err.message || 'ಫೈಲ್ ಪಾರ್ಸ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮಾನ್ಯ JSON ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ.');
      }
    };

    reader.readAsText(file);
  };

  // Download Sample JSON Template
  const handleDownloadSample = () => {
    const sample = {
      classId: targetClass,
      subjectId: targetSubject,
      examType: targetExam,
      description: `Sample Question Bank for ${targetClass} - ${targetSubject}`,
      questions: [
        {
          id: "q1",
          questionText: "‘ನೀ ಹೋದ ಮರುದಿನ’ ಪದ್ಯದ ಕವಿ ಯಾರಾಗಿದ್ದಾರೆ?",
          lessonName: "ನೀ ಹೋದ ಮರುದಿನ",
          marks: 1,
          answer: "ಸಿದ್ಧಲಿಂಗಯ್ಯ"
        },
        {
          id: "q2",
          questionText: "ರಾಜನು ಸಭೆಯನ್ನು ಅಲ್ಲಿಗೇ ಏಕೆ ಪರಿಸಮಾಪ್ತಿಗೊಳಿಸಿದನು?",
          lessonName: "ಗಂಧರ್ವಸೇನ",
          marks: 1,
          answer: "ಒಡ್ಯೋಲಗ ಮುಕ್ತಾಯಗೊಳಿಸಲು"
        },
        {
          id: "q3",
          questionText: "ಸೂರ್ಯನಿಂದ ಮಕ್ಕಳು ಕಲಿಯಬೇಕಾದ ಪ್ರಮುಖ ಜೀವನ ಮೌಲ್ಯವೇನು?",
          lessonName: "ಬೇಸಿಗೆ",
          marks: 2,
          answer: "ಸೂರ್ಯನು ನಿರಂತರವಾಗಿ ಬೆಳಕು ನೀಡುವಂತೆ ನಾವೂ ಸತ್ಕಾರ್ಯಗಳಲ್ಲಿ ತೊಡಗಬೇಕು."
        },
        {
          id: "q4",
          questionText: "ಡಾ. ರಾಜಕುಮಾರ್ ಅವರ ಸರಳತೆ ಮತ್ತು ನಾಡಿನ ಪ್ರೇಮವನ್ನು ವಿವರಿಸಿ.",
          lessonName: "ಡಾ. ರಾಜಕುಮಾರ್",
          marks: 2,
          answer: "ಅವರು ಅಭಿಮಾನಿಗಳನ್ನು ದೇವರು ಎಂದು ಗೌರವಿಸಿ ಕನ್ನಡ ನಾಡು ನುಡಿಗೆ ಅಪಾರ ಕೊಡುಗೆ ನೀಡಿದರು."
        },
        {
          id: "q5",
          questionText: "ಕೃಷ್ಣನು ಸುಧಾಮನ ನಿಸ್ವಾರ್ಥ ಸ್ನೇಹವನ್ನು ಹೇಗೆ ಗೌರವಿಸಿದನು?",
          lessonName: "ಕೃಷ್ಣ-ಸುಧಾಮ",
          marks: 4,
          answer: "ಸುಧಾಮನ ಭಕ್ತಿಯನ್ನು ಮೆಚ್ಚಿ ಅವನ ಬಡ ಗುಡಿಸಲನ್ನು ಭವ್ಯ ಅರಮನೆಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿದನು."
        },
        {
          id: "q6",
          questionText: "ಮೂರು ದಿನಗಳ ರಜೆ ಕೋರಿ ನಿಮ್ಮ ಶಾಲಾ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರಿಗೆ ಪತ್ರ ಬರೆಯಿರಿ.",
          lessonName: "ಪತ್ರ ಲೇಖನ",
          marks: 4,
          answer: "ದಿನಾಂಕ, ಸ್ಥಳ, ಇವರಿಗೆ, ಮಾನ್ಯರೇ, ವಿಷಯ, ಪತ್ರದ ಒಡಲು, ವಂದನೆಗಳೊಂದಿಗೆ, ತಮ್ಮ ವಿಧೇಯ ವಿದ್ಯಾರ್ಥಿ."
        }
      ]
    };

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `question_bank_${targetClass}_${targetSubject}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = () => {
    onApplyBank(parsedBank, onlyJsonMode);
    onClose();
  };

  const handleClear = () => {
    setParsedBank(null);
    setOnlyJsonMode(false);
    onApplyBank(null, false);
  };

  // Group questions by marks for preview
  const qByMarks = (parsedBank?.questions || []).reduce((acc: Record<number, number>, q) => {
    acc[q.marks] = (acc[q.marks] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print font-kannada">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1e40af] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <FileJson className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                JSON ಪ್ರಶ್ನೆ ಕೋಶ ಅಪ್ಲೋಡ್ (Upload JSON Question Bank)
              </h3>
              <p className="text-xs text-blue-200">
                ತರಗತಿ ಮತ್ತು ವಿಷಯವಾರು ಕಸ್ಟಮ್ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ ಬಳಸಿ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Class, Subject, Exam Targeting */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-3">
            <p className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              1. ಪ್ರಶ್ನೆ ಕೋಶದ ಗುರಿ (Target Class, Subject & Exam):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                  ತರಗತಿ (Class):
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-semibold"
                >
                  {ALL_CLASSES.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameKannada} ({cls.nameEnglish})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                  ವಿಷಯ (Subject):
                </label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-semibold"
                >
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nameKannada} [{sub.code}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                  ಪರೀಕ್ಷಾ ಪ್ರಕಾರ (Exam Type):
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value as ExamType)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-semibold"
                >
                  <option value="FA">FA (Formative Assessment)</option>
                  <option value="SA1">SA1 (Summative Assessment 1)</option>
                  <option value="SA2">SA2 (Summative Assessment 2)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload Zone & Download Sample Button */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">
                2. JSON ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (Select JSON File):
              </span>
              <button
                onClick={handleDownloadSample}
                className="bg-blue-50 border border-blue-300 hover:bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ಮಾದರಿ JSON ಡೌನ್‌ಲೋಡ್ (Sample JSON)</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-xl p-5 text-center hover:bg-blue-50/60 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ JSON ಫೈಲ್ ಎಳೆದು ತಂದು ಬಿಡಿ
              </p>
              <p className="text-[11px] text-slate-500 mb-3">
                (ಫೈಲ್ .json ವಿಸ್ತರಣೆ ಹೊಂದಿರಬೇಕು)
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="inline-block text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Uploaded Question Bank Status */}
          {parsedBank && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">
                      {parsedBank.filename}
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      ಒಟ್ಟು {parsedBank.questions.length} ಪ್ರಶ್ನೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಆಗಿವೆ.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  ತೆರವುಗೊಳಿಸಿ
                </button>
              </div>

              {/* Marks breakdown pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                {Object.entries(qByMarks).map(([m, cnt]) => (
                  <span
                    key={m}
                    className="bg-white border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded font-mono font-semibold"
                  >
                    {cnt} Questions × {m}M
                  </span>
                ))}
              </div>

              {/* Strict Toggle: USE ONLY THIS JSON FILE */}
              <label className="flex items-center gap-2.5 p-2.5 bg-white border border-emerald-400 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyJsonMode}
                  onChange={(e) => setOnlyJsonMode(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0 w-4 h-4"
                />
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  ಈ JSON ಫೈಲ್‌ನಲ್ಲಿರುವ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾತ್ರ ಬಳಸಿ (Use ONLY questions from this JSON file)
                </span>
              </label>

              {/* Preview first 3 questions */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto bg-white p-2.5 rounded border border-emerald-200 text-xs">
                <p className="font-semibold text-slate-700 text-[11px] mb-1">
                  ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು (Preview):
                </p>
                {parsedBank.questions.slice(0, 4).map((q, idx) => (
                  <div key={idx} className="flex justify-between gap-2 text-slate-800 border-b pb-1 last:border-none">
                    <span>
                      {idx + 1}. {q.questionText}
                    </span>
                    <span className="font-mono text-emerald-700 flex-shrink-0 font-bold">
                      [{q.marks}M]
                    </span>
                  </div>
                ))}
                {parsedBank.questions.length > 4 && (
                  <p className="text-[10px] text-slate-500 italic">
                    ...ಮತ್ತು ಇನ್ನೂ {parsedBank.questions.length - 4} ಪ್ರಶ್ನೆಗಳು
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-slate-500">
            {parsedBank
              ? `${parsedBank.questions.length} ಪ್ರಶ್ನೆಗಳು ಸಿದ್ಧವಾಗಿವೆ.`
              : 'ಯಾವುದೇ ಫೈಲ್ ಆಯ್ಕೆಯಾಗಿಲ್ಲ.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm"
            >
              ಮುಚ್ಚಿ (Close)
            </button>
            <button
              onClick={handleApply}
              disabled={!parsedBank}
              className={`px-5 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-xs text-xs sm:text-sm ${
                parsedBank
                  ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              ಪ್ರಶ್ನೆ ಕೋಶವನ್ನು ಅನ್ವಯಿಸಿ (Apply)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
