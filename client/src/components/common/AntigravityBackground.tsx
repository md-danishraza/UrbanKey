'use client';

import Antigravity from '@/components/Antigravity'; 

export function AntigravityBackground() {
  return (

            // {/* 1. BASE BACKGROUND COLOR: Change `bg-slate-950` to any Tailwind color (e.g., bg-black, bg-blue-900, or keep bg-background for light/dark mode support) */}
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden bg-slate-950">

      
      <div className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40">
      <Antigravity
          count={300}
          // --- INTERACTIVITY PROPS ---
          magnetRadius={45}       // Increased from 10: Makes the cursor's area of effect much larger
          fieldStrength={35}      // Increased from 13: Makes the push/pull reaction much more noticeable
          lerpSpeed={0.15}        // Increased from 0.1: Makes the particles snap to the cursor a bit faster
          
          // --- SPEED PROPS ---
          waveSpeed={0.15}        // Decreased from 0.4: Slows down the global wave motion
          rotationSpeed={0.4}     // Decreased from 1.3: Slows down the spinning of individual tetrahedrons
          pulseSpeed={1.2}        // Decreased from 3: Makes the size pulsing much more subtle and calm
          
          // --- AESTHETIC PROPS (Kept mostly the same) ---
          ringRadius={10}
          waveAmplitude={1}
          particleSize={2}
          color="#f43f5e" 
          autoAnimate
          particleVariance={1.7}
          depthFactor={1.8}
          particleShape="tetrahedron"
        />
      </div>
      
      {/* 3. GRADIENT OVERLAY: If you changed the base background above, make sure to update these gradient colors to match so the fade looks natural */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/50 to-slate-950" />
    </div>
  );
}