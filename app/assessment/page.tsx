'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AssessmentPage() {
  const router = useRouter();
  // Google Form Integration: Custom form logic replaced by iframe embed.

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Recruitment Health Assessment
              </h1>
              <p className="text-slate-600">
                Answer a few questions to discover your hiring performance score
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-semibold text-slate-900">Complete Your Assessment</h2>
                <p className="text-slate-600 text-sm mt-1">Please fill out the form below to continue</p>
              </div>
              
              <div className="p-2 lg:p-4">
                <div className="relative w-full min-h-[1200px] bg-slate-50 rounded-xl overflow-hidden">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdIZhwOkl3jl8UfK50bRoh6cL58O-QbuKdHmGTvtZZRu5S73g/viewform?embedded=true" 
                    className="absolute inset-0 w-full h-full border-none"
                    title="Assessment Form"
                  >
                    Loading…
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
