import React from 'react';
import { Home, Layers, CheckSquare, Zap } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  // Helper to determine active state style
  const getBtnClass = (view: AppView) => {
    const isActive = currentView === view || (currentView === AppView.RESULTS && view === AppView.HOME); // Keep home active loosely or handle strictly
    return `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    } transition-colors duration-200`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 z-50 safe-area-pb">
      <button onClick={() => onNavigate(AppView.HOME)} className={getBtnClass(AppView.HOME)}>
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      {/* These buttons are disabled if no content is loaded usually, but here we let them navigate to 'create' or prompt */}
      <div className="w-px h-8 bg-slate-100 mx-2"></div>
      
      <button 
        onClick={() => onNavigate(AppView.FLASHCARDS)} 
        className={getBtnClass(AppView.FLASHCARDS)}
      >
        <Layers size={24} />
        <span className="text-[10px] font-medium">Flashcards</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.DRILL)} 
        className={getBtnClass(AppView.DRILL)}
      >
        <Zap size={24} />
        <span className="text-[10px] font-medium">Drills</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.QUIZ)} 
        className={getBtnClass(AppView.QUIZ)}
      >
        <CheckSquare size={24} />
        <span className="text-[10px] font-medium">Quiz</span>
      </button>
    </nav>
  );
};
