/**
 * Airtable Service
 * 
 * Handles all Airtable API interactions for the assessment system.
 * 
 * Data Flow:
 * 1. User submits assessment form
 * 2. POST /api/assessment sends data to Zapier webhook
 * 3. Zapier processes and generates score/rating/insights
 * 4. Zapier calls POST /api/callback with results
 * 5. This service saves results to Airtable
 * 6. GET /api/result/:id retrieves results from Airtable
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Parsed Resumes';
const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';

export interface AssessmentResult {
  id: string;
  score: number;
  rating: string;
  insights: string[];
  breakdown?: {
    timeToHire: { score: number; max: number; message: string };
    offerAcceptance: { score: number; max: number; message: string };
    interviewToOffer: { score: number; max: number; message: string };
    diversity: { score: number; max: number; message: string };
    candidateNPS: { score: number; max: number; message: string };
    industryBonus: { score: number; max: number; message: string };
  };
  companyName?: string;
  email?: string;
  industry?: string;
  timeToHire?: number;
  offerAcceptanceRate?: number;
  interviewToOfferRatio?: number;
  diversityScore?: number;
  candidateNPS?: number;
  status?: string;
  createdAt?: string;
  isMock?: boolean;
}

export interface SaveAssessmentData {
  id: string;
  score?: number;
  rating?: string;
  insights?: string[];
  breakdown?: AssessmentResult['breakdown'];
  companyName?: string;
  email?: string;
  industry?: string;
  timeToHire?: number;
  offerAcceptanceRate?: number;
  interviewToOfferRatio?: number;
  diversityScore?: number;
  candidateNPS?: number;
  processedAt?: string;
}

/**
 * Saves an assessment result to Airtable
 */
export async function saveAssessmentResult(data: SaveAssessmentData): Promise<{ id: string } | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('Airtable credentials not configured - skipping save');
    console.log('Would save:', JSON.stringify(data, null, 2));
    return null;
  }

  try {
    const fields: Record<string, string | number> = {
      'Assessment ID': data.id,
      'Score': data.score ?? 0,
      'Rating': data.rating ?? 'Pending',
      'Insights': Array.isArray(data.insights) ? data.insights.join('\n') : (data.insights || ''),
      'Processed At': data.processedAt || new Date().toISOString(),
      'Status': 'Completed'
    };

    if (data.breakdown) {
      fields['Score Breakdown'] = JSON.stringify(data.breakdown);
    }

    if (data.companyName) fields['Company Name'] = data.companyName;
    if (data.email) fields['Email'] = data.email;
    if (data.industry) fields['Industry'] = data.industry;
    if (data.timeToHire !== undefined) fields['Time to Hire'] = data.timeToHire;
    if (data.offerAcceptanceRate !== undefined) fields['Offer Acceptance Rate'] = data.offerAcceptanceRate;
    if (data.interviewToOfferRatio !== undefined) fields['Interview Ratio'] = data.interviewToOfferRatio;
    if (data.diversityScore !== undefined) fields['Diversity Score'] = data.diversityScore;
    if (data.candidateNPS !== undefined) fields['Candidate NPS'] = data.candidateNPS;

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{ fields }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Failed to save to Airtable';
      console.error('Airtable Error Response:', errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.records || result.records.length === 0) {
      throw new Error('Airtable returned no records after save');
    }
    return { id: result.records[0].id };
  } catch (error) {
    console.error('Airtable save error:', error);
    throw error;
  }
}

/**
 * Retrieves an assessment result from Airtable by assessment ID
 */
export async function getAssessmentById(assessmentId: string): Promise<AssessmentResult | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn('Airtable credentials not configured - returning mock data');
    return generateMockResult(assessmentId);
  }

  try {
    const url = new URL(
      `${AIRTABLE_BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`
    );
    url.searchParams.set('filterByFormula', `{Assessment ID} = '${assessmentId}'`);
    url.searchParams.set('maxRecords', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Airtable');
    }

    const data = await response.json();
    const records = data.records;

    if (!records || records.length === 0) {
      return null;
    }

    const record = records[0];
    const fields = record.fields;

    return {
      id: fields['Assessment ID'],
      score: fields['Score'],
      rating: fields['Rating'],
      insights: fields['Insights'] ? fields['Insights'].split('\n') : [],
      breakdown: fields['Score Breakdown'] ? JSON.parse(fields['Score Breakdown']) : undefined,
      companyName: fields['Company Name'],
      industry: fields['Industry'],
      email: fields['Email'],
      timeToHire: fields['Time to Hire'],
      offerAcceptanceRate: fields['Offer Acceptance Rate'],
      interviewToOfferRatio: fields['Interview Ratio'],
      diversityScore: fields['Diversity Score'],
      candidateNPS: fields['Candidate NPS'],
      status: fields['Status'] || 'Completed',
      createdAt: fields['Processed At'],
      isMock: false
    };
  } catch (error) {
    console.error('Airtable fetch error:', error);
    throw error;
  }
}

/**
 * Generates mock result for development without Airtable configured
 */
function generateMockResult(assessmentId: string): AssessmentResult {
  const hash = assessmentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = 50 + (hash % 50);
  
  const getRating = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  const mockInsights = [
    'Your time-to-hire metric is performing above industry average. Consider sharing your process with other teams.',
    'Offer acceptance rate could be improved by enhancing your candidate experience during the offer stage.',
    'Diversity score indicates room for improvement in recruitment sourcing strategies.',
    'Interview efficiency is good but there may be opportunities to reduce interview stages.',
    'Candidate NPS suggests candidates appreciate your process but there are friction points to address.'
  ];

  const mockBreakdown = {
    timeToHire: { score: 15 + (hash % 10), max: 20, message: 'Time to hire is competitive' },
    offerAcceptance: { score: 12 + (hash % 8), max: 20, message: 'Good offer acceptance' },
    interviewToOffer: { score: 10 + (hash % 10), max: 20, message: 'Efficient interview process' },
    diversity: { score: 5 + (hash % 10), max: 15, message: 'Room for diversity improvement' },
    candidateNPS: { score: 8 + (hash % 7), max: 15, message: 'Good candidate experience' },
    industryBonus: { score: 5 + (hash % 5), max: 10, message: 'Competitive within industry' }
  };

  return {
    id: assessmentId,
    score: baseScore,
    rating: getRating(baseScore),
    insights: mockInsights.slice(0, 3 + (hash % 3)),
    breakdown: mockBreakdown,
    companyName: 'Sample Company',
    industry: 'Technology',
    status: 'Completed',
    createdAt: new Date().toISOString(),
    isMock: true
  };
}

const airtableService = {
  saveAssessmentResult,
  getAssessmentById
};

export default airtableService;
