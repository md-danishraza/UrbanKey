'use client';

import Link from 'next/link';
import { Plus, FileText, Home, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  {
    title: 'List New Property',
    description: 'Add a new property to your portfolio',
    icon: Plus,
    href: '/landlord/properties/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Create Agreement',
    description: 'Generate rent agreement for tenants',
    icon: FileText,
    href: '/landlord/agreements',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'View Properties',
    description: 'Manage your existing listings',
    icon: Home,
    href: '/landlord/properties',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Check Leads',
    description: 'Review tenant inquiries',
    icon: MessageCircle,
    href: '/landlord/leads',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer",
                action.bgColor,
                "hover:scale-[1.02] hover:shadow-md"
              )}>
                <div className={cn("p-2 rounded-lg bg-white", action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}