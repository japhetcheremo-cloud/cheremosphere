import React from 'react';
import NextLink from 'next/link';
import { Sparkles, ShieldCheck, Target, Users, ArrowRight, Building2, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <Layout title="About CheremoSphere — Vision & Leadership">
      {/* Header */}
      <div className="bg-[#0D2A5C] text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Our Story & Mission</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Connecting Opportunities. Empowering Africa.
          </h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            CheremoSphere was founded by <strong>Japhet Cheremo</strong> to unify employment, recruitment, professional freelancing, trade marketplace, and networking into one modern digital ecosystem.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E6EBF2] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D2A5C] flex items-center justify-center font-bold">
              <Target className="w-6 h-6 text-[#0D2A5C]" />
            </div>
            <h3 className="text-lg font-bold text-[#0D2A5C]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
              To eliminate friction in hiring and commerce by providing every job seeker, employer, freelancer, and seller with a direct, verified pathway to grow.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E6EBF2] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h3 className="text-lg font-bold text-[#0D2A5C]">The Orbital Vision</h3>
            <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
              The 'C' and orbit in our logo represent continuous motion of people, skills, and commerce — moving together within one interconnected Kenyan and African sphere.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E6EBF2] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#16A34A] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
            </div>
            <h3 className="text-lg font-bold text-[#0D2A5C]">Trust & Integrity</h3>
            <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
              Every job listing, candidate request, and marketplace listing is tied to verified profiles, direct messaging, and physical office accountability at Cheremo Plaza.
            </p>
          </div>
        </div>

        {/* Founder & Headquarters Note */}
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 text-center md:text-left space-y-3">
            <div className="w-24 h-24 rounded-3xl bg-[#0D2A5C] text-white flex items-center justify-center text-3xl font-black mx-auto md:mx-0 shadow-lg">
              JC
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#0D2A5C]">Japhet Cheremo</h3>
              <p className="text-xs font-semibold text-[#FF7A00]">Founder & Platform Owner</p>
              <p className="text-xs text-[#5B6B82] flex items-center justify-center md:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#0D2A5C]" />
                <span>Cheremo Plaza, Nairobi Mombasa Road, Kenya</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-sm text-[#24344D] leading-relaxed border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <p>
              "CheremoSphere is born out of the realization that talent and opportunity across Africa are plentiful, yet fragmented across disconnected systems. Someone searching for an accounting job in Nairobi or a commercial driver role in Western Kenya should not have to juggle ten separate channels."
            </p>
            <p>
              "With CheremoSphere, a single account allows you to find employment, broadcast your availability via <em>Ask for a Job</em>, offer freelance services, market products, and network with fellow professionals. Your skills. Your opportunities. All in one place."
            </p>
          </div>
        </div>

        {/* Platform Slogan Banner */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C]">
            Jobs. Connect. Market. Grow.
          </h2>
          <div className="flex justify-center gap-4 pt-2">
            <NextLink href="/register" className="btn-primary px-8 py-3.5 text-sm font-bold rounded-xl shadow-md">
              Join CheremoSphere Free
            </NextLink>
            <NextLink href="/contact" className="btn-outline px-6 py-3.5 text-sm font-bold rounded-xl">
              Contact Leadership
            </NextLink>
          </div>
        </div>

      </div>
    </Layout>
  );
}
