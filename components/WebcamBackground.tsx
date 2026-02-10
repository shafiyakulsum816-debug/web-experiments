
import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Loader2 } from 'lucide-react';

interface WebcamBackgroundProps {
  opacity: number;
}

const WebcamBackground: React.FC<WebcamBackgroundProps> = ({ opacity }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setLoading(true);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720, facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access denied. Please check permissions.");
      } finally {
        setLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 overflow-hidden"
      style={{ opacity }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-50" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
          <CameraOff className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute min-w-full min-h-full object-cover scale-x-[-1]"
        />
      )}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    </div>
  );
};

export default WebcamBackground;
