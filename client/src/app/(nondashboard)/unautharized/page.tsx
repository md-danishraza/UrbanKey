import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. This area is restricted to specific user roles.
        </p>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          
          <Link href="/properties/search">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}