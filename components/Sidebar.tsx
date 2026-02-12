
import React from 'react';
import { User, GeneratedImage } from '../types';
import { APP_NAME } from '../constants';

interface SidebarProps {
  user: User;
  history: GeneratedImage[];
  onLogout: () => void;
  onSelectImage: (img: GeneratedImage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, history, onLogout, onSelectImage }) => {
  return (
    <div className="w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-8">
        <h1 className="text-3xl font-outfit font-black tracking-tighter bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent italic">
          {APP_NAME}
        </h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Creative Studio</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6">Recent Creations</div>
        <div className="grid grid-cols-2 gap-3">
          {history.length === 0 ? (
            <div className="col-span-2 py-16 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
              <div className="w-10 h-10 bg-white/5 rounded-xl mx-auto mb-4 flex items-center justify-center">
                 <svg className="w-5 h-5 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} /></svg>
              </div>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Empty Canvas</p>
            </div>
          ) : (
            history.map((img) => (
              <button
                key={img.id}
                onClick={() => onSelectImage(img)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 hover:border-white/30 transition-all hover:scale-[1.05] bg-[#111]"
              >
                <img src={img.url} alt={img.prompt} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[8px] truncate text-white/80 font-medium">{img.prompt}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto p-6 bg-white/[0.02] border-t border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img src={user.photoUrl} alt={user.name} className="relative w-12 h-12 rounded-full border border-white/10 bg-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate text-white font-outfit">{user.name}</div>
            <div className="text-[10px] text-white/40 truncate font-medium">{user.email}</div>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10"
        >
          Exit Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
