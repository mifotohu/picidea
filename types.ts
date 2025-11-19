export interface PinterestSuggestion {
  id: string;
  title: string;
  description: string;
  searchQuery: string;
  category: string;
}

export interface AnalysisResult {
  craftType: string;
  suggestions: PinterestSuggestion[];
}

export interface ApiKeyConfig {
  key: string;
  isValid: boolean;
}