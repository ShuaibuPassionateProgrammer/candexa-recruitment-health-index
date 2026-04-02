export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    title: "General Questions",
    icon: "info",
    items: [
      {
        question: "What is Candexa AI?",
        answer: "Candexa AI is an AI-powered hiring platform that works directly inside your email inbox. It helps you source, screen, schedule, and manage candidates — all without needing a complicated dashboard or expensive ATS integration."
      },
      {
        question: "How is Candexa AI different from a traditional ATS?",
        answer: "Traditional ATS platforms collect resumes and track applications. Candexa AI goes further — it actually reads and understands candidate resumes, detects hidden bias in your screening process, audits your candidate experience, and helps you respond faster. All from your inbox. No extra tools needed."
      },
      {
        question: "Who is Candexa AI built for?",
        answer: "Candexa is built for recruiters, hiring managers, HR teams, and business owners who are tired of juggling multiple platforms just to fill one role. Whether you're hiring for a startup or a large organization, if you use email for recruitment, Candexa makes it smarter."
      },
      {
        question: "Is Candexa AI hard to set up?",
        answer: "Not at all. Candexa works right inside your existing email. There's no new dashboard to learn, no complicated integration process, and no lengthy onboarding. You can get started quickly and see results fast."
      },
      {
        question: "Do I need to change my current email provider?",
        answer: "No. Candexa works with your existing email. No switching. No migration. It fits into the tools you already use every day."
      }
    ]
  },
  {
    title: "Pricing & Plans",
    icon: "pricing",
    items: [
      {
        question: "How much does Candexa AI cost?",
        answer: "We offer flexible plans designed to fit teams of all sizes. You can reach out to our team for a custom quote tailored to your needs."
      },
      {
        question: "Is there a free trial?",
        answer: "Yes. We offer a free Recruitment Health Index assessment so you can see exactly where your current hiring process stands before committing to anything. It takes less than two minutes."
      },
      {
        question: "Can I cancel anytime?",
        answer: "Absolutely. We believe in earning your business every month. No long-term contracts. No hidden fees."
      }
    ]
  },
  {
    title: "Features & Functionality",
    icon: "features",
    items: [
      {
        question: "What does the Auto-Parse feature do?",
        answer: "Our Auto-Parse engine reads resumes attached to emails, extracts key information — skills, experience, education — and ranks candidates based on fit for your role. It works with 99% accuracy across different formats and regions."
      },
      {
        question: "How does Candexa detect bias in hiring?",
        answer: "Candexa audits your screening patterns and identifies where unconscious bias may be entering your process — whether through keyword filtering, inconsistent evaluation criteria, or delayed communication with certain candidate groups. You get clear, actionable data to fix it."
      },
      {
        question: "What is the Recruitment Health Index?",
        answer: "The Recruitment Health Index is a real-time score that shows how your hiring process compares to industry benchmarks. It measures things like speed, fairness, candidate experience, and screening accuracy. Think of it as a health check-up for your recruitment."
      },
      {
        question: "Can Candexa help with scheduling interviews?",
        answer: "Yes. Candexa lets you coordinate interviews, send follow-ups, and manage candidate communication — all without leaving your inbox. No third-party scheduling tools required."
      },
      {
        question: "Does Candexa work for international hiring?",
        answer: "Absolutely. Candexa's Auto-Parse engine handles diverse resume formats from across the globe with 99% accuracy. Whether your candidates are in the US, Europe, Africa, or Asia, their resumes get read properly."
      },
      {
        question: "How does Candexa track candidate status?",
        answer: "Candexa creates an organized recruitment flow inside your email so you can see every candidate's status at a glance — who's been reviewed, who's shortlisted, who's scheduled for an interview — without logging into a separate platform."
      }
    ]
  },
  {
    title: "Candidate Experience",
    icon: "candidate",
    items: [
      {
        question: "How does Candexa improve the candidate experience?",
        answer: "Candexa audits every touchpoint in your candidate's journey — from the moment they apply to the moment they get feedback. It identifies where candidates are dropping off, where responses are delayed, and where your process might be making people feel ignored. Then it helps you fix it."
      },
      {
        question: "Will candidates know that AI is being used?",
        answer: "Candexa works behind the scenes to help your team make better, faster decisions. The candidate experience remains personal and human. Candexa just ensures no qualified person gets overlooked."
      }
    ]
  },
  {
    title: "Security & Privacy",
    icon: "security",
    items: [
      {
        question: "Is candidate data safe with Candexa?",
        answer: "Yes. Data security and privacy are top priorities. Candexa follows strict data protection standards to ensure all candidate information is handled securely and responsibly."
      },
      {
        question: "Who has access to candidate data?",
        answer: "Only authorized users on your team. Candidate data is never shared with third parties and is used solely to improve your hiring process."
      }
    ]
  },
  {
    title: "Troubleshooting & Support",
    icon: "support",
    items: [
      {
        question: "The Auto-Parse didn't read a resume correctly. What do I do?",
        answer: "This rarely happens, but if it does, please report it to our support team with the specific resume attached. Our engineers will investigate and resolve it quickly. We're constantly improving accuracy."
      },
      {
        question: "I'm not receiving my Recruitment Health Index results. What should I do?",
        answer: "First, check your spam or junk folder. If it's not there, reach out to our support team and we'll make sure your results are delivered right away."
      },
      {
        question: "Who do I contact for help?",
        answer: "You can reach our support team at support@candexa.com. We typically respond within 24 to 48 hours and are always happy to help."
      }
    ]
  }
];

// Flat array for backward compatibility (landing page preview & chatbot)
export const faqData: FAQItem[] = faqCategories.flatMap(cat => cat.items);
