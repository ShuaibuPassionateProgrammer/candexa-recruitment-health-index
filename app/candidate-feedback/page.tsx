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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © {new Date().getFullYear()} Candexa AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
