'use client';

import { useState } from 'react';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { 
  Calendar, 
 
  Clock, 
  ArrowRight, 
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
 
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Blog post interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

// Sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Zero Brokerage Rentals: How UrbanKey is Changing the Game",
    excerpt: "Discover how UrbanKey is revolutionizing the Indian rental market by eliminating brokerage fees and connecting tenants directly with verified landlords.",
    content: "Full content here...",
    author: "Rahul Sharma",
    authorAvatar: "/avatars/rahul.jpg",
    date: "2024-03-15",
    readTime: 5,
    category: "Industry News",
    tags: ["Brokerage", "Rental Tips", "UrbanKey"],
    image: "/blog/zero-brokerage.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Property Search: Finding Your Dream Home Made Easy",
    excerpt: "Learn how our AI-powered semantic search understands natural language to help you find the perfect property faster than ever.",
    content: "Full content here...",
    author: "Priya Singh",
    authorAvatar: "/avatars/priya.jpg",
    date: "2024-03-10",
    readTime: 4,
    category: "Technology",
    tags: ["AI", "Search", "Technology"],
    image: "/blog/ai-search.jpg",
    featured: true,
  },
  {
    id: 3,
    title: "A Complete Guide to Digital Rent Agreements in India",
    excerpt: "Everything you need to know about digital rent agreements, e-signatures, and legal compliance for hassle-free renting.",
    content: "Full content here...",
    author: "Amit Kumar",
    authorAvatar: "/avatars/amit.jpg",
    date: "2024-03-05",
    readTime: 7,
    category: "Legal",
    tags: ["Rent Agreement", "Legal", "Documents"],
    image: "/blog/rent-agreement.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Top 5 Things to Check Before Renting a Property",
    excerpt: "Essential checklist for tenants: From verifying documents to inspecting amenities, here's what you need to know before signing the lease.",
    content: "Full content here...",
    author: "Neha Gupta",
    authorAvatar: "/avatars/neha.jpg",
    date: "2024-02-28",
    readTime: 6,
    category: "Tenant Tips",
    tags: ["Tenant Tips", "Checklist", "Renting"],
    image: "/blog/checklist.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Why Aadhar Verification is Crucial for Rental Platforms",
    excerpt: "Understanding the importance of KYC verification in building a trusted rental ecosystem for both tenants and landlords.",
    content: "Full content here...",
    author: "Vikram Mehta",
    authorAvatar: "/avatars/vikram.jpg",
    date: "2024-02-20",
    readTime: 4,
    category: "Security",
    tags: ["Verification", "KYC", "Security"],
    image: "/blog/verification.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Landlord's Guide: How to List Your Property Successfully",
    excerpt: "Tips and tricks for landlords to create compelling property listings that attract quality tenants quickly.",
    content: "Full content here...",
    author: "Anjali Desai",
    authorAvatar: "/avatars/anjali.jpg",
    date: "2024-02-15",
    readTime: 5,
    category: "Landlord Tips",
    tags: ["Landlord Tips", "Listing", "Properties"],
    image: "/blog/landlord-guide.jpg",
    featured: false,
  },
];

const categories = ["All", "Industry News", "Technology", "Legal", "Tenant Tips", "Landlord Tips", "Security"];
const tags = ["Brokerage", "Rental Tips", "UrbanKey", "AI", "Technology", "Rent Agreement", "Legal", "Tenant Tips", "Verification", "KYC"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Our Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Insights & Updates
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Latest news, tips, and insights about renting in India
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <Link href={`/blog/${post.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                          <div className="relative h-48 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                            <div className="absolute bottom-4 left-4 z-20">
                              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                {post.category}
                              </Badge>
                            </div>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime} min read
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                  {post.author.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-600">{post.author}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1 group">
                                Read More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
              <div className="space-y-6">
                {currentPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative h-48 md:h-auto">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime} min read
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                  {post.author.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-600">{post.author}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1 group">
                                Read More
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-colors",
                        selectedCategory === category
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {category}
                      {category !== "All" && (
                        <span className="float-right text-gray-400">
                          {blogPosts.filter(p => p.category === category).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm text-white/80 mb-4">
                  Get the latest rental tips and news delivered to your inbox.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button variant="secondary" size="sm">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}