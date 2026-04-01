import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, date, duration } = await req.json();

    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
      return NextResponse.json({ error: 'Zoom credentials missing' }, { status: 500 });
    }

    // 1. Get Access Token
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Zoom Token Error:', errorText);
      return NextResponse.json({ error: 'Failed to get Zoom token' }, { status: 500 });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Create Meeting
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: title || 'Webinar',
        type: 2, // Scheduled meeting
        start_time: date || new Date().toISOString(),
        duration: duration || 60,
        settings: {
          join_before_host: false,
          waiting_room: true,
          auto_recording: 'cloud',
        },
      }),
    });

    if (!meetingResponse.ok) {
      const errorText = await meetingResponse.text();
      console.error('Zoom Meeting Creation Error:', errorText);
      return NextResponse.json({ error: 'Failed to create Zoom meeting' }, { status: 500 });
    }

    const meetingData = await meetingResponse.json();

    return NextResponse.json({
      meetingId: meetingData.id,
      password: meetingData.password,
      start_url: meetingData.start_url,
      join_url: meetingData.join_url,
    });
  } catch (error) {
    console.error('Error in create-meeting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
