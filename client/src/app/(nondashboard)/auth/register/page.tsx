'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Building2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import styles from '../Auth.module.css';

const roles = [
  {
    id: 'tenant',
    title: 'Looking for a Home',
    description: 'Find your perfect rental property',
    icon: Home,
    gradient: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    path: '/auth/register/tenant'
  },
  {
    id: 'landlord',
    title: 'List Your Property',
    description: 'Rent out your property easily',
    icon: Building2,
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    path: '/auth/register/landlord'
  }
];

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className={cn(
      styles.authContainer, 
      "flex items-center justify-center p-4 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    )}>
      
      {/* Decorative Background Shapes */}
      <div className={cn(styles.floatingShape, styles.shape1, "pointer-events-none absolute")} />
      <div className={cn(styles.floatingShape, styles.shape2, "pointer-events-none absolute")} />
      <div className={cn(styles.floatingShape, styles.shape3, "pointer-events-none absolute")} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join UrbanKey
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Choose how you want to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                
                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(role.path)}
                    className="cursor-pointer"
                  >
                    <Card className={cn(
                      "border-2 hover:border-transparent transition-all duration-300 overflow-hidden",
                      `bg-gradient-to-br ${role.bgGradient}`
                    )}>
                      <CardContent className="p-6 text-center">
                        <div className={cn(
                          "w-20 h-20 rounded-2xl bg-gradient-to-r mx-auto mb-4 flex items-center justify-center",
                          role.gradient
                        )}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                        <p className="text-gray-600 mb-4">{role.description}</p>
                        
                        <Button 
                          variant="ghost" 
                          className={cn(
                            "group hover:bg-transparent",
                            role.id === 'tenant' ? "text-blue-600" : "text-purple-600"
                          )}
                        >
                          Get Started 
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <a 
                href="/auth/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}