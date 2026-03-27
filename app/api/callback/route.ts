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

interface CallbackData {
  id: string;
  score?: number;
  rating?: string;
  insights?: string[];
  breakdown?: AssessmentResult['breakdown'];
}

export async function POST(request: NextRequest) {
  try {
    const { id, score, rating, insights, breakdown }: CallbackData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const resultData = {
      id,
      score: score || 0,
      rating: rating || 'Pending',
      insights: insights || [],
      breakdown: breakdown || undefined,
      processedAt: new Date().toISOString()
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
