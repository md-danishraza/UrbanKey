import Link from 'next/link';
import { Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-12 w-12 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verification Pending
        </h1>
        
        <p className="text-gray-600 mb-4">
          Your account is currently under review. You'll be able to list properties once verified.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              We'll notify you via email once your verification is complete. 
              This usually takes 1-2 business days.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              Return to Homepage
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}