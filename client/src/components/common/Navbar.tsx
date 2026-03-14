"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  Heart, 
  Building2, 
  User,
  LogOut,
  Settings,
  ChevronDown,
  Bell,
  Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import styles from "@/styles/Navbar.module.css"

// auth 
import { useClerk,useUser } from "@clerk/nextjs";
import router from "next/router";



type UserRole = "tenant" | "landlord" | "admin";

interface ClerkUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  role: UserRole;
  isVerified: boolean;
}


interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: Array<'tenant' | 'landlord' | 'admin'>;
}

function Navbar() {
    // auth
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const clerkUser: ClerkUser | null = user
    ? {
        id: user.id,
        name: user.fullName || "User",
        email: user.primaryEmailAddress?.emailAddress,
        avatar: user.imageUrl,
        role: (user.publicMetadata?.role as UserRole) ?? "tenant",
        isVerified: true,
      }
    : null;




  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Navigation links based on user role
  const getNavLinks = (): NavLink[] => {
    const commonLinks: NavLink[] = [
      { href: '/', label: 'Home', icon: Home, roles: ['tenant', 'landlord', 'admin'] },
      { href: '/properties/search', label: 'Search', icon: Search, roles: ['tenant', 'landlord', 'admin'] },
    ];

    const roleSpecificLinks: NavLink[] = [];

    if (clerkUser?.role === 'tenant') {
      roleSpecificLinks.push(
        { href: '/tenant/wishlist', label: 'Wishlist', icon: Heart, roles: ['tenant'] },
        { href: '/tenant/visits', label: 'My Visits', icon: Building2, roles: ['tenant'] }
      );
    } else if (clerkUser?.role === 'landlord') {
      roleSpecificLinks.push(
        { href: '/landlord/dashboard', label: 'Dashboard', icon: Building2, roles: ['landlord'] },
        { href: '/landlord/properties', label: 'My Properties', icon: Building2, roles: ['landlord'] },
        { href: '/landlord/leads', label: 'Leads', icon: User, roles: ['landlord'] }
      );
    } else if (clerkUser?.role === 'admin') {
      roleSpecificLinks.push(
        { href: '/admin/dashboard', label: 'Dashboard', icon: Shield, roles: ['admin'] },
        { href: '/admin/verifications', label: 'Verifications', icon: User, roles: ['admin'] },
        { href: '/admin/analytics', label: 'Analytics', icon: Building2, roles: ['admin'] }
      );
    }

    return [...commonLinks, ...roleSpecificLinks].filter(link => 
      !isSignedIn || (link.roles && link.roles.includes(clerkUser?.role || 'tenant'))
    );
  };

  const navLinks = getNavLinks();

  // Update handleLogout
const handleLogout = async () => {
  setIsLoading(true);
  try {
    await signOut();
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    setIsLoading(false);
  }
};

  const getUserInitials = () => {
    if (!clerkUser?.name) return 'U';
    return clerkUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'landlord':
        return 'bg-blue-500';
      case 'admin':
        return 'bg-purple-500';
      default:
        return 'bg-green-500';
    }
  };




  return (
    <>
      <motion.nav
        className={cn(
          "w-full h-16 fixed top-0 z-50 transition-all duration-300",
          styles.navbar,
          isScrolled ? styles.navbarScrolled : "bg-primary text-primary-foreground"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* Left: Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className={styles.logoContainer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo />
            </motion.div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors relative",
                    styles.navLink,
                    isActive 
                      ? cn("text-foreground", styles.navLinkActive) 
                      : cn("text-muted-foreground hover:text-foreground", isScrolled ? "text-gray-600" : "text-primary-foreground/80 hover:text-primary-foreground")
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: User Menu / Auth Buttons */}
          <div className="flex items-center gap-3">
            {clerkUser ? (
              <>
                {/* Notification Bell (Optional) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative",
                    isScrolled ? "hover:bg-gray-100" : "hover:bg-primary-foreground/10"
                  )}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className={cn("flex items-center gap-2 cursor-pointer", styles.avatarContainer)}>
                      <Avatar className="h-9 w-9 border-2 border-white/20">
                        <AvatarImage src={clerkUser?.avatar} />
                        <AvatarFallback className={cn("text-white", getRoleBadgeColor(clerkUser?.role))}>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isScrolled ? "text-gray-600" : "text-white"
                      )} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{clerkUser?.name}</p>
                        <p className="text-xs text-muted-foreground">{clerkUser?.email}</p>
                        <Badge className={cn("w-fit mt-1", getRoleBadgeColor(clerkUser?.role))}>
                          {clerkUser?.role.charAt(0).toUpperCase() + clerkUser?.role.slice(1)}
                          {!clerkUser?.isVerified && (
                            <span className="ml-1 text-xs">(Unverified)</span>
                          )}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Role-specific quick links */}
                    { clerkUser.role === 'landlord' && (
                      <DropdownMenuItem asChild>
                        <Link href="/landlord/dashboard" className="cursor-pointer">
                          <Building2 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className={cn(
                      "hidden sm:flex transition-all duration-300",
                      styles.buttonOutline,
                      isScrolled 
                        ? "text-gray-700 hover:text-primary hover:bg-gray-100" 
                        : "text-primary-foreground hover:text-white hover:bg-primary-foreground/10"
                    )}
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className={cn(
                        "font-semibold shadow-sm transition-all duration-300",
                        styles.buttonPrimary,
                        isScrolled
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-white text-primary hover:bg-white/90"
                      )}
                    >
                      List Property
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                styles.mobileMenuButton,
                isScrolled ? "hover:bg-gray-100" : "hover:bg-primary-foreground/10"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed top-16 left-0 right-0 z-40 md:hidden border-b",
              styles.mobileMenu,
              isScrolled ? "bg-white/95" : "bg-primary/95"
            )}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        isActive
                          ? isScrolled 
                            ? "bg-primary/10 text-primary" 
                            : "bg-white/20 text-white"
                          : isScrolled
                            ? "text-gray-600 hover:bg-gray-100"
                            : "text-white/80 hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}

                {!user && (
                  <div className="pt-4 mt-4 border-t border-white/20">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full mb-2">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button className="w-full">
                        List Property
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      
    </>
  );
}

export default Navbar;