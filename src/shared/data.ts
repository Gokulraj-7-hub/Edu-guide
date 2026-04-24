import { Question, Degree, College } from '../types.js';
import { tnColleges } from './colleges.js';

export const questions: Question[] = [
  { id: 'q1', text: 'I enjoy solving complex mathematical puzzles.', domain: 'Logical', weight: 1.0, difficulty: 'hard' },
  { id: 'q2', text: 'I can quickly spot patterns in data and graphs.', domain: 'Analytical', weight: 0.9, difficulty: 'medium' },
  { id: 'q3', text: 'I like coming up with original stories or artwork.', domain: 'Creative', weight: 1.0, difficulty: 'medium' },
  { id: 'q4', text: 'I can easily express my thoughts in writing or speech.', domain: 'Communication', weight: 0.8, difficulty: 'easy' },
  { id: 'q5', text: 'I prefer hands-on activities like building or fixing things.', domain: 'Practical', weight: 1.0, difficulty: 'medium' },
  
  { id: 'q6', text: 'I enjoy writing computer code or algorithms.', domain: 'Logical', weight: 0.9, difficulty: 'hard' },
  { id: 'q7', text: 'I carefully research all options before making a decision.', domain: 'Analytical', weight: 0.8, difficulty: 'easy' },
  { id: 'q8', text: 'I often daydream about new inventions or concepts.', domain: 'Creative', weight: 0.9, difficulty: 'medium' },
  { id: 'q9', text: 'I enjoy presenting in front of an audience.', domain: 'Communication', weight: 1.0, difficulty: 'hard' },
  { id: 'q10', text: 'I like repairing broken household items.', domain: 'Practical', weight: 0.9, difficulty: 'medium' },
  
  { id: 'q11', text: 'I am good at breaking down a large system into its fundamental pieces.', domain: 'Analytical', weight: 1.0, difficulty: 'hard' },
  { id: 'q12', text: 'I prefer tasks that require a step-by-step approach.', domain: 'Logical', weight: 0.8, difficulty: 'easy' },
  { id: 'q13', text: 'I am often asked to mediate conflicts between friends.', domain: 'Communication', weight: 0.9, difficulty: 'medium' },
  { id: 'q14', text: 'I enjoy physical education and outdoor activities.', domain: 'Practical', weight: 0.8, difficulty: 'easy' },
  { id: 'q15', text: 'I love experimenting with music or digital design.', domain: 'Creative', weight: 0.8, difficulty: 'medium' },

  { id: 'q16', text: 'I enjoy participating in debate or moot court.', domain: 'Communication', weight: 0.9, difficulty: 'hard' },
  { id: 'q17', text: 'I often read financial and business news for fun.', domain: 'Analytical', weight: 1.0, difficulty: 'hard' },
  { id: 'q18', text: 'I can easily figure out how machines work.', domain: 'Practical', weight: 1.0, difficulty: 'hard' },
  { id: 'q19', text: 'I like participating in science fairs and experiments.', domain: 'Logical', weight: 0.9, difficulty: 'medium' },
  { id: 'q20', text: 'I excel at visual design tasks (e.g., UI, posters).', domain: 'Creative', weight: 0.9, difficulty: 'easy' },
];

