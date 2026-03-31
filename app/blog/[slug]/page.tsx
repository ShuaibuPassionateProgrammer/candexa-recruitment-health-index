import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BlogCTA from '@/components/BlogCTA';
import { getPostBySlug } from '@/lib/blog-data';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#ff7a18] transition-colors gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO BLOG
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3 text-xs font-bold text-[#ff7a18] uppercase tracking-widest bg-orange-50 w-fit px-3 py-1 rounded-full border border-orange-100">
            <span>{post.publishedDate}</span>
            <span className="w-1 h-1 rounded-full bg-orange-200"></span>
            <span>{post.readingTime}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
            {post.title}
          </h1>
        </header>

        {/* Article Content */}
        <article className="prose prose-slate max-w-none">
          {post.content}
        </article>

        {/* End of Article CTA */}
        <BlogCTA />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © {new Date().getFullYear()} Candexa AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
