import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { SUBJECTS } from '../data/syllabus';
import {
  DEFAULT_SETTINGS,
  exportAllDataJSON,
  getSettings,
  importAllDataJSON,
  resetAllData,
  saveSettings,
} from '../services/storage';
import { AnswerSpaceType, ClassId, ExamId, SubjectId, TeacherSettings } from '../types';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<TeacherSettings>(() => getSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChange = <K extends keyof TeacherSettings>(
    key: K,
    value: TeacherSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setToastMessage('ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Backup Data
  const handleBackup = () => {
    const jsonStr = exportAllDataJSON();
    const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const a = document.createElement('a');
    a.href = dataUri;
    a.download = `karnataka_qp_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setToastMessage('ಬ್ಯಾಕಪ್ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Restore Data
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllDataJSON(content);
      if (success) {
        setSettings(getSettings());
        alert('ಬ್ಯಾಕಪ್ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ (Restored successfully)!');
        window.location.reload();
      } else {
        alert('ಬ್ಯಾಕಪ್ ಫೈಲ್ ಅಮಾನ್ಯವಾಗಿದೆ.');
      }
    };
    reader.readAsText(file);
  };

  // Reset Data with safety confirmation as required!
  const handleReset = () => {
    const confirmed = window.confirm(
      'ನಿಜವಾಗಿಯೂ ಎಲ್ಲಾ ಪ್ರಸ್ತುತ ಮಾಹಿತಿಯನ್ನು ತೆರವುಗೊಳಿಸಲು ಬಯಸುವಿರಾ?'
    );
    if (confirmed) {
      resetAllData();
      setSettings(DEFAULT_SETTINGS);
      alert('ಎಲ್ಲಾ ಮಾಹಿತಿಯನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6 font-kannada">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700" />
            <span>ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್ಸ್ (Settings & School Profile)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            ಶಾಲೆಯ ವಿವರಗಳು, ಪೂರ್ವನಿಯೋಜಿತ ಶಿಕ್ಷಕರ ಮಾಹಿತಿ, ಮುದ್ರಣ ಮಾರ್ಜಿನ್ ಮತ್ತು ಡೇಟಾ ಬ್ಯಾಕಪ್
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* School & Teacher Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>ಶಾಲೆ & ಶಿಕ್ಷಕರ ವಿವರಗಳು (School & Teacher Profile)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಶಾಲೆಯ ಹೆಸರು (School Name):
              </label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada font-medium"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಶಿಕ್ಷಕರ ಹೆಸರು (Teacher Name):
              </label>
              <input
                type="text"
                value={settings.teacherName}
                onChange={(e) => handleChange('teacherName', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                required
              />
              <span className="text-[11px] text-slate-500">ಡೀಫಾಲ್ಟ್: S R Angadi</span>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                ಶಾಲೆಯ ವಿಳಾಸ (School Address):
              </label>
              <input
                type="text"
                value={settings.schoolAddress}
                onChange={(e) => handleChange('schoolAddress', e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಸಂಪರ್ಕ ದೂರವಾಣಿ (Phone):
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full border border-slate-300 rounded-lg p-2 font-sans"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಇಮೇಲ್ (Email):
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="teacher@school.edu"
                className="w-full border border-slate-300 rounded-lg p-2 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Paper Defaults */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
            ಪೂರ್ವನಿಯೋಜಿತ ಪತ್ರಿಕೆ ನಿಯತಾಂಕಗಳು (Default Exam Preferences)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಪೂರ್ವನಿಯೋಜಿತ ತರಗತಿ:
              </label>
              <select
                value={settings.defaultClass}
                onChange={(e) => handleChange('defaultClass', e.target.value as ClassId)}
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              >
                <option value="6th">೬ನೇ ತರಗತಿ</option>
                <option value="7th">೭ನೇ ತರಗತಿ</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಪೂರ್ವನಿಯೋಜಿತ ವಿಷಯ:
              </label>
              <select
                value={settings.defaultSubject}
                onChange={(e) => handleChange('defaultSubject', e.target.value as SubjectId)}
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameKannada}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಪೂರ್ವನಿಯೋಜಿತ ಪರೀಕ್ಷೆ:
              </label>
              <select
                value={settings.defaultExam}
                onChange={(e) => handleChange('defaultExam', e.target.value as ExamId)}
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              >
                <option value="SA-1">SA-1</option>
                <option value="SA-2">SA-2</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಪೂರ್ವನಿಯೋಜಿತ ಅಂಕಗಳು:
              </label>
              <input
                type="number"
                value={settings.defaultMarks}
                onChange={(e) =>
                  handleChange('defaultMarks', parseInt(e.target.value, 10) || 40)
                }
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಸಂಖ್ಯೆಗಳ ಶೈಲಿ (Numbering):
              </label>
              <select
                value={settings.defaultNumberingFormat}
                onChange={(e) =>
                  handleChange('defaultNumberingFormat', e.target.value as any)
                }
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              >
                <option value="kannada">೧, ೨, ೩ (ಕನ್ನಡ ಅಂಕಿಗಳು)</option>
                <option value="arabic">1, 2, 3 (ಇಂಗ್ಲಿಷ್ ಸಂಖ್ಯೆಗಳು)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ಉತ್ತರ ಬರೆಯಲು ಸ್ಥಳ:
              </label>
              <select
                value={settings.defaultAnswerSpace}
                onChange={(e) =>
                  handleChange('defaultAnswerSpace', e.target.value as AnswerSpaceType)
                }
                className="w-full border border-slate-300 rounded-lg p-2 font-kannada"
              >
                <option value="auto">ಸ್ವಯಂ ಸ್ಥಳ (Auto)</option>
                <option value="by_marks">ಅಂಕಗಳಿಗೆ ಅನುಗುಣವಾಗಿ (By marks)</option>
                <option value="ruled">ಗೆರೆಯ ಸ್ಥಳ (Ruled lines)</option>
                <option value="none">ಸ್ಥಳ ಬೇಡ (None)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-sm text-sm"
          >
            <Save className="w-4 h-4" />
            <span>ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ (Save Settings)</span>
          </button>
        </div>
      </form>

      {/* Backup, Restore & Reset */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>ಡೇಟಾ ಬ್ಯಾಕಪ್ & ಮರುಸ್ಥಾಪನೆ (Backup, Restore & Reset)</span>
        </h3>
        <p className="text-xs text-slate-600">
          ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್, ಪಠ್ಯಪುಸ್ತಕಗಳ ಮಾಹಿತಿ, ಉಳಿಸಿದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಹಾಗೂ ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಬ್ಯಾಕಪ್ ಇಟ್ಟುಕೊಳ್ಳಿ.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleBackup}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>ಬ್ಯಾಕಪ್ ಡೌನ್‌ಲೋಡ್ (Backup Data JSON)</span>
          </button>

          <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer border border-slate-300">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>ಬ್ಯಾಕಪ್ ಮರುಸ್ಥಾಪನೆ (Restore Data)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ಡೇಟಾ ರೀಸೆಟ್ (Reset)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
