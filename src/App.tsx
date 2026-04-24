import { useState } from 'react';
import { AssessmentResult, StreamFit, Degree, College, StudentDetails } from './types';
import WelcomeView from './components/WelcomeView';
import StudentDetailsView from './components/StudentDetailsView';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';

export type AppState = 'welcome' | 'details' | 'quiz' | 'results';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [streams, setStreams] = useState<StreamFit[] | null>(null);

  const onStart = () => setAppState('details');
  
  const onDetailsComplete = (details: StudentDetails) => {
    setStudentDetails(details);
    setAppState('quiz');
  };

  const onQuizComplete = async (submittedAnswers: Record<string, number>) => {
    setAnswers(submittedAnswers);
    setIsAnalyzing(true);
    
    // Call the backend API
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: submittedAnswers }),
      });
      const data = await response.json();
      
      // Artificial delay for the "analyzing" transition
      setTimeout(() => {
        setAssessmentResult(data.result);
        setStreams(data.streams);
        setIsAnalyzing(false);
        setAppState('results');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setIsAnalyzing(false);
      alert('Failed to calculate results. Please try again.');
    }
  };

  const restart = () => {
    setAnswers({});
    setAssessmentResult(null);
    setStreams(null);
    setStudentDetails(null);
    setAppState('welcome');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <header className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold text-xl leading-none">E</div>
              <h1 className="text-xl font-bold tracking-tight uppercase">EduGuide</h1>
            </div>
            {appState !== 'welcome' && (
              <button onClick={restart} className="md:hidden text-sm uppercase font-bold tracking-widest text-black border-2 border-transparent hover:border-black hover:bg-black hover:text-white px-3 py-1 transition-colors">
                Restart
              </button>
            )}
          </div>
          

          {appState !== 'welcome' && (
            <button onClick={restart} className="hidden md:block text-sm uppercase font-bold tracking-widest text-black border-2 border-transparent hover:border-black hover:bg-black hover:text-white px-3 py-1 transition-colors">
              Restart
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {appState === 'welcome' && <WelcomeView onStart={onStart} />}
        {appState === 'details' && <StudentDetailsView onComplete={onDetailsComplete} />}
        {appState === 'quiz' && !isAnalyzing && <QuizView onComplete={onQuizComplete} />}
        
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Analyzing Matrices</h2>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Compiling aptitude topology across 5 dimensions...</p>
            </div>
          </div>
        )}

        {appState === 'results' && assessmentResult && streams && (
          <ResultsView result={assessmentResult} streams={streams} studentDetails={studentDetails} />
        )}
      </main>
    </div>
  );
}
