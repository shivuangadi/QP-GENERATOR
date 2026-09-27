import React, { useState, useEffect } from 'react';
import {
  PaperState,
  INITIAL_40_MARKS_PAPER,
  MATCH_POOLS,
  QuestionItem,
  KANNADA_LESSONS,
} from './data/kannadaPaperData';
import {
  ALL_SUBJECTS,
  ALL_CLASSES,
  ExamType,
  getLessonsForExam,
} from './data/allSubjectsData';
import {
  generateCustomPaper,
  AnswerSpaceOption,
} from './services/smartPaperGenerator';
import { printPaperSafely } from './services/pdfExport';
import { KannadaPaperPreview } from './components/KannadaPaperPreview';
import { AnswerSheetView } from './components/AnswerSheetView';
import { BlueprintView } from './components/BlueprintView';
import { SwapQuestionModal } from './components/SwapQuestionModal';
import { EditQuestionModal } from './components/EditQuestionModal';
import { AnswerKeyModal } from './components/AnswerKeyModal';
import { BlueprintModal } from './components/BlueprintModal';
import { ResultsModal } from './components/ResultsModal';
import {
  UploadJsonModal,
  CustomUploadedBank,
} from './components/UploadJsonModal';
import {
  RotateCw,
  Edit3,
  FileCheck2,
  Printer,
  Grid,
  Star,
  RotateCcw,
  Calendar,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlignJustify,
  FileJson,
  Hash,
  Download,
  CheckSquare,
  Square,
} from 'lucide-react';

