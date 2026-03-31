import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  publishedDate: string;
  readingTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'agentic-ai-hiring',
    title: 'What Is Agentic AI in Hiring? (And Why It Might Be the End of Bias)',
    excerpt: 'Discover how agentic AI is transforming the recruitment landscape by moving beyond simple automation to proactive reasoning and bias reduction.',
    publishedDate: 'March 31, 2026',
    readingTime: '5 min read',
    content: (
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-800">
          The recruitment industry is standing at a crossroads. For decades, we&apos;ve relied on <strong>Traditional Automation</strong>—systems that follow rigid rules to filter resumes based on keywords. But the next wave of innovation is here: <strong>Agentic AI</strong>.
        </p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8">What exactly is &quot;Agentic&quot; AI?</h2>
        <p>
          Unlike standard AI that waits for a command, Agentic AI acts as an autonomous agent. It doesn&apos;t just parse text; it <strong>understands context, reasons through problems, and takes proactive steps</strong> to achieve a goal. In hiring, this means an AI that doesn&apos;t just &quot;find candidates&quot; but deeply evaluates their potential and fit within a specific company culture.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mt-6">Why It&apos;s the End of Bias</h3>
        <p>
          Human bias is often unconscious and deeply rooted. Traditional systems often amplify this bias by learning from historical (and biased) hiring data. Agentic AI, however, is designed with:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li><strong>Skill-First Logic:</strong> It prioritizes verifiable skills and achievements over prestigious school names or specific zip codes.</li>
          <li><strong>Blind Evaluation:</strong> It can be configured to focus entirely on merit, ignoring demographic indicators that often trigger unconscious bias.</li>
          <li><strong>Consistency:</strong> Unlike a tired recruiter at 4:30 PM on a Friday, the AI treats the 100th candidate with the exact same objective criteria as the first.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Future of Human-AI Collaboration</h2>
        <p>
          This isn&apos;t about replacing recruiters; it&apos;s about <strong>elevating them</strong>. By handling the heavy lifting of objective evaluation, Agentic AI allows human HR professionals to focus on what they do best: building relationships and closing top talent.
        </p>
      </div>
    )
  },
  {
    slug: 'traditional-ats-problems',
    title: 'Why Companies Are Moving Away From Traditional ATS',
    excerpt: 'Legacy Applicant Tracking Systems (ATS) are becoming bottlenecks. Learn why modern companies are switching to leaner, AI-driven alternatives.',
    publishedDate: 'March 28, 2026',
    readingTime: '4 min read',
    content: (
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-800">
          If you ask any hiring manager about their biggest frustration, the answer is almost always their <strong>Applicant Tracking System (ATS)</strong>. What was meant to be a solution has, for many, become a barrier to great talent.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Problems with Legacy Systems</h2>
        <p>
          Traditional ATS platforms were built in an era of data management, not talent acquisition. Here is why they are failing modern companies:
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 mt-6">1. The &quot;Black Hole&quot; Effect</h3>
        <p>
          Candidates often feel like their applications disappear into a black hole. Rigid keyword filters reject qualified candidates simply because they used a different synonym for their job title or missed a specific acronym.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mt-6">2. Complexity Over Clarity</h3>
        <p>
          Most ATS platforms are bloated with features that teams never use. This complexity leads to poor adoption, fragmented data, and eventually, recruiters going back to using spreadsheets and email folders.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 mt-6">3. Lack of Real-Time Insights</h3>
        <p>
          Legacy systems are great at stored data but terrible at analyzing it. If you want to know <strong>why</strong> your offer acceptance rate is dropping, a traditional ATS rarely has the answer.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Shift to Lean Recruitment</h2>
        <p>
          Modern companies are looking for systems that are <strong>integrated, intelligent, and focused on speed</strong>. They want platforms that live where they work—like their email or collaborative tools—and provide instant AI-driven health checks on their recruitment pipeline.
        </p>
        <p>
          The goal is no longer just to &quot;track&quot; applicants, but to <strong>nurture talent</strong> and make hiring a competitive advantage.
        </p>
      </div>
    )
  },
  {
    slug: 'hire-faster-inbox',
    title: 'How to Hire Faster Using Your Inbox – Yes, Your Inbox',
    excerpt: 'Stop switching between endless tools. Learn how to turn your email inbox into a powerful hiring engine that sources, screens, and schedules with Candexa AI.',
    publishedDate: 'March 31, 2026',
    readingTime: '4 min read',
    content: (
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg font-medium text-slate-800">
          The modern recruiter is drowning in tabs. Between LinkedIn, the ATS, scheduling tools, and endless spreadsheets, the actual &quot;human&quot; part of human resources is getting lost in the shuffle.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Real Problem: Too Many Tools, Too Little Time</h2>
        <p>
          Recruiters spend approximately <strong>60% of their day on administrative work</strong>. Every time you switch from your inbox to another platform to check a candidate&apos;s status or log a note, you lose focus and momentum. This &quot;tool switching tax&quot; is the silent killer of hiring efficiency.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Simple Truth</h2>
        <p>
          Email is universal. It&apos;s where communication naturally happens. The problem isn&apos;t that we use email; it&apos;s that our inboxes lack the intelligence to handle the recruitment lifecycle.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">How Candexa AI Turns Your Inbox Into a Hiring Engine</h2>
        <p>
          Instead of forcing you to leave your workflow, Candexa AI brings the power of an advanced recruitment platform directly to where you already spend your time.
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li><strong>Source:</strong> Identify top talent from incoming inquiries automatically.</li>
          <li><strong>Screen:</strong> AI-driven evaluation of resumes and profiles without opening a new tab.</li>
          <li><strong>Schedule:</strong> Intelligent meeting coordination that respects your calendar.</li>
          <li><strong>Track:</strong> Instant status updates and pipeline health checks within your thread.</li>
        </ul>

        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 my-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2">The Results:</h3>
          <ul className="grid sm:grid-cols-3 gap-4 text-sm font-semibold text-[#ff7a18]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a18]"></span>
              Faster Responses
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a18]"></span>
              Shorter Hiring Cycles
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a18]"></span>
              Zero Wasted Time
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">The Bottom Line</h2>
        <p>
          In a competitive talent market, <strong>speed + communication wins talent</strong>. By transforming your inbox from a static message list into an active hiring engine, you&apos;re not just working faster—you&apos;re working smarter.
        </p>
      </div>
    )
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
