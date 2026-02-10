
import React, { useState } from 'react';
import { Link as LinkIcon, ChevronUp, ChevronDown, Plus, Sparkle } from 'lucide-react';
import { ImageItem } from '../types';

interface GallerySheetProps {
  images: ImageItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddImages: (newImages: ImageItem[]) => void;
}

const GallerySheet: React.FC<GallerySheetProps> = ({ images, selectedId, onSelect, onAddImages }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onAddImages([{
          id: `upload-${Date.now()}-${Math.random()}`,
          url: result,
          title: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUrlAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAddImages([{
      id: `url-${Date.now()}`,
      url: urlInput,
      title: 'Remote Image'
    }]);
    setUrlInput('');
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isExpanded ? 'h-[75vh]' : 'h-28'
      }`}
    >
      <div className="h-full bg-white/70 backdrop-blur-3xl border-t border-white/50 shadow-[0_-20px_50px_rgba(0,0,0,0.04)] rounded-t-[40px] overflow-hidden flex flex-col">
        {/* Header/Grabber */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full pt-4 pb-2 flex flex-col items-center gap-1.5 group active:opacity-60 transition-opacity"
        >
          <div className="w-12 h-1.5 bg-zinc-200/80 rounded-full group-hover:bg-zinc-300 transition-colors" />
          <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-bold uppercase tracking-[0.15em] mt-1">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            {isExpanded ? 'Minimize' : `Explore ${images.length} Images`}
          </div>
        </button>

        <div className="flex-1 px-8 pb-12 overflow-y-auto custom-scrollbar">
          {/* Header Action Row */}
          <div className="flex flex-col gap-5 mt-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  Library
                  <Sparkle className="w-4 h-4 text-zinc-300" />
                </h2>
                <p className="text-sm text-zinc-400 font-medium">Recently generated items</p>
              </div>
              <label className="p-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[20px] cursor-pointer transition-all active:scale-90 shadow-lg shadow-zinc-900/10">
                <Plus className="w-6 h-6" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <form onSubmit={handleUrlAdd} className="relative group">
              <input 
                type="text" 
                placeholder="Paste remote URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-zinc-100/60 border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-[15px] focus:bg-white focus:border-zinc-200 outline-none transition-all shadow-inner placeholder:text-zinc-300"
              />
              <LinkIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-300 group-focus-within:text-zinc-500 transition-colors" />
            </form>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 pb-20">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => {
                  onSelect(img.id);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`group relative aspect-[4/5] rounded-[24px] overflow-hidden border-2 transition-all duration-500 ease-out ${
                  selectedId === img.id 
                  ? 'border-zinc-900 ring-4 ring-zinc-900/5 scale-[0.98] shadow-2xl' 
                  : 'border-transparent hover:scale-105 active:scale-95'
                }`}
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-opacity duration-500 ${selectedId === img.id ? 'opacity-0' : 'opacity-20 group-hover:opacity-0'}`} />
                {selectedId === img.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-900 shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E4E7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default GallerySheet;
