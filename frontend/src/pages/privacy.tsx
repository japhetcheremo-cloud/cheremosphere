import React from 'react';
import Layout from '@/components/Layout';

export default function PrivacyPage() {
  return (
    <Layout title="Privacy Policy — CheremoSphere">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 sm:p-12 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Data Protection & Privacy</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C] mt-1">CheremoSphere Privacy Policy</h1>
            <p className="text-xs text-[#5B6B82] mt-1">Official Policy under CheremoSphere Leadership (Owner: Japhet Cheremo)</p>
          </div>

          <div className="text-sm text-[#24344D] leading-relaxed space-y-4">
            <h3 className="text-base font-bold text-[#0D2A5C]">1. Overview & Commitment</h3>
            <p>
              At CheremoSphere (Cheremo Plaza, Nairobi Mombasa Road, Kenya), we respect and protect the privacy of every job seeker, employer, freelancer, business owner, seller, and customer utilizing our digital platform and mobile applications.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">2. Information We Collect</h3>
            <p>
              We collect information provided directly by users during registration, profile updates, and listing creation. This includes full name, contact phone numbers (e.g. WhatsApp), email address (japhetcheremo@gmai.com for administrative notifications), qualifications, CV documents, and product/service descriptions.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">3. How Information is Used</h3>
            <p>
              Your information enables employers to review CVs for posted vacancies, buyers to connect with product sellers, and clients to hire professional freelancers. We never sell your personal data to unauthorized third parties.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">4. Document Security & Private CVs</h3>
            <p>
              Uploaded CVs and candidate credentials are accessible only to authorized employers and recruiters for jobs to which the applicant has explicitly applied, or where the job seeker has publicly broadcast their availability.
            </p>

            <h3 className="text-base font-bold text-[#0D2A5C]">5. Contact Our Data Protection Officer</h3>
            <p>
              For privacy inquiries or account deactivation, contact our Nairobi office at Cheremo Plaza, or email <strong>japhetcheremo@gmai.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
