'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import config from '@/lib/config';

interface BreakdownItem {
  score: number;
  max: number;
  message: string;
}

interface ResultData {
  id: string;
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
  status: string;
  isMock?: boolean;
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
  const percentage = max > 0 ? (score / max) * 100 : 0;
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

function ProcessingState({ attempt, maxAttempts }: { attempt: number; maxAttempts: number }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#ff7a18] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Processing with AI
          </h2>
          <p className="text-slate-600 mb-4">
            Our AI is analyzing your recruitment data and generating personalized insights...
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="inline-block w-2 h-2 bg-[#ff7a18] rounded-full animate-pulse"></span>
            <span>Checking results... (attempt {attempt}/{maxAttempts})</span>
          </div>
          
          {attempt > 5 && (
            <p className="mt-4 text-xs text-slate-400">
              This usually takes 10-30 seconds. Please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Unable to Load Results
          </h2>
          <p className="text-slate-600 mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-[#ff7a18] hover:bg-[#e66a10] text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/assessment"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              New Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Sidebar />
      <div className="text-center lg:ml-64 px-4">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">No Results Found</h1>
        <p className="text-slate-600 mb-6">Please complete an assessment to see your results.</p>
        <Link
          href="/assessment"
          className="inline-flex items-center px-6 py-3 bg-[#ff7a18] hover:bg-[#e66a10] text-white font-semibold rounded-lg transition-colors"
        >
          Go to Assessment
        </Link>
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const fetchResult = useCallback(async () => {
    if (!id) return;
    
    try {
      setAttempt(prev => prev + 1);
      const response = await fetch(config.api.result(id));
      const data = await response.json();
      
      if (response.ok && data.score !== undefined) {
        setResult(data);
        setIsLoading(false);
        return true;
      } else if (response.status === 404 || data.status === 'pending') {
        return false;
      } else {
        throw new Error(data.error || 'Failed to fetch result');
      }
    } catch (err) {
      console.error('Error fetching result:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsLoading(false);
      return false;
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('No assessment ID provided');
      setIsLoading(false);
      return;
    }

    let pollInterval: ReturnType<typeof setInterval>;
    let attempts = 0;
    const maxAttempts = config.polling.maxAttempts;

    const startPolling = () => {
      pollInterval = setInterval(async () => {
        attempts++;
        const success = await fetchResult();
        
        if (success || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (!success && !error) {
            setError('Processing is taking longer than expected. Please try again later.');
          }
        }
      }, config.polling.intervalMs);
    };

    fetchResult().then(success => {
      if (!success) {
        startPolling();
      }
    });

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id, fetchResult, error]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setAttempt(0);
    fetchResult();
  };

  if (!id) {
    return <NoResultsState />;
  }

  if (isLoading && !result) {
    return <ProcessingState attempt={attempt} maxAttempts={config.polling.maxAttempts} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  if (!result) {
    return <NoResultsState />;
  }

  return (
    <div className="lg:ml-64 min-h-screen">
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Recruitment Health Report
            </h1>
            <p className="text-slate-600">
              {result.companyName} - {result.industry}
            </p>
            {result.isMock && (
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                Demo Mode - Airtable not configured
              </span>
            )}
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
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.score / 100)}`}
                    className={`stroke-current ${getScoreColor(result.score)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{result.score}</span>
                  <span className="text-xs text-slate-500">out of 100</span>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${getRatingColor(result.rating)}`}>
                  {result.rating}
                </span>
                <p className="mt-4 text-slate-600">
                  {result.rating === 'Excellent' && 'Outstanding recruitment performance! Your hiring processes are industry-leading.'}
                  {result.rating === 'Good' && 'Solid recruitment health with room for optimization in specific areas.'}
                  {result.rating === 'Average' && 'Your recruitment health is moderate. Focus on key improvements to boost performance.'}
                  {result.rating === 'Poor' && 'Significant improvements needed. Consider a comprehensive recruitment strategy overhaul.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Score Breakdown</h2>
              
              {result.breakdown?.timeToHire && (
                <ScoreBar 
                  score={result.breakdown.timeToHire.score} 
                  max={result.breakdown.timeToHire.max}
                  label="Time to Hire"
                  color="bg-orange-500"
                />
              )}
              
              {result.breakdown?.offerAcceptance && (
                <ScoreBar 
                  score={result.breakdown.offerAcceptance.score} 
                  max={result.breakdown.offerAcceptance.max}
                  label="Offer Acceptance"
                  color="bg-orange-600"
                />
              )}
              
              {result.breakdown?.interviewToOffer && (
                <ScoreBar 
                  score={result.breakdown.interviewToOffer.score} 
                  max={result.breakdown.interviewToOffer.max}
                  label="Interview Efficiency"
                  color="bg-blue-500"
                />
              )}
              
              {result.breakdown?.diversity && (
                <ScoreBar 
                  score={result.breakdown.diversity.score} 
                  max={result.breakdown.diversity.max}
                  label="Diversity Score"
                  color="bg-pink-500"
                />
              )}
              
              {result.breakdown?.candidateNPS && (
                <ScoreBar 
                  score={result.breakdown.candidateNPS.score} 
                  max={result.breakdown.candidateNPS.max}
                  label="Candidate NPS"
                  color="bg-cyan-500"
                />
              )}
              
              {result.breakdown?.industryBonus && (
                <ScoreBar 
                  score={result.breakdown.industryBonus.score} 
                  max={result.breakdown.industryBonus.max}
                  label="Industry Benchmark"
                  color="bg-amber-500"
                />
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">AI-Powered Insights</h2>
              <div className="space-y-3">
                {result.insights && result.insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="inline-flex items-center justify-center px-6 py-3 bg-[#ff7a18] hover:bg-[#e66a10] text-white font-semibold rounded-lg transition-colors"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7a18] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading results...</p>
          </div>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
