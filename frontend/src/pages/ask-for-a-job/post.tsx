import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { UserCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken } from '@/lib/api';

export default function PostJobRequestPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    job_sought: '',
    category: 'General',
    personal_introduction: '',
    skills: '',
    experience_summary: '',
    qualifications: '',
    preferred_location: 'Nairobi, Kenya',
    employment_type: 'full_time',
    availability: 'immediately',
    expected_salary: '',
    portfolio_url: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getToken()) {
      router.push('/login?redirect=/ask-for-a-job/post');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      await apiFetch('/job-seeking/requests/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/ask-for-a-job');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to post job request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Ask for a Job — Broadcast Your Availability — CheremoSphere">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <NextLink href="/ask-for-a-job" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Request Board</span>
        </NextLink>

        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-10 shadow-xs">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Reverse Hiring</span>
            <h1 className="text-2xl font-extrabold text-[#0D2A5C] mt-1">Broadcast What Job You Are Seeking</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              Examples: "I am looking for an accounting job in Nairobi", "Trained driver seeking employment in Bungoma", or "Graphic designer available for freelance gigs".
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto" />
              <h3 className="text-xl font-bold text-[#16A34A]">Job Request Broadcasted!</h3>
              <p className="text-xs text-[#5B6B82]">Employers and clients can now discover your availability and message you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">What Job or Role Are You Seeking? *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seeking Accounting / Bookkeeping Role in Nairobi"
                  value={formData.job_sought}
                  onChange={(e) => setFormData({ ...formData, job_sought: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accounting, Logistics, IT"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Preferred Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi, Bungoma, Remote"
                    value={formData.preferred_location}
                    onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Employment Type *</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance / Gig</option>
                    <option value="internship">Internship</option>
                    <option value="any">Any / Open</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Availability *</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  >
                    <option value="immediately">Immediately</option>
                    <option value="two_weeks">Within 2 Weeks</option>
                    <option value="one_month">Within 1 Month</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Expected Pay / Salary (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. KES 50,000 / month or Negotiable"
                    value={formData.expected_salary}
                    onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Personal Introduction *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Introduce yourself, your dedication, work ethic, and why an employer should hire you..."
                  value={formData.personal_introduction}
                  onChange={(e) => setFormData({ ...formData, personal_introduction: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Key Skills *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Financial Reporting, Tax, QuickBooks"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Qualifications & Certificates *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Com Accounting, CPA Part 2, Driving BCE"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <NextLink href="/ask-for-a-job" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#5B6B82] hover:bg-gray-50">
                  Cancel
                </NextLink>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {submitting ? 'Broadcasting...' : 'Broadcast Job Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
