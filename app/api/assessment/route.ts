/**
 * POST /api/assessment
 * 
 * Receives assessment form data, sends to Zapier webhook, returns assessment ID.
 * 
 * Data Flow:
 * 1. User submits assessment form from frontend
 * 2. Frontend calls POST /api/assessment
 * 3. This route generates a unique ID
 * 4. Sends data to Zapier webhook for AI processing
 * 5. Returns the assessment ID to frontend
 * 6. Frontend redirects to results page and starts polling
 */

import { NextRequest, NextResponse } from 'next/server';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AssessmentData {
  companyName: string;
  email: string;
  industry: string;
  timeToHire: number;
  offerAcceptanceRate: number;
  interviewToOfferRatio: number;
  diversityScore: number;
  candidateNPS: number;
}

function validateAssessmentData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  const d = data as Record<string, unknown>;

  if (!d.companyName || typeof d.companyName !== 'string') {
    errors.push('Company name is required');
  }
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email as string)) {
    errors.push('Valid email is required');
  }
  if (!d.industry || typeof d.industry !== 'string') {
    errors.push('Industry is required');
  }
  if (typeof d.timeToHire !== 'number' || d.timeToHire < 0) {
    errors.push('Time to hire must be a positive number');
  }
  if (typeof d.offerAcceptanceRate !== 'number' || d.offerAcceptanceRate < 0 || d.offerAcceptanceRate > 100) {
    errors.push('Offer acceptance rate must be between 0 and 100');
  }
  if (typeof d.interviewToOfferRatio !== 'number' || d.interviewToOfferRatio < 0) {
    errors.push('Interview to offer ratio must be a positive number');
  }
  // diversityScore and candidateNPS are now optional with defaults
  const diversityScore = typeof d.diversityScore === 'number' ? d.diversityScore : 5;
  const candidateNPS = typeof d.candidateNPS === 'number' ? d.candidateNPS : 0;

  if (diversityScore < 0 || diversityScore > 10) {
    errors.push('Diversity score must be between 0 and 10');
  }
  if (candidateNPS < -100 || candidateNPS > 100) {
    errors.push('Candidate NPS must be between -100 and 100');
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  try {
    const formData: AssessmentData = await request.json();
    
    const validation = validateAssessmentData(formData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const assessmentId = generateUUID();

    const webhookPayload = {
      id: assessmentId,
      companyName: formData.companyName,
      email: formData.email,
      industry: formData.industry,
      timeToHire: formData.timeToHire,
      offerAcceptanceRate: formData.offerAcceptanceRate,
      interviewToOfferRatio: formData.interviewToOfferRatio,
      diversityScore: typeof formData.diversityScore === 'number' ? formData.diversityScore : 5,
      candidateNPS: typeof formData.candidateNPS === 'number' ? formData.candidateNPS : 0,
      submittedAt: new Date().toISOString()
    };

    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    
    if (zapierWebhookUrl) {
      try {
        await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
        console.log(`Assessment ${assessmentId} sent to Zapier webhook`);
      } catch (webhookError) {
        console.error('Zapier webhook error:', webhookError);
      }
    } else {
      console.log('ZAPIER_WEBHOOK_URL not configured - skipping webhook call');
      console.log('Webhook payload would be:', JSON.stringify(webhookPayload, null, 2));
    }

    return NextResponse.json({
      success: true,
      id: assessmentId
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
