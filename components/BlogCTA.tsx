import Link from 'next/link';

export default function BlogCTA() {
  return (
    <div className="mt-16 p-8 sm:p-12 bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a18]/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7a18] rounded-full blur-[100px] opacity-20"></div>
      
      <div className="relative z-10 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">
          Ready to See Where You Stand?
        </h3>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Take our free <strong>Recruitment Health Index</strong> assessment today and get actionable insights to optimize your hiring.
        </p>
        <div className="pt-4">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#ff7a18] hover:bg-[#e66a10] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/50 hover:-translate-y-1"
          >
            Take Free Assessment
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
