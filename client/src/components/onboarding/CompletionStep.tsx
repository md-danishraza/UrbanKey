'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


interface CompletionStepProps {
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentType: string;
  rejectionReason?: string;
  onComplete: () => void;
  onRetry?: () => void;
}

export function CompletionStep({ 
  verificationStatus, 
  documentType, 
  rejectionReason,
  onComplete,
  onRetry   
}: CompletionStepProps) {
  const isVerified = verificationStatus === 'APPROVED';
  const isPending = verificationStatus === 'PENDING';
  const isRejected = verificationStatus === 'REJECTED';

  return (
    <div className="text-center py-4 space-y-6">
      {/* Main Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
      >
        {isVerified && (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        )}
        {isPending && (
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        )}
        {isRejected && (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        )}
      </motion.div>

    
      {/* Next Steps */}
      {isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              What's next?
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You can now list properties on the platform</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Your listings will be visible to tenants immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Manage inquiries and schedule visits</span>
              </li>
            </ul>
          </div>

          <Button onClick={onComplete} size="lg" className="mt-4">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {isPending && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Our team will verify your documents within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>You'll receive an email once verification is complete</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>You can start listing properties immediately (they'll be marked as "pending verification")</span>
              </li>
            </ul>
          </div>

          <Button onClick={onComplete} size="lg" className="mt-4">
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {isRejected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-red-800 mb-2">Verification Failed</h3>
              <p className="text-sm text-red-600 mb-4">
                Please upload a clear image of your document and try again.
              </p>
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-upload Document
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}