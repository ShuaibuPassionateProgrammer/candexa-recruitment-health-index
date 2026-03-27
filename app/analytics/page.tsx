'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/auth';

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: number[];
}

interface AssessmentRecord {
  id: string;
  date: string;
  company: string;
  industry: string;
  score: number;
  rating: string;
  status: 'completed' | 'pending';
}

interface IndustryBenchmark {
  industry: string;
  averageScore: number;
  yourScore: number;
}

interface MonthlyTrend {
  month: string;
  score: number;
  assessments: number;
}

const metricCards: MetricCard[] = [
  {
    id: 'overall-score',
    label: 'Overall Score',
    value: 78,
    change: '+5.2%',
    changeType: 'positive',
    trend: [68, 72, 75, 78]
  },
  {
    id: 'assessments',
    label: 'Total Assessments',
    value: 47,
    change: '+12',
    changeType: 'positive',
    trend: [8, 12, 15, 12]
  },
  {
    id: 'avg-time',
    label: 'Avg. Time to Hire',
    value: '32 days',
    change: '-8.5%',
    changeType: 'positive',
    trend: [45, 40, 35, 32]
  },
  {
    id: 'offer-rate',
    label: 'Offer Acceptance',
    value: '87%',
    change: '+3.2%',
    changeType: 'positive',
    trend: [78, 82, 85, 87]
  }
];

const assessmentHistory: AssessmentRecord[] = [
  { id: '1', date: 'Mar 24, 2026', company: 'TechCorp Solutions', industry: 'Technology', score: 82, rating: 'Excellent', status: 'completed' },
  { id: '2', date: 'Mar 20, 2026', company: 'Global Finance Inc', industry: 'Finance', score: 75, rating: 'Good', status: 'completed' },
  { id: '3', date: 'Mar 15, 2026', company: 'HealthFirst Medical', industry: 'Healthcare', score: 68, rating: 'Average', status: 'completed' },
  { id: '4', date: 'Mar 10, 2026', company: 'RetailMax Group', industry: 'Retail', score: 71, rating: 'Good', status: 'completed' },
  { id: '5', date: 'Mar 5, 2026', company: 'EduLearn Academy', industry: 'Education', score: 79, rating: 'Good', status: 'completed' },
  { id: '6', date: 'Feb 28, 2026', company: 'ConsultPro Partners', industry: 'Consulting', score: 85, rating: 'Excellent', status: 'completed' },
  { id: '7', date: 'Feb 20, 2026', company: 'LegalEase Associates', industry: 'Legal', score: 62, rating: 'Average', status: 'completed' },
  { id: '8', date: 'Feb 15, 2026', company: 'MarketBuzz Agency', industry: 'Marketing', score: 73, rating: 'Good', status: 'completed' }
];

const industryBenchmarks: IndustryBenchmark[] = [
  { industry: 'Technology', averageScore: 72, yourScore: 78 },
  { industry: 'Finance', averageScore: 68, yourScore: 75 },
  { industry: 'Healthcare', averageScore: 70, yourScore: 68 },
  { industry: 'Retail', averageScore: 65, yourScore: 71 },
  { industry: 'Education', averageScore: 71, yourScore: 79 },
  { industry: 'Consulting', averageScore: 74, yourScore: 85 }
];

const monthlyTrends: MonthlyTrend[] = [
  { month: 'Sep', score: 68, assessments: 3 },
  { month: 'Oct', score: 71, assessments: 5 },
  { month: 'Nov', score: 74, assessments: 4 },
  { month: 'Dec', score: 72, assessments: 6 },
  { month: 'Jan', score: 76, assessments: 8 },
  { month: 'Feb', score: 78, assessments: 12 },
  { month: 'Mar', score: 78, assessments: 9 }
];

const scoreDistribution = [
  { range: '90-100', count: 5, percentage: 11 },
  { range: '80-89', count: 12, percentage: 26 },
  { range: '70-79', count: 18, percentage: 38 },
  { range: '60-69', count: 9, percentage: 19 },
  { range: 'Below 60', count: 3, percentage: 6 }
];

const recommendations = [
  { metric: 'Time to Hire', status: 'positive', message: 'Your time-to-hire is 18% faster than industry average' },
  { metric: 'Offer Acceptance', status: 'positive', message: 'Strong offer acceptance rate indicates good candidate experience' },
  { metric: 'Diversity Score', status: 'warning', message: 'Consider expanding sourcing channels to improve diversity' },
  { metric: 'Interview Efficiency', status: 'info', message: 'Average of 4.2 interviews per offer - room for optimization' }
];

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 65) return 'text-blue-600 bg-blue-50';
  if (score >= 50) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 65) return 'from-blue-500 to-blue-600';
  if (score >= 50) return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
}

function MiniTrendChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((value, idx) => {
        const height = ((value - min) / range) * 60 + 20;
        return (
          <div
            key={idx}
            className={`w-3 ${color} rounded-t-sm transition-all`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricCard }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-orange-200 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          metric.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' :
          metric.changeType === 'negative' ? 'text-red-600 bg-red-50' :
          'text-slate-600 bg-slate-50'
        }`}>
          {metric.change}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
      <div className="text-sm text-slate-500 mb-3">{metric.label}</div>
      <MiniTrendChart 
        data={metric.trend} 
        color="bg-[#ff7a18]" 
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<{ companyName: string } | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7a18]"></div>
      </div>
    );
  }

  const maxScore = Math.max(...monthlyTrends.map(m => m.score));
  const avgScore = Math.round(monthlyTrends.reduce((acc, m) => acc + m.score, 0) / monthlyTrends.length);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Analytics Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Track your recruitment performance metrics
              </p>
            </div>
            <div className="flex gap-2">
              {['30days', '3months', '6months', '1year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedPeriod === period
                      ? 'bg-[#ff7a18] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {period === '30days' ? '30 Days' :
                   period === '3months' ? '3 Months' :
                   period === '6months' ? '6 Months' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Score Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Score Trend</h2>
                  <p className="text-sm text-slate-500">Average: {avgScore} points</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff7a18]"></div>
                    <span className="text-slate-600">Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-slate-600">Assessments</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4">
                {monthlyTrends.map((month, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex gap-1 items-end h-48">
                      <div 
                        className="flex-1 bg-gradient-to-t from-[#ff7a18] to-[#e66a10] rounded-t-lg relative group"
                        style={{ height: `${(month.score / 100) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Score: {month.score}
                        </div>
                      </div>
                      <div 
                        className="flex-1 bg-slate-200 rounded-t-lg relative group"
                        style={{ height: `${(month.assessments / 15) * 80}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {month.assessments} assessments
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 font-medium">{month.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Score Distribution</h2>
              <div className="space-y-4">
                {scoreDistribution.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600">{item.range}</span>
                      <span className="text-sm font-medium text-slate-900">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreGradient(item.range === '90-100' ? 95 : 
                          item.range === '80-89' ? 82 : 
                          item.range === '70-79' ? 72 : 
                          item.range === '60-69' ? 62 : 40)} rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Score</span>
                  <span className="text-lg font-bold text-slate-900">{avgScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Benchmark & Recommendations */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Industry Benchmark */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Industry Benchmark Comparison</h2>
              <div className="space-y-5">
                {industryBenchmarks.map((benchmark, idx) => {
                  const diff = benchmark.yourScore - benchmark.averageScore;
                  const diffPercent = Math.round((diff / benchmark.averageScore) * 100);
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{benchmark.industry}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">Avg: {benchmark.averageScore}</span>
                          <span className={`text-sm font-semibold ${
                            diff >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {diff >= 0 ? '+' : ''}{diffPercent}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-3">
                        <div 
                          className="h-full bg-slate-200 rounded-l-full"
                          style={{ width: `${(benchmark.averageScore / 100) * 100}%` }}
                        />
                        <div 
                          className={`h-full rounded-r-full ${diff >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${(Math.abs(diff) / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">AI Recommendations</h2>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      rec.status === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                      rec.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {rec.status === 'positive' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : rec.status === 'warning' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 mb-1">{rec.metric}</div>
                      <div className="text-sm text-slate-600">{rec.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment History Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Recent Assessments</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assessments..."
                    className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ff7a18] focus:border-[#ff7a18] outline-none"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ff7a18] focus:border-[#ff7a18] outline-none bg-white">
                  <option>All Industries</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Retail</option>
                  <option>Education</option>
                  <option>Consulting</option>
                  <option>Legal</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Industry</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentHistory.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-slate-900">{record.date}</td>
                      <td className="py-4 font-medium text-slate-900">{record.company}</td>
                      <td className="py-4 text-slate-600">{record.industry}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getScoreGradient(record.score)} rounded-full`}
                              style={{ width: `${record.score}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-900">{record.score}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(record.score)}`}>
                          {record.rating}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'completed' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            record.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {record.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-sm text-[#ff7a18] hover:text-[#e66a10] font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing {assessmentHistory.length} of 47 assessments
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
