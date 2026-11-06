import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Briefcase, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken } from '@/lib/api';

export default function PostJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: 'Nairobi, Kenya',
    employment_type: 'full_time',
    experience_level: '2-4 Years',
    qualifications: '',
    description: '',
    salary_min: '',
    salary_max: '',
    is_salary_negotiable: true,
    currency: 'KES',
    deadline: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getToken()) {
      router.push('/login?redirect=/jobs/post');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await apiFetch<any>('/jobs/vacancies/', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
          deadline: formData.deadline || null,
        })
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/jobs/${res.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to post vacancy.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Post a Job Vacancy — CheremoSphere">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <NextLink href="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </NextLink>

        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-10 shadow-xs">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Employer Portal</span>
            <h1 className="text-2xl font-extrabold text-[#0D2A5C] mt-1">Post a New Job Vacancy</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              Publish your vacancy to thousands of qualified candidates across Kenya and East Africa.
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto" />
              <h3 className="text-xl font-bold text-[#16A34A]">Vacancy Published Successfully!</h3>
              <p className="text-xs text-[#5B6B82]">Redirecting you to the live job listing...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Accountant, Software Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cheremo Enterprises Ltd"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi, Kenya or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Experience Level</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-5 Years"
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Minimum Salary (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Maximum Salary (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 85000"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Job Description & Responsibilities *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Outline key daily responsibilities, deliverables, and role context..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Required Qualifications & Skills *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Degrees, professional certifications, specific software skills..."
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <NextLink href="/jobs" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#5B6B82] hover:bg-gray-50">
                  Cancel
                </NextLink>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Job Vacancy'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
