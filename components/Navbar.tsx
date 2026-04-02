'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ companyName: string; email: string } | null>(null);
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo_with_text.jpg" alt="Candexa AI Logo" width={120} height={120} className="rounded-xl object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              href="/webinar"
              className={`text-sm font-medium transition-colors ${
                isActive('/webinar') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Webinar
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                isActive('/blog') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/candidate-feedback"
              className={`text-sm font-medium transition-colors ${
                isActive('/candidate-feedback') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feedback
            </Link>
            <Link
              href="/faq"
              className={`text-sm font-medium transition-colors ${
                isActive('/faq') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FAQ
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/assessment"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/assessment') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Assessment
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">Hi, {currentUser?.companyName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/login') ? 'text-[#ff7a18]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#ff7a18] hover:bg-[#e66a10] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive('/') ? 'text-[#ff7a18]' : 'text-slate-600'
                }`}
              >
                Home
              </Link>
              <Link
                href="/webinar"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive('/webinar') ? 'text-[#ff7a18]' : 'text-slate-600'
                }`}
              >
                Webinar
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive('/blog') ? 'text-[#ff7a18]' : 'text-slate-600'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/candidate-feedback"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive('/candidate-feedback') ? 'text-[#ff7a18]' : 'text-slate-600'
                }`}
              >
                Feedback
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  isActive('/faq') ? 'text-[#ff7a18]' : 'text-slate-600'
                }`}
              >
                FAQ
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      isActive('/dashboard') ? 'text-[#ff7a18]' : 'text-slate-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/assessment"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      isActive('/assessment') ? 'text-[#ff7a18]' : 'text-slate-600'
                    }`}
                  >
                    Assessment
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-base font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      isActive('/login') ? 'text-[#ff7a18]' : 'text-slate-600'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-medium text-[#ff7a18]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
