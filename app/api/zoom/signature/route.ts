import { NextResponse } from 'next/server';
import crypto from 'crypto';

function generateSignature(sdkKey: string, sdkSecret: string, meetingNumber: string, role: string) {
  const iat = Math.round(new Date().getTime() / 1000) - 30; // 30 seconds buffer
  const exp = iat + 60 * 60 * 2; // 2 hours

  const oHeader = { alg: 'HS256', typ: 'JWT' };
  const oPayload = {
    sdkKey: sdkKey,
    appKey: sdkKey,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  
  // Base64Url encode
  const encodeBase64Url = (str: string) => {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const encodedHeader = encodeBase64Url(sHeader);
  const encodedPayload = encodeBase64Url(sPayload);

  const signature = crypto
    .createHmac('sha256', sdkSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(req: Request) {
  try {
    const { meetingNumber, role } = await req.json();

    const sdkKey = process.env.ZOOM_API_KEY;
    const sdkSecret = process.env.ZOOM_API_SECRET;

    if (!sdkKey || !sdkSecret) {
      return NextResponse.json({ error: 'Zoom SDK credentials missing' }, { status: 500 });
    }

    if (!meetingNumber) {
      return NextResponse.json({ error: 'Meeting number is required' }, { status: 400 });
    }

    // Role: 1 for host, 0 for participant
    const roleStr = role?.toString() === '1' ? '1' : '0';

    const signature = generateSignature(sdkKey, sdkSecret, meetingNumber.toString(), roleStr);

    return NextResponse.json({ signature, sdkKey });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
