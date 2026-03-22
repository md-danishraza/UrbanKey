'use client';

import { useState } from 'react';

import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface AgreementFormProps {
  onAccept: () => Promise<void>;
  isLoading?: boolean;
}

export function AgreementForm({ onAccept, isLoading = false }: AgreementFormProps) {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (isBottom) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    if (!accepted) return;
    await onAccept();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Landlord Agreement</h2>
        <p className="text-gray-600">Please review and accept the terms and conditions</p>
      </div>

      <Card className="bg-gray-50 border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="prose prose-sm max-h-96 overflow-y-auto p-6"
            onScroll={handleScroll}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Terms and Conditions for Landlords
            </h3>
            
            <div className="space-y-4 text-gray-600">
              <section>
                <h4 className="font-medium text-gray-900">1. Property Listing</h4>
                <p>You confirm that you have the legal right to rent out the property. All property details provided must be accurate and truthful. Any misrepresentation may result in account suspension.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">2. Verification</h4>
                <p>You agree to provide valid identity and property ownership documents for verification. UrbanKey may verify your property details through third-party services.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">3. Communication</h4>
                <p>You agree to respond to tenant inquiries within 24 hours. All communication should be professional and respectful.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">4. Fees and Commission</h4>
                <p>You agree to our commission structure for successful rentals. Commission rates are clearly displayed during property listing and may vary based on the package chosen.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">5. Tenant Screening</h4>
                <p>While UrbanKey provides basic tenant verification, you are responsible for final tenant selection and background checks.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">6. Rent Agreements</h4>
                <p>All rental agreements generated through the platform are legally valid. You agree to use the platform's agreement templates or upload your own.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">7. Dispute Resolution</h4>
                <p>Any disputes with tenants should first be attempted to be resolved through the platform's mediation services before legal action.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">8. Platform Rules</h4>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>List fake or non-existent properties</li>
                  <li>Discriminate against tenants based on religion, caste, or gender</li>
                  <li>Charge tenants outside the platform without documentation</li>
                  <li>Share contact information of other landlords</li>
                </ul>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">9. Termination</h4>
                <p>UrbanKey reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.</p>
              </section>

              <section>
                <h4 className="font-medium text-gray-900">10. Changes to Terms</h4>
                <p>We may update these terms periodically. Continued use of the platform constitutes acceptance of updated terms.</p>
              </section>
            </div>

            <p className="text-xs text-gray-500 mt-4 pt-4 border-t">
              Last updated: March 2026 | Version 1.0
            </p>
            
            {!scrolledToBottom && (
              <div className="sticky bottom-0 mt-4 p-2 bg-gradient-to-t from-gray-50 to-transparent text-center">
                <p className="text-xs text-gray-400 animate-pulse">
                  ↓ Scroll to read all terms ↓
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg transition-all",
        accepted ? "bg-purple-50 border border-purple-200" : "bg-gray-50"
      )}>
        <Checkbox
          id="acceptTerms"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked as boolean)}
          disabled={!scrolledToBottom}
          className="mt-1"
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer flex-1">
          I have read and agree to the Terms and Conditions for Landlords. I confirm that I have the 
          legal right to rent out properties and that all information provided is accurate.
        </label>
      </div>

      {!scrolledToBottom && (
        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          Please scroll to the bottom of the agreement to enable acceptance
        </div>
      )}

      <Button 
        onClick={handleAccept} 
        className="w-full"
        disabled={!accepted || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept & Continue
          </>
        )}
      </Button>
    </div>
  );
}