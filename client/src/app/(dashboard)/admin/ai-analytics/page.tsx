'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Brain, 
  TrendingUp, 
  Search,
  Sparkles,
  Loader2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { getAIAnalytics, getQuickStats } from '@/lib/api/admin';

export default function AIAnalyticsPage() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState('');
  const [quickStats, setQuickStats] = useState({
    mostSearchedArea: 'Whitefield',
    averageRent2BHK: 28500,
    highestDemand: 'Fully Furnished',
    responseRate: 23,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    setIsLoadingStats(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const stats = await getQuickStats(token);
      setQuickStats(stats);
    } catch (error) {
      console.error('Failed to load quick stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const result = await getAIAnalytics(token, { query });
      setResponse(result.answer);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const trendingQueries = [
    'What are the most popular areas for properties?',
    'Show me rent trends for different BHK types',
    'What amenities do tenants prefer most?',
    'Analyze user growth and engagement',
    'Which property type has the highest demand?',
    'What is the average response time for leads?',
  ];

  const handleSuggestedQuery = (q: string) => {
    setQuery(q);
    setTimeout(() => handleAnalyze(), 100);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Analytics & Insights
                </h1>
                <p className="text-gray-600 mt-1">Powered by Gemini AI - Get intelligent property insights</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadQuickStats}
              disabled={isLoadingStats}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
              Refresh Stats
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask anything about your property data, market trends, or user behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {response && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-900 mb-2">AI Analysis</p>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {response}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!response && !isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Brain className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500">Ask a question to get insights</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try: "What are the most popular areas for 2BHK apartments?"
                      </p>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Analyzing data...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about property trends, user behavior, market insights..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAnalyze();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!query.trim() || isAnalyzing}
                    className="h-auto px-6"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Trending Queries
                </CardTitle>
                <CardDescription>Popular questions from other admins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuery(q)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-purple-600">{q}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Searched Area</span>
                  <span className="font-semibold">
                    {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : quickStats.mostSearchedArea}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Rent (2BHK)</span>
                  <span className="font-semibold">
                    {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : `₹${quickStats.averageRent2BHK.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Highest Demand</span>
                  {isLoadingStats ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {quickStats.highestDemand}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : `+${quickStats.responseRate}%`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <Sparkles className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">RAG-Enabled Search</h3>
                <p className="text-sm text-white/80 mb-4">
                  Our AI understands your property database to give accurate, data-driven insights.
                </p>
                <Badge className="bg-white/20 text-white border-none">
                  Powered by Google Gemini
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}