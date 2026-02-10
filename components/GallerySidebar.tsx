
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ImageItem } from '../types';

interface GallerySidebarProps {
  images: ImageItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddImages: (newImages: ImageItem[]) => void;
}

const GallerySidebar: React.FC<GallerySidebarProps> = ({ images, selectedId, onSelect, onAddImages }) => {
  const [isOpen, setIsOpen] = useState(true);
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
    <div className={`fixed top-0 left-0 h-full z-30 transition-transform duration-500 ease-in-out flex ${isOpen ? 'translate-x-0' : '-translate-x-[280px]'}`}>
      <div className="w-[280px] bg-white/80 backdrop-blur-2xl border-r border-zinc-200 p-6 flex flex-col gap-6 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900">
            <ImageIcon className="w-5 h-5 text-zinc-400" />
            Gallery
          </h2>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">
            {images.length} Items
          </span>
        </div>

        {/* Upload & Add Section */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl cursor-pointer transition-all active:scale-95 group shadow-md">
            <Upload className="w-4 h-4 text-white/80 group-hover:text-white" />
            <span className="text-sm font-medium">Upload Photos</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <form onSubmit={handleUrlAdd} className="relative group">
            <input 
              type="text" 
              placeholder="Paste image URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:bg-white focus:border-zinc-400 outline-none transition-all"
            />
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-500" />
            <button type="submit" className="hidden" />
          </form>
        </div>

        {/* Thumbnail Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => onSelect(img.id)}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group ${
                  selectedId === img.id ? 'border-zinc-900 ring-4 ring-zinc-900/10 scale-95' : 'border-transparent hover:border-zinc-300'
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-white/20 transition-opacity ${selectedId === img.id ? 'opacity-0' : 'group-hover:opacity-0 opacity-10'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="flex items-center pointer-events-none h-full">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto w-10 h-20 bg-white/90 backdrop-blur-xl border border-zinc-200 border-l-0 rounded-r-2xl flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all group hover:bg-white shadow-xl"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default GallerySidebar;
