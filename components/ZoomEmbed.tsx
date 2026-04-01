'use client';

import { useEffect, useRef } from 'react';

interface ZoomEmbedProps {
  meetingNumber: string;
  userName: string;
  signature: string;
  sdkKey: string;
  password?: string;
  userEmail?: string;
}

export default function ZoomEmbed({
  meetingNumber,
  userName,
  signature,
  sdkKey,
  password,
  userEmail,
}: ZoomEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zoomClient: any;

    const initZoom = async () => {
      try {
        const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
        
        zoomClient = ZoomMtgEmbedded.createClient();
        
        const zoomMeetingElement = containerRef.current;
        if (!zoomMeetingElement) return;

        zoomClient.init({
          zoomAppRoot: zoomMeetingElement,
          language: 'en-US',
          customize: {
            meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
            toolbar: {
              buttons: [
                {
                  text: 'Custom Button',
                  className: 'CustomButton',
                  onClick: () => {
                    console.log('custom button');
                  },
                },
              ],
            },
          },
        });

        await zoomClient.join({
          sdkKey: sdkKey,
          signature: signature,
          meetingNumber: meetingNumber,
          password: password || '',
          userName: userName,
          userEmail: userEmail || '',
        });
      } catch (err) {
        console.error('Zoom Embed Initialization failed', err);
      }
    };

    initZoom();

    return () => {
      // Zoom Embedded Component does not have a formal destroy method,
      // but we can try to leave the meeting on unmount if possible.
      // E.g., zoomClient.leaveMeeting() if documented, or just rely on iframe drop.
    };
  }, [meetingNumber, userName, signature, sdkKey, password, userEmail]);

  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <div 
        ref={containerRef} 
        id="zoom-embed-root"
        className="w-full h-full absolute inset-0 [&>div]:h-full [&>div]:w-full" 
      />
    </div>
  );
}
