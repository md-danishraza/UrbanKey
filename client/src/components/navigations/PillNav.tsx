'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PillNavProps {
  items: { label: string; href: string }[];
  activeHref?: string;
  isScrolled?: boolean;
}

const PillNav = ({ items, activeHref, isScrolled = false }: PillNavProps) => {
  const pathname = usePathname();
  const currentActiveHref = activeHref || pathname;

  return (
    <nav 
      className={cn(
        "flex items-center p-1 rounded-full transition-all duration-300",
        isScrolled ? "bg-gray-100 border border-gray-200" : "bg-white/10 border border-white/5 backdrop-blur-sm"
      )}
    >
      <ul className="flex items-center m-0 p-0 list-none gap-1">
        {items.map((item) => {
          const isActive = currentActiveHref === item.href;
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                className={cn(
                  "px-5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-300",
                  // Top State (Black Navbar)
                  !isScrolled && isActive && "bg-white text-black shadow-sm",
                  !isScrolled && !isActive && "text-white/80 hover:text-white hover:bg-white/10",
                  // Scrolled State (White Navbar)
                  isScrolled && isActive && "bg-white text-black shadow-sm border border-gray-200/50",
                  isScrolled && !isActive && "text-gray-600 hover:text-black hover:bg-gray-200/50"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default PillNav;