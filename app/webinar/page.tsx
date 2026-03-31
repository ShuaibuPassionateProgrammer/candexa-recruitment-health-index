'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import Image from 'next/image';

// Use basic search query as fallback if no channel ID is set
const API_KEY = 'AIzaSyCMeBLtf4A1qLtgPbg8dFsNsnZA2unanWI';
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '';

export default function WebinarPage() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loadCount = useRef(0);

  useEffect(() => {
    async function fetchLatestStream() {
      if (!CHANNEL_ID) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}&order=date`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId);
          setIsLive(true);
          setIsLoading(false);
        } else {
          // Check for upcoming
          const upcomingResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=upcoming&type=video&key=${API_KEY}&order=date`
          );
          const upcomingData = await upcomingResponse.json();
          if (upcomingData.items && upcomingData.items.length > 0) {
            setVideoId(upcomingData.items[0].id.videoId);
            setIsLive(false);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching stream:', err);
        setIsLoading(false);
      }
    }

    fetchLatestStream();
  }, []);

  const handleIframeLoad = () => {
    loadCount.current += 1;
    // Google Form iframe loads once initially, then again after submission
    if (loadCount.current > 1) {
      setIsSubmitted(true);
      // Scroll to the success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Join Our Live Webinar
          </h1>
          <p className="text-xl text-slate-600 mb-6 font-medium">
            Register below to secure your spot and learn with us live
          </p>
          <div className="max-w-2xl mx-auto p-6 bg-orange-50 rounded-2xl border border-orange-100 text-slate-700 leading-relaxed shadow-sm">
            <p>
              In this exclusive session, discover how AI is reshaping the recruitment landscape, 
              reducing hiring bias, and accelerating team growth with data-driven insights.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {/* YouTube Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isLoading ? 'Checking Stream...' : isLive ? 'Watch Live Now' : 'Upcoming Event'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {isLoading ? (
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                ) : videoId ? (
                  <iframe
                    className="w-full aspect-video"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${isLive ? 1 : 0}`}
                    title="YouTube live stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="aspect-video bg-slate-900 flex items-center justify-center p-8 text-center">
                    <div className="text-white space-y-4">
                      <p className="text-xl font-medium text-white/90">No live stream detected</p>
                      <p className="text-slate-400 text-sm">Please check back later or register below to get notified.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Chat */}
              {videoId && isLive && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col min-h-[400px] lg:min-h-full">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Live Chat</span>
                  </div>
                  <iframe
                    src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
                    className="flex-grow w-full border-none"
                    title="YouTube live chat"
                  ></iframe>
                </div>
              )}
            </div>
          </section>

          {/* Form Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-[#ff7a18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isSubmitted ? 'Registration Complete' : 'Register Now'}
              </h2>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-2 sm:p-8 min-h-[400px] flex flex-col justify-center transition-all duration-500">
              {isSubmitted ? (
                <div className="text-center py-12 px-6 animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-500/10">
                    <svg className="w-12 h-12 text-green-600 animate-bounce-short" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Wait! You&apos;re All Set! 🎉
                  </h3>
                  <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
                    Thank you for registering for our exclusive webinar. We&apos;ve reserved 
                    your spot and we can&apos;t wait to see you there!
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                      <p className="text-sm font-bold text-slate-800 mb-1 tracking-tight uppercase">Check Your Inbox</p>
                      <p className="text-sm text-slate-500">We&apos;ve sent a confirmation email with all the details.</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 italic">
                      <p className="text-sm font-bold text-orange-800 mb-1 tracking-tight uppercase">Event Support</p>
                      <p className="text-sm text-orange-600">Reach out to our team if you have any questions.</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      loadCount.current = 0;
                      setIsSubmitted(false);
                    }}
                    className="mt-12 text-slate-400 hover:text-[#ff7a18] text-sm font-medium transition-colors"
                  >
                    Mistake? Register another attendee
                  </button>
                </div>
              ) : (
                <div className="relative w-full min-h-[1200px] rounded-2xl overflow-hidden">
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdO96NAjU2ElRg715maux9shKKtdfpUActStXxAOGtvV_T1sg/viewform?embedded=true"
                    className="absolute inset-0 w-full h-full border-none"
                    title="Webinar Registration Form"
                    onLoad={handleIframeLoad}
                  >
                    Loading…
                  </iframe>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 px-8">
              <Image src="/logo_with_text.jpg" alt="Candexa AI Logo" width={120} height={120} className="rounded-xl object-contain" />
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} Candexa AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s infinite ease-in-out;
        }
      `}</style>

      <Chatbot />
    </div>
  );
}
