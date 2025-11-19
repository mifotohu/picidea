import React, { useState } from 'react';
import { Key, HelpCircle, Check, ExternalLink, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key size={32} />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Kezdjük egy API Kulccsal!</h2>
      </div>

      {/* New informational section for beginners */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8 text-left">
        <h3 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
          <Info size={18} className="text-rose-500" />
          Miért van erre szükség?
        </h3>
        <ul className="space-y-3 text-sm text-stone-600">
          <li className="flex items-start gap-3">
            <div className="min-w-[80px] font-bold text-stone-800">Technológia:</div>
            <div>Az applikáció a Google Gemini mesterséges intelligenciáját használja a képek elemzéséhez. A Google egy "API kulcsot" kér, hogy engedélyezze a hozzáférést ehhez a rendszerhez.</div>
          </li>
          <li className="flex items-start gap-3">
            <div className="min-w-[80px] font-bold text-stone-800">Ingyenes?</div>
            <div>Igen! A "Google AI Studio" <strong>Free tier</strong> csomagja teljesen ingyenes személyes használatra. Nem kell bankkártyát megadnod.</div>
          </li>
          <li className="flex items-start gap-3">
            <div className="min-w-[80px] font-bold text-stone-800">Napi limit:</div>
            <div>A "Free" csomaggal <strong>naponta 1500 képet</strong> elemezhetsz ingyen (Gemini Flash modellel), ami hobbicélra gyakorlatilag korlátlan.</div>
          </li>
           <li className="flex items-start gap-3">
            <div className="min-w-[80px] font-bold text-stone-800">Biztonság:</div>
            <div>A kulcsodat <strong>csak a te böngésződben tároljuk 1 napig</strong> (24 óra), utána automatikusan törlődik a gyorsítótárból. Mi soha nem látjuk és nem férünk hozzá.</div>
          </li>
        </ul>
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
          Mentés (1 napig) és Indítás
        </button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-4">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center justify-between w-full text-left text-stone-600 hover:text-rose-600 transition-colors group"
        >
          <span className="flex items-center gap-2 font-medium">
            <HelpCircle size={18} />
            Segítség a kulcs igényléséhez (Lépésről-lépésre)
          </span>
          {showHelp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showHelp && (
          <div className="mt-4 p-4 bg-rose-50 rounded-lg text-sm text-stone-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border border-rose-100">
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Kattints erre a linkre: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-rose-700 underline font-bold hover:text-rose-900 inline-flex items-center gap-1">Google AI Studio <ExternalLink size={12}/></a>
              </li>
              <li>Jelentkezz be a Google (Gmail) fiókoddal.</li>
              <li>Kattints a nagy kék <strong>"Create API key"</strong> gombra.</li>
              <li>A felugró ablakban válaszd a <strong>"Create API key in new project"</strong> lehetőséget.</li>
              <li>Másold ki a generált hosszú kódot (ami "AIza" betűkkel kezdődik).</li>
              <li>Gyere vissza ide, és illeszd be a fenti mezőbe.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};