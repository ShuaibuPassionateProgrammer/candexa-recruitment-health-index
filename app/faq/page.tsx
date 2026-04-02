'use client';

import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import FAQ from '@/components/FAQ';
import Image from 'next/image';
import Link from 'next/link';
import { faqCategories } from '@/data/faq';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full opacity-30 blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-[#ff7a18] rounded-full text-sm font-bold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Candexa AI and how it transforms your hiring process.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {faqCategories.map((cat) => (
              <a
                key={cat.title}
                href={`#${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#ff7a18] hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <main className="max-w-4xl mx-auto px-4 py-12 lg:py-16 space-y-16">
        {faqCategories.map((category) => (
          <section key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                {category.icon === 'info' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {category.icon === 'pricing' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {category.icon === 'features' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {category.icon === 'candidate' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {category.icon === 'security' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {category.icon === 'support' && (
                  <svg className="w-5 h-5 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{category.title}</h2>
            </div>
            <FAQ data={category.items} />
          </section>
        ))}

        {/* CTA */}
        <section className="text-center pt-8 pb-4">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-10 border border-orange-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h3>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Our team is always happy to help. Reach out and we&apos;ll get back to you within 24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@candexa.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#ff7a18] hover:bg-[#e66a10] text-white font-medium rounded-xl transition-colors shadow-lg shadow-orange-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors border border-slate-200"
              >
                Start Free Assessment
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 px-8">
              <Image src="/logo_with_text.jpg" alt="Candexa AI Logo" width={120} height={120} className="rounded-xl object-contain" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4 text-slate-400">
                <a href="https://www.youtube.com/@CandexaAI-f7i" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7a18] transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/candexa_ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7a18] transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
              <div className="text-sm">
                © {new Date().getFullYear()} Candexa AI. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
