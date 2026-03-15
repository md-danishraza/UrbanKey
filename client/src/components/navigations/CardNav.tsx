'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: { label: string; href?: string }[];
}

const CardNav = ({ items }: { items: CardNavItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Icon: Inherits color smoothly from the header */}
      <button
        onClick={() => setIsOpen(true)}
        className="transition-opacity hover:opacity-70 outline-none flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Full Screen Overlay (z-[200] to sit above everything) */}
      <div 
        className={cn(
          "fixed inset-0 z-[200] bg-gray-100/95 backdrop-blur-md transition-all duration-300 ease-out text-left",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Close Button Top Right (Explicitly styled so it doesn't inherit header colors) */}
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2.5 bg-white rounded-full shadow-md border border-gray-200 text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Cards Container */}
        <div className="container mx-auto px-4 pt-24 pb-12 h-full overflow-y-auto">
          {/* Grid layout: 1 col on mobile, 2 cols on tablets, up to 3 on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 flex flex-col gap-6 shadow-xl hover:-translate-y-1 transition-transform duration-300"
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                <h3 className="text-2xl font-bold tracking-tight opacity-95">{item.label}</h3>
                
                <div className="flex flex-col gap-4 mt-2">
                  {item.links?.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href || '#'}
                      className="flex items-center justify-between group py-1"
                    >
                      <span className="text-[16px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {link.label}
                      </span>
                      <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardNav;