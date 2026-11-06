import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, Briefcase, Users, ShoppingBag, Wrench, 
  MapPin, ArrowRight, CheckCircle2, ShieldCheck, 
  ExternalLink, Sparkles, Building2, TrendingUp, PhoneCall, MessageCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, JobVacancy, JobRequest, ProductListing, FreelanceService, PlatformStats } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [services, setServices] = useState<FreelanceService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, jobsRes, reqRes, prodRes, srvRes] = await Promise.allSettled([
          apiFetch<PlatformStats>('/platform/stats/'),
          apiFetch<{ results?: JobVacancy[] } | JobVacancy[]>('/jobs/vacancies/'),
          apiFetch<{ results?: JobRequest[] } | JobRequest[]>('/job-seeking/requests/'),
          apiFetch<{ results?: ProductListing[] } | ProductListing[]>('/marketplace/products/'),
          apiFetch<{ results?: FreelanceService[] } | FreelanceService[]>('/freelance/services/'),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
        if (jobsRes.status === 'fulfilled') {
          const val = jobsRes.value;
          setJobs(Array.isArray(val) ? val.slice(0, 4) : (val.results || []).slice(0, 4));
        }
        if (reqRes.status === 'fulfilled') {
          const val = reqRes.value;
          setJobRequests(Array.isArray(val) ? val.slice(0, 4) : (val.results || []).slice(0, 4));
        }
        if (prodRes.status === 'fulfilled') {
          const val = prodRes.value;
          setProducts(Array.isArray(val) ? val.slice(0, 4) : (val.results || []).slice(0, 4));
        }
        if (srvRes.status === 'fulfilled') {
          const val = srvRes.value;
          setServices(Array.isArray(val) ? val.slice(0, 4) : (val.results || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchCategory === 'jobs') {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'products') {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'services') {
      router.push(`/freelance?search=${encodeURIComponent(searchQuery)}`);
    } else if (searchCategory === 'job_requests') {
      router.push(`/ask-for-a-job?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F4F7FB] to-[#F4F7FB] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E6EBF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E5] border border-[#FF7A00]/30 text-[#FF7A00] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                <span>Jobs. Connect. Market. Grow.</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#0D2A5C] tracking-tight leading-[1.15]">
                Discover Opportunities. Connect with People. <span className="text-[#FF7A00]">Grow Your Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#24344D]/80 leading-relaxed max-w-xl">
                Find your next job, hire talented people, promote your business, discover products and connect with opportunities through one powerful platform.
              </p>

              {/* Universal Search Box */}
              <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 max-w-2xl">
                {/* Search Categories Tabs */}
                <div className="flex items-center gap-1.5 pb-3 overflow-x-auto border-b border-gray-100 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'jobs', label: 'Jobs' },
                    { id: 'job_requests', label: 'Job Requests' },
                    { id: 'products', label: 'Products' },
                    { id: 'services', label: 'Services' },
                    { id: 'businesses', label: 'Businesses' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSearchCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        searchCategory === cat.id 
                          ? 'bg-[#0D2A5C] text-white font-bold' 
                          : 'text-[#5B6B82] hover:bg-gray-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Input Form */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search jobs, skills, products, businesses, or people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white text-sm font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    Search Now
                  </button>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <NextLink 
                  href="/jobs" 
                  className="btn-secondary px-6 py-3 text-sm font-bold rounded-xl shadow-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Find Jobs</span>
                </NextLink>

                <NextLink 
                  href="/marketplace" 
                  className="btn-primary px-6 py-3 text-sm font-bold rounded-xl shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Marketplace</span>
                </NextLink>

                <NextLink 
                  href="/ask-for-a-job" 
                  className="btn-outline px-5 py-3 text-sm font-bold rounded-xl"
                >
                  <span>Ask for a Job</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </NextLink>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-semibold text-[#5B6B82]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Verified Employers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D2A5C]" />
                  <span>Direct WhatsApp Connect</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF7A00]" />
                  <span>Headquartered in Nairobi</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Column: Official Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden border border-[#E6EBF2] bg-white shadow-2xl p-2">
                  <img 
                    src="/hero-placeholder.svg" 
                    alt="CheremoSphere Opportunities Ecosystem" 
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white border border-[#E6EBF2] p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-[260px]">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF1E5] text-[#FF7A00] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0D2A5C]">Direct Trade & Hiring</h5>
                    <p className="text-[11px] text-[#5B6B82]">Kenya & Africa Connected</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. REAL-TIME PLATFORM METRICS */}
      <section className="py-8 bg-white border-b border-[#E6EBF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[#F4F7FB]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C]">
                {stats?.active_jobs ? `${stats.active_jobs}+` : 'Active'}
              </p>
              <p className="text-xs font-semibold text-[#5B6B82] mt-1">Job Vacancies Open</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7FB]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FF7A00]">
                {stats?.job_requests ? `${stats.job_requests}+` : 'Available'}
              </p>
              <p className="text-xs font-semibold text-[#5B6B82] mt-1">Job-Seeker Requests</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7FB]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#16A34A]">
                {stats?.marketplace_products ? `${stats.marketplace_products}+` : 'Listed'}
              </p>
              <p className="text-xs font-semibold text-[#5B6B82] mt-1">Marketplace Products</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7FB]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C]">
                {stats?.total_users ? `${stats.total_users}+` : 'Growing'}
              </p>
              <p className="text-xs font-semibold text-[#5B6B82] mt-1">Verified Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "ASK FOR A JOB" SPOTLIGHT SECTION (Reverse Job-Seeking) */}
      <section className="py-14 bg-gradient-to-r from-[#0D2A5C] to-[#071836] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Reverse Recruitment</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">"Ask for a Job" Board</h2>
              <p className="text-sm text-blue-200 mt-1 max-w-xl">
                Looking for work? Broadcast what you can do. Employers and clients browse candidate availability directly and reach out!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NextLink 
                href="/ask-for-a-job/post" 
                className="bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Post Your Job Request
              </NextLink>
              <NextLink 
                href="/ask-for-a-job" 
                className="text-sm font-semibold text-white/80 hover:text-white underline underline-offset-4"
              >
                Browse All Requests
              </NextLink>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {jobRequests.map(req => (
              <div key={req.id} className="bg-white/10 backdrop-blur-xs border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[#FF7A00] transition-colors">
                <div>
                  <span className="text-[11px] font-bold text-[#FF7A00] bg-white/10 px-2.5 py-1 rounded-md">
                    {req.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-3 line-clamp-2">
                    {req.job_sought}
                  </h3>
                  <p className="text-xs text-blue-100/80 mt-2 line-clamp-3">
                    {req.personal_introduction}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span className="truncate max-w-[120px]">{req.preferred_location}</span>
                    </span>
                    <span className="font-semibold text-white">{req.availability}</span>
                  </div>
                  
                  <NextLink 
                    href={`/ask-for-a-job?id=${req.id}`} 
                    className="block text-center w-full py-2 bg-white/20 hover:bg-[#FF7A00] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    View Details & Contact
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED JOB VACANCIES */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Employment & Careers</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C] mt-1">Latest Job Vacancies</h2>
              <p className="text-sm text-[#5B6B82] mt-0.5">Explore full-time, contract, freelance and remote roles across Kenya.</p>
            </div>
            <NextLink 
              href="/jobs" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D2A5C] hover:text-[#FF7A00] transition-colors"
            >
              <span>View All Vacancies</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white border border-[#E6EBF2] hover:border-[#0D2A5C] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-[#5B6B82]">{job.company_name}</span>
                      <h3 className="text-lg font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors mt-0.5">
                        <NextLink href={`/jobs/${job.id}`}>{job.title}</NextLink>
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#0D2A5C] border border-blue-100 shrink-0 capitalize">
                      {job.employment_type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#5B6B82] mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E6EBF2] flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[#5B6B82]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>{job.location}</span>
                    </p>
                    <p className="font-bold text-[#16A34A]">
                      {job.salary_max ? `KES ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}` : 'Competitive Salary'}
                    </p>
                  </div>

                  <NextLink 
                    href={`/jobs/${job.id}`} 
                    className="btn-secondary text-xs px-4 py-2 font-bold rounded-lg"
                  >
                    Apply Now
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MARKETPLACE HIGHLIGHTS */}
      <section className="py-14 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Buy & Sell Locally</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C] mt-1">Marketplace Highlights</h2>
              <p className="text-sm text-[#5B6B82] mt-0.5">Discover verified electronics, food, agriculture, and business equipment.</p>
            </div>
            <NextLink 
              href="/marketplace" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D2A5C] hover:text-[#FF7A00] transition-colors"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(prod => (
              <div 
                key={prod.id} 
                className="bg-white border border-[#E6EBF2] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="p-4">
                  <span className="text-[11px] font-bold text-[#5B6B82] bg-gray-100 px-2 py-0.5 rounded-md">
                    {prod.category_name}
                  </span>
                  <h3 className="text-sm font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors mt-2 line-clamp-2">
                    <NextLink href={`/marketplace/${prod.id}`}>{prod.title}</NextLink>
                  </h3>
                  <p className="text-xs text-[#5B6B82] mt-1.5 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="p-4 pt-0 mt-auto border-t border-gray-100">
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <p className="text-base font-extrabold text-[#FF7A00]">
                        KES {Number(prod.price).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#5B6B82] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{prod.location}</span>
                      </p>
                    </div>

                    <NextLink 
                      href={`/marketplace/${prod.id}`}
                      className="p-2 rounded-lg bg-[#0D2A5C] text-white hover:bg-[#FF7A00] transition-colors"
                      title="View Product"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </NextLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OFFICIAL CONTACT & WHATSAPP BANNER */}
      <section className="py-12 bg-white border-t border-[#E6EBF2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FFF1E5] to-[#F4F7FB] border border-[#FF7A00]/20 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Personalized Business & Recruitment Assistance</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C]">
                Need Help Finding Workers or Advertising on CheremoSphere?
              </h3>
              <p className="text-sm text-[#5B6B82] max-w-xl">
                Reach Japhet Cheremo and the official CheremoSphere team directly on WhatsApp or call our Nairobi office at Cheremo Plaza.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a 
                href="https://wa.me/254719678760" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp: 0719678760</span>
              </a>

              <a 
                href="tel:+254719678760" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0D2A5C] hover:bg-[#071836] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Us Today</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
