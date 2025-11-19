import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string, previewUrl: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isAnalyzing }) => {
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Kérlek, csak képfájlt tölts fel (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract pure base64 part
      const base64Data = base64String.split(',')[1];
      onImageSelected(base64Data, file.type, base64String);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isAnalyzing) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 text-center 
        ${isAnalyzing ? 'border-stone-200 bg-stone-50 opacity-50 cursor-wait' : 'border-stone-300 bg-white hover:border-rose-400 hover:bg-rose-50/30 cursor-pointer'}`}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleChange}
        disabled={isAnalyzing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className={`p-4 rounded-full ${isAnalyzing ? 'bg-stone-200' : 'bg-rose-100 text-rose-600'}`}>
          {isAnalyzing ? (
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-500"></div>
          ) : (
            <Upload size={32} />
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-stone-800">
            {isAnalyzing ? 'Elemzés folyamatban...' : 'Húzd ide a képet vagy kattints'}
          </h3>
          <p className="text-sm text-stone-500 max-w-xs mx-auto">
            Tölts fel egy fotót a kézműves alkotásodról (JPG, PNG). 
            Mi megkeressük hozzá a legjobb Pinterest ötleteket.
          </p>
        </div>
      </div>
    </div>
  );
};