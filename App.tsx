import React, { useState, useRef } from 'react';
import { User, AspectRatio, GeneratedImage, ImageSize } from './types';
import { generateImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import RatioPicker from './components/RatioPicker';
import ChatHelp from './components/ChatHelp';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<AspectRatio>('1:1');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mandatory API key selection for Gemini 3 models as per platform requirements
  const handleStart = async () => {
    // @ts-ignore
    if (typeof window.aistudio !== 'undefined' && window.aistudio.hasSelectedApiKey) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Guideline: assume success after triggering openSelectKey() due to potential race conditions
      }
    }
    
    setUser({
      id: 'vex-user',
      name: "Vex Explorer",
      email: "hello@vexai.com",
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=VexAI`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setCurrentResult(null);
    setRefImage(null);
    setPrompt('');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!user || !prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateImage(
        prompt, 
        ratio, 
        size, 
        refImage || undefined
      );
      
      setCurrentResult(imageUrl);
      
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        aspectRatio: ratio,
        size: size,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newImg, ...prev]);
    } catch (err: any) {
      // Re-trigger key selection if the requested entity was not found (sign of key issue)
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key issue detected. Please re-select a valid project key.");
        // @ts-ignore
        if (typeof window.aistudio !== 'undefined' && window.aistudio.openSelectKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      } else {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    if (currentResult) {
      setRefImage(currentResult);
      setPrompt("Refine this image by...");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,black)]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
        
        <div className="relative z-10 w-full max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">
            Create By Rakha A.M
          </div>
          
          <h1 className="text-7xl md:text-8xl font-outfit font-black tracking-tighter leading-none bg-gradient-to-br from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            Vex AI
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-lg mx-auto leading-relaxed font-light">
            Unleash the power of Gemini Nano Banana. Create, edit, and explore high-fidelity AI imagery with zero friction.
          </p>

          <div className="pt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleStart}
              className="group relative px-12 py-5 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Get Started
              <div className="absolute inset-0 rounded-2xl bg-white blur-lg opacity-0 group-hover:opacity-40 transition-opacity -z-10"></div>
            </button>
            <div className="text-center">
              <p className="text-xs text-white/20 font-medium uppercase tracking-widest">Powered by Google Gemini 3</p>
              {/* Billing documentation link as required for paid project selection */}
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-block text-[10px] text-white/40 hover:text-white underline transition-colors"
              >
                Paid project API key required. Learn about billing.
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-inter text-white">
      <Sidebar 
        user={user} 
        history={history} 
        onLogout={handleLogout} 
        onSelectImage={(img) => {
          setCurrentResult(img.url);
          setPrompt(img.prompt);
          setRatio(img.aspectRatio);
        }}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        <div className="flex-1 relative overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Editor Canvas */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[450px] flex items-center justify-center relative group">
              {currentResult ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={currentResult} 
                    alt="Generated content" 
                    className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl transition-all"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleEdit}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-2 rounded-lg text-white text-xs flex items-center gap-2 border border-white/10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2} /></svg>
                      Edit
                    </button>
                    <a 
                      href={currentResult} 
                      download="vex-gen.png"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-lg text-white border border-white/10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} /></svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1} /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-outfit font-bold text-white/60 mb-2">Start your creation</h3>
                    <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
                      Enter a prompt below. You're using Gemini 3 Pro with integrated high-fidelity vision engine.
                    </p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center z-20">
                  <div className="w-20 h-20 border-t-4 border-purple-500 rounded-full animate-spin shadow-2xl shadow-purple-500/50"></div>
                  <p className="mt-8 font-outfit font-bold text-2xl tracking-tight text-white animate-pulse">
                    Synthesizing Pro Vision...
                  </p>
                  <p className="text-white/40 text-sm mt-2 font-medium">Generating high-fidelity result</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm flex items-center justify-between animate-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2} /></svg>
                  <span>{error}</span>
                </div>
                <button onClick={() => setError(null)} className="text-white/20 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg>
                </button>
              </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/50 flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" strokeWidth={2} /></svg>
                    Aspect Ratio
                  </label>
                  <RatioPicker selected={ratio} onSelect={setRatio} />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/50 flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth={2} /></svg>
                    Resolution
                  </label>
                  <div className="flex gap-2">
                    {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                          size === s 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white/50 flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} /></svg>
                    Reference Image
                  </label>
                  {refImage && (
                    <button onClick={() => setRefImage(null)} className="text-[10px] text-red-500 font-bold hover:underline">RESET</button>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                    ${refImage ? 'border-purple-600/50 bg-purple-600/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                  `}
                >
                  {refImage ? (
                    <img src={refImage} alt="Reference" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-10 h-10 text-white/10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth={2} /></svg>
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Upload Seed</span>
                    </div>
                  )}
                </button>
                {/* Fixed incorrect fileInputRef prop to standard React ref prop */}
                <input type="file" ref={fileInputRef} onChange={onFileChange} hidden accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-black border-t border-white/10 relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What can I imagine for you today?"
                className="w-full bg-[#111] border border-white/10 rounded-3xl py-5 pl-6 pr-40 min-h-[100px] text-lg focus:outline-none focus:border-white/20 transition-all resize-none shadow-2xl placeholder:text-white/10 font-outfit"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`h-14 px-8 rounded-2xl font-bold transition-all flex items-center gap-3 text-base
                    ${isGenerating || !prompt.trim() 
                      ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                      : 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl shadow-white/10'
                    }
                  `}
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Generate</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth={2} /></svg>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
               <div className="flex gap-6 items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></div>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Engine: Gemini 3 Pro</span>
                 </div>
                 <div className="flex items-center gap-2 text-white/30">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeWidth={2} /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider">High Fidelity Mode</span>
                 </div>
               </div>
               <p className="text-[10px] text-white/20 font-medium tracking-[0.1em]">© 2024 VEX CREATIVE LABS</p>
            </div>
          </div>
        </div>
      </main>

      <ChatHelp />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;