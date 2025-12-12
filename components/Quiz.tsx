import React, { useState } from 'react';
import { QuizQuestion, AppView } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RefreshCcw } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
  onExit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Trophy size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">You mastered this topic.</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full mb-8">
            <span className="text-5xl font-bold text-indigo-600">{Math.round((score / questions.length) * 100)}%</span>
            <p className="text-slate-400 mt-2">Score: {score} / {questions.length}</p>
        </div>

        <button 
          onClick={onExit}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={20} /> Start New Topic
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto pt-6">
       {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="p-2 -ml-2 text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <div className="h-2 flex-1 mx-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs font-bold text-slate-400">{currentIndex + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let itemClass = "w-full p-4 rounded-xl text-left border-2 transition-all duration-200 relative ";
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            
            if (isAnswered) {
              if (isCorrect) itemClass += "border-green-500 bg-green-50 text-green-900";
              else if (isSelected && !isCorrect) itemClass += "border-red-500 bg-red-50 text-red-900";
              else itemClass += "border-slate-100 opacity-50";
            } else {
              itemClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 bg-white text-slate-700";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={itemClass}
              >
                <div className="flex items-center justify-between">
                    <span className="font-medium pr-8">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-green-600 absolute right-4" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-600 absolute right-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in-up">
            <h4 className="text-indigo-900 font-semibold mb-1 flex items-center gap-2">
                Explanation
            </h4>
            <p className="text-indigo-800 text-sm leading-relaxed">
                {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-md mx-auto">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${
            isAnswered 
            ? 'bg-indigo-600 text-white shadow-indigo-200' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
