import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import { StudentDetails } from '../types';
import { DISTRICTS } from '../shared/constants';

interface StudentDetailsViewProps {
  onComplete: (details: StudentDetails) => void;
}

export default function StudentDetailsView({ onComplete }: StudentDetailsViewProps) {
  const [details, setDetails] = useState<StudentDetails>({
    name: '',
    class: '',
    district: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.name.trim() && details.class && details.district) {
      onComplete(details);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8 mt-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-black">
          Candidate <span className="bg-black text-white px-2">Profile</span>
        </h2>
        <p className="text-black font-bold uppercase tracking-widest text-xs">Configure your assessment parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'PERSONALIZATION', desc: 'Your name is used for the final career report.' },
          { label: 'DIFFICULTY', desc: 'Your class level calibrates the question difficulty.' },
          { label: 'PROXIMITY', desc: 'District data optimizes local college matching.' },
        ].map((item, i) => (
          <div key={i} className="border-2 border-black p-3 bg-gray-50">
            <div className="text-[10px] font-black text-black mb-1">{item.label}</div>
            <p className="text-[9px] font-bold text-gray-500 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white p-8 md:p-12 border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] space-y-8"
      >
        {/* Name Input */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-black">
            <User className="w-5 h-5" />
            <span>Full Name</span>
          </label>
          <input
            autoFocus
            required
            type="text"
            placeholder="ENTER YOUR NAME"
            className="w-full border-4 border-black p-4 font-bold text-xl uppercase placeholder:text-gray-300 focus:outline-none focus:bg-gray-50 transition-colors"
            value={details.name}
            onChange={e => setDetails({ ...details, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Class Select */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-black">
              <GraduationCap className="w-5 h-5" />
              <span>Current Class</span>
            </label>
            <input
              list="classes"
              className="w-full border-4 border-black p-4 font-bold text-lg uppercase focus:outline-none focus:bg-gray-50 bg-white"
              value={details.class}
              onChange={e => setDetails({ ...details, class: e.target.value })}
              placeholder="SELECT CLASS"
            />
            <datalist id="classes">
              <option value="10th Standard" />
              <option value="12th Standard" />
            </datalist>
          </div>

          {/* District Select */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-black">
              <MapPin className="w-5 h-5" />
              <span>District</span>
            </label>
            <input
              list="districts"
              className="w-full border-4 border-black p-4 font-bold text-lg uppercase focus:outline-none focus:bg-gray-50 bg-white"
              value={details.district}
              onChange={e => setDetails({ ...details, district: e.target.value })}
              placeholder="SELECT DISTRICT"
            />
            <datalist id="districts">
              {DISTRICTS.map(d => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 8, y: 8, boxShadow: "0px 0px 0 0 rgba(0,0,0,1)" }}
          type="submit"
          disabled={!details.name.trim() || !details.class || !details.district}
          className="w-full group relative inline-flex items-center justify-center border-4 border-black p-6 font-black uppercase tracking-widest text-white bg-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
        >
          <span className="mr-3 text-xl">Continue to Scan</span>
          <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </motion.form>

    </motion.div>
  );
}
