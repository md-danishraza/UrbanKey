'use client';

import { useState, useRef } from 'react';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSparkle?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ 
  onSearch, 
  isLoading, 
  placeholder = "Search by city, neighborhood, or landmark...",
  className,
  variant = 'glass',
  size = 'lg',
  showSparkle = true,
  autoFocus = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    await onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      input: 'pl-10 pr-20 h-10 text-sm',
      sparkle: 'left-3 h-4 w-4',
      clear: 'right-16',
      button: 'right-1 h-8 px-3 text-sm',
    },
    md: {
      input: 'pl-12 pr-24 h-12 text-base',
      sparkle: 'left-4 h-5 w-5',
      clear: 'right-20',
      button: 'right-1.5 h-9 px-4',
    },
    lg: {
      input: 'pl-14 pr-28 h-14 text-lg',
      sparkle: 'left-5 h-6 w-6',
      clear: 'right-24',
      button: 'right-2 h-10 px-5',
    },
  };

  // Variant configurations
  const variantClasses = {
    default: {
      container: 'bg-white border border-gray-200',
      input: 'text-gray-900 placeholder:text-gray-400',
      sparkle: 'text-purple-500',
    },
    glass: {
      container: 'bg-white/10 backdrop-blur-md border border-white/20',
      input: 'text-white placeholder:text-gray-300',
      sparkle: 'text-purple-400',
    },
    dark: {
      container: 'bg-gray-800 border border-gray-700',
      input: 'text-white placeholder:text-gray-400',
      sparkle: 'text-purple-400',
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className={cn(
        "relative flex items-center rounded-full transition-all duration-200",
        isFocused && "ring-2 ring-purple-500 shadow-lg",
        currentVariant.container,
      )}>
        {/* Sparkle Icon */}
        {showSparkle && (
          <div className={cn("absolute z-10", currentSize.sparkle)}>
            <Sparkles className={cn("h-5 w-5 animate-pulse", currentVariant.sparkle)} />
          </div>
        )}

        {/* Input */}
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            currentSize.input,
            currentVariant.input
          )}
          autoFocus={autoFocus}
        />

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10",
              currentSize.clear
            )}
            aria-label="Clear search"
          >
            <X className={cn(
              size === 'sm' ? "h-4 w-4" : size === 'md' ? "h-5 w-5" : "h-6 w-6"
            )} />
          </button>
        )}

        {/* Search Button */}
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-10 rounded-full",
            currentSize.button
          )}
        >
          {isLoading ? (
            <Loader2 className={cn(
              "animate-spin",
              size === 'sm' ? "h-3 w-3" : "h-4 w-4"
            )} />
          ) : (
            <>
              <Search className={cn(
                size === 'sm' ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"
              )} />
              <span className={cn(
                size === 'sm' ? "text-xs" : "text-sm"
              )}>Search</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}