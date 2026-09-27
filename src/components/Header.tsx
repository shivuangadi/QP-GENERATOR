import React from 'react';
import { BookOpen, FileText, Settings, Database, BookMarked, Sliders, Archive } from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'editor'
  | 'question_bank'
  | 'textbook'
  | 'patterns'
  | 'saved_papers'
  | 'settings';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasActivePaper: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  hasActivePaper,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            {/* Circular Badge */}
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-blue-700/80 border-2 border-amber-400/80 flex items-center justify-center shadow-inner">
              <span className="font-extrabold text-amber-300 text-xs tracking-tight text-center leading-none">
                SA-1<br />SA-2
              </span>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-blue-950 font-black text-[9px] px-1 rounded-full border border-white">
                26-27
              </div>
            </div>

            <div>
              <div className="flex items-baseline space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm font-kannada">
                  ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ರಚನಾ ಸಾಧನ
                </h1>
                <span className="hidden sm:inline-block text-xs bg-blue-600/70 border border-blue-400/40 text-blue-100 px-2 py-0.5 rounded-full font-medium">
                  Question Paper Formation Tool
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-blue-200 mt-0.5">
                <span className="text-amber-300 font-semibold">Karnataka State Syllabus</span>
                <span>•</span>
                <span>ಕನ್ನಡ ಮಾಧ್ಯಮ (೬ & ೭ನೇ ತರಗತಿ - ೭ ವಿಷಯಗಳು)</span>
                <span>•</span>
                <span className="text-emerald-300 font-medium bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  By S R Angadi
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-blue-200">
            <span className="hidden lg:inline bg-blue-800/80 border border-blue-700 px-2.5 py-1 rounded-md text-amber-200 font-medium">
              ಶೈಕ್ಷಣಿಕ ವರ್ಷ 2026-27
            </span>
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಕ್ರಿಯವಾಗಿದೆ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-blue-950/70 border-t border-blue-700/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span>೧. ರಚನೆ (Dashboard)</span>
            </button>

            <button
              onClick={() => onTabChange('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap relative ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>೨. ಸಂಪಾದನೆ & A4 ಮುನ್ನೋಟ</span>
              {hasActivePaper && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => onTabChange('question_bank')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'question_bank'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-300" />
              <span>೩. ಪ್ರಶ್ನೆ ಬ್ಯಾಂಕ್</span>
            </button>

            <button
              onClick={() => onTabChange('textbook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'textbook'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <BookMarked className="w-4 h-4 text-emerald-300" />
              <span>೪. ಆಂತರಿಕ ಪಠ್ಯವಿಷಯ (Internal Text)</span>
            </button>

            <button
              onClick={() => onTabChange('patterns')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'patterns'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-300" />
              <span>೫. ಪತ್ರಿಕೆ ಮಾದರಿ</span>
            </button>

            <button
              onClick={() => onTabChange('saved_papers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'saved_papers'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <Archive className="w-4 h-4 text-amber-200" />
              <span>೬. ಉಳಿಸಿದ ಪತ್ರಿಕೆಗಳು</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-300" />
              <span>೭. ಸೆಟ್ಟಿಂಗ್ಸ್</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
