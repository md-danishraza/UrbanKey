'use client';

import Link from 'next/link';
import { 
  User, 
  Settings, 
  LogOut, 
  Building2, 
  Heart,
  Calendar,
  MessageCircle,
  ChevronDown,
  Shield
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    role: 'tenant' | 'landlord' | 'admin';
    isVerified: boolean;
  };
  isScrolled?: boolean;
  onLogout: () => void;
  isLoading?: boolean;
  mobile?: boolean;
}

export default function ProfileDropdown({ 
  user, 
  isScrolled = false, 
  onLogout, 
  isLoading = false,
  mobile = false 
}: ProfileDropdownProps) {

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'landlord': return 'bg-blue-500 hover:bg-blue-600';
      case 'admin': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-green-500 hover:bg-green-600';
    }
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleSpecificLinks = () => {
    switch (user.role) {
      case 'tenant':
        return [
          { icon: Heart, label: 'Wishlist', href: '/tenant/wishlist' },
          { icon: Calendar, label: 'My Visits', href: '/tenant/visits' },
          { icon: MessageCircle, label: 'Inquiries', href: '/tenant/inquiries' },
        ];
      case 'landlord':
        return [
          { icon: Building2, label: 'Dashboard', href: '/landlord/dashboard' },
          { icon: Building2, label: 'My Properties', href: '/landlord/properties' },
          { icon: MessageCircle, label: 'Leads', href: '/landlord/leads' },
        ];
      case 'admin':
        return [
          { icon: Shield, label: 'Dashboard', href: '/admin/dashboard' },
          { icon: User, label: 'Verifications', href: '/admin/verifications' },
          { icon: Building2, label: 'Analytics', href: '/admin/analytics' },
        ];
      default:
        return [];
    }
  };

  return (
    <DropdownMenu>
      {/* TRIGGER BUTTON */}
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none group outline-none">
        <div className="relative">
          <Avatar className={cn(
            "border-2 transition-transform group-hover:scale-105",
            mobile ? "h-8 w-8" : "h-10 w-10",
            // Adapts border color based on scroll position (transparent vs grey)
            isScrolled ? "border-border" : "border-white/20"
          )}>
            <AvatarImage src={user.avatar} />
            <AvatarFallback className={cn("text-white", getRoleBadgeColor(user.role))}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Online/Verified Dot */}
          {user.isVerified && (
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 bg-green-500 border-2 rounded-full",
              isScrolled ? "border-white" : "border-transparent",
              mobile ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
            )} />
          )}
        </div>
        
        {!mobile && (
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180",
            isScrolled ? "text-foreground/70" : "text-white/80"
          )} />
        )}
      </DropdownMenuTrigger>

      {/* DROPDOWN CONTENT (Uses React Portals to prevent clipping) */}
      <DropdownMenuContent 
        className={cn("w-64 p-2 rounded-xl shadow-xl", mobile ? "mr-4" : "mr-8")} 
        align="end" 
        forceMount
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className={cn("text-white", getRoleBadgeColor(user.role))}>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-1">
              <Badge className={cn("text-white text-xs border-none", getRoleBadgeColor(user.role))}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              {!user.isVerified && (
                <Badge variant="outline" className="text-[10px] border-yellow-300 text-yellow-700 bg-yellow-50 px-1.5 py-0">
                  Unverified
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Role Specific Links */}
        <DropdownMenuGroup>
          {getRoleSpecificLinks().map((link) => {
            const Icon = link.icon;
            return (
              <DropdownMenuItem key={link.href} asChild className="cursor-pointer rounded-lg">
                <Link href={link.href} className="flex items-center gap-2 py-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{link.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Common Links */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
            <Link href="/profile" className="flex items-center gap-2 py-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
            <Link href="/settings" className="flex items-center gap-2 py-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Action */}
        <DropdownMenuItem 
          onClick={onLogout} 
          disabled={isLoading}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg py-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}