'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

interface BreakdownItem {
  score: number;
  max: number;
  message: string;
}

interface ResultData {
  score: number;
  rating: string;
  breakdown: {
    timeToHire: BreakdownItem;
    offerAcceptance: BreakdownItem;
    interviewToOffer: BreakdownItem;
    diversity: BreakdownItem;
    candidateNPS: BreakdownItem;
    industryBonus: BreakdownItem;
  };
  insights: string[];
  companyName: string;
  industry: string;
}

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'Excellent': return 'text-emerald-600 bg-emerald-50';
    case 'Good': return 'text-blue-600 bg-blue-50';
    case 'Average': return 'text-amber-600 bg-amber-50';
    case 'Poor': return 'text-red-600 bg-red-50';
    default: return 'text-slate-600 bg-slate-50';
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 65) return 'from-blue-500 to-blue-600';
  if (score >= 50) return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
}

function ScoreBar({ score, max, label, color }: { score: number; max: number; label: string; color: string }) {
  const percentage = (score / max) * 100;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{score}/{max}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');

  if (!dataParam) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Sidebar />
        <div className="text-center lg:ml-64">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Results Found</h1>
          <p className="text-slate-600 mb-6">Please complete an assessment to see your results.</p>
          <Link
            href="/assessment"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Assessment
          </Link>
        </div>
      </div>
    );
  }

  const data: ResultData = JSON.parse(decodeURIComponent(dataParam));

  return (
    <div className="lg:ml-64 min-h-screen">
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Recruitment Health Report
            </h1>
            <p className="text-slate-600">
              {data.companyName} - {data.industry}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 mb-6 border border-slate-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="10"
                    fill="none"
                    className="stroke-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - data.score / 100)}`}
                    className={`stroke-current ${getScoreColor(data.score)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{data.score}</span>
                  <span className="text-xs text-slate-500">out of 100</span>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getRatingColor(data.rating)}`}>
                  {data.rating}
                </span>
                <p className="mt-4 text-slate-600">
                  {data.rating === 'Excellent' && 'Outstanding recruitment performance! Your hiring processes are industry-leading.'}
                  {data.rating === 'Good' && 'Solid recruitment health with room for optimization in specific areas.'}
                  {data.rating === 'Average' && 'Your recruitment health is moderate. Focus on key improvements to boost performance.'}
                  {data.rating === 'Poor' && 'Significant improvements needed. Consider a comprehensive recruitment strategy overhaul.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Score Breakdown</h2>
              
              <ScoreBar 
                score={data.breakdown.timeToHire.score} 
                max={data.breakdown.timeToHire.max}
                label="Time to Hire"
                color="bg-indigo-500"
              />
              
              <ScoreBar 
                score={data.breakdown.offerAcceptance.score} 
                max={data.breakdown.offerAcceptance.max}
                label="Offer Acceptance"
                color="bg-purple-500"
              />
              
              <ScoreBar 
                score={data.breakdown.interviewToOffer.score} 
                max={data.breakdown.interviewToOffer.max}
                label="Interview Efficiency"
                color="bg-blue-500"
              />
              
              <ScoreBar 
                score={data.breakdown.diversity.score} 
                max={data.breakdown.diversity.max}
                label="Diversity Score"
                color="bg-pink-500"
              />
              
              <ScoreBar 
                score={data.breakdown.candidateNPS.score} 
                max={data.breakdown.candidateNPS.max}
                label="Candidate NPS"
                color="bg-cyan-500"
              />
              
              <ScoreBar 
                score={data.breakdown.industryBonus.score} 
                max={data.breakdown.industryBonus.max}
                label="Industry Benchmark"
                color="bg-amber-500"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">AI-Powered Insights</h2>
              <div className="space-y-3">
                {data.insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Assessment
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center lg:ml-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading results...</p>
          </div>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
