import Link from 'next/link';
import { Home, MapPinOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Subtle Background Glows to match UrbanKey theme */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center space-y-8 p-8 md:p-12 backdrop-blur-sm bg-background/50 border border-border/50 rounded-3xl shadow-2xl">
        
        {/* Animated Icon */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 mb-4 animate-in zoom-in duration-500">
          <MapPinOff className="w-12 h-12 text-rose-500 animate-pulse" />
        </div>

        {/* Text Block */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-foreground/5 animate-in slide-in-from-bottom-4 duration-700 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 -z-10 select-none">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground animate-in slide-in-from-bottom-6 duration-500">
            Address Not Found
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500 delay-150">
            We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you just lost your keys.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-in fade-in duration-700 delay-300">
          <Link 
            href="/"
            className={cn(
              "flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300",
              "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            <Home className="w-5 h-5" />
            Back to Homepage
          </Link>
          <button 
            // Depending on if this is a client component, you can use useRouter().back(). 
            // For a server component, linking to a generic previous safe route or search is best.
            // Using a standard Link to search as a fallback "back" action here:
            className={cn(
              "flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
            )}
          >
            <Link href="/properties/search" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Browse Properties
            </Link>
          </button>
        </div>
      </div>

      {/* Brand Watermark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 font-medium tracking-widest text-sm uppercase">
        UrbanKey
      </div>
    </div>
  );
}