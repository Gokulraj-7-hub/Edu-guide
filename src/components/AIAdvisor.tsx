import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, User } from 'lucide-react';
import { AssessmentResult, StreamFit, Degree } from '../types';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AIAdvisor({ result, streams }: { result: AssessmentResult, streams: StreamFit[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAdvice = async () => {
    setHasRequested(true);
    setLoading(true);
    try {
      const module = await import('../shared/data.js');
      const degrees = module.degrees;

      const response = await fetch('/api/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, streams, degrees: degrees.slice(0, 3) }),
      });
      const data = await response.json();
      
      const initialMessage: Message = { role: 'assistant', content: data.explanation };
      setMessages([initialMessage]);
    } catch (err) {
      console.error(err);
      setMessages([{ role: 'assistant', content: 'Failed to generate AI advice.' }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('##')) return <h3 key={i} className="text-lg font-black uppercase mt-4 mb-2">{line.replace('##', '')}</h3>;
      if (line.startsWith('#')) return <h2 key={i} className="text-xl font-black uppercase mt-4 mb-2">{line.replace('#', '')}</h2>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 font-medium list-disc">{line.replace(/^[*|-]\s/, '')}</li>;
      if (!line.trim()) return <br key={i} />;
      return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col h-[600px] w-full">      
      <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-black">AI Advisor</h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-black font-bold uppercase tracking-widest text-[10px]">Real-time Counselor</p>
            </div>
          </div>
        </div>
        {!hasRequested && (
          <button 
            onClick={fetchAdvice}
            className="border-2 border-black bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Start Session
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 font-medium">
        {!hasRequested ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Sparkles className="w-16 h-16 text-black mb-4" />
            <p className="font-black uppercase tracking-widest text-lg">Initialize neural link to begin.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 border-black ${msg.role === 'user' ? 'bg-yellow-400' : 'bg-black'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="text-sm">
                      {renderContent(msg.content)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black animate-bounce">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3 p-4 border-2 border-black bg-gray-50 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {hasRequested && (
        <form onSubmit={sendMessage} className="flex space-x-2 mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ASK ABOUT CAREERS, COLLEGES, OR SYLLABUS..."
            className="flex-grow border-4 border-black p-3 font-bold uppercase text-sm focus:outline-none focus:bg-yellow-50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-black text-white p-3 border-4 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      )}
    </div>
  );
}
