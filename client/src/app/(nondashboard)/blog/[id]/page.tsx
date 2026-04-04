'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { blogPosts } from '../page';


export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(params.id as string));
    if (foundPost) {
      setPost(foundPost);
    } else {
      router.push('/blog');
    }
  }, [params.id, router]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto max-w-4xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why This Matters</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit</li>
              <li>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</li>
              <li>Consectetur, adipisci velit, sed quia non numquam eius modi tempora</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti 
              atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
              "The rental market in India is evolving, and UrbanKey is at the forefront of this transformation."
            </blockquote>
            <p className="text-gray-700 leading-relaxed mb-4">
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates 
              repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
            </p>
          </article>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/blog?tag=${tag}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Author Bio */}
          <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {post.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">Written by {post.author}</h3>
                <p className="text-sm text-gray-600">
                  Rental expert and content creator at UrbanKey. Passionate about helping people find their perfect home.
                </p>
              </div>
            </div>
          </div>

          {/* Share & Actions */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className="gap-2"
              >
                <Heart className={liked ? "fill-red-500 text-red-500" : ""} />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Bookmark className="" />
                Save
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Share:</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}