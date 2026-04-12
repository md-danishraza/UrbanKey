'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Heart, Calendar, MessageCircle, Building2, Shield, FileText, User, MapPin } from 'lucide-react';

import PillNav from './PillNav';
import CardNav from './CardNav';
import { cn } from '@/lib/utils';
import Logo from '../Logo';

type UserRole = 'tenant' | 'landlord' | 'admin';

export default function MainNavbar() {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const userRole = (user?.publicMetadata?.role as UserRole) ?? 'tenant';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/properties/search' }
  ];

  // Dynamically generate CardNav items based on role
  const getCardNavItems = () => {
    const items = [];

    // Show Tenant links for tenants (or guests)
    if (!isSignedIn || userRole === 'tenant') {
      items.push({
        label: "Tenant",
        bgColor: "#0D0716", textColor: "#fff",
        links: [
          { label: "Dashboard", href: "/tenant/dashboard" },
          { label: "Search Properties", href: "/properties/search" },
          { label: "Wishlist", href: "/tenant/wishlist" },
          { label: "My Visits", href: "/tenant/visits" },
          { label: "Enquiries", href: "/tenant/enquiries" },
        ]
      });
    }

    // Show Landlord links for landlords (or guests)
    if (!isSignedIn || userRole === 'landlord') {
      items.push({
        label: "Landlord", 
        bgColor: "#170D27", textColor: "#fff",
        links: [
          { label: "Dashboard", href: "/landlord/dashboard" },
          { label: "List Property", href: "/landlord/properties/new" },
          { label: "Leads", href: "/landlord/leads" },
          { label: "Visits", href: "/landlord/visits" },
          { label: "Agreements", href: "/landlord/agreements" }
        ]
      });
    }

    // Show Admin links exclusively for admins
    if (userRole === 'admin') {
      items.push({
        label: "Admin Panel", 
        bgColor: "#1A0B2E", textColor: "#fff",
        links: [
          { label: "Dashboard", href: "/admin" },
          { label: "Verifications", href: "/admin/verifications" },
          { icon: Building2, label: 'Analytics', href: '/admin/ai-analytics' },
        ]
      });
    }

    // Resources are always visible
    items.push({
      label: "Resources",
      bgColor: "#271E37", textColor: "#fff",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQs", href: "/faqs" },
        { label: "Terms & Conditions", href: "/terms" }
      ]
    });

    return items;
  };

  const CustomUserButton = () => (
    <UserButton 
      appearance={{
        elements: { avatarBox: "w-9 h-9 border-2 border-white/20 hover:border-white/50 transition-all" }
      }}
    >
      <UserButton.MenuItems>
         {/* Profile Link - Common for all users */}
        <UserButton.Link label="My Profile" href="/profile" labelIcon={<User className="w-4 h-4" />} />
   

        {/* Tenant Links */}
        {userRole === 'tenant' && <UserButton.Link label="Dashboard" href="/tenant/dashboard" labelIcon={<Building2 className="w-4 h-4" />} />}
        {userRole === 'tenant' && <UserButton.Link label="Wishlist" href="/tenant/wishlist" labelIcon={<Heart className="w-4 h-4" />} />}
        {userRole === 'tenant' && <UserButton.Link label="My Visits" href="/tenant/visits" labelIcon={<Calendar className="w-4 h-4" />} />}
        {userRole === 'tenant' && <UserButton.Link label="Enquiries" href="/tenant/enquiries" labelIcon={<MessageCircle className="w-4 h-4" />} />}
        {userRole === 'tenant' && <UserButton.Link label="Onboarding" href="/onboarding/tenant" labelIcon={<User className="w-4 h-4" />} />}
        
        {/* Landlord Links */}
        {userRole === 'landlord' && <UserButton.Link label="Dashboard" href="/landlord/dashboard" labelIcon={<Building2 className="w-4 h-4" />} />}
        {userRole === 'landlord' && <UserButton.Link label="My Properties" href="/landlord/properties" labelIcon={<Building2 className="w-4 h-4" />} />}
        {userRole === 'landlord' && <UserButton.Link label="Leads" href="/landlord/leads" labelIcon={<MessageCircle className="w-4 h-4" />} />}
        {userRole === 'landlord' && <UserButton.Link label="Visits" href="/landlord/visits" labelIcon={<MapPin className="w-4 h-4" />} />}
        {userRole === 'landlord' && <UserButton.Link label="Agreements" href="/landlord/agreements" labelIcon={<FileText className="w-4 h-4" />} />}
        {userRole === 'landlord' && <UserButton.Link label="Onboarding" href="/onboarding/landlord" labelIcon={<User className="w-4 h-4" />} />}
        
        {/* Admin Links */}
        {userRole === 'admin' && <UserButton.Link label="dashboard" href="/admin" labelIcon={<Shield className="w-4 h-4" />} />}

        {/* sign out */}
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );

  return (
    <header 
      className={cn(
        "fixed top-0  w-screen z-[100] transition duration-300 border-b",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200 py-3 text-black" 
          : "bg-black border-transparent py-4 text-white" 
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <Link href="/" >
          <Logo/>
        </Link>

        {/* CENTER: Desktop PillNav */}
        <div className="hidden md:flex flex-1 justify-center">
          <PillNav items={navItems} activeHref={pathname} isScrolled={isScrolled} />
        </div>

        {/* RIGHT: Combined Actions */}
        <div className="flex items-center gap-4">
          
          {/* Desktop Auth Buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3 mr-2">
            {!isSignedIn && (
              <>
                <Link 
                  href="/auth/login" 
                  className={cn("px-5 py-2 text-sm font-semibold transition-colors rounded-full",
                    isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-5 py-2 text-sm font-semibold rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all"
                >
                  List Property
                </Link>
              </>
            )}
          </div>

          {/* Mobile Auth Button (Hidden on desktop) */}
          {!isSignedIn && (
            <Link 
              href="/auth/login" 
              className="md:hidden px-4 py-1.5 text-sm font-semibold bg-rose-500 text-white rounded-full shadow-md"
            >
              Sign In
            </Link>
          )}

          {/* Profile Dropdown (Visible if signed in) */}
          {isSignedIn && <CustomUserButton />}
          
          {/* Mega Menu Hamburger (Visible everywhere, sits beside profile) */}
          <div className="relative flex items-center border-l border-current/20 pl-4 ml-1">
            <CardNav items={getCardNavItems()} />
          </div>

        </div>

      </div>
    </header>
  );
}