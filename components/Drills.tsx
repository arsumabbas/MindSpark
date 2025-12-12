import React, { useState } from 'react';
import { DrillItem } from '../types';
import { ArrowLeft, Send } from 'lucide-react';

interface DrillsProps {
  items: DrillItem[];
  onExit: () => void;
}

export const Drills: React.FC<DrillsProps> = ({ items, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedback, setFeedback] = useState('');

  const currentItem = items[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const normalize = (str: string) => str.toLowerCase().trim();
    
    if (normalize(userInput) === normalize(currentItem.missingWord)) {
      setStatus('correct');
      setFeedback('Correct! Great job.');
    } else {
      setStatus('incorrect');
      setFeedback(`Incorrect. The answer was: ${currentItem.missingWord}`);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setStatus('idle');
    setFeedback('');
    
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of drill logic
      onExit();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto pt-6">
      <div className="flex items-center mb-8">
        <button onClick={onExit} className="p-2 -ml-2 text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <span className="ml-4 font-semibold text-slate-700">Drill {currentIndex + 1} / {items.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center pt-8">
        <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <p className="text-xl text-slate-800 font-medium leading-loose text-center">
              {currentItem.displaySentence.split('_____').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className={`inline-block w-24 border-b-2 px-1 mx-1 font-bold text-center ${
                        status === 'correct' ? 'border-green-500 text-green-600' :
                        status === 'incorrect' ? 'border-red-500 text-red-600' : 'border-indigo-500 text-transparent'
                    }`}>
                      {status !== 'idle' ? currentItem.missingWord : '?'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
        </div>

        {status === 'idle' ? (
          <form onSubmit={handleSubmit} className="w-full relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the missing word..."
              className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!userInput.trim()}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white p-3 rounded-lg disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className={`w-full p-4 rounded-xl text-center mb-4 ${status === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold">{feedback}</p>
          </div>
        )}
      </div>

      {status !== 'idle' && (
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold mb-20 shadow-lg"
        >
          {currentIndex === items.length - 1 ? 'Finish Drill' : 'Next Item'}
        </button>
      )}
    </div>
  );
};
