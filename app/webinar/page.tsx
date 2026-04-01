'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ZoomEmbed = dynamic(() => import('@/components/ZoomEmbed'), { ssr: false });

export default function WebinarPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loadCount = useRef(0);

  // Zoom States
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Meeting details
  const [meetingDetails, setMeetingDetails] = useState<{ id: string; password?: string } | null>(null);
  
  // Forms
  const [createForm, setCreateForm] = useState({ title: 'Live Webinar Session', date: '', duration: 60 });
  const [joinForm, setJoinForm] = useState({ meetingId: '', password: '', name: '' });
  
  // Credentials from backend
  const [signature, setSignature] = useState('');
  const [sdkKey, setSdkKey] = useState('');

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/zoom/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (data.meetingId) {
        setMeetingDetails({ id: data.meetingId, password: data.password });
        setJoinForm(prev => ({ ...prev, meetingId: data.meetingId, password: data.password || '' }));
      } else if (data.error) {
        alert(`Creation failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while creating meeting');
    }
    setIsLoading(false);
  };

  const generateSignatureAndJoin = async (roleNum: 0 | 1, meetingId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/zoom/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber: meetingId, role: roleNum }),
      });
      const data = await res.json();
      if (data.signature && data.sdkKey) {
        setSignature(data.signature);
        setSdkKey(data.sdkKey);
        setIsZooming(true);
      } else {
        alert('Failed to generate secure signature to join webinar.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while joining meeting');
    }
    setIsLoading(false);
  };

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
          {/* Zoom Webinar Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-[#ff7a18]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm11 3.5l4-2.5v10l-4-2.5v-5z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Live Webinar Session
                </h2>
              </div>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setIsHost(false)} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${!isHost ? 'bg-white shadow text-[#ff7a18]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Participant
                </button>
                <button 
                  onClick={() => setIsHost(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${isHost ? 'bg-white shadow text-[#ff7a18]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Host
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[500px] flex">
              {isZooming && signature && sdkKey ? (
                <div className="w-full flex">
                  <ZoomEmbed 
                    meetingNumber={isHost ? (meetingDetails?.id || '') : joinForm.meetingId}
                    userName={isHost ? 'Host' : (joinForm.name || 'Participant')}
                    signature={signature}
                    sdkKey={sdkKey}
                    password={isHost ? (meetingDetails?.password || '') : joinForm.password}
                  />
                </div>
              ) : (
                <div className="w-full p-8 flex flex-col items-center justify-center bg-slate-50">
                  {isHost ? (
                    <div className="w-full max-w-md space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900">Host Dashboard</h3>
                        <p className="text-slate-500 text-sm mt-1">Create and start a new webinar</p>
                      </div>
                      
                      {!meetingDetails ? (
                        <form onSubmit={handleCreateMeeting} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Webinar Title</label>
                            <input type="text" value={createForm.title} onChange={e => setCreateForm({...createForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                              <input type="datetime-local" value={createForm.date} onChange={e => setCreateForm({...createForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                              <input type="number" value={createForm.duration} onChange={e => setCreateForm({...createForm, duration: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                          </div>
                          <button type="submit" disabled={isLoading} className="w-full bg-[#ff7a18] hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
                            {isLoading ? 'Creating...' : 'Create Webinar'}
                          </button>
                        </form>
                      ) : (
                        <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm space-y-4">
                          <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm">
                            <p className="font-semibold mb-2">Webinar Created Successfully!</p>
                            <p><strong>Meeting ID:</strong> {meetingDetails.id}</p>
                            <p><strong>Passcode:</strong> {meetingDetails.password || 'None'}</p>
                          </div>
                          <button 
                            onClick={() => generateSignatureAndJoin(1, meetingDetails.id)} 
                            disabled={isLoading}
                            className="w-full bg-[#ff7a18] hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Starting...' : 'Start Webinar'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-md space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900">Join Webinar</h3>
                        <p className="text-slate-500 text-sm mt-1">Enter meeting details to join</p>
                      </div>
                      
                      <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                          <input type="text" placeholder="John Doe" value={joinForm.name} onChange={e => setJoinForm({...joinForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Meeting ID</label>
                          <input type="text" placeholder="123 456 7890" value={joinForm.meetingId} onChange={e => setJoinForm({...joinForm, meetingId: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Passcode</label>
                          <input type="text" placeholder="Optional" value={joinForm.password} onChange={e => setJoinForm({...joinForm, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <button 
                          onClick={() => {
                            if (!joinForm.meetingId) return alert('Meeting ID required');
                            generateSignatureAndJoin(0, joinForm.meetingId);
                          }}
                          disabled={isLoading || !joinForm.meetingId}
                          className="w-full bg-[#ff7a18] hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Joining...' : 'Join Webinar'}
                        </button>
                      </div>
                    </div>
                  )}
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
        
        /* Needed for Zoom embed full height constraint if it overflows */
        #zoom-embed-root {
          z-index: 10;
        }
      `}</style>

      <Chatbot />
    </div>
  );
}
