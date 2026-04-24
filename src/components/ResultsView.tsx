import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
// import html2pdf from 'html2pdf.js';
import { AssessmentResult, StreamFit, StudentDetails } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, AlertCircle, Sparkles, User, Download } from 'lucide-react';
import CollegeFinder from './CollegeFinder';
import AIAdvisor from './AIAdvisor';

interface ResultsViewProps {
  result: AssessmentResult;
  streams: StreamFit[];
  studentDetails?: StudentDetails | null;
}

export default function ResultsView({ result, streams, studentDetails }: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'colleges'>('overview');
  const reportRef = useRef<HTMLDivElement>(null);

  const radarData = Object.entries(result.domainScores).map(([subject, A]) => ({
    subject,
    A,
    fullMark: 100,
  }));

  const bestStream = streams[0];
  const hybridThreshold = 10;
  const isHybrid = streams.length > 1 && (streams[0].fit - streams[1].fit) < hybridThreshold;

  const downloadPDF = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
      ref={reportRef}
    >
      {studentDetails && (
        <motion.div variants={itemVariants} className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0_0_rgba(200,200,200,1)] inline-block w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-black">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">REPORT FOR: {studentDetails.name}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{studentDetails.class} | {studentDetails.district} District</p>
              </div>
            </div>
            {activeTab === 'overview' && (
              <button 
                onClick={(e) => { e.preventDefault(); downloadPDF(); }}
                className="flex items-center space-x-2 border-2 border-white bg-white text-black md:bg-black md:text-white px-4 py-2 hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-widest text-[10px] md:text-sm shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] md:shadow-none"
              >
                <Download className="w-4 h-4" />
                <span>Get Report PDF</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Header Tabs (hidden in PDF) */}
      <div className="flex overflow-x-auto border-b-4 border-black mb-10 no-print scrollbar-hide" data-html2canvas-ignore>
        <div className="flex min-w-full">
          {[
            { id: 'overview', label: '1. Aptitude & AI' },
            { id: 'colleges', label: '2. Colleges' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] px-4 md:px-8 py-5 text-xs md:text-sm font-bold uppercase tracking-widest border-b-4 -mb-1 transition-all ${
                activeTab === tab.id
                  ? 'border-black text-white bg-black'
                  : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            {/* Top Stat */}
            <motion.div variants={itemVariants} className="bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-center space-x-3 text-black text-xs font-bold mb-6 uppercase tracking-widest border-b-2 border-black pb-3">
                <BookOpen className="w-5 h-5" />
                <span>Primary Vector</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-4">
                {bestStream.stream}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-full border-2 border-black h-4 p-0.5 bg-white">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${bestStream.fit}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-black h-full"
                  ></motion.div>
                </div>
                <span className="text-lg font-bold font-mono text-black">{bestStream.fit}%</span>
              </div>
              
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Stream Comparison</h4>
                <div className="space-y-3">
                  {streams.map((s, idx) => (
                    <div key={s.stream} className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase w-24">{s.stream}</span>
                      <div className="flex-1 mx-4 border border-gray-300 h-2 bg-gray-50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.fit}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + (idx * 0.1) }}
                          className="bg-gray-400 h-full"
                        ></motion.div>
                      </div>
                      <span className="text-xs font-mono font-bold">{s.fit}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hybrid or Confidence Alerts */}
            {isHybrid && (
               <motion.div variants={itemVariants} className="bg-white p-6 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                 <div className="flex items-start space-x-4">
                   <Sparkles className="w-6 h-6 text-black mt-1" />
                   <div>
                     <h4 className="font-bold uppercase tracking-widest text-black">Multi-potential</h4>
                     <p className="text-sm font-medium text-black mt-2 leading-relaxed">
                       Your aptitude shows an extremely close fit for both {streams[0].stream} and {streams[1].stream}.
                     </p>
                   </div>
                 </div>
               </motion.div>
            )}

            {result.confidence === 'Low' && (
              <motion.div variants={itemVariants} className="bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0_0_rgba(200,200,200,1)]">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-white mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-widest">Inconsistent Scan</h4>
                    <p className="text-sm font-medium text-gray-300 mt-2 leading-relaxed">
                      High variance detected in responses. True aptitude reliability is degraded.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={itemVariants} className="bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center">
              <h3 className="font-bold text-black mb-8 text-xl uppercase tracking-widest self-start w-full border-b-2 border-black pb-4">Aptitude Topology</h3>
              <div className="h-[350px] w-full max-w-lg mt-4 font-mono font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#000" strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Aptitude"
                      dataKey="A"
                      stroke="#000"
                      strokeWidth={3}
                      fill="#000"
                      fillOpacity={0.15}
                    />
                    <Tooltip contentStyle={{ borderRadius: '0px', border: '2px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold', fontFamily: 'monospace' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AIAdvisor result={result} streams={streams} />
            </motion.div>
          </div>

        </div>
      )}

      {activeTab === 'colleges' && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CollegeFinder result={result} streams={streams} onDownload={downloadPDF} />
        </motion.div>
      )}
    </motion.div>
  );
}
