'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Document, approveDocument, rejectDocument } from '@/lib/api/admin';
import { cn } from '@/lib/utils';

interface DocumentPreviewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose, onActionComplete }: DocumentPreviewModalProps) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!document) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      await approveDocument(token, document.id);
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setIsLoading(true);
    try {
      const token = await getToken();
      await rejectDocument(token, document.id, rejectionReason);
      onActionComplete();
      setIsRejectDialogOpen(false);
      onClose();
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} >
        <DialogContent className="max-w-4xl max-h-[90vh] mt-10 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Preview
            </DialogTitle>
            <DialogDescription>
              Review and verify the uploaded document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{document.user.fullName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        {document.user.email}
                      </div>
                      {document.user.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {document.user.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Uploaded: {formatDate(document.uploadedAt)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        Size: {formatFileSize(document.fileSize)}
                      </div>
                    </div>
                  </div>
                  <Badge className={cn(
                    document.status === 'PENDING' && "bg-yellow-100 text-yellow-700",
                    document.status === 'APPROVED' && "bg-green-100 text-green-700",
                    document.status === 'REJECTED' && "bg-red-100 text-red-700"
                  )}>
                    {document.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Document Preview */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Document</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(document.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden bg-gray-50 p-4 flex items-center justify-center min-h-[400px]">
                  {document.mimeType.startsWith('image/') ? (
                    <img
                      src={document.fileUrl}
                      alt={document.fileName}
                      className="max-w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Preview not available for this file type</p>
                      <Button
                        variant="link"
                        onClick={() => window.open(document.fileUrl, '_blank')}
                        className="mt-2"
                      >
                        Open in new tab
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {document.status === 'PENDING' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve Document
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Document
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Rejection Reason
              </label>
              <textarea
                id="reason"
                placeholder="e.g., Image is blurry, Document not clearly visible, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}