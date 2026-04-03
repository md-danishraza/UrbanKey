'use client';

import { useState, useRef } from 'react';
import {  Sparkles, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SearchBar } from '../common/SearchBar';

interface SemanticSearchProps {
  onSearch: (query: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

const defaultSuggestions = [
  '2BHK apartment near metro station',
  'Fully furnished with power backup',
  'Family-friendly with 24/7 water',
  'Budget-friendly 1BHK for bachelors',
  'Luxury 3BHK with parking',
  'Pet-friendly apartment',
];

export function SemanticSearch({ 
  onSearch, 
  isLoading, 
  placeholder, 
  className,
  suggestions = defaultSuggestions 
}: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setTimeout(() => {
      onSearch(suggestion);
    }, 100);
  };


  return (
    <div className={cn("w-full", className)}>
       <SearchBar
        onSearch={onSearch}
        isLoading={isLoading}
        placeholder={placeholder || "Try: 'spacious 2BHK near metro with power backup'"}
        variant="glass"
        size="lg"
        showSparkle={true}
      />
      
       {/* Suggestions Dropdown */}
       {showSuggestions && !isLoading && query && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>Popular searches</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors duration-150"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
        </div>
       )}

      {/* AI Badge */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-white flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-500" />
          AI-powered semantic search understands natural language
        </p>
        <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200 bg-purple-50">
          Beta
        </Badge>
      </div>
    </div>
  );
}