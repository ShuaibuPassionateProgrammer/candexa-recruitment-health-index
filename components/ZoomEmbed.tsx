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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      switch (event.data.type) {
        case 'zoom-ready':
          // Iframe is ready — send configuration
          iframeRef.current?.contentWindow?.postMessage({
            type: 'zoom-init',
            config: {
              sdkKey,
              signature,
              meetingNumber,
              password: password || '',
              userName,
              userEmail: userEmail || '',
            },
          }, '*');
          break;
        case 'zoom-join-success':
          console.log('Successfully joined Zoom meeting');
          break;
        case 'zoom-error':
          console.error('Zoom error from iframe:', event.data.error);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [meetingNumber, userName, signature, sdkKey, password, userEmail]);

  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <iframe
        ref={iframeRef}
        src="/zoom-embed.html"
        className="w-full h-full absolute inset-0 border-0"
        allow="camera; microphone; display-capture; autoplay; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}
