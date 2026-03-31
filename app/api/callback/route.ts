/**
 * POST /api/callback
 * 
 * Receives processed results from Zapier and saves to Airtable.
 * 
 * Data Flow:
 * 1. Zapier receives assessment data via webhook trigger
 * 2. Zapier processes (e.g., via AI or other steps) and generates score/rating/insights
 * 3. Zapier makes an HTTP request to this endpoint
 * 4. This route saves the results to Airtable
 * 5. Frontend polling eventually retrieves the saved results
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint is now a no-op as the project has migrated to Google Forms.
    // It remains here to prevent errors if external webhooks (e.g., Zapier) still hit it.
    
    const body = await request.json();
    console.log('Received callback (Airtable integration disabled):', body.id || 'No ID');
    
    return NextResponse.json({
      message: 'Callback received successfully (Airtable integration is disabled)',
      status: 'success'
    });

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
