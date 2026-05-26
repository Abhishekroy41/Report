import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Moon, Sun, Droplet } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import SettingsModal from '../../features/settings/SettingsModal';

export default function Navbar() {
  const { theme, setTheme, patientName } = useSettingsStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
            <Droplet className="w-6 h-6 fill-current" />
            <span>GlucoTrack</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline-block">
              {patientName}'s Data
            </span>
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
