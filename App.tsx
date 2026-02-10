
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { 
  Search, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Sparkles,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import ImageSphere from './components/ImageSphere';
import GallerySheet from './components/GallerySheet';
import { geminiService } from './services/geminiService';
import { ImageItem } from './types';

const INITIAL_IMAGES_COUNT = 48;

const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.4);
  const [themeInput, setThemeInput] = useState('Dreamy Minimalist Art');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchImages = useCallback(async (keywords: string[]) => {
    setLoading(true);
    try {
      const newImages = keywords.map((k, i) => ({
        id: `gen-${k}-${i}-${Date.now()}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(k + i)}/800/1000`,
        title: k
      }));
      setImages(newImages);
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const keywords = await geminiService.generateImageKeywords(themeInput);
    const padded = [...keywords];
    while (padded.length < INITIAL_IMAGES_COUNT) {
      padded.push(`minimal-art-${padded.length}`);
    }
    await fetchImages(padded.slice(0, INITIAL_IMAGES_COUNT));
  };

  const handleAddCustomImages = (newImages: ImageItem[]) => {
    setImages(prev => [...newImages, ...prev]);
  };

  const handleSelectImage = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#FDFDFD] overflow-hidden text-zinc-900 select-none font-['Inter'] flex flex-col items-center">
      {/* iOS-Style Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-11 z-50 pointer-events-none flex justify-between px-8 items-end pb-1">
         <span className="text-sm font-bold tracking-tight text-zinc-800">9:41</span>
         <div className="flex gap-1.5 items-center">
            <Signal className="w-3.5 h-3.5 text-zinc-800" />
            <Wifi className="w-3.5 h-3.5 text-zinc-800" />
            <Battery className="w-4 h-4 text-zinc-800" />
         </div>
      </div>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <ImageSphere 
            images={images} 
            radius={7} 
            zoom={zoom} 
            selectedId={selectedId}
          />
          
          <OrbitControls 
            enablePan={false} 
            enableRotate={false} 
            enableZoom={false}
          />
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Top Floating UI: Search Capsule */}
      <div className="absolute top-12 left-0 right-0 z-30 px-6 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-white/60 backdrop-blur-3xl border border-white/40 rounded-[28px] px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] group focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all border-b-2 border-b-zinc-100"
          >
            <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 mr-3" />
            <input 
              type="text" 
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="Visual vibe..."
              className="bg-transparent border-none outline-none text-[15px] font-medium w-full placeholder:text-zinc-300"
            />
            <button 
              type="submit" 
              className={`p-2 rounded-full transition-all ${loading ? 'animate-spin' : 'hover:bg-zinc-100 active:scale-90'}`}
              disabled={loading}
            >
              {loading ? <RefreshCw className="w-5 h-5 text-zinc-400" /> : <Sparkles className="w-5 h-5 text-zinc-900" />}
            </button>
          </form>
        </div>
      </div>

      {/* Side Controls: Zoom Pill (Right Hand Optimized) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden sm:block">
        <div className="bg-white/60 backdrop-blur-3xl p-3.5 rounded-full border border-white/40 shadow-xl pointer-events-auto flex flex-col items-center gap-6">
          <Maximize2 className="w-4 h-4 text-zinc-400" />
          <div className="h-44 w-1 flex items-center justify-center bg-zinc-100 rounded-full relative">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="absolute -rotate-90 w-44 h-12 appearance-none bg-transparent cursor-pointer vertical-slider"
            />
          </div>
          <Minimize2 className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* iOS-Style Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-zinc-200 rounded-full z-[100] pointer-events-none shadow-sm" />

      {/* Bottom Sheet Component */}
      <GallerySheet 
        images={images} 
        selectedId={selectedId} 
        onSelect={handleSelectImage} 
        onAddImages={handleAddCustomImages}
      />

      <style>{`
        .vertical-slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .vertical-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #18181b;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          transition: transform 0.1s ease;
        }
        .vertical-slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        .vertical-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #18181b;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default App;
