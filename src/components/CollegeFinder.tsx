import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentResult, StreamFit, College, Degree, StudentDetails } from '../types';
import { MapPin, Coins, Award, Globe, X, ExternalLink, SortAsc, Sparkles, Download } from 'lucide-react';
import { DISTRICTS, COLLEGE_TYPES } from '../shared/constants';

type SortOption = 'rank' | 'fees' | 'placement';

export default function CollegeFinder({ result, streams, studentDetails, onDownload }: { result: AssessmentResult, streams: StreamFit[], studentDetails?: StudentDetails | null, onDownload?: () => void }) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDegree, setSelectedDegree] = useState<string>('');
  const [budget, setBudget] = useState<number>(300000);
  const [district, setDistrict] = useState<string>(studentDetails?.district || 'Any');
  const [collegeType, setCollegeType] = useState<'Government' | 'Aided' | 'Self-Financing' | 'Any'>('Any');

  useEffect(() => {
    import('../shared/data.js').then((module) => {
      const allDegrees = module.degrees;
      setDegrees(allDegrees);
      
      // Intelligent Auto-selection: find the degree with the highest synergy score
      if (allDegrees.length > 0 && result.domainScores) {
        let bestDegreeId = allDegrees[0].id;
        let highestSynergy = -1;

        for (const d of allDegrees) {
          let synergy = 0;
          const domains = Object.entries(d.requiredDomains);
          if (domains.length === 0) continue;

          for (const [domain, weight] of domains) {
            const score = (result.domainScores as any)[domain] || 0;
            synergy += (score / 100) * (weight as number);
          }

          if (synergy > highestSynergy) {
            highestSynergy = synergy;
            bestDegreeId = d.id;
          }
        }
        setSelectedDegree(bestDegreeId);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDegree) return;
    
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/colleges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            degreeId: selectedDegree, 
            budget, 
            district, 
            collegeType,
            domainScores: result.domainScores 
          }),
        });
        const data = await response.json();
        setColleges(data.colleges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [selectedDegree, budget, district, collegeType]);

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedColleges = [...filteredColleges].sort((a, b) => {
    if (sortBy === 'fees') return a.fees - b.fees;
    if (sortBy === 'placement') return b.placement - a.placement;
    return 0; // Rank is default from backend
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-10">
      {/* Filtering Sidebar / Topbar */}
      <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">Search College</label>
          <input 
            type="text"
            placeholder="NAME..."
            className="w-full border-2 border-black bg-white focus:outline-none focus:ring-0 py-3 px-3 font-bold text-sm lg:text-base uppercase"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">Degree Program</label>
          <select 
            className="w-full border-2 border-black bg-white focus:outline-none focus:ring-0 py-3 px-3 font-bold text-sm lg:text-base cursor-pointer"
            value={selectedDegree}
            onChange={e => setSelectedDegree(e.target.value)}
          >
            {degrees.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">Max Fees: ₹{budget.toLocaleString()}</label>
          <input 
            type="range" min="10000" max="1000000" step="10000"
            className="w-full mt-2 accent-black bg-black h-1 cursor-pointer"
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">District</label>
          <select 
            className="w-full border-2 border-black bg-white focus:outline-none focus:ring-0 py-3 px-3 font-bold text-sm lg:text-base cursor-pointer"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="Any">Any Location</option>
            {DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black mb-3">Type</label>
          <select 
            className="w-full border-2 border-black bg-white focus:outline-none focus:ring-0 py-3 px-3 font-bold text-sm lg:text-base cursor-pointer"
            value={collegeType}
            onChange={e => setCollegeType(e.target.value as any)}
          >
            <option value="Any">Any Type</option>
            {COLLEGE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {onDownload && (
        <div className="bg-black text-white p-4 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex items-center justify-between no-print" data-html2canvas-ignore>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Ready to save your findings?</span>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onDownload(); }}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors border-2 border-black"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      )}

      {/* Sorting Bar */}
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">
          Ranked Results {colleges.length > 0 && `(${colleges.length})`}
        </h3>
        <div className="flex items-center space-x-3">
          <SortAsc className="w-5 h-5 text-black" />
          <span className="text-xs font-black uppercase tracking-widest">Sort By:</span>
          <select 
            className="border-2 border-black bg-white py-1 px-2 font-bold text-xs uppercase cursor-pointer"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
          >
            <option value="rank">Recommended</option>
            <option value="fees">Lowest Fees</option>
            <option value="placement">Best Placement</option>
          </select>
        </div>
      </div>

      {/* College List */}
      <div className="space-y-6 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <div className="text-black font-black uppercase tracking-widest text-sm animate-pulse">Running Ranking Engine...</div>
          </div>
        ) : sortedColleges.length === 0 ? (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="p-12 text-center bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-black font-bold uppercase tracking-widest"
           >
             No exact college match found. Adjust parameters.
           </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedColleges.map((c, i) => (
              <motion.div 
                key={`${c.id}-${sortBy}`}
                variants={cardVariants}
                onClick={() => setSelectedCollege(c)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none transition-all relative flex flex-col h-full group cursor-pointer"
              >
                {/* Ranking / Match Badge */}
                <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-mono text-sm font-bold border-b-2 border-l-2 border-black z-10 flex flex-col items-end">
                  <span>{sortBy === 'rank' ? `#${i + 1}` : <Award className="w-4 h-4" />}</span>
                </div>
                
                <div className="absolute top-0 left-0 bg-yellow-400 text-black px-2 py-0.5 font-mono text-[10px] font-black border-b-2 border-r-2 border-black z-10">
                  {Math.round((c as any).rankScore * 100 || 85)}% MATCH
                </div>
                
                <h4 className="font-bold text-xl uppercase tracking-tight text-black mb-6 mt-4 pr-10 leading-tight group-hover:text-yellow-600 transition-colors">{c.name}</h4>
                
                <div className="space-y-4 text-sm font-bold text-black flex-grow">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span className="uppercase">{c.district}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coins className="w-5 h-5 flex-shrink-0" />
                    <span className={`font-mono ${sortBy === 'fees' ? 'text-green-600' : ''}`}>₹{c.fees.toLocaleString()} FEES</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 flex-shrink-0" />
                    <span className={`uppercase ${sortBy === 'placement' ? 'text-blue-600' : ''}`}>{c.type} / {c.placement}/5 PLA</span>
                  </div>
                  <div className="flex items-center space-x-3 pt-2 text-yellow-600">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span className="uppercase text-[10px] leading-tight italic font-black">{c.matchReason}</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1.5">
                    {degrees.find(d => d.id === selectedDegree)?.name.slice(0, 20)}...
                  </span>
                  {c.website && (
                    <a 
                      href={c.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white px-2 py-1.5 transition-colors border-2 border-transparent hover:border-black"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Site</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Selected College Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedCollege && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCollege(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-default"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] max-w-2xl w-full p-8 relative flex flex-col max-h-[90vh] cursor-auto"
              >
                <button 
                  onClick={() => setSelectedCollege(null)}
                  className="absolute top-4 right-4 p-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="mb-6 pr-12">
                  <span className="inline-block bg-yellow-400 text-black px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 border-black mb-4">
                    College Code: {selectedCollege.code || selectedCollege.id}
                  </span>
                  <h2 className="text-3xl font-black uppercase leading-tight text-black">{selectedCollege.name}</h2>
                <p className="text-sm font-bold text-gray-500 uppercase mt-2 tracking-widest flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-600" />
                  Reason: {selectedCollege.matchReason}
                </p>
              </div>
                
                <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 border-2 border-black">
                      <div className="text-blue-900 font-bold uppercase text-xs tracking-widest mb-1 flex items-center space-x-2">
                        <MapPin className="w-4 h-4" /> <span>District</span>
                      </div>
                      <div className="text-xl font-black uppercase">{selectedCollege.district}</div>
                    </div>
                    <div className="bg-green-50 p-4 border-2 border-black">
                      <div className="text-green-900 font-bold uppercase text-xs tracking-widest mb-1 flex items-center space-x-2">
                        <Coins className="w-4 h-4" /> <span>Type</span>
                      </div>
                      <div className="text-xl font-black uppercase">{selectedCollege.type}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg uppercase border-b-2 border-black pb-2 mb-4">Offered Degrees</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollege.degrees.map(dId => {
                        const d = degrees.find(deg => deg.id === dId);
                        return d ? (
                          <span key={d.id} className="bg-gray-100 border-2 border-black px-3 py-1 text-sm font-bold">
                            {d.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-4 border-black flex flex-col sm:flex-row gap-4">
                  {selectedCollege.website ? (
                    <a 
                      href={selectedCollege.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 bg-black text-white p-4 font-black uppercase text-center hover:bg-white hover:text-black border-4 border-black transition-colors flex items-center justify-center space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-6 h-6" />
                      <span>Visit Official Website</span>
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </a>
                  ) : (
                    <div className="flex-1 bg-gray-200 text-gray-500 p-4 font-black uppercase text-center border-4 border-gray-300 flex items-center justify-center cursor-not-allowed">
                      Website Not Available
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
