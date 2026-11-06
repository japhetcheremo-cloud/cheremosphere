import React from 'react';
import Layout from '@/components/Layout';

export default function TermsPage() {
  return (
    <Layout title="Terms and Conditions — CheremoSphere">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">User Agreement</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C] mt-1">Terms and Conditions</h1>
            <p className="text-xs text-[#5B6B82] mt-1">Effective Date: 2026 • CheremoSphere Official Platform</p>
          </div>

          <div className="text-sm text-[#24344D] leading-relaxed space-y-4">
            <h3 className="text-base font-bold text-[#0D2A5C]">1. Acceptance of Terms</h3>
            <p>
              By accessing or using the CheremoSphere website, dedicated Android application, or iOS application, you agree to comply with and be bound by these Terms and Conditions.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">2. Authentic Representation</h3>
            <p>
              All members agree to post authentic job vacancies, genuine skills, accurate product listings, and legitimate service offerings. Misleading, fraudulent, or abusive posts will result in account suspension and moderation review.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">3. Marketplace & Commercial Safety</h3>
            <p>
              CheremoSphere provides direct networking and contact mechanisms (including WhatsApp and direct calling). We advise all transacting parties to verify physical goods in safe commercial locations prior to payment.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">4. Moderation & Enforcement</h3>
            <p>
              Platform administrators and moderators have the authority to remove non-compliant listings, block abusive communication, and protect community trust.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">5. Contact Information</h3>
            <p>
              CheremoSphere is registered and operated under the leadership of Japhet Cheremo, Cheremo Plaza, Nairobi Mombasa Road, Kenya. Official inquiries: <strong>japhetcheremo@gmai.com</strong> or WhatsApp <strong>0719678760</strong>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
