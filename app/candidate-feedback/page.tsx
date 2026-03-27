'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function CandidateFeedback() {
  const [formData, setFormData] = useState({
    candidateNPS: 5,
    diversity: 'Prefer not to say',
    feedback: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/candidate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setStatus('success');
      setFormData({ candidateNPS: 5, diversity: 'Prefer not to say', feedback: '' });
    } catch (err) {
      console.error('Feedback submission error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'candidateNPS' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Candidate Experience Feedback</h1>
            <p className="text-slate-600">We value your input to help us improve our recruitment process.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
              <p className="text-slate-600 mb-6">Your feedback has been submitted successfully. We appreciate your time.</p>
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-2 bg-[#ff7a18] text-white font-semibold rounded-lg hover:bg-[#e66a10] transition-colors"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Candidate NPS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  How likely are you to recommend our recruitment process to others? (0-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    name="candidateNPS"
                    min="0"
                    max="10"
                    value={formData.candidateNPS}
                    onChange={handleChange}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ff7a18]"
                  />
                  <span className="text-2xl font-bold text-[#ff7a18] min-w-[3ch] text-center">
                    {formData.candidateNPS}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                  <span>Not Likely</span>
                  <span>Neutral</span>
                  <span>Very Likely</span>
                </div>
              </div>

              {/* Diversity */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  How would you describe the diversity of your recruitment experience?
                </label>
                <select
                  name="diversity"
                  value={formData.diversity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="Diverse">Diverse</option>
                  <option value="Not Diverse">Not Diverse</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Any additional feedback or comments?
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                  placeholder="Tell us what you liked or what we can improve..."
                  required
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-[#ff7a18] hover:bg-[#e66a10] disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {status === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Submit Feedback
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link href="/" className="text-[#ff7a18] hover:text-[#e66a10] text-sm font-medium transition-colors">
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
