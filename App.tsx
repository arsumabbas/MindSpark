import React, { useState } from 'react';
import { AppView, Difficulty, StudySession } from './types';
import { generateFlashcards, generateQuiz, generateDrill } from './services/geminiService';
import { Navigation } from './components/Navigation';
import { Flashcards } from './components/Flashcards';
import { Quiz } from './components/Quiz';
import { Drills } from './components/Drills';
import { Sparkles, Brain, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<StudySession | null>(null);

  const startSession = async (type: AppView) => {
    if (!topic.trim()) {
        alert("Please enter a topic first!");
        return;
    }

    setIsLoading(true);
    setCurrentView(AppView.LOADING);

    try {
      let data: any = null;
      
      if (type === AppView.FLASHCARDS) {
        data = await generateFlashcards(topic);
      } else if (type === AppView.QUIZ) {
        data = await generateQuiz(topic, Difficulty.MEDIUM);
      } else if (type === AppView.DRILL) {
        data = await generateDrill(topic);
      }

      setSessionData({ topic, type, data });
      setCurrentView(type);
    } catch (error) {
      console.error("Failed to generate content:", error);
      alert("Something went wrong. Please try a simpler topic or check your connection.");
      setCurrentView(AppView.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: AppView) => {
    // If navigating to home, reset
    if (view === AppView.HOME) {
      setCurrentView(AppView.HOME);
      return;
    }
    
    // If we have active data for the view, go there, otherwise prompt or stay home
    if (sessionData && sessionData.type === view) {
      setCurrentView(view);
    } else {
        // If clicking a tab without data, treat it as a request to start that mode with current topic
        if (topic) {
            startSession(view);
        } else {
            setCurrentView(AppView.HOME);
            // Optionally focus input
        }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
                <Sparkles size={20} className="text-indigo-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">Generating Content</h3>
            <p className="text-slate-500 text-sm mt-1">AI is preparing your {sessionData?.type?.toLowerCase() || 'session'}...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="flex flex-col h-full p-6 pt-12 max-w-md mx-auto overflow-y-auto no-scrollbar pb-24">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Mind<span className="text-indigo-600">Spark</span>
              </h1>
              <p className="text-slate-500">What do you want to master today?</p>
            </header>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Spanish Basics, Quantum Physics, React Hooks..."
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => startSession(AppView.FLASHCARDS)}
                className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200 transition-transform active:scale-[0.98]"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <BookOpen size={64} />
                 </div>
                 <div className="relative z-10 flex flex-col items-start">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">Study</span>
                    <h3 className="text-2xl font-bold mb-1">Flashcards</h3>
                    <p className="text-indigo-100 text-sm">Memorize concepts quickly</p>
                 </div>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => startSession(AppView.DRILL)}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col items-start active:bg-slate-50"
                >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">Drills</h3>
                    <p className="text-xs text-slate-400 mt-1">Fill in the blanks</p>
                </button>

                <button 
                    onClick={() => startSession(AppView.QUIZ)}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col items-start active:bg-slate-50"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <Brain size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">Quiz</h3>
                    <p className="text-xs text-slate-400 mt-1">Test your knowledge</p>
                </button>
              </div>
            </div>

            <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Topics</h3>
                <div className="space-y-2">
                    {/* Placeholder for recent history - static for now */}
                    <div className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <span className="text-slate-600 text-sm font-medium">Javascript Arrays</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                         <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                        <span className="text-slate-600 text-sm font-medium">World War II History</span>
                    </div>
                </div>
            </div>
          </div>
        );
      
      case AppView.FLASHCARDS:
        return <Flashcards cards={sessionData?.data as any[]} onExit={() => setCurrentView(AppView.HOME)} />;
      
      case AppView.QUIZ:
        return <Quiz questions={sessionData?.data as any[]} onExit={() => setCurrentView(AppView.HOME)} />;
        
      case AppView.DRILL:
        return <Drills items={sessionData?.data as any[]} onExit={() => setCurrentView(AppView.HOME)} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
