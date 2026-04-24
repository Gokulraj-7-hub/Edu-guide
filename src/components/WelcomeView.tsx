import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Compass, Building } from 'lucide-react';

export default function WelcomeView({ onStart }: { onStart: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center space-y-16 mt-10"
    >
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="inline-flex items-center space-x-2 border-2 border-black bg-white px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <span className="h-2 w-2 bg-black animate-pulse"></span>
          <span>System Online</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase leading-none">
          Design your <br className="hidden md:block"/> <span className="bg-black text-white px-4">future.</span>
        </h2>
        <p className="text-lg md:text-xl text-black font-medium max-w-2xl mx-auto leading-relaxed border-l-4 border-black pl-6 text-left mt-8">
          A deterministic aptitude engine. We analyze your strengths, map them to career streams, and find the best colleges tailored to you. No fluff. Just data.
        </p>
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ x: 6, y: 6, boxShadow: "0px 0px 0 0 rgba(0,0,0,1)" }}
        onClick={onStart}
        className="group relative inline-flex items-center justify-center border-2 border-black p-4 px-10 font-bold uppercase tracking-widest text-white bg-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
      >
        <span className="mr-3 text-lg">Initialize Run</span>
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-16">
        {[
          { icon: Brain, title: 'Data-Driven', desc: 'Analyzes 5 core cognitive domains to verify your natural aptitude.' },
          { icon: Compass, title: 'Stream Mapping', desc: 'Maps your profile to Science, Commerce, or Arts based on statistical fit.' },
          { icon: Building, title: 'College Matching', desc: 'Finds institutions matching your degree, budget, and location.' },
        ].map((feature, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="flex flex-col items-start p-6 bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          >
            <div className="w-12 h-12 bg-black flex items-center justify-center text-white mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl uppercase tracking-tight text-black mb-3">{feature.title}</h3>
            <p className="text-black font-medium text-left leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
