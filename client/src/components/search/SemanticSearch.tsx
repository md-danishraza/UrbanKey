'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    await onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Auto-search after a short delay
    setTimeout(() => {
      onSearch(suggestion);
    }, 100);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center rounded-xl transition-all duration-200",
          isFocused ? "ring-2 ring-purple-500 shadow-lg" : "shadow-md",
          "bg-white"
        )}>
          {/* Sparkle Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
          </div>

          {/* Input */}
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(query.length > 0);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder || "Try: 'spacious 2BHK near metro with power backup'"}
            className="pl-12 pr-24 h-14 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Clear Button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-lg px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-1" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && !isLoading && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
      </form>

      {/* AI Badge */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
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