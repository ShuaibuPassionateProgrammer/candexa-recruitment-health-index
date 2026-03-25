'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/auth';
import config from '@/lib/config';

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Consulting',
  'Legal',
  'Marketing',
  'Real Estate'
];

interface FormData {
  companyName: string;
  email: string;
  industry: string;
  timeToHire: string;
  offerAcceptanceRate: string;
  interviewToOfferRatio: string;
  diversityScore: number;
  candidateNPS: string;
}

interface FormErrors {
  companyName?: string;
  email?: string;
  industry?: string;
  timeToHire?: string;
  offerAcceptanceRate?: string;
  interviewToOfferRatio?: string;
  diversityScore?: string;
  candidateNPS?: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    industry: '',
    timeToHire: '',
    offerAcceptanceRate: '',
    interviewToOfferRatio: '',
    diversityScore: 5,
    candidateNPS: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        companyName: user.companyName,
        email: user.email
      }));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    const timeToHire = parseFloat(formData.timeToHire);
    if (!formData.timeToHire) {
      newErrors.timeToHire = 'Time to hire is required';
    } else if (isNaN(timeToHire) || timeToHire < 0) {
      newErrors.timeToHire = 'Please enter a valid number';
    }

    const offerRate = parseFloat(formData.offerAcceptanceRate);
    if (!formData.offerAcceptanceRate) {
      newErrors.offerAcceptanceRate = 'Offer acceptance rate is required';
    } else if (isNaN(offerRate) || offerRate < 0 || offerRate > 100) {
      newErrors.offerAcceptanceRate = 'Must be between 0 and 100';
    }

    const ratio = parseFloat(formData.interviewToOfferRatio);
    if (!formData.interviewToOfferRatio) {
      newErrors.interviewToOfferRatio = 'Interview-to-offer ratio is required';
    } else if (isNaN(ratio) || ratio < 0) {
      newErrors.interviewToOfferRatio = 'Please enter a valid number';
    }

    if (formData.diversityScore < 0 || formData.diversityScore > 10) {
      newErrors.diversityScore = 'Diversity score must be between 0 and 10';
    }

    const nps = parseInt(formData.candidateNPS);
    if (!formData.candidateNPS) {
      newErrors.candidateNPS = 'Candidate NPS is required';
    } else if (isNaN(nps) || nps < -100 || nps > 100) {
      newErrors.candidateNPS = 'Must be between -100 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(config.api.assessment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          industry: formData.industry,
          timeToHire: parseFloat(formData.timeToHire),
          offerAcceptanceRate: parseFloat(formData.offerAcceptanceRate),
          interviewToOfferRatio: parseFloat(formData.interviewToOfferRatio),
          diversityScore: formData.diversityScore,
          candidateNPS: parseInt(formData.candidateNPS)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to submit assessment');
      }

      router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-2xl mx-auto">
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
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-slate-200">
              {serverError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    placeholder="Acme Corporation"
                  />
                  {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                    placeholder="hr@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.industry ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white`}
                  >
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time to Hire */}
                  <div>
                    <label htmlFor="timeToHire" className="block text-sm font-medium text-slate-700 mb-1">
                      Time to Hire (days)
                    </label>
                    <input
                      type="number"
                      id="timeToHire"
                      name="timeToHire"
                      value={formData.timeToHire}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.timeToHire ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                      placeholder="45"
                    />
                    {errors.timeToHire && <p className="mt-1 text-sm text-red-600">{errors.timeToHire}</p>}
                  </div>

                  {/* Offer Acceptance Rate */}
                  <div>
                    <label htmlFor="offerAcceptanceRate" className="block text-sm font-medium text-slate-700 mb-1">
                      Offer Acceptance (%)
                    </label>
                    <input
                      type="number"
                      id="offerAcceptanceRate"
                      name="offerAcceptanceRate"
                      value={formData.offerAcceptanceRate}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.offerAcceptanceRate ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                      placeholder="85"
                    />
                    {errors.offerAcceptanceRate && <p className="mt-1 text-sm text-red-600">{errors.offerAcceptanceRate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Interview to Offer Ratio */}
                  <div>
                    <label htmlFor="interviewToOfferRatio" className="block text-sm font-medium text-slate-700 mb-1">
                      Interview-to-Offer Ratio
                    </label>
                    <input
                      type="number"
                      id="interviewToOfferRatio"
                      name="interviewToOfferRatio"
                      value={formData.interviewToOfferRatio}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.interviewToOfferRatio ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                      placeholder="4"
                    />
                    {errors.interviewToOfferRatio && <p className="mt-1 text-sm text-red-600">{errors.interviewToOfferRatio}</p>}
                  </div>

                  {/* Candidate NPS */}
                  <div>
                    <label htmlFor="candidateNPS" className="block text-sm font-medium text-slate-700 mb-1">
                      Candidate NPS (-100 to 100)
                    </label>
                    <input
                      type="number"
                      id="candidateNPS"
                      name="candidateNPS"
                      value={formData.candidateNPS}
                      onChange={handleChange}
                      min="-100"
                      max="100"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.candidateNPS ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                      placeholder="35"
                    />
                    {errors.candidateNPS && <p className="mt-1 text-sm text-red-600">{errors.candidateNPS}</p>}
                  </div>
                </div>

                {/* Diversity Score Slider */}
                <div>
                  <label htmlFor="diversityScore" className="block text-sm font-medium text-slate-700 mb-1">
                    Diversity Score: <span className="text-indigo-600 font-semibold">{formData.diversityScore}/10</span>
                  </label>
                  <input
                    type="range"
                    id="diversityScore"
                    name="diversityScore"
                    value={formData.diversityScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, diversityScore: parseFloat(e.target.value) }))}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  {errors.diversityScore && <p className="mt-1 text-sm text-red-600">{errors.diversityScore}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-200 disabled:shadow-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Get My Recruitment Score'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
