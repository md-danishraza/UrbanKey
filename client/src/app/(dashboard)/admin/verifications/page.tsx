'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/admin/StatsCard';
import { DocumentTable } from '@/components/admin/DocumentTable';
import { DocumentPreviewModal } from '@/components/admin/DocumentPreviewModal';
import { Pagination } from '@/components/admin/Pagination';
import {
  getPendingVerifications,
  getAllVerifications,
  getVerificationStats,
  Document,
  VerificationStats,
} from '@/lib/api/admin';
import Link from 'next/link';

export default function AdminVerificationsPage() {
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Load stats
      const statsResponse = await getVerificationStats(token);
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      // Load documents
      let docsResponse;
      if (filterStatus === 'PENDING') {
        docsResponse = await getPendingVerifications(token);
        if (docsResponse.success) {
          setDocuments(docsResponse.documents);
        }
      } else {
        docsResponse = await getAllVerifications(token, filterStatus, currentPage, 10);
        if (docsResponse.success) {
          setDocuments(docsResponse.documents);
          setTotalPages(docsResponse.pagination?.totalPages || 1);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, filterStatus, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePreview = (document: Document) => {
    setSelectedDoc(document);
    setIsPreviewOpen(true);
  };

  const handleActionComplete = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 mb-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Verification Panel
          </h1>
          <p className="text-gray-600 mt-1">Manage user verifications and documents</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Documents"
            value={stats?.total || 0}
            icon={FileText}
            color="purple"
            delay={0.1}
          />
          <StatsCard
            title="Pending"
            value={stats?.pending || 0}
            icon={Clock}
            color="yellow"
            delay={0.2}
          />
          <StatsCard
            title="Approved"
            value={stats?.approved || 0}
            icon={CheckCircle}
            color="green"
            delay={0.3}
          />
          <StatsCard
            title="Rejected"
            value={stats?.rejected || 0}
            icon={XCircle}
            color="red"
            delay={0.4}
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <Tabs value={filterStatus} onValueChange={handleStatusChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="APPROVED">Approved</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              <TabsTrigger value="ALL">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filterStatus === 'PENDING' ? 'Pending Verifications' : 
               filterStatus === 'APPROVED' ? 'Approved Documents' :
               filterStatus === 'REJECTED' ? 'Rejected Documents' : 'All Documents'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents to display</p>
              </div>
            ) : (
              <>
                <DocumentTable documents={documents} onPreview={handlePreview} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onActionComplete={handleActionComplete}
        
      />
    </div>
  );
}