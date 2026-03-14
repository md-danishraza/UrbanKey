'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Users, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import styles from '../Auth.module.css';

const roles = [
  {
    id: 'tenant',
    title: 'Looking for a Home',
    description: 'Find your perfect rental property',
    icon: Users,
    features: [
      'Search and filter properties',
      'Save favorites to wishlist',
      'Schedule visits',
      'Chat with landlords'
    ],
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'landlord',
    title: 'List Your Property',
    description: 'Rent out your property easily',
    icon: Building2,
    features: [
      'List unlimited properties',
      'Manage inquiries',
      'Track leads',
      'Generate rent agreements'
    ],
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Redirect to role-specific registration
    router.push(`/auth/register/${selectedRole}`);
  };

  return (
    <div className={cn(styles.authContainer, "flex items-center justify-center p-4")}>
      {/* Floating Shapes */}
      <div className={cn(styles.floatingShape, styles.shape1)} />
      <div className={cn(styles.floatingShape, styles.shape2)} />
      <div className={cn(styles.floatingShape, styles.shape3)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <Card className={cn(styles.glassCard, "border-0")}>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join UrbanKey
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Choose how you want to use UrbanKey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      styles.roleCard,
                      isSelected && styles.roleCardSelected,
                      "relative p-6 rounded-xl border-2 cursor-pointer",
                      role.bgColor,
                      isSelected ? `border-${role.gradient.split(' ')[0].replace('from-', '')}` : 'border-transparent'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    )}

                    <div className={cn(
                      "w-16 h-16 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center",
                      role.gradient
                    )}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                    <p className="text-gray-600 mb-4">{role.description}</p>

                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selectedRole || isLoading}
                className={cn(
                  styles.submitButton,
                  "px-12 h-14 text-white font-semibold text-lg"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Please wait...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Continue as {selectedRole ? (selectedRole === 'tenant' ? 'Tenant' : 'Landlord') : ''}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center text-gray-600">
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