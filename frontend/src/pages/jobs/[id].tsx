import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Briefcase, MapPin, DollarSign, Calendar, Clock,
  Bookmark, CheckCircle, Share2, ArrowLeft, Send
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, JobVacancy } from '@/lib/api';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState<JobVacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Apply form state
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function loadJob() {
      try {
        const data = await apiFetch<JobVacancy>(`/jobs/vacancies/${id}/`);
        setJob(data);
        setIsSaved(data.is_saved);
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    try {
      const res = await apiFetch<{ is_saved: boolean }>(
        `/jobs/vacancies/${id}/save/`,
        { method: 'POST' }
      );

      setIsSaved(res.is_saved);
    } catch (err) {
      console.error('Error toggling saved job:', err);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!getToken()) {
      router.push('/login');
      return;
    }

    setApplying(true);
    setApplyError('');

    try {
      await apiFetch('/jobs/applications/apply/', {
        method: 'POST',
        body: JSON.stringify({
          vacancy: job?.id,
          cover_letter: coverLetter,
        })
      });

      setApplySuccess(true);

      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
      }, 2000);

    } catch (err: any) {
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center text-[#5B6B82]">
          Loading job details...
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="py-24 text-center text-[#DC2626]">
          Job vacancy not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${job.title} at ${job.company_name} — CheremoSphere`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <NextLink
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vacancies</span>
        </NextLink>

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#FF7A00] bg-[#FFF1E5] px-3 py-1 rounded-full uppercase">
                {job.category_name}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C] mt-2">
                {job.title}
              </h1>

              <p className="text-sm font-semibold text-[#5B6B82]">
                {job.company_name} •{' '}
                <span className="text-[#0D2A5C]">{job.location}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToggle}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-orange-50 border-[#FF7A00] text-[#FF7A00]'
                    : 'border-gray-200 text-[#5B6B82] hover:bg-gray-50'
                }`}
                title={isSaved ? 'Saved' : 'Save Job'}
              >
                <Bookmark
                  className="w-5 h-5"
                  fill={isSaved ? '#FF7A00' : 'none'}
                />
              </button>

              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary px-7 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer"
              >
                Apply for this Position
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100 text-xs">

            <div>
              <p className="text-[#5B6B82]">Employment Type</p>
              <p className="font-bold text-[#0D2A5C] capitalize mt-0.5">
                {typeof job.employment_type === 'string' && job.employment_type.trim()
                  ? job.employment_type.replace(/_/g, ' ')
                  : 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-[#5B6B82]">Salary Range</p>
              <p className="font-bold text-[#16A34A] mt-0.5">
                {job.salary_max
                  ? `KES ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}`
                  : 'Competitive / Negotiable'}
              </p>
            </div>

            <div>
              <p className="text-[#5B6B82]">Experience Level</p>
              <p className="font-bold text-[#0D2A5C] mt-0.5">
                {job.experience_level}
              </p>
            </div>

            <div>
              <p className="text-[#5B6B82]">Application Deadline</p>
              <p className="font-bold text-[#0D2A5C] mt-0.5">
                {job.deadline || 'Open until filled'}
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#0D2A5C] mb-4">
                Job Description & Responsibilities
              </h3>

              <div className="text-sm text-[#24344D] leading-relaxed whitespace-pre-line space-y-4">
                {job.description}
              </div>
            </div>

            {/* Qualifications & Requirements */}
            <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#0D2A5C] mb-4">
                Required Qualifications & Skills
              </h3>

              <div className="text-sm text-[#24344D] leading-relaxed whitespace-pre-line">
                {job.qualifications}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 space-y-4">

              <h4 className="text-sm font-bold text-[#0D2A5C] uppercase tracking-wider">
                About the Employer
              </h4>

              <p className="text-sm font-bold text-[#0D2A5C]">
                {job.company_name}
              </p>

              <p className="text-xs text-[#5B6B82]">
                Registered employer on CheremoSphere. Applications are delivered securely to the employer recruitment portal.
              </p>

              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full btn-secondary py-3 text-xs font-bold rounded-xl"
              >
                Submit Application
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blight-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">

            <h3 className="text-xl font-bold text-[#0D2A5C]">
              Apply for {job.title}
            </h3>

            <p className="text-xs text-[#5B6B82] mt-1">
              {job.company_name} • {job.location}
            </p>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto" />

                <h4 className="text-base font-bold text-[#16A34A]">
                  Application Submitted Successfully!
                </h4>

                <p className="text-xs text-[#5B6B82]">
                  The employer has received your application and will review your profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">

                {applyError && (
                  <div className="p-3 rounded-lg bg-red-50 text-[#DC2626] text-xs font-semibold">
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">
                    Cover Letter / Note to Employer
                  </label>

                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe your qualifications, enthusiasm, and relevant experience..."
                    className="w-full p-3 text-sm rounded-xl bg-[#F4F7FB] border border-gray-200 outline-none focus:border-[#0D2A5C]"
                    required
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#F4F7FB] border border-gray-200 text-xs text-[#5B6B82]">
                  <p className="font-semibold text-[#0D2A5C]">
                    Attached Credentials:
                  </p>

                  <p className="mt-1">
                    Your registered CheremoSphere profile credentials and uploaded CV will be securely submitted to this employer.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">

                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#5B6B82] hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary text-xs px-6 py-2.5 font-bold rounded-xl"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>

                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </Layout>
  );
}