'use client';

import { useState, useEffect } from 'react';


interface TextTypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TextTypingEffect({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = ''
}: TextTypingEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(prev => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText.length === currentWord.length) {
        setIsPaused(true);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  // Find longest word for container width
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, '');

  return (
    <div className={className}>
      <div className="inline-block relative py-2">
        {/* Invisible spacer to prevent layout shift */}
        <span className="invisible font-array uppercase font-light  leading-relaxed opacity-0 pointer-events-none select-none" aria-hidden="true">
          {longestWord}
        </span>
        
        {/* Actual typing text */}
        <span className="absolute top-0 font-array uppercase font-light leading-relaxed left-0 bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
          {currentText}
        </span>
        
        {/* Blinking cursor */}
        <span className="absolute -right-3 top-10 lg:top-20 text-rose-500 animate-pulse inline-block transform scale-y-200">|</span>
      </div>
    </div>
  );
}