export const degrees: Degree[] = [
  { id: 'd1', name: 'B.E Computer Science', requiredDomains: { Logical: 0.5, Analytical: 0.3, Practical: 0.2 }, careers: ['Software Engineer', 'Systems Architect', 'Data Scientist'] },
  { id: 'd17', name: 'B.E Electronics & Comm. (ECE)', requiredDomains: { Logical: 0.4, Analytical: 0.4, Practical: 0.2 }, careers: ['Embedded Engineer', 'Network Engineer', 'VLSI Designer'] },
  { id: 'd18', name: 'B.E Electrical & Electronics (EEE)', requiredDomains: { Logical: 0.4, Practical: 0.4, Analytical: 0.2 }, careers: ['Electrical Engineer', 'Power Systems Engineer', 'Control Systems Engineer'] },
  { id: 'd19', name: 'B.E Civil Engineering', requiredDomains: { Practical: 0.5, Logical: 0.3, Analytical: 0.2 }, careers: ['Structural Engineer', 'Site Engineer', 'Urban Planner'] },
  { id: 'd5', name: 'BTech Mechanical Engineering', requiredDomains: { Logical: 0.4, Practical: 0.4, Analytical: 0.2 }, careers: ['Mechanical Engineer', 'Automotive Engineer', 'Robotics Specialist'] },
  
  { id: 'd2', name: 'B.Com (General/Hons)', requiredDomains: { Analytical: 0.5, Logical: 0.3, Practical: 0.2 }, careers: ['Chartered Accountant', 'Financial Analyst', 'Investment Banker'] },
  { id: 'd13', name: 'B.Sc Mathematics', requiredDomains: { Logical: 0.7, Analytical: 0.3 }, careers: ['Data Analyst', 'Statistician', 'Research Scientist'] },
  { id: 'd20', name: 'B.Sc Physics', requiredDomains: { Analytical: 0.4, Logical: 0.4, Practical: 0.2 }, careers: ['Physicist', 'Lab Researcher', 'Technical Assistant'] },
  { id: 'd21', name: 'B.Sc Chemistry', requiredDomains: { Analytical: 0.4, Practical: 0.4, Logical: 0.2 }, careers: ['Chemist', 'Quality Control', 'Pharmacologist'] },
  { id: 'd22', name: 'B.Sc Computer Science', requiredDomains: { Logical: 0.5, Analytical: 0.3, Practical: 0.2 }, careers: ['Web Developer', 'Software Analyst', 'IT Consultant'] },
  { id: 'd14', name: 'B.A English', requiredDomains: { Communication: 0.7, Creative: 0.3 }, careers: ['Content Writer', 'Copywriter', 'Literature Teacher'] },
  { id: 'd15', name: 'B.A Economics', requiredDomains: { Analytical: 0.5, Logical: 0.3, Communication: 0.2 }, careers: ['Economist', 'Policy Researcher', 'Market Analyst'] },
  
  { id: 'd6', name: 'MBBS', requiredDomains: { Logical: 0.3, Analytical: 0.4, Practical: 0.3 }, careers: ['General Surgeon', 'Physician', 'Medical Researcher'] },
  { id: 'd12', name: 'BDS (Dental)', requiredDomains: { Practical: 0.5, Analytical: 0.3, Creative: 0.2 }, careers: ['Dentist', 'Orthodontist', 'Dental Consultant'] },
  { id: 'd7', name: 'B.Pharm', requiredDomains: { Analytical: 0.4, Practical: 0.4, Logical: 0.2 }, careers: ['Pharmacist', 'Drug Researcher', 'Clinical Coordinator'] },
  { id: 'd8', name: 'B.Sc Nursing', requiredDomains: { Practical: 0.5, Communication: 0.3, Analytical: 0.2 }, careers: ['Registered Nurse', 'Nurse Educator', 'Healthcare Admin'] },
  { id: 'd9', name: 'BPT (Physiotherapy)', requiredDomains: { Practical: 0.6, Communication: 0.2, Analytical: 0.2 }, careers: ['Physiotherapist', 'Sports Rehab Specialist', 'Clinic Manager'] },
  
  { id: 'd3', name: 'BA Journalism & Mass Comm', requiredDomains: { Communication: 0.6, Creative: 0.3, Analytical: 0.1 }, careers: ['Journalist', 'PR Specialist', 'Media Executive'] },
  { id: 'd4', name: 'B.Des (Design)', requiredDomains: { Creative: 0.7, Practical: 0.2, Communication: 0.1 }, careers: ['UI/UX Designer', 'Product Designer', 'Fashion Designer'] },
  { id: 'd10', name: 'B.Ed (Education)', requiredDomains: { Communication: 0.5, Creative: 0.3, Analytical: 0.2 }, careers: ['School Teacher', 'Curriculum Designer', 'Educational Consultant'] },
  { id: 'd11', name: 'Diploma in Engineering', requiredDomains: { Practical: 0.6, Logical: 0.2, Analytical: 0.2 }, careers: ['Junior Engineer', 'Technician', 'Service Engineer'] },
  { id: 'd16', name: 'B.Sc Psychology', requiredDomains: { Analytical: 0.4, Communication: 0.4, Creative: 0.2 }, careers: ['Psychologist', 'Counselor', 'HR Manager'] }
];

export const colleges: College[] = tnColleges;
