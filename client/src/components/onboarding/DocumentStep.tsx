'use client';

import { DocumentUpload } from './DocumentUpload';
import { VerificationStatus } from './VerificationStatus';

interface DocumentStepProps {
  documentUploaded?: boolean;
  documentStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentType: string;
  onUpload: (file: File) => Promise<void>;
  rejectionReason?: string;
  onRetry?: () => void;
}

export function DocumentStep({ 
  documentUploaded,
  documentStatus,
  documentType,
  onUpload,
  rejectionReason,
  onRetry 
}: DocumentStepProps) {
  // If document is already uploaded and pending/approved, show status
  if (documentUploaded && documentStatus && documentStatus !== 'REJECTED') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Verification Documents</h2>
          <p className="text-gray-600">Your document is being reviewed</p>
        </div>
        
        <VerificationStatus
          status={documentStatus}
          documentType={documentType}
          rejectionReason={rejectionReason}
          onRetry={onRetry}
        />

        {documentStatus === 'PENDING' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can proceed to the next step while we verify your document.
              You'll receive an email once verification is complete.
            </p>
          </div>
        )}
      </div>
    );
  }

  // If document was rejected, show upload form
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Verification Documents</h2>
        <p className="text-gray-600">Upload documents to verify your identity</p>
      </div>
      
      <DocumentUpload
        title="Aadhar Card"
        description="Upload a clear image of your Aadhar card"
        documentType={documentType}
        onUpload={onUpload}
      />

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your documents will be verified by our team within 24-48 hours. 
          You'll receive an email once verification is complete.
        </p>
      </div>
    </div>
  );
}