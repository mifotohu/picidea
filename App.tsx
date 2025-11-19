import React, { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ImageUploader } from './components/ImageUploader';
import { PinterestCard } from './components/PinterestCard';
import { analyzeImageForPinterest } from './services/geminiService';
import { AnalysisResult } from './types';
import { Palette, RefreshCw, LogOut, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'pintvibe_api_key_data';

interface StoredKeyData {
  key: string;
  expiry: number;
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key from local storage on mount with expiration check
  useEffect(() => {
    const storedDataString = localStorage.getItem(STORAGE_KEY);
    
    if (storedDataString) {
      try {
        const storedData: StoredKeyData = JSON.parse(storedDataString);
        const now = Date.now();

        if (now < storedData.expiry) {
          setApiKey(storedData.key);
        } else {
          // Key expired
          localStorage.removeItem(STORAGE_KEY);
          setApiKey(null);
        }
      } catch (e) {
        // Error parsing, clear storage
        localStorage.removeItem(STORAGE_KEY);
        setApiKey(null);
      }
    } else {
      // Fallback for older version key if exists (optional cleanup)
      const oldKey = localStorage.getItem('gemini_api_key');
      if (oldKey) {
        localStorage.removeItem('gemini_api_key');
      }
    }
  }, []);

  const handleSaveKey = (key: string) => {
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const data: StoredKeyData = { key, expiry };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setApiKey(key);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
    setAnalysis(null);
    setPreviewUrl(null);
  };

  const handleImageSelected = async (base64: string, mimeType: string, preview: string) => {
    if (!apiKey) return;

    setPreviewUrl(preview);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeImageForPinterest(apiKey, base64, mimeType);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Hiba történt az elemzés során. Ellenőrizd az API kulcsot, vagy próbálj másik képet.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <Palette size={24} />
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Pint<span className="text-rose-600">Vibe</span>
            </h1>
          </div>
          {apiKey && (
            <button 
              onClick={handleLogout}
              className="text-xs font-medium text-stone-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <LogOut size={14} />
              Kulcs Törlése
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow bg-stone-50 px-4 py-8 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Intro / Hero Section */}
          <div className="text-center mb-10 pb-8 border-b border-stone-200/60">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wide mb-4">
              <Sparkles size={14} />
              Kreatív Inspiráció
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Találd meg a tökéletes Pinterest hangulatot
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              A kézműves alkotásod több, mint egy tárgy – egy életérzés. Töltsd fel a fotót, és a mesterséges intelligencia segít megtalálni azokat a Pinterest trendeket és kulcsszavakat, amikkel a munkád igazán érvényesülni tud.
            </p>
          </div>

          {!apiKey ? (
            <ApiKeyModal onSave={handleSaveKey} />
          ) : (
            <div className="space-y-8">
              
              {/* Main Interface */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Panel: Upload & Preview */}
                <div className="md:col-span-4 lg:col-span-3 space-y-4">
                  {!previewUrl ? (
                    <ImageUploader 
                      onImageSelected={handleImageSelected} 
                      isAnalyzing={isAnalyzing} 
                    />
                  ) : (
                    <div className="relative bg-white p-3 rounded-xl shadow-sm border border-stone-200">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 relative">
                        <img 
                          src={previewUrl} 
                          alt="Uploaded craft" 
                          className="object-cover w-full h-full"
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="animate-pulse flex flex-col items-center text-rose-600 font-medium">
                              <div className="h-8 w-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                              Elemzés...
                            </div>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={handleReset}
                        disabled={isAnalyzing}
                        className="mt-3 w-full py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Új kép feltöltése
                      </button>
                    </div>
                  )}

                  {analysis && (
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-bottom-4">
                      <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                        Felismerve
                      </h3>
                      <p className="text-lg font-medium text-stone-800 leading-snug">
                        {analysis.craftType}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Panel: Results */}
                <div className="md:col-span-8 lg:col-span-9">
                  {!analysis && !isAnalyzing && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl bg-white/50">
                      <Palette size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium text-stone-500">
                        Válassz egy képet bal oldalon!
                      </p>
                      <p className="text-sm text-stone-400 mt-2 max-w-xs">
                        Elemezzük a stílust, színeket és technikát, majd keresünk hozzá illő Pinterest ötleteket.
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                      <div className="mt-1 min-w-[20px]">⚠️</div>
                      <p>{error}</p>
                    </div>
                  )}

                  {analysis && (
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                        <Sparkles className="text-rose-500" size={24} />
                        Pinterest Ötletek
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <PinterestCard 
                            key={suggestion.id || idx} 
                            suggestion={suggestion} 
                            index={idx} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-stone-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-stone-500 text-sm">
          <p className="font-medium">Az applikáció VIBE CODING technikával készült. © Práger Péter / 2025.</p>
          <a 
            href="https://www.mifotografia.hu/vc/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-block hover:text-rose-600 transition-colors border-b border-transparent hover:border-rose-600"
          >
            www.mifotografia.hu/vc/
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;