export default function App() {
  // Config state
  const [selectedClass, setSelectedClass] = useState<'6th' | '7th' | '8th'>('6th');
  const [selectedSubject, setSelectedSubject] = useState<string>('kannada');
  const [examType, setExamType] = useState<ExamType>('SA1');
  const [activeMarks, setActiveMarks] = useState<number>(40);
  const [questionCount, setQuestionCount] = useState<number>(26);
  const [answerSpace, setAnswerSpace] = useState<AnswerSpaceOption>('dotted_2');
  const [dateValue, setDateValue] = useState<string>('2026-09-05');
  const [schoolName, setSchoolName] = useState<string>('ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ');
  const [studentName, setStudentName] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<string>('');

  // Selected Chapters state (Checkboxes)
  const [selectedChapters, setSelectedChapters] = useState<string[]>(() =>
    KANNADA_LESSONS.map((l) => l.name)
  );

  // Canvas Inclusion States: Answer Sheet and Blueprint
  const [showAnswerSheet, setShowAnswerSheet] = useState<boolean>(false);
  const [showBlueprint, setShowBlueprint] = useState<boolean>(false);

  // Custom JSON Question Bank
  const [customBank, setCustomBank] = useState<CustomUploadedBank | null>(null);
  const [useOnlyJsonBank, setUseOnlyJsonBank] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);

  // Paper state
  const [paper, setPaper] = useState<PaperState>(() =>
    JSON.parse(JSON.stringify(INITIAL_40_MARKS_PAPER))
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [matchPoolIndex, setMatchPoolIndex] = useState(0);

  // Modals state
  const [swapModal, setSwapModal] = useState<{
    isOpen: boolean;
    question: QuestionItem | null;
    sectionType: any;
  }>({
    isOpen: false,
    question: null,
    sectionType: 'fill_blank',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnswerKeyOpen, setIsAnswerKeyOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Convert HTML date (YYYY-MM-DD) to Indian format (DD-MM-YYYY) with English digits
  const formatIndianDate = (d: string) => {
    if (!d) return '05-09-2026';
    const parts = d.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return d;
  };

  // Lessons available for current subject/class/exam
  const currentLessons = getLessonsForExam(selectedSubject, selectedClass, examType);
  const currentClassLabel = ALL_CLASSES.find((c) => c.id === selectedClass)?.nameKannada;
  const currentSubjectObj = ALL_SUBJECTS.find((s) => s.id === selectedSubject);
  const partNumberText = examType === 'SA2' ? 'ಭಾಗ-2 (Part 2)' : 'ಭಾಗ-1 (Part 1)';

  // Helper to re-generate paper when key parameters change
  const rebuildPaper = (
    newMarks = activeMarks,
    newCount = questionCount,
    newClass = selectedClass,
    newSubject = selectedSubject,
    newExam = examType,
    newSpace = answerSpace,
    newSchool = schoolName,
    newDate = dateValue,
    cBank = customBank,
    onlyJson = useOnlyJsonBank,
    chapters = selectedChapters
  ) => {
    const formattedDate = formatIndianDate(newDate);

    // If Kannada default 40 marks and all chapters selected and no custom json bank
    if (
      newSubject === 'kannada' &&
      newCount === 26 &&
      newMarks === 40 &&
      newExam === 'SA1' &&
      (!onlyJson || !cBank) &&
      chapters.length >= 8
    ) {
      const p = JSON.parse(JSON.stringify(INITIAL_40_MARKS_PAPER)) as PaperState;
      p.header.schoolName = newSchool;
      p.header.classSection = ALL_CLASSES.find((c) => c.id === newClass)?.nameKannada || '6ನೇ ತರಗತಿ';
      p.header.subTitle = '';
      p.header.date = formattedDate;
      p.header.academicYear = '2026-27';
      p.header.time = '2 ಗಂಟೆ';
      p.header.studentName = studentName;
      p.header.rollNumber = rollNumber;
      setPaper(p);
      return;
    }

    const generated = generateCustomPaper({
      classId: newClass,
      subjectId: newSubject,
      examType: newExam,
      totalMarks: newMarks,
      questionCount: newCount,
      answerSpace: newSpace,
      date: formattedDate,
      schoolName: newSchool,
      studentName,
      rollNumber,
      customBank: cBank,
      useOnlyCustomBank: onlyJson,
      selectedLessons: chapters,
    });

    setPaper(generated);
  };

  // Sync chapters when subject or class or exam changes
  const updateAvailableChapters = (newSub: string, newCls: '6th' | '7th' | '8th', newEx: ExamType) => {
    const lessons = getLessonsForExam(newSub, newCls, newEx);
    const lessonNames = lessons.map((l) => l.name);
    setSelectedChapters(lessonNames);
    return lessonNames;
  };

  // When class changes
  const handleClassChange = (newClass: '6th' | '7th' | '8th') => {
    setSelectedClass(newClass);
    const newChaps = updateAvailableChapters(selectedSubject, newClass, examType);
    rebuildPaper(activeMarks, questionCount, newClass, selectedSubject, examType, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, newChaps);
    showToast(`${ALL_CLASSES.find((c) => c.id === newClass)?.nameKannada} ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ`);
  };

  // When subject changes
  const handleSubjectChange = (newSubId: string) => {
    setSelectedSubject(newSubId);
    const subInfo = ALL_SUBJECTS.find((s) => s.id === newSubId);
    const newChaps = updateAvailableChapters(newSubId, selectedClass, examType);
    rebuildPaper(activeMarks, questionCount, selectedClass, newSubId, examType, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, newChaps);
    showToast(`${subInfo?.nameKannada || newSubId} ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ`);
  };

  // Exam Type change (FA, SA1, SA2)
  const handleExamTypeChange = (newExam: ExamType) => {
    setExamType(newExam);
    const newChaps = updateAvailableChapters(selectedSubject, selectedClass, newExam);
    rebuildPaper(activeMarks, questionCount, selectedClass, selectedSubject, newExam, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, newChaps);
    const partNum = newExam === 'SA2' ? 'ಭಾಗ-2' : 'ಭಾಗ-1';
    showToast(`${newExam} ಪರೀಕ್ಷೆ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ (${partNum})`);
  };

  // Handle Marks Change (Typed custom marks or quick buttons)
  const handleMarksChange = (marks: number) => {
    const validMarks = Math.max(5, Math.min(200, marks));
    setActiveMarks(validMarks);
    let newCount = questionCount;
    if (validMarks === 30) newCount = 20;
    else if (validMarks === 40) newCount = 26;
    else if (validMarks === 50) newCount = 31;
    setQuestionCount(newCount);
    rebuildPaper(validMarks, newCount);
    showToast(`${validMarks} ಅಂಕಗಳಿಗೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ (${newCount} ಪ್ರಶ್ನೆಗಳು)`);
  };

  // Handle Question Count Change (typed or quick buttons)
  const handleQuestionCountChange = (count: number) => {
    const validCount = Math.max(2, Math.min(60, count));
    setQuestionCount(validCount);
    rebuildPaper(activeMarks, validCount);
    showToast(`${validCount} ಪ್ರಶ್ನೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ (${activeMarks} ಅಂಕಕ್ಕೆ ಸಮತೋಲನಗೊಳಿಸಲಾಗಿದೆ)`);
  };

  // Handle Chapter Checkbox Toggle
  const handleToggleChapter = (chapterName: string) => {
    let updated: string[];
    if (selectedChapters.includes(chapterName)) {
      if (selectedChapters.length <= 1) {
        showToast('ಕನಿಷ್ಠ ಒಂದು ಪಾಠವನ್ನು ಆಯ್ಕೆ ಮಾಡಿರಬೇಕು!');
        return;
      }
      updated = selectedChapters.filter((c) => c !== chapterName);
    } else {
      updated = [...selectedChapters, chapterName];
    }
    setSelectedChapters(updated);
    rebuildPaper(activeMarks, questionCount, selectedClass, selectedSubject, examType, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, updated);
    showToast(`ಪಾಠಗಳ ಆಯ್ಕೆ ನವೀಕರಿಸಲಾಗಿದೆ (${updated.length} ಆಯ್ಕೆಯಾಗಿದೆ)`);
  };

  // Select all chapters
  const handleSelectAllChapters = () => {
    const allNames = currentLessons.map((l) => l.name);
    setSelectedChapters(allNames);
    rebuildPaper(activeMarks, questionCount, selectedClass, selectedSubject, examType, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, allNames);
    showToast('ಎಲ್ಲಾ ಪಾಠಗಳನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ');
  };

  // Deselect all chapters (keeps at least 1)
  const handleDeselectAllChapters = () => {
    if (currentLessons.length === 0) return;
    const firstOnly = [currentLessons[0].name];
    setSelectedChapters(firstOnly);
    rebuildPaper(activeMarks, questionCount, selectedClass, selectedSubject, examType, answerSpace, schoolName, dateValue, customBank, useOnlyJsonBank, firstOnly);
    showToast(`ಮೊದಲ ಪಾಠವನ್ನು ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ (${firstOnly[0]})`);
  };

  // Handle Answer Space Change
  const handleAnswerSpaceChange = (space: AnswerSpaceOption) => {
    setAnswerSpace(space);
    showToast(
      space === 'none'
        ? 'ಉತ್ತರ ಬರೆಯುವ ಜಾಗವನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ'
        : 'ಉತ್ತರ ಬರೆಯಲು ಜಾಗವನ್ನು ಸೇರಿಸಲಾಗಿದೆ'
    );
  };

  // Date Change
  const handleDateChange = (newDate: string) => {
    setDateValue(newDate);
    const formatted = formatIndianDate(newDate);
    setPaper((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        date: formatted,
      },
    }));
  };

  // School name change (removes dotted lines immediately)
  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    setPaper((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        schoolName: val,
      },
    }));
  };

  // Reshuffle questions
  const handleReshuffleQuestions = () => {
    rebuildPaper();
    showToast('ಪ್ರಶ್ನೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ!');
  };

  // Shuffle Match Section
  const handleShuffleMatch = () => {
    const nextIdx = (matchPoolIndex + 1) % MATCH_POOLS.length;
    setMatchPoolIndex(nextIdx);
    setPaper((prev) => ({
      ...prev,
      matchSection: {
        ...prev.matchSection,
        pairs: MATCH_POOLS[nextIdx],
      },
    }));
    showToast('ಹೊಂದಿಸಿ ಬರೆಯಿರಿ ಜೋಡಿಗಳನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ');
  };

  // Reset to default
  const handleReset = () => {
    setSelectedClass('6th');
    setSelectedSubject('kannada');
    setExamType('SA1');
    setActiveMarks(40);
    setQuestionCount(26);
    setAnswerSpace('dotted_2');
    setDateValue('2026-09-05');
    setSchoolName('ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ');
    setStudentName('');
    setRollNumber('');
    setCustomBank(null);
    setUseOnlyJsonBank(false);
    setShowAnswerSheet(false);
    setShowBlueprint(false);
    const defaultChaps = KANNADA_LESSONS.map((l) => l.name);
    setSelectedChapters(defaultChaps);
    setPaper(JSON.parse(JSON.stringify(INITIAL_40_MARKS_PAPER)));
    showToast('ಪತ್ರಿಕೆಯನ್ನು ಮೂಲ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಲಾಗಿದೆ');
  };

  // Apply uploaded JSON Question Bank
  const handleApplyJsonBank = (bank: CustomUploadedBank | null, useOnly: boolean) => {
    setCustomBank(bank);
    setUseOnlyJsonBank(useOnly);
    if (bank) {
      setSelectedClass(bank.classId);
      setSelectedSubject(bank.subjectId);
      setExamType(bank.examType);
      rebuildPaper(activeMarks, questionCount, bank.classId, bank.subjectId, bank.examType, answerSpace, schoolName, dateValue, bank, useOnly);
      showToast(`JSON ಕೋಶದಿಂದ ${bank.questions.length} ಪ್ರಶ್ನೆಗಳನ್ನು ಅನ್ವಯಿಸಲಾಗಿದೆ!`);
    } else {
      rebuildPaper(activeMarks, questionCount, selectedClass, selectedSubject, examType, answerSpace, schoolName, dateValue, null, false);
      showToast('ಪ್ರಶ್ನೆ ಕೋಶವನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ.');
    }
  };

  // Toggle Answers
  const handleToggleAnswers = () => {
    setPaper((prev) => ({
      ...prev,
      showAnswers: !prev.showAnswers,
    }));
    showToast(
      !paper.showAnswers
        ? 'ಮಾದರಿ ಉತ್ತರಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ'
        : 'ಮಾದರಿ ಉತ್ತರಗಳನ್ನು ಮರೆಮಾಡಲಾಗಿದೆ'
    );
  };

  // Print paper directly in the SAME window
  const handlePrintPaper = () => {
    printPaperSafely('a4-paper-canvas');
  };

  // User requirement:
  // "WHEN I CLICK ON PRINT ANSWER SHEET IT SHOULD COME BELOW THE MAIN QUESTION PAPER"
  // "WHEN CLICKED IT SHOULD SHOW THE PRINT PREVIEW (NOT IN ANOTHER WINDOW BUT IN SAME WINDOW)"
  const handlePrintAnswerSheet = () => {
    setShowAnswerSheet(true);
    showToast('ಮಾದರಿ ಉತ್ತರ ಪತ್ರಿಕೆಯನ್ನು ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ಕೆಳಗೆ ಸೇರಿಸಲಾಗಿದೆ!');
    setTimeout(() => {
      const el = document.getElementById('answer-sheet-canvas');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        printPaperSafely();
      }, 300);
    }, 120);
  };

  // User requirement:
  // "WHEN BLUE PRINT IS SELECTED BOTH QUE PAPER AND ANSWER PAPER ALONG WITH BLUE PRINT IS TO BE PRINTED"
  // "WHEN CLICKED IT SHOULD SHOW THE PRINT PREVIEW (NOT IN ANOTHER WINDOW BUT IN SAME WINDOW)"
  const handlePrintBlueprint = () => {
    setShowBlueprint(true);
    setShowAnswerSheet(true);
    showToast('ನೀಲಿ ನಕ್ಷೆ & ಉತ್ತರ ಪತ್ರಿಕೆ ಎರಡನ್ನೂ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯೊಂದಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!');
    setTimeout(() => {
      const el = document.getElementById('blueprint-canvas');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        printPaperSafely();
      }, 300);
    }, 120);
  };

  // Swap individual question
  const openSwapModal = (question: QuestionItem, sectionType: any) => {
    setSwapModal({
      isOpen: true,
      question,
      sectionType,
    });
  };

  const handleApplySwappedQuestion = (newQuestion: QuestionItem) => {
    setPaper((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => ({
        ...sec,
        questions: sec.questions.map((q) =>
          q.id === newQuestion.id ? newQuestion : q
        ),
      })),
    }));
    showToast(`ಪ್ರಶ್ನೆ ${newQuestion.number} ಅನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ!`);
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex flex-col font-kannada text-slate-900 selection:bg-blue-200">
      {/* ========================================================= */}
      {/* 1. TOP HEADER & TOOLBAR (ROYAL BLUE BACKGROUND)           */}
      {/* ========================================================= */}
      <header className="bg-[#1e40af] text-white px-3 sm:px-6 pt-3.5 pb-4 shadow-xl border-b border-blue-900 no-print">
        <div className="max-w-7xl mx-auto space-y-3.5">
          {/* Logo & Main Title Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Circular Exam Badge (FA / SA1 / SA2) with double gold rings */}
              <div className="relative flex-shrink-0">
                <div className="w-13 h-13 rounded-full border-2 border-[#facc15] p-0.5 flex items-center justify-center shadow-lg bg-[#1e3a8a]">
                  <div className="w-full h-full rounded-full border border-[#fef08a] flex items-center justify-center bg-[#172554]">
                    <span className="font-extrabold text-amber-300 text-base tracking-wider font-sans">
                      {examType}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-300 uppercase font-sans">
                    QP GENERATOR BY S R ANGADI
                  </h1>
                  <span className="bg-amber-400/20 text-amber-200 border border-amber-300/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider font-sans">
                    Karnataka 2026-27
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* SPACE TO CUSTOMISE MARKS */}
              <div className="flex items-center gap-1.5 bg-[#172554] border border-blue-400/80 px-2 py-1 rounded shadow-inner">
                <span className="text-amber-300 font-bold text-xs">ಅಂಕಗಳು (Marks):</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={activeMarks}
                  onChange={(e) => handleMarksChange(Number(e.target.value) || 40)}
                  className="w-14 text-center font-black text-slate-900 bg-white rounded px-1.5 py-0.5 text-xs font-sans focus:outline-blue-500 shadow-inner"
                  title="ಅಂಕಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ (Type Custom Marks)"
                />
              </div>

              {/* 30 Marks Quick Button */}
              <button
                onClick={() => handleMarksChange(30)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold font-sans transition-all shadow-xs ${
                  activeMarks === 30
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                30
              </button>

              {/* 40 Marks Quick Button */}
              <button
                onClick={() => handleMarksChange(40)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold font-sans transition-all shadow-xs ${
                  activeMarks === 40
                    ? 'bg-[#ea580c] text-white ring-2 ring-amber-300 font-extrabold shadow-md scale-105'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                40
              </button>

              {/* 50 Marks Quick Button */}
              <button
                onClick={() => handleMarksChange(50)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold font-sans transition-all shadow-xs ${
                  activeMarks === 50
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105'
                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                }`}
              >
                50
              </button>

              {/* Change Questions */}
              <button
                onClick={handleReshuffleQuestions}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs"
                title="ಪ್ರಶ್ನೆಗಳನ್ನು ಬದಲಾಯಿಸಿ"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>ಪ್ರಶ್ನೆಗಳನ್ನು ಬದಲಾಯಿಸಿ</span>
              </button>

              {/* Upload JSON Button */}
              <button
                onClick={() => setIsJsonModalOpen(true)}
                className={`font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs ${
                  useOnlyJsonBank && customBank
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-200'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
                title="JSON ಪ್ರಶ್ನೆ ಕೋಶ ಅಪ್ಲೋಡ್ ಮಾಡಿ"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>JSON ಪ್ರಶ್ನೆ ಕೋಶ</span>
              </button>

              {/* Edit / Type */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ಸಂಪಾದಿಸಿ / ಟೈಪ್ ಮಾಡಿ</span>
              </button>

              {/* Show / Hide Answers */}
              <button
                onClick={handleToggleAnswers}
                className={`font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs ${
                  paper.showAnswers
                    ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 ring-2 ring-amber-200'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{paper.showAnswers ? 'ಉತ್ತರ ಮರೆಮಾಡಿ' : 'ಉತ್ತರ ಬರೆಯಿರಿ'}</span>
              </button>

              {/* Print Answer Sheet: Comes below the question paper and prints in same window */}
              <button
                onClick={handlePrintAnswerSheet}
                className={`font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs ${
                  showAnswerSheet
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : 'bg-[#059669] hover:bg-[#047857] text-white'
                }`}
                title="ಉತ್ತರ ಪತ್ರಿಕೆ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ಕೆಳಗೆ ಬರುತ್ತದೆ ಮತ್ತು ಮುದ್ರಣವಾಗುತ್ತದೆ"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ಉತ್ತರ ಪತ್ರಿಕೆ ಮುದ್ರಿಸಿ</span>
                {showAnswerSheet && <span className="text-[10px] bg-white/20 px-1 rounded ml-0.5">✓</span>}
              </button>

              {/* Print Blueprint: When selected, both QP and Answer Paper along with Blueprint are printed */}
              <button
                onClick={handlePrintBlueprint}
                className={`font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs ${
                  showBlueprint
                    ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                    : 'bg-[#7e22ce] hover:bg-[#6b21a8] text-white'
                }`}
                title="ನೀಲಿ ನಕ್ಷೆ ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ, ಉತ್ತರ ಪತ್ರಿಕೆ ಮತ್ತು ನೀಲಿ ನಕ್ಷೆ ಎಲ್ಲವೂ ಮುದ್ರಣಗೊಳ್ಳುತ್ತವೆ"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>ನೀಲಿ ನಕ್ಷೆ ಮುದ್ರಿಸಿ</span>
                {showBlueprint && <span className="text-[10px] bg-white/20 px-1 rounded ml-0.5">✓</span>}
              </button>

              {/* Results */}
              <button
                onClick={() => setIsResultsOpen(true)}
                className="bg-[#db2777] hover:bg-[#be185d] text-white font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <Star className="w-3.5 h-3.5" />
                <span>ಫಲಿತಾಂಶ</span>
              </button>

              {/* ONLY PRINT OPTION BUTTON (Per user instruction: DONT PUT PRINT AND SAVE AS PDF BOTH OPTION KEEP ONLY PRINT OPTION BUTTON) */}
              <button
                onClick={handlePrintPaper}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold px-3 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1.5 transition-all shadow-md ring-2 ring-blue-300 active:scale-95"
                title="ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಮುದ್ರಿಸಿ (Print Preview - Same Window)"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>ಮುದ್ರಿಸಿ</span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold px-2.5 py-1.5 rounded text-xs sm:text-[13px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ಮರುಹೊಂದಿಸಿ</span>
              </button>
            </div>
          </div>

          {/* Number of Questions input space & Space to Type bar */}
          <div className="bg-[#172554] border border-blue-800 p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* WRITE NUMBER OF QUESTIONS IN GIVEN SPACE */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Hash className="w-4 h-4 text-amber-300" />
                ಪ್ರಶ್ನೆಗಳ ಸಂಖ್ಯೆ ({activeMarks} ಅಂಕಕ್ಕೆ ನಿಗದಿ):
              </span>

              {/* Input space to freely type number of questions */}
              <div className="flex items-center gap-1 bg-white rounded px-2 py-0.5 border border-slate-300 shadow-inner">
                <span className="text-[11px] text-slate-500 font-semibold">ಸಂಖ್ಯೆ ಟೈಪ್ ಮಾಡಿ:</span>
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={questionCount}
                  onChange={(e) => handleQuestionCountChange(Number(e.target.value) || 20)}
                  className="w-14 text-center font-black text-slate-900 text-sm font-sans focus:outline-none"
                />
                <span className="text-xs text-blue-900 font-bold font-sans">Qs</span>
              </div>

              {/* Quick shortcut buttons */}
              <div className="flex items-center gap-1 bg-blue-900/60 p-1 rounded border border-blue-700">
                <button
                  onClick={() => handleQuestionCountChange(20)}
                  className={`px-2 py-0.5 rounded text-xs font-bold font-sans transition-all ${
                    questionCount === 20
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800'
                  }`}
                  title="30 ಅಂಕಗಳಿಗೆ 20 ಪ್ರಶ್ನೆಗಳು"
                >
                  20 Qs (30M)
                </button>
                <button
                  onClick={() => handleQuestionCountChange(26)}
                  className={`px-2 py-0.5 rounded text-xs font-bold font-sans transition-all ${
                    questionCount === 26
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800'
                  }`}
                  title="40 ಅಂಕಗಳಿಗೆ 26 ಪ್ರಶ್ನೆಗಳು (Default)"
                >
                  26 Qs (40M)
                </button>
                <button
                  onClick={() => handleQuestionCountChange(31)}
                  className={`px-2 py-0.5 rounded text-xs font-bold font-sans transition-all ${
                    questionCount === 31
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800'
                  }`}
                  title="50 ಅಂಕಗಳಿಗೆ 31 ಪ್ರಶ್ನೆಗಳು"
                >
                  31 Qs (50M)
                </button>
                <button
                  onClick={() => handleQuestionCountChange(15)}
                  className={`px-2 py-0.5 rounded text-xs font-bold font-sans transition-all ${
                    questionCount === 15
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  15 Qs
                </button>
              </div>
            </div>

            {/* Answer Space Options (Dotted lines with exact 0.85cm difference) */}
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <AlignJustify className="w-3.5 h-3.5" />
                ಉತ್ತರ ಬರೆಯಲು ಜಾಗ (0.85cm ಅಂತರದ ಗೆರೆಗಳು):
              </span>
              <select
                value={answerSpace}
                onChange={(e) => handleAnswerSpaceChange(e.target.value as AnswerSpaceOption)}
                className="bg-white text-slate-900 px-2.5 py-1 rounded text-xs font-bold border border-slate-300 focus:outline-blue-500"
              >
                <option value="dotted_2">ಡಾಟೆಡ್ ಲೈನ್‌ಗಳು (1M-1ಗೆರೆ, 2M-2ಗೆರೆ, 4M-4ಗೆರೆ)</option>
                <option value="dotted_3">ಡಾಟೆಡ್ ಲೈನ್‌ಗಳು (3 ಗೆರೆಗಳು - 0.85cm ಅಂತರ)</option>
                <option value="by_marks">ಅಂಕಗಳಿಗೆ ತಕ್ಕಂತೆ (0.85cm ಅಂತರ)</option>
                <option value="box">ಬಾಕ್ಸ್ / ಖಾಲಿ ಜಾಗ (Blank Box)</option>
                <option value="none">ಯಾವುದೂ ಇಲ್ಲ (No Space)</option>
              </select>
            </div>
          </div>

          {/* Configuration Inputs Panel (Note: "SECTION" OPTION REMOVED as requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-0.5 text-xs">
            {/* School Name Input (Dotted lines disappear immediately after typing!) */}
            <div className="md:col-span-2">
              <label className="block text-[11px] text-blue-100 font-medium mb-0.5">
                ಶಾಲೆಯ ಹೆಸರು (ಟೈಪ್ ಮಾಡಿದ ನಂತರ ಡಾಟ್‌ಗಳು ಮಾಯವಾಗುತ್ತವೆ)
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => handleSchoolNameChange(e.target.value)}
                placeholder="ನಿಮ್ಮ ಶಾಲೆಯ ಹೆಸರನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold focus:outline-blue-500 shadow-inner"
              />
            </div>

            {/* Exam Type (FA, SA1, SA2) - IF SA1 THEN PART1, IF SA2 THEN PART2 */}
            <div>
              <label className="block text-[11px] text-amber-300 font-bold mb-0.5">
                ಪರೀಕ್ಷಾ ಪ್ರಕಾರ (FA / SA1 / SA2)
              </label>
              <select
                value={examType}
                onChange={(e) => handleExamTypeChange(e.target.value as ExamType)}
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold focus:outline-blue-500 shadow-inner"
              >
                <option value="SA1">SA1 (ಭಾಗ-1 Part 1)</option>
                <option value="SA2">SA2 (ಭಾಗ-2 Part 2)</option>
                <option value="FA">FA (ರಚನಾತ್ಮಕ FA)</option>
              </select>
            </div>

            {/* Class Dropdown (6 to 8) with English digits */}
            <div>
              <label className="block text-[11px] text-amber-300 font-bold mb-0.5">
                ತರಗತಿ (Class 6 - 8)
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value as any)}
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold focus:outline-blue-500 shadow-inner"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.nameKannada} ({cls.nameEnglish})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker (Calendar UI) with English numbers */}
            <div>
              <label className="block text-[11px] text-blue-100 font-medium mb-0.5">
                ದಿನಾಂಕ (Date Picker)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold font-sans focus:outline-blue-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Input Fields Row 2: Subject Dropdown (All 7 subjects), Time, Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {/* Subject Dropdown with all 7 subjects */}
            <div>
              <label className="block text-[11px] text-amber-300 font-bold mb-0.5">
                ವಿಷಯ (Subject: KAN, ENG, HINDI, MATHS, SCI, SS, VE)
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold focus:outline-blue-500 shadow-inner"
              >
                {ALL_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nameKannada} [{sub.code}]
                  </option>
                ))}
              </select>
            </div>

            {/* Time with English numbers */}
            <div>
              <label className="block text-[11px] text-blue-100 font-medium mb-0.5">
                ಸಮಯ (Time)
              </label>
              <input
                type="text"
                value={paper.header.time}
                onChange={(e) =>
                  setPaper((prev) => ({
                    ...prev,
                    header: { ...prev.header, time: e.target.value },
                  }))
                }
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold font-sans focus:outline-blue-500 shadow-inner"
              />
            </div>

            {/* Academic Year with English numbers 2026-27 */}
            <div>
              <label className="block text-[11px] text-blue-100 font-medium mb-0.5">
                ಶೈಕ್ಷಣಿಕ ವರ್ಷ (Academic Year)
              </label>
              <input
                type="text"
                value={paper.header.academicYear}
                onChange={(e) =>
                  setPaper((prev) => ({
                    ...prev,
                    header: { ...prev.header, academicYear: e.target.value },
                  }))
                }
                className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold font-sans focus:outline-blue-500 shadow-inner"
              />
            </div>
          </div>

          {/* Custom JSON Bank Active Indicator if active */}
          {useOnlyJsonBank && customBank && (
            <div className="bg-emerald-950/80 border border-emerald-400 p-2 rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-200">
                  ಕಸ್ಟಮ್ JSON ಪ್ರಶ್ನೆ ಕೋಶ ಸಕ್ರಿಯವಾಗಿದೆ ({customBank.filename} - {customBank.questions.length} ಪ್ರಶ್ನೆಗಳು)
                </span>
                <span className="bg-emerald-800 text-emerald-100 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  JSON ಮಾತ್ರ ಬಳಕೆಯಾಗುತ್ತಿದೆ
                </span>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(true)}
                className="text-amber-300 underline font-semibold text-xs hover:text-white"
              >
                ಬದಲಾಯಿಸಿ / ವೀಕ್ಷಿಸಿ
              </button>
            </div>
          )}

          {/* Interactive Chapter Selection with CHECKBOXES (User requirement: "GIVE CHECK BOX TO SELECT THE CHAPTERS") */}
          <div className="pt-0.5">
            <div
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="bg-[#172554] border border-blue-800 hover:bg-[#1e3a8a] text-white px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-semibold rounded cursor-pointer flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                {isAccordionOpen ? (
                  <ChevronDown className="w-4 h-4 text-amber-300" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                )}
                <span className="font-bold text-amber-300">
                  ಪಾಠಗಳ ಆಯ್ಕೆ (Select Chapters with Checkbox) — {currentSubjectObj?.nameKannada} ({currentClassLabel}) - {partNumberText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-blue-900 border border-blue-600 text-cyan-200 px-2 py-0.5 rounded font-sans font-bold">
                  {selectedChapters.length} / {currentLessons.length} ಪಾಠಗಳು ಆಯ್ಕೆಯಾಗಿವೆ
                </span>
                <span className="text-xs text-amber-300 font-bold">{isAccordionOpen ? 'ಮುಚ್ಚಿ ▲' : 'ತೆರೆಯಿರಿ ▼'}</span>
              </div>
            </div>

            {/* Accordion Expandable Panel with CHECKBOXES */}
            {isAccordionOpen && (
              <div className="mt-1.5 bg-[#0f172a] border border-blue-800 p-3.5 rounded-lg text-xs space-y-3 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2">
                  <p className="text-slate-300 text-xs">
                    ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗೆ ಸೇರಿಸಬೇಕಾದ ಅಧ್ಯಾಯಗಳನ್ನು <strong>ಚೆಕ್‌ಬಾಕ್ಸ್ (Check box)</strong> ಮೂಲಕ ಆಯ್ಕೆಮಾಡಿ:
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAllChapters}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ (Select All)</span>
                    </button>
                    <button
                      onClick={handleDeselectAllChapters}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ (Deselect All)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {currentLessons.map((lesson, idx) => {
                    const isChecked = selectedChapters.includes(lesson.name);
                    return (
                      <label
                        key={lesson.id || idx}
                        className={`flex items-center justify-between p-2 rounded border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-blue-950/90 border-blue-500 text-white shadow-xs'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleChapter(lesson.name)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 flex-shrink-0"
                          />
                          <span className="truncate font-medium text-xs">
                            {idx + 1}. {lesson.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ml-1 flex-shrink-0 ${
                            isChecked ? 'bg-blue-900 text-cyan-300' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {lesson.type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. TOAST NOTIFICATION                                     */}
      {/* ========================================================= */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN QUESTION PAPER CANVAS                             */}
      {/* ========================================================= */}
      <main className="flex-grow p-2 sm:p-4 md:p-6 overflow-x-auto flex flex-col items-center">
        {/* Document Selection Toolbar (Hidden in print) */}
        <div className="w-full max-w-[850px] mb-3 no-print flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-xs p-2 sm:px-3 rounded-lg border border-slate-300 shadow-sm text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-slate-800">ಮುದ್ರಣಕ್ಕೆ ಆಯ್ಕೆಯಾದ ದಾಖಲೆಗಳು:</span>
            <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              ✓ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ
            </span>
            {showAnswerSheet && (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1 animate-in fade-in">
                ✓ ಉತ್ತರ ಪತ್ರಿಕೆ
                <button
                  onClick={() => setShowAnswerSheet(false)}
                  className="hover:text-red-700 font-bold ml-1 text-slate-500 hover:bg-emerald-200 rounded-full w-4 h-4 inline-flex items-center justify-center"
                  title="ಉತ್ತರ ಪತ್ರಿಕೆ ತೆಗೆದುಹಾಕಿ"
                >
                  ✕
                </button>
              </span>
            )}
            {showBlueprint && (
              <span className="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded font-bold flex items-center gap-1 animate-in fade-in">
                ✓ ನೀಲಿ ನಕ್ಷೆ
                <button
                  onClick={() => setShowBlueprint(false)}
                  className="hover:text-red-700 font-bold ml-1 text-slate-500 hover:bg-purple-200 rounded-full w-4 h-4 inline-flex items-center justify-center"
                  title="ನೀಲಿ ನಕ್ಷೆ ತೆಗೆದುಹಾಕಿ"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const next = !showAnswerSheet;
                setShowAnswerSheet(next);
                if (next) {
                  showToast('ಉತ್ತರ ಪತ್ರಿಕೆಯನ್ನು ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಯ ಕೆಳಗೆ ಸೇರಿಸಲಾಗಿದೆ');
                  setTimeout(() => {
                    document.getElementById('answer-sheet-canvas')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className={`px-2.5 py-1 rounded font-semibold border flex items-center gap-1 transition-all ${
                showAnswerSheet
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{showAnswerSheet ? '✓ ಉತ್ತರ ಪತ್ರಿಕೆ ಸಕ್ರಿಯ' : '+ ಉತ್ತರ ಪತ್ರಿಕೆ ಕೆಳಗೆ ಸೇರಿಸಿ'}</span>
            </button>
            <button
              onClick={() => {
                const next = !showBlueprint;
                setShowBlueprint(next);
                if (next) {
                  setShowAnswerSheet(true); // User: WHEN BLUE PRINT IS SELECTED BOTH QUE PAPER AND ANSWER PAPER ALONG WITH BLUE PRINT IS TO BE PRINTED
                  showToast('ನೀಲಿ ನಕ್ಷೆ ಮತ್ತು ಉತ್ತರ ಪತ್ರಿಕೆ ಎರಡನ್ನೂ ಕೆಳಗೆ ಸೇರಿಸಲಾಗಿದೆ');
                  setTimeout(() => {
                    document.getElementById('blueprint-canvas')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className={`px-2.5 py-1 rounded font-semibold border flex items-center gap-1 transition-all ${
                showBlueprint
                  ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{showBlueprint ? '✓ ನೀಲಿ ನಕ್ಷೆ ಸಕ್ರಿಯ' : '+ ನೀಲಿ ನಕ್ಷೆ ಸೇರಿಸಿ'}</span>
            </button>
            <button
              onClick={handlePrintPaper}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded flex items-center gap-1 shadow-xs ml-1"
              title="ಈಗಲೇ ಮುದ್ರಿಸಿ (Print Preview - Same Window)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>ಮುದ್ರಿಸಿ</span>
            </button>
          </div>
        </div>

        {/* 1. Main Question Paper */}
        <KannadaPaperPreview
          paper={paper}
          answerSpaceType={answerSpace}
          examType={examType}
          onSwapQuestion={openSwapModal}
          onShuffleMatch={handleShuffleMatch}
        />

        {/* 2. Answer Sheet directly below Main Question Paper */}
        {showAnswerSheet && (
          <AnswerSheetView
            paper={paper}
            onRemove={() => setShowAnswerSheet(false)}
            onPrint={handlePrintPaper}
          />
        )}

        {/* 3. Blue Print along with Question Paper and Answer Sheet */}
        {showBlueprint && (
          <BlueprintView
            paper={paper}
            onRemove={() => setShowBlueprint(false)}
            onPrint={handlePrintPaper}
          />
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. MODALS                                                 */}
      {/* ========================================================= */}
      {swapModal.question && (
        <SwapQuestionModal
          question={swapModal.question}
          sectionType={swapModal.sectionType}
          isOpen={swapModal.isOpen}
          onClose={() => setSwapModal({ ...swapModal, isOpen: false, question: null })}
          onSelect={handleApplySwappedQuestion}
        />
      )}

      {isEditModalOpen && (
        <EditQuestionModal
          paper={paper}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updated) => {
            setPaper(updated);
            showToast('ಪತ್ರಿಕೆಯ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!');
          }}
        />
      )}

      {isAnswerKeyOpen && (
        <AnswerKeyModal
          paper={paper}
          isOpen={isAnswerKeyOpen}
          onClose={() => setIsAnswerKeyOpen(false)}
        />
      )}

      {isBlueprintOpen && (
        <BlueprintModal
          paper={paper}
          isOpen={isBlueprintOpen}
          onClose={() => setIsBlueprintOpen(false)}
        />
      )}

      {isResultsOpen && (
        <ResultsModal
          paper={paper}
          isOpen={isResultsOpen}
          onClose={() => setIsResultsOpen(false)}
        />
      )}

      {isJsonModalOpen && (
        <UploadJsonModal
          isOpen={isJsonModalOpen}
          currentClass={selectedClass}
          currentSubject={selectedSubject}
          currentExamType={examType}
          useOnlyJsonBank={useOnlyJsonBank}
          activeJsonBank={customBank}
          onClose={() => setIsJsonModalOpen(false)}
          onApplyBank={handleApplyJsonBank}
        />
      )}
    </div>
  );
}
