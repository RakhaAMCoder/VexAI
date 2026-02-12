
import React, { useState, useRef, useEffect } from 'react';
import { getChatAssistance } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m the Vex AI assistant. Need help with a prompt? Just ask!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getChatAssistance(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Sorry, I couldn\'t help with that.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to brain. Try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-[450px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <span className="font-outfit font-bold text-sm">Vex Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl flex gap-1">
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500/50"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform group"
      >
        <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatHelp;
