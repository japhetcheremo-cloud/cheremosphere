import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Search, MapPin, Briefcase, Filter, ArrowRight, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, JobVacancy } from '@/lib/api';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (location) queryParams.append('location', location);
      if (employmentType) queryParams.append('type', employmentType);

      const res = await apiFetch<{ results?: JobVacancy[] } | JobVacancy[]>(`/jobs/vacancies/?${queryParams.toString()}`);
      setJobs(Array.isArray(res) ? res : (res.results || []));
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.search) {
      setSearch(router.query.search as string);
    }
  }, [router.query.search]);

  useEffect(() => {
    loadJobs();
  }, [search, location, employmentType]);

  return (
    <Layout title="Find Jobs — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Job Vacancies & Careers</h1>
            <p className="text-blue-200 text-sm mt-1">
              Browse verified employment opportunities in Nairobi, Mombasa, Kisumu, Eldoret, and across Africa.
            </p>
          </div>
          <NextLink
            href="/jobs/post"
            className="btn-primary text-sm font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post a Vacancy (Employers)</span>
          </NextLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6EBF2] shadow-xs mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, skills, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Location (e.g. Nairobi, Remote)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />
          </div>

          <div>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            >
              <option value="">All Employment Types</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <button
            onClick={() => { setSearch(''); setLocation(''); setEmploymentType(''); }}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#5B6B82] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="py-16 text-center text-[#5B6B82]">Loading verified jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-[#0D2A5C]">No jobs match your filter criteria</h3>
            <p className="text-sm text-[#5B6B82] mt-1">Try broadening your search or post a job vacancy today.</p>
            <NextLink href="/jobs/post" className="btn-primary mt-4 inline-flex">
              Post a Job
            </NextLink>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-[#E6EBF2] hover:border-[#0D2A5C] p-6 rounded-2xl shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#FF7A00] bg-[#FFF1E5] px-2.5 py-0.5 rounded-md">
                      {job.category_name || 'General'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#5B6B82] capitalize">
                      {job.employment_type.replace('_', ' ')}
                    </span>
                    {job.is_featured && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#16A34A]/10 text-[#16A34A]">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors">
                    <NextLink href={`/jobs/${job.id}`}>{job.title}</NextLink>
                  </h3>

                  <p className="text-xs font-semibold text-[#5B6B82]">
                    {job.company_name} • <span className="text-[#0D2A5C]">{job.location}</span>
                  </p>

                  <p className="text-xs text-[#5B6B82] line-clamp-2 max-w-3xl leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <p className="text-sm font-extrabold text-[#16A34A]">
                      {job.salary_max
                        ? `KES ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}`
                        : 'Competitive'}
                    </p>
                    <p className="text-[11px] text-[#5B6B82]">
                      {job.deadline ? `Deadline: ${job.deadline}` : 'Open until filled'}
                    </p>
                  </div>

                  <NextLink
                    href={`/jobs/${job.id}`}
                    className="btn-secondary text-xs px-5 py-2.5 font-bold rounded-xl shadow-xs"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
