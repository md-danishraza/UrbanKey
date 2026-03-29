'use client';

import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

interface SemanticSearchProps {
  onSearch: (query: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function SemanticSearch({ onSearch, isLoading, placeholder, className }: SemanticSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Try: 'spacious 2BHK near metro with power backup'"}
          className="pl-10 pr-24 h-12 text-base"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !query.trim()}
          className="absolute right-1 top-1/2 -translate-y-1/2"
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
      <p className="text-xs text-gray-500 mt-2">
        AI-powered search understands natural language. Try describing what you're looking for!
      </p>
    </form>
  );
}