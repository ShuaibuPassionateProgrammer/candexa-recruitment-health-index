"use client";

import React, { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  data: FAQItem[];
}

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {data.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={`border rounded-2xl bg-white transition-all overflow-hidden ${
              isOpen ? 'border-orange-200 shadow-lg shadow-orange-100/50' : 'border-slate-200 hover:border-orange-100 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <h3 className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</h3>
              <div 
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'bg-[#ff7a18] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-100/0">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
