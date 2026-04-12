'use client';

import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import Lenis from 'lenis';
import styles from './ScrollStack.module.css';

// 1. Export the Item with Module styles
export const ScrollStackItem = ({ children, itemClassName = '' }: { children: React.ReactNode; itemClassName?: string }) => (
  <div className={`${styles.card} ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemScale?: number;      // How much smaller each card gets (e.g., 0.05)
  stackOffset?: number;    // Pixels from top to start stacking
  useWindowScroll?: boolean;
}

const ScrollStack = ({
  children,
  className = '',
  itemScale = 0.05, 
  stackOffset = 40, // Trigger stacking when top of card is 40px from top of screen
  useWindowScroll = true, // Default to true, usually better for main page layouts
}: ScrollStackProps) => {
  
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Core Math Logic updated for responsive sync
  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    cardsRef.current.forEach((card, index) => {
      // Use getBoundingClientRect for absolute precision relative to viewport
      const rect = card.getBoundingClientRect();
      
      // Calculate how far the card has moved past our "stack point"
      // If rect.top < stackOffset, it means the card is hitting the "ceiling" and should stick
      const distancePastCeiling = stackOffset - rect.top;

      if (distancePastCeiling > 0) {
        // The card is pinned! Apply scaling and translation to create the "stack" effect
        
        // Push it down so it stays fixed to the ceiling
        const translateY = distancePastCeiling; 
        
        // Calculate scale based on how far we've scrolled past it
        // The further we scroll, the smaller it gets (until a certain point)
        const scaleDrop = Math.min((distancePastCeiling / 1000) * itemScale, itemScale * 3); 
        const scale = 1 - scaleDrop;
        
        // Calculate blur (optional, looks nice for deep stacks)
        const blur = Math.min((distancePastCeiling / 500) * 2, 4);

        // Apply transform
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = `${index}`; // Keep top cards visually underneath new ones scrolling up
      } else {
        // Card is in normal flow
        card.style.transform = 'translate3d(0, 0px, 0) scale(1)';
        card.style.filter = 'none';
        card.style.zIndex = `${index}`;
      }
    });
  }, [itemScale, stackOffset]);

  // Setup Lenis Smooth Scroll
  useLayoutEffect(() => {
    // 1. Gather all cards
    const scroller = scrollerRef.current;
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(`.${styles.card}`)
        : scroller?.querySelectorAll(`.${styles.card}`) || []
    ) as HTMLElement[];
    
    cardsRef.current = cards;

    // 2. Initialize Lenis
    const lenis = new Lenis({
      wrapper: useWindowScroll ? window : scroller!,
      content: useWindowScroll ? document.documentElement : scroller?.querySelector(`.${styles.inner}`) as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // 3. Animation Loop
    lenis.on('scroll', updateCardTransforms);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    // Initial check
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [useWindowScroll, updateCardTransforms]);

  // Ensure window resize recalculates positions
  useEffect(() => {
    window.addEventListener('resize', updateCardTransforms);
    return () => window.removeEventListener('resize', updateCardTransforms);
  }, [updateCardTransforms]);


  return (
    <div className={`${styles.scroller} ${className}`.trim()} ref={scrollerRef}>
      <div className={styles.inner}>
        {children}
        <div className={styles.endMarker} />
      </div>
    </div>
  );
};

export default ScrollStack;