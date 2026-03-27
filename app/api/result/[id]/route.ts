/**
 * GET /api/result/[id]
 * 
 * Fetches assessment result from Airtable by assessment ID.
 * 
 * Data Flow:
 * 1. Frontend polls this endpoint with the assessment ID
 * 2. This route queries Airtable for matching Assessment ID
 * 3. Returns stored results or "not found" if still processing
 * 4. If Airtable is not configured, returns mock data for development
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentById } from '@/lib/airtable';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }
    
    const result = await getAssessmentById(id);
    
    if (!result) {
      return NextResponse.json({
        status: 'processing'
      });
    }
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch result', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
