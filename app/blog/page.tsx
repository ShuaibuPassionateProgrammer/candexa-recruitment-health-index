import React from 'react';
import Navbar from '@/components/Navbar';
import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/lib/blog-data';

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Insights & <span className="text-[#ff7a18]">Articles</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Expert perspectives on AI in recruitment, hiring efficiency, and the future of talent acquisition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.publishedDate}
              readingTime={post.readingTime}
            />
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm">
            © {new Date().getFullYear()} Candexa AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
