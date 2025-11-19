import React from 'react';
import { PinterestSuggestion } from '../types';
import { ExternalLink, Search, Hash } from 'lucide-react';

interface PinterestCardProps {
  suggestion: PinterestSuggestion;
  index: number;
}

export const PinterestCard: React.FC<PinterestCardProps> = ({ suggestion, index }) => {
  // Construct the Pinterest search URL
  const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(suggestion.searchQuery)}`;
  
  // Generate a dynamic placeholder color based on index for variety
  const colors = ['bg-rose-50', 'bg-amber-50', 'bg-emerald-50', 'bg-blue-50', 'bg-violet-50', 'bg-fuchsia-50'];
  const accentColors = ['text-rose-600', 'text-amber-600', 'text-emerald-600', 'text-blue-600', 'text-violet-600', 'text-fuchsia-600'];
  
  const bgClass = colors[index % colors.length];
  const textClass = accentColors[index % accentColors.length];

  return (
    <a 
      href={pinterestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col h-full p-5 rounded-xl border border-stone-200 hover:border-rose-200 hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 p-2 rounded-bl-xl ${bgClass} ${textClass} text-xs font-bold uppercase tracking-wider`}>
        {suggestion.category}
      </div>

      <div className="mb-4 mt-2">
        <div className={`w-12 h-12 rounded-full ${bgClass} ${textClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Hash size={20} />
        </div>
        <h3 className="text-lg font-bold text-stone-800 leading-tight group-hover:text-rose-600 transition-colors">
          {suggestion.title}
        </h3>
      </div>

      <p className="text-stone-600 text-sm mb-6 flex-grow">
        {suggestion.description}
      </p>

      <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-medium text-stone-500 group-hover:text-rose-600">
        <span className="flex items-center gap-2">
          <Search size={14} />
          Keresés a Pinteresten
        </span>
        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  );
};