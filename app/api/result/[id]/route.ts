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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Result fetching from Airtable has been discontinued in favor of Google Forms.
    // All assessment data is now managed directly within the Google Form responses.
    
    return NextResponse.json({
      status: 'migrated',
      message: 'The assessment system has migrated to Google Forms. Please check your Google Form responses for results.',
      id: id
    }, { status: 404 });

  } catch (error) {
    console.error('Result fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch result' },
      { status: 500 }
    );
  }
}
