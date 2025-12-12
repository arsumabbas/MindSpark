import React, { useState } from 'react';
import { Flashcard, AppView } from '../types';
import { RotateCw, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface FlashcardsProps {
  cards: Flashcard[];
  onExit: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ cards, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Loop back or finish? Let's loop for practice
            setCurrentIndex(0);
        }
    }, 200);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) return <div className="p-8 text-center text-slate-500">No cards available.</div>;

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto w-full pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="p-2 -ml-2 text-slate-500 hover:text-slate-800">
          <ArrowLeft size={24} />
        </button>
        <div className="text-sm font-semibold text-slate-400">
          Card {currentIndex + 1} / {cards.length}
        </div>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Card Container */}
      <div className="flex-1 flex flex-col justify-center perspective-1000 mb-8">
        <div 
          className={`relative w-full aspect-[4/5] transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <span className="text-xs uppercase tracking-widest text-indigo-500 font-bold mb-4">Front</span>
            <h3 className="text-2xl font-bold text-slate-800 leading-tight">{currentCard.front}</h3>
            <p className="absolute bottom-6 text-slate-400 text-sm animate-pulse">Tap to flip</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
             <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold mb-4">Back</span>
            <p className="text-xl font-medium leading-relaxed">{currentCard.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-4 pb-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full bg-white shadow-lg border border-slate-100 ${currentIndex === 0 ? 'opacity-50' : 'active:scale-95 transition-transform'}`}
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>

        <button 
            onClick={handleFlip}
            className="p-4 rounded-full bg-indigo-50 text-indigo-600 active:bg-indigo-100 transition-colors"
        >
            <RotateCw size={24} />
        </button>

        <button 
          onClick={handleNext}
          className="p-4 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          <ArrowRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};
