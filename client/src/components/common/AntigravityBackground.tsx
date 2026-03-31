'use client';

import Antigravity from '@/components/Antigravity'; 

export function AntigravityBackground() {
  return (

            // {/* 1. BASE BACKGROUND COLOR: Change `bg-slate-950` to any Tailwind color (e.g., bg-black, bg-blue-900, or keep bg-background for light/dark mode support) */}
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden bg-slate-950">

      
      <div className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40">
        <Antigravity
          count={300}
          magnetRadius={10}
          ringRadius={10}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={2}
          lerpSpeed={0.1}
        //     {/* 2. PARTICLE COLOR: Change this hex code to change the color of the floating shapes */}
          color="#f43f5e" 
          autoAnimate
          particleVariance={1.7}
          rotationSpeed={1.3}
          depthFactor={1.8}
          pulseSpeed={3}
          particleShape="tetrahedron"
          fieldStrength={13}
        />
      </div>
      
      {/* 3. GRADIENT OVERLAY: If you changed the base background above, make sure to update these gradient colors to match so the fade looks natural */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/50 to-slate-950" />
    </div>
  );
}