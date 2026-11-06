import React from 'react';
import NextLink from 'next/link';
import { HelpCircle, Phone, Mail, MessageCircle, FileQuestion, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

export default function HelpCentrePage() {
  const faqs = [
    {
      q: 'How does "Ask for a Job" work?',
      a: 'Unlike traditional job boards where you only search for postings, "Ask for a Job" allows you to broadcast your availability, skills, preferred location, and personal introduction. Employers and recruiters browsing the reverse directory can discover your profile and contact you directly.'
    },
    {
      q: 'Can I post a job as an employer or company?',
      a: 'Yes. Employers can click "Create" or go to "Post a Job", fill in qualifications, salary range, and deadlines. Applications are delivered securely to your Employer Dashboard.'
    },
    {
      q: 'How do buyers and sellers communicate in the Marketplace?',
      a: 'CheremoSphere provides two instant communication channels: 1) Direct WhatsApp and phone call buttons connected to the seller\'s phone, and 2) Encrypted in-app private messaging.'
    },
    {
      q: 'Where is the official physical office located?',
      a: 'Our physical office is located at Cheremo Plaza, Nairobi Mombasa Road, Kenya. Official inquiries can also be directed to Japhet Cheremo via WhatsApp at 0719678760.'
    },
    {
      q: 'Can one account perform multiple roles?',
      a: 'Yes! A single CheremoSphere account can be used as a job seeker, employer, freelancer, seller, and network member without needing separate logins.'
    }
  ];

  return (
    <Layout title="Help Centre & FAQs — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Support & Assistance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">CheremoSphere Help Centre</h1>
          <p className="text-blue-200 text-sm">
            Everything you need to know about navigating jobs, services, trading, and account safety.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs text-center space-y-2">
            <MessageCircle className="w-8 h-8 text-[#16A34A] mx-auto" />
            <h4 className="text-sm font-bold text-[#0D2A5C]">WhatsApp Support</h4>
            <p className="text-xs text-[#5B6B82]">Instant chat with our Nairobi team.</p>
            <a href="https://wa.me/254719678760" className="inline-block text-xs font-bold text-[#16A34A] hover:underline pt-1">
              0719678760
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs text-center space-y-2">
            <Phone className="w-8 h-8 text-[#FF7A00] mx-auto" />
            <h4 className="text-sm font-bold text-[#0D2A5C]">Direct Telephone</h4>
            <p className="text-xs text-[#5B6B82]">Call our operations center.</p>
            <a href="tel:+254719678760" className="inline-block text-xs font-bold text-[#0D2A5C] hover:underline pt-1">
              +254 719 678 760
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs text-center space-y-2">
            <Mail className="w-8 h-8 text-[#0D2A5C] mx-auto" />
            <h4 className="text-sm font-bold text-[#0D2A5C]">Official Email</h4>
            <p className="text-xs text-[#5B6B82]">Send documentation & inquiries.</p>
            <a href="mailto:japhetcheremo@gmai.com" className="inline-block text-xs font-bold text-[#0D2A5C] hover:underline pt-1 break-all">
              japhetcheremo@gmai.com
            </a>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#0D2A5C]">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#F4F7FB] border border-[#E6EBF2] space-y-1.5">
                <h4 className="text-sm font-bold text-[#0D2A5C] flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-[#FF7A00] shrink-0" />
                  <span>{f.q}</span>
                </h4>
                <p className="text-xs text-[#24344D] leading-relaxed pl-6">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
