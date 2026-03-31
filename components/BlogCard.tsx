import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export default function BlogCard({ slug, title, excerpt, date, readingTime }: BlogCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#ff7a18]/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
        <span>{date}</span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>{readingTime}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#ff7a18] transition-colors leading-tight">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 flex-grow line-clamp-3">
        {excerpt}
      </p>
      
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center text-[#ff7a18] font-bold group-hover:gap-2 transition-all"
      >
        Read More
        <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
