import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';

interface QuizViewProps {
  onComplete: (answers: Record<string, number>) => void;
}

export default function QuizView({ onComplete }: QuizViewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import('../shared/data.js').then((module) => {
      setQuestions(module.questions);
    });
  }, []);

  const handleSelect = (score: number) => {
    const qid = questions[currentIdx].id;
    setAnswers({ ...answers, [qid]: score });
    
    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 300);
    }
  };

  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  if (questions.length === 0) return <div className="animate-pulse text-center p-12 text-gray-500">Loading questions...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-10">
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-black">
          <span>SEQ {currentIdx + 1}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-4 w-full border-2 border-black bg-white p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-black"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 md:p-12 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] min-h-[400px] flex flex-col justify-center relative"
        >
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black mb-12 text-center leading-relaxed">
            "{currentQ.text}"
          </h3>

          <div className="flex flex-col space-y-4 relative w-full max-w-md mx-auto">
            {[
              { v: 5, label: 'Strongly Agree' },
              { v: 4, label: 'Agree' },
              { v: 3, label: 'Neutral' },
              { v: 2, label: 'Disagree' },
              { v: 1, label: 'Strongly Disagree' }
            ].map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.v;
              return (
                <motion.button
                  key={opt.v}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(opt.v)}
                  className={`w-full p-4 text-center font-bold uppercase tracking-widest transition-all duration-100 border-2 border-black 
                    ${isSelected 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1'}`}
                >
                  {opt.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center px-2 pt-4">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(currentIdx - 1)}
          className="py-2 px-4 border-2 border-transparent font-bold uppercase tracking-widest text-black disabled:opacity-30 hover:border-black transition-all"
        >
          Previous
        </button>
        {currentIdx === questions.length - 1 && answers[currentQ.id] && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={() => {
              setLoading(true);
              onComplete(answers);
            }}
            disabled={loading}
            className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          >
            {loading ? 'Analyzing...' : 'Show Results'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
