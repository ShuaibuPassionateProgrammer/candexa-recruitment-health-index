/**
 * POST /api/callback
 * 
 * Receives processed results from Make.com and saves to Airtable.
 * 
 * Data Flow:
 * 1. Make.com receives assessment data via webhook trigger
 * 2. Make.com processes with AI and generates score/rating/insights
 * 3. Make.com makes an HTTP request to this endpoint
 * 4. This route saves the results to Airtable
 * 5. Frontend polling eventually retrieves the saved results
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveAssessmentResult, type AssessmentResult } from '@/lib/airtable';

interface CallbackData extends Partial<AssessmentResult> {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CallbackData = await request.json();
    const { id, score, rating, insights, breakdown, ...otherFields } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    if (score === undefined || rating === undefined || insights === undefined) {
      return NextResponse.json(
        { error: 'Incomplete data: score, rating, and insights are required' },
        { status: 400 }
      );
    }

    const resultData = {
      id,
      score: typeof score === 'number' ? score : (Number(score) || 0),
      rating: String(rating || 'Pending'),
      insights: Array.isArray(insights) ? insights : (insights ? [String(insights)] : []),
      breakdown: breakdown || undefined,
      processedAt: new Date().toISOString(),
      ...otherFields
    };
    
    const savedRecord = await saveAssessmentResult(resultData);
    
    console.log(`Assessment ${id} result saved to Airtable:`, savedRecord);
    
    return NextResponse.json({
      message: 'Result saved successfully',
      recordId: savedRecord?.id
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
