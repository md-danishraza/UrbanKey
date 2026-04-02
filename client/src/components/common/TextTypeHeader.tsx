'use client';

import { TextTypingEffect } from './TextTypingEffect';
import { cn } from '@/lib/utils';

export interface TextTypeHeaderProps {
  words?: string[];
  subheading?: string;
  className?: string;
  headingSize?: string;
}

export function TextTypeHeader({
  words = [
    'Find your dream home with zero broker fees.',
    'Search smarter with AI-powered matching.',
    'Connect directly with verified landlords.',
    'Sign rental agreements instantly online.'
  ],
  subheading = "UrbanKey makes renting simple, transparent, and completely broker-free.",
  className = "",
  headingSize = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
}: TextTypeHeaderProps) {
  
  return (
    <div className={cn(
      "relative z-10 w-full max-w-4xl mx-auto px-4  text-center",
      className
    )}>
      {/* Typing Effect Heading */}
      <div className="min-h-[120px] sm:min-h-[100px] md:min-h-[80px] flex items-center justify-center">
        <TextTypingEffect 
          words={words}
          typingSpeed={60}
          deletingSpeed={30}
          pauseDuration={2500}
          className={cn("font-bold tracking-tight text-white", headingSize)}
        />
      </div>
      
      {/* Subheading */}
      {subheading && (
        <p className="mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-medium max-w-2xl mx-auto px-4">
          {subheading}
        </p>
      )}
    </div>
  );
}