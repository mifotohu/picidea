import React, { useState } from 'react';
import { Key, HelpCircle, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 10) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-stone-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key size={32} />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Kezdjük egy API Kulccsal!</h2>
        <p className="text-stone-600">
          Az alkalmazás működéséhez a saját Google Gemini API kulcsodra lesz szükség.
          A kulcsot csak a böngésződben tároljuk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-stone-700 mb-1">
            Google Gemini API Kulcs
          </label>
          <input
            type="password"
            id="apiKey"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            placeholder="Illeszd be ide a kulcsot (pl. AIzaSy...)"
            required
          />
        </div>

        <button
          type="submit"
          disabled={inputKey.length < 10}
          className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Mentés és Indítás
        </button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-4">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center justify-between w-full text-left text-stone-600 hover:text-rose-600 transition-colors group"
        >
          <span className="flex items-center gap-2 font-medium">
            <HelpCircle size={18} />
            Hogyan szerezhetek ingyenes kulcsot?
          </span>
          {showHelp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showHelp && (
          <div className="mt-4 p-4 bg-stone-50 rounded-lg text-sm text-stone-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="font-medium">Kövesd ezeket a lépéseket (kb. 2 perc):</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Nyisd meg a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-rose-600 underline inline-flex items-center gap-1 hover:text-rose-800">Google AI Studio <ExternalLink size={12} /></a> oldalt.
              </li>
              <li>Jelentkezz be a Google fiókoddal, ha kéri.</li>
              <li>Kattints a kék <strong>"Create API key"</strong> gombra.</li>
              <li>Válaszd ki a projektet (vagy hozz létre újat), majd kattints a <strong>"Create API key in new project"</strong> opcióra.</li>
              <li>Másold ki a generált kulcsot (ami "AIza" kezdetű), és illeszd be a fenti mezőbe.</li>
            </ol>
            <p className="text-xs text-stone-500 mt-2 italic">
              Megjegyzés: A "Free of charge" csomag tökéletesen elegendő ehhez az alkalmazáshoz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};