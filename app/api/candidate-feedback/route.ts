/**
 * POST /api/candidate-feedback
 * 
 * Receives candidate NPS, diversity, and feedback. Sends to Make.com webhook.
 * 
 * Data Flow:
 * 1. Candidate fills out feedback form on hidden /candidate-feedback page
 * 2. Form calls POST /api/candidate-feedback
 * 3. This route generates a unique ID
 * 4. Sends data to Make.com webhook for processing
 * 5. Returns success status to frontend
 */

import { NextRequest, NextResponse } from 'next/server';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function validateFeedbackData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  const d = data as Record<string, unknown>;

  if (typeof d.candidateNPS !== 'number' || d.candidateNPS < 0 || d.candidateNPS > 10) {
    errors.push('Candidate NPS must be a number between 0 and 10');
  }
  
  const validDiversity = ["Diverse", "Not Diverse", "Prefer not to say"];
  if (!d.diversity || typeof d.diversity !== 'string' || !validDiversity.includes(d.diversity)) {
    errors.push(`Diversity must be one of: ${validDiversity.join(', ')}`);
  }

  if (!d.feedback || typeof d.feedback !== 'string' || d.feedback.trim().length === 0) {
    errors.push('Feedback is required');
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateFeedbackData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { candidateNPS, diversity, feedback } = body;
    const feedbackId = generateUUID();

    const webhookPayload = {
      id: feedbackId,
      type: 'candidate_feedback',
      candidateNPS,
      diversity,
      feedback,
      submittedAt: new Date().toISOString()
    };

    const makeWebhookUrl = process.env.MAKE_CANDIDATE_WEBHOOK_URL;
    
    if (makeWebhookUrl) {
      try {
        await fetch(makeWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
        console.log(`Candidate feedback ${feedbackId} sent to Make.com candidate webhook`);
      } catch (webhookError) {
        console.error('Make.com candidate webhook error:', webhookError);
        // We still continue to return success if webhook fails but we logged it
      }
    } else {
      console.log('MAKE_CANDIDATE_WEBHOOK_URL not configured - skipping webhook call');
      console.log('Webhook payload would be:', JSON.stringify(webhookPayload, null, 2));
    }

    return NextResponse.json({
      success: true,
      id: feedbackId,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Candidate feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
