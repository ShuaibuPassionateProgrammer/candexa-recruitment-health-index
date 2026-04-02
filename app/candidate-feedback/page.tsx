import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function CandidateFeedback() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Candidate Feedback
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We value your experience. Please share your feedback to help us improve.
          </p>
        </div>

        {/* Card-style Design Container */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10">
          
          {/* Responsive Iframe Wrapper */}
          <div className="w-full overflow-hidden rounded-xl">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLScvxrtP_oKqOSTOt0RHmTJp2As9kY5lvWzRbD3uOqoE0XYD_A/viewform?embedded=true" 
              className="w-full border-0 h-[2800px] sm:h-[2600px] lg:h-[2407px] bg-transparent"
              title="Candidate Feedback Form"
              aria-label="Candidate Feedback"
            >
              Loading…
            </iframe>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link href="/" className="inline-flex items-center text-[#ff7a18] hover:text-[#e66a10] text-sm font-semibold transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Landing Page
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
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
      </footer>
    </div>
  );
}
