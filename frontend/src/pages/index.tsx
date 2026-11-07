import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import {
  Search,
  Briefcase,
  ShoppingBag,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Building2,
  TrendingUp,
  PhoneCall,
  MessageCircle
} from 'lucide-react';

import Layout from '@/components/Layout';

import {
  apiFetch,
  JobVacancy,
  JobRequest,
  ProductListing,
  PlatformStats
} from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [products, setProducts] = useState<ProductListing[]>([]);

  const [loading, setLoading] = useState(true);

  // LOAD HOMEPAGE DATA
  useEffect(() => {
    async function loadData() {
      try {
        const [
          statsRes,
          jobsRes,
          reqRes,
          prodRes
        ] = await Promise.allSettled([
          apiFetch<PlatformStats>('/platform/stats/'),

          apiFetch<{ results?: JobVacancy[] } | JobVacancy[]>(
            '/jobs/vacancies/'
          ),

          apiFetch<{ results?: JobRequest[] } | JobRequest[]>(
            '/job-seeking/requests/'
          ),

          apiFetch<{ results?: ProductListing[] } | ProductListing[]>(
            '/marketplace/products/'
          ),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value);
        }

        if (jobsRes.status === 'fulfilled') {
          const val = jobsRes.value;

          setJobs(
            Array.isArray(val)
              ? val.slice(0, 4)
              : (Array.isArray(val.results) ? val.results.slice(0, 4) : [])
          );
        }

        if (reqRes.status === 'fulfilled') {
          const val = reqRes.value;

          setJobRequests(
            Array.isArray(val)
              ? val.slice(0, 4)
              : (Array.isArray(val.results) ? val.results.slice(0, 4) : [])
          );
        }

        if (prodRes.status === 'fulfilled') {
          const val = prodRes.value;

          setProducts(
            Array.isArray(val)
              ? val.slice(0, 4)
              : (Array.isArray(val.results) ? val.results.slice(0, 4) : [])
          );
        }

      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // UNIVERSAL SEARCH
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    const query = encodeURIComponent(searchQuery);

    switch (searchCategory) {
      case 'jobs':
        router.push(`/jobs?search=${query}`);
        break;

      case 'products':
        router.push(`/marketplace?search=${query}`);
        break;

      case 'services':
        router.push(`/freelance?search=${query}`);
        break;

      case 'job_requests':
        router.push(`/ask-for-a-job?search=${query}`);
        break;

      case 'businesses':
        router.push(`/marketplace?search=${query}`);
        break;

      default:
        router.push(`/jobs?search=${query}`);
    }
  };

  return (
    <Layout>

      <main className="w-full overflow-x-hidden">

        {/* ==========================================
            1. PREMIUM HERO SECTION
        ========================================== */}

        <section className="
          relative isolate overflow-hidden
          bg-gradient-to-br
          from-white via-[#F8FAFF] to-[#EDF3FF]
          border-b border-[#E6EBF2]
        ">

          {/* HERO IMAGE BACKGROUND */}

          <div className="
            absolute inset-y-0 right-0
            w-full lg:w-[62%]
            pointer-events-none
            z-0
          ">

            <img
              src="/images/cheremosphere-hero.png"
              alt="CheremoSphere founder presenting the platform"
              className="
                absolute inset-0
                w-full h-full
                object-cover
                object-center
                lg:object-center
              "
            />

            {/* IMAGE BLENDING GRADIENT */}

            <div className="
              absolute inset-0
              bg-gradient-to-r
              from-[#F8FAFF]
              via-[#F8FAFF]/90
              via-25%
              to-transparent
              lg:from-[#F8FAFF]
              lg:via-[#F8FAFF]/70
              lg:via-10%
              lg:to-transparent
            " />

            {/* BOTTOM BLENDING */}

            <div className="
              absolute inset-0
              bg-gradient-to-t
              from-[#EDF3FF]/80
              via-transparent
              to-white/10
            " />

          </div>

          {/* HERO CONTENT */}

          <div className="
            relative z-10
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-12 sm:py-16 lg:py-20
          ">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* LEFT CONTENT */}

              <div className="
                lg:col-span-7
                space-y-6
                text-left
                max-w-3xl
              ">

                {/* BADGE */}

                <div className="
                  inline-flex items-center gap-2
                  px-3.5 py-2
                  rounded-full
                  bg-[#FFF1E5]
                  border border-[#FF7A00]/30
                  text-[#FF7A00]
                  text-xs font-bold
                  tracking-wide uppercase
                ">

                  <Sparkles className="w-4 h-4" />

                  Jobs. Connect. Market. Grow.

                </div>

                {/* MAIN HEADING */}

                <h1 className="
                  text-4xl
                  sm:text-5xl
                  lg:text-[58px]
                  font-extrabold
                  text-[#0D2A5C]
                  tracking-tight
                  leading-[1.08]
                ">

                  Discover Opportunities.

                  Connect with People.

                  <span className="block text-[#FF7A00] mt-1">
                    Grow Your Future.
                  </span>

                </h1>

                {/* DESCRIPTION */}

                <p className="
                  text-base sm:text-lg
                  text-[#24344D]/90
                  leading-relaxed
                  max-w-xl
                ">

                  Find your next job, hire talented people,
                  promote your business, discover products
                  and connect with opportunities through
                  one powerful platform.

                </p>


                {/* UNIVERSAL SEARCH */}

                <div className="
                  bg-white/95
                  backdrop-blur-md
                  p-3 sm:p-4
                  rounded-2xl
                  shadow-xl
                  border border-white
                  max-w-2xl
                ">

                  {/* SEARCH CATEGORIES */}

                  <div className="
                    flex items-center gap-1.5
                    pb-3
                    overflow-x-auto
                    border-b border-gray-100
                    text-xs font-semibold
                  ">

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
                        className={`
                          px-3 py-2
                          rounded-lg
                          whitespace-nowrap
                          transition-colors
                          cursor-pointer
                          ${
                            searchCategory === cat.id
                              ? 'bg-[#0D2A5C] text-white font-bold'
                              : 'text-[#5B6B82] hover:bg-gray-100'
                          }
                        `}
                      >
                        {cat.label}
                      </button>

                    ))}

                  </div>


                  {/* SEARCH FORM */}

                  <form
                    onSubmit={handleSearchSubmit}
                    className="
                      flex flex-col sm:flex-row
                      items-center gap-2 pt-3
                    "
                  >

                    <div className="relative flex-1 w-full">

                      <Search className="
                        w-5 h-5
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-gray-400
                      " />

                      <input
                        type="text"
                        placeholder="Search jobs, skills, products, businesses, or people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
                          w-full
                          pl-11 pr-4 py-3
                          bg-[#F4F7FB]
                          border border-transparent
                          focus:border-[#0D2A5C]
                          focus:bg-white
                          rounded-xl
                          text-sm
                          outline-none
                          transition-all
                        "
                      />

                    </div>


                    <button
                      type="submit"
                      className="
                        w-full sm:w-auto
                        px-6 py-3
                        bg-[#FF7A00]
                        hover:bg-[#E66E00]
                        text-white
                        text-sm font-bold
                        rounded-xl
                        transition-all
                        shadow-md
                        shrink-0
                        cursor-pointer
                      "
                    >

                      Search Now

                    </button>

                  </form>

                </div>


                {/* ACTION BUTTONS */}

                <div className="
                  flex flex-wrap
                  items-center gap-3 pt-2
                ">

                  <NextLink
                    href="/jobs"
                    className="
                      inline-flex items-center gap-2
                      btn-secondary
                      px-6 py-3
                      text-sm font-bold
                      rounded-xl shadow-sm
                    "
                  >

                    <Briefcase className="w-4 h-4" />

                    Find Jobs

                  </NextLink>


                  <NextLink
                    href="/marketplace"
                    className="
                      inline-flex items-center gap-2
                      btn-primary
                      px-6 py-3
                      text-sm font-bold
                      rounded-xl shadow-sm
                    "
                  >

                    <ShoppingBag className="w-4 h-4" />

                    Explore Marketplace

                  </NextLink>


                  <NextLink
                    href="/ask-for-a-job"
                    className="
                      inline-flex items-center gap-2
                      btn-outline
                      px-5 py-3
                      text-sm font-bold
                      rounded-xl
                    "
                  >

                    Ask for a Job

                    <ArrowRight className="w-4 h-4" />

                  </NextLink>

                </div>


                {/* TRUST BADGES */}

                <div className="
                  flex flex-wrap
                  items-center gap-5
                  pt-3
                  text-xs font-semibold
                  text-[#5B6B82]
                ">

                  <div className="flex items-center gap-1.5">

                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />

                    Verified Employers

                  </div>


                  <div className="flex items-center gap-1.5">

                    <ShieldCheck className="w-4 h-4 text-[#0D2A5C]" />

                    Direct WhatsApp Connect

                  </div>


                  <div className="flex items-center gap-1.5">

                    <Building2 className="w-4 h-4 text-[#FF7A00]" />

                    Kenya & Africa Connected

                  </div>

                </div>

              </div>


              {/* RIGHT IMAGE SPACE */}

              <div className="
                hidden lg:block
                lg:col-span-5
                min-h-[480px]
              " />

            </div>

          </div>


          {/* FLOATING INFORMATION CARD */}

          <div className="
            absolute
            bottom-8
            right-5 sm:right-10 lg:right-[7%]
            z-20
            hidden sm:flex
            items-center gap-3
            bg-white/95
            backdrop-blur-md
            border border-white
            p-4
            rounded-2xl
            shadow-2xl
            max-w-[280px]
          ">

            <div className="
              w-12 h-12
              rounded-xl
              bg-[#FFF1E5]
              text-[#FF7A00]
              flex items-center justify-center
              shrink-0
            ">

              <TrendingUp className="w-6 h-6" />

            </div>

            <div>

              <h5 className="text-sm font-bold text-[#0D2A5C]">

                Direct Trade & Hiring

              </h5>

              <p className="text-xs text-[#5B6B82]">

                Kenya & Africa Connected

              </p>

            </div>

          </div>

        </section>


        {/* ==========================================
            2. PLATFORM STATISTICS
        ========================================== */}

        <section className="py-8 bg-white border-b border-[#E6EBF2]">

          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          ">

            <div className="
              grid grid-cols-2
              md:grid-cols-4 gap-4 sm:gap-6
              text-center
            ">

              {[
                {
                  value: stats?.active_jobs
                    ? `${stats.active_jobs}+`
                    : 'Active',
                  label: 'Job Vacancies Open',
                  color: 'text-[#0D2A5C]'
                },
                {
                  value: stats?.job_requests
                    ? `${stats.job_requests}+`
                    : 'Available',
                  label: 'Job-Seeker Requests',
                  color: 'text-[#FF7A00]'
                },
                {
                  value: stats?.marketplace_products
                    ? `${stats.marketplace_products}+`
                    : 'Listed',
                  label: 'Marketplace Products',
                  color: 'text-[#16A34A]'
                },
                {
                  value: stats?.total_users
                    ? `${stats.total_users}+`
                    : 'Growing',
                  label: 'Platform Members',
                  color: 'text-[#0D2A5C]'
                }
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    p-4 rounded-xl
                    bg-[#F4F7FB]
                  "
                >

                  <p className={`
                    text-2xl sm:text-3xl
                    font-extrabold
                    ${item.color}
                  `}>

                    {item.value}

                  </p>

                  <p className="
                    text-xs font-semibold
                    text-[#5B6B82] mt-1
                  ">

                    {item.label}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ==========================================
            3. ASK FOR A JOB
        ========================================== */}

        <section className="
          py-14
          bg-gradient-to-r
          from-[#0D2A5C]
          to-[#071836]
          text-white
        ">

          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          ">

            <div className="
              flex flex-col md:flex-row
              items-start md:items-center
              justify-between gap-6
              pb-8
              border-b border-white/10
            ">

              <div>

                <span className="
                  text-xs font-bold
                  text-[#FF7A00]
                  tracking-wider uppercase
                ">

                  Reverse Recruitment

                </span>

                <h2 className="
                  text-2xl sm:text-3xl
                  font-bold mt-1
                ">

                  Ask for a Job Board

                </h2>

                <p className="
                  text-sm text-blue-200
                  mt-1 max-w-xl
                ">

                  Looking for work? Broadcast what you can do.
                  Employers and clients can discover your skills
                  and contact you directly.

                </p>

              </div>


              <div className="
                flex flex-wrap
                items-center gap-3
              ">

                <NextLink
                  href="/ask-for-a-job/post"
                  className="
                    bg-[#FF7A00]
                    hover:bg-[#E66E00]
                    text-white font-bold
                    text-sm px-5 py-2.5
                    rounded-lg shadow-sm
                    transition-colors
                  "
                >

                  Post Your Job Request

                </NextLink>


                <NextLink
                  href="/ask-for-a-job"
                  className="
                    text-sm font-semibold
                    text-white/80
                    hover:text-white
                    underline underline-offset-4
                  "
                >

                  Browse All Requests

                </NextLink>

              </div>

            </div>


            {/* REQUEST CARDS */}

            <div className="
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6 pt-8
            ">

              {jobRequests.map(req => (

                <div
                  key={req.id}
                  className="
                    bg-white/10
                    backdrop-blur-sm
                    border border-white/10
                    p-5 rounded-2xl
                    flex flex-col justify-between
                    hover:border-[#FF7A00]
                    transition-colors
                  "
                >

                  <div>

                    <span className="
                      text-[11px] font-bold
                      text-[#FF7A00]
                      bg-white/10
                      px-2.5 py-1
                      rounded-md
                    ">

                      {req.category}

                    </span>


                    <h3 className="
                      text-base font-bold
                      text-white mt-3
                      line-clamp-2
                    ">

                      {req.job_sought}

                    </h3>


                    <p className="
                      text-xs text-blue-100/80
                      mt-2 line-clamp-3
                    ">

                      {req.personal_introduction}

                    </p>

                  </div>


                  <div className="
                    pt-4 mt-4
                    border-t border-white/10
                  ">

                    <div className="
                      flex items-center justify-between
                      text-xs text-blue-200 mb-3
                    ">

                      <span className="
                        flex items-center gap-1
                      ">

                        <MapPin className="
                          w-3.5 h-3.5 text-[#FF7A00]
                        " />

                        <span className="truncate max-w-[120px]">

                          {req.preferred_location}

                        </span>

                      </span>

                      <span className="font-semibold text-white">

                        {req.availability}

                      </span>

                    </div>


                    <NextLink
                      href={`/ask-for-a-job?id=${req.id}`}
                      className="
                        block text-center
                        w-full py-2
                        bg-white/20
                        hover:bg-[#FF7A00]
                        text-white text-xs font-bold
                        rounded-lg transition-colors
                      "
                    >

                      View Details & Contact

                    </NextLink>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ==========================================
            4. LATEST JOB VACANCIES
        ========================================== */}

        <section className="py-14 bg-white">

          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          ">

            <div className="
              flex flex-col sm:flex-row
              items-start sm:items-center
              justify-between gap-4 mb-8
            ">

              <div>

                <span className="
                  text-xs font-bold
                  text-[#FF7A00]
                  tracking-wider uppercase
                ">

                  Employment & Careers

                </span>

                <h2 className="
                  text-2xl sm:text-3xl
                  font-extrabold
                  text-[#0D2A5C] mt-1
                ">

                  Latest Job Vacancies

                </h2>

                <p className="
                  text-sm text-[#5B6B82] mt-1
                ">

                  Explore full-time, contract, freelance
                  and remote roles across Kenya.

                </p>

              </div>


              <NextLink
                href="/jobs"
                className="
                  inline-flex items-center gap-1.5
                  text-sm font-bold
                  text-[#0D2A5C]
                  hover:text-[#FF7A00]
                "
              >

                View All Vacancies

                <ArrowRight className="w-4 h-4" />

              </NextLink>

            </div>


            <div className="
              grid grid-cols-1
              md:grid-cols-2 gap-6
            ">

              {jobs.map(job => (

                <div
                  key={job.id}
                  className="
                    bg-white
                    border border-[#E6EBF2]
                    hover:border-[#0D2A5C]
                    p-6 rounded-2xl
                    shadow-sm hover:shadow-md
                    transition-all
                    flex flex-col justify-between
                    group
                  "
                >

                  <div>

                    <div className="
                      flex items-start
                      justify-between gap-4
                    ">

                      <div>

                        <span className="
                          text-xs font-semibold
                          text-[#5B6B82]
                        ">

                          {job.company_name}

                        </span>


                        <h3 className="
                          text-lg font-bold
                          text-[#0D2A5C]
                          group-hover:text-[#FF7A00]
                          mt-0.5
                        ">

                          <NextLink href={`/jobs/${job.id}`}>

                            {job.title}

                          </NextLink>

                        </h3>

                      </div>


                      <span className="
                        text-xs font-bold
                        px-2.5 py-1
                        rounded-full
                        bg-blue-50
                        text-[#0D2A5C]
                        border border-blue-100
                        shrink-0 capitalize
                      ">

                        {job.employment_type?.replace('_', ' ') || 'Employment'}

                      </span>

                    </div>


                    <p className="
                      text-xs text-[#5B6B82]
                      mt-3 line-clamp-2
                      leading-relaxed
                    ">

                      {job.description}

                    </p>

                  </div>


                  <div className="
                    pt-4 mt-4
                    border-t border-[#E6EBF2]
                    flex items-center justify-between
                    text-xs
                  ">

                    <div className="space-y-1">

                      <p className="
                        flex items-center gap-1.5
                        text-[#5B6B82]
                      ">

                        <MapPin className="
                          w-3.5 h-3.5 text-[#FF7A00]
                        " />

                        {job.location}

                      </p>


                      <p className="
                        font-bold text-[#16A34A]
                      ">

                        {job.salary_max
                          ? `KES ${Number(job.salary_min || 0).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}`
                          : 'Competitive Salary'
                        }

                      </p>

                    </div>


                    <NextLink
                      href={`/jobs/${job.id}`}
                      className="
                        btn-secondary
                        text-xs px-4 py-2
                        font-bold rounded-lg
                      "
                    >

                      Apply Now

                    </NextLink>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ==========================================
            5. MARKETPLACE HIGHLIGHTS
        ========================================== */}

        <section className="py-14 bg-[#F4F7FB]">

          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          ">

            <div className="
              flex flex-col sm:flex-row
              items-start sm:items-center
              justify-between gap-4 mb-8
            ">

              <div>

                <span className="
                  text-xs font-bold
                  text-[#FF7A00]
                  tracking-wider uppercase
                ">

                  Buy & Sell Locally

                </span>

                <h2 className="
                  text-2xl sm:text-3xl
                  font-extrabold
                  text-[#0D2A5C] mt-1
                ">

                  Marketplace Highlights

                </h2>

                <p className="
                  text-sm text-[#5B6B82] mt-1
                ">

                  Discover electronics, food, agriculture
                  and business equipment.

                </p>

              </div>


              <NextLink
                href="/marketplace"
                className="
                  inline-flex items-center gap-1.5
                  text-sm font-bold
                  text-[#0D2A5C]
                  hover:text-[#FF7A00]
                "
              >

                Explore Marketplace

                <ArrowRight className="w-4 h-4" />

              </NextLink>

            </div>


            <div className="
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6
            ">

              {products.map(prod => (

                <div
                  key={prod.id}
                  className="
                    bg-white
                    border border-[#E6EBF2]
                    rounded-2xl
                    overflow-hidden
                    shadow-sm hover:shadow-md
                    transition-all
                    flex flex-col justify-between
                    group
                  "
                >

                  <div className="p-4">

                    <span className="
                      text-[11px] font-bold
                      text-[#5B6B82]
                      bg-gray-100
                      px-2 py-0.5 rounded-md
                    ">

                      {prod.category_name}

                    </span>


                    <h3 className="
                      text-sm font-bold
                      text-[#0D2A5C]
                      group-hover:text-[#FF7A00]
                      mt-2 line-clamp-2
                    ">

                      <NextLink href={`/marketplace/${prod.id}`}>

                        {prod.title}

                      </NextLink>

                    </h3>


                    <p className="
                      text-xs text-[#5B6B82]
                      mt-1.5 line-clamp-2
                    ">

                      {prod.description}

                    </p>

                  </div>


                  <div className="
                    p-4 pt-0 mt-auto
                    border-t border-gray-100
                  ">

                    <div className="
                      flex items-center
                      justify-between pt-3
                    ">

                      <div>

                        <p className="
                          text-base font-extrabold
                          text-[#FF7A00]
                        ">

                          KES {Number(prod.price).toLocaleString()}

                        </p>


                        <p className="
                          text-[11px] text-[#5B6B82]
                          flex items-center gap-1 mt-0.5
                        ">

                          <MapPin className="w-3 h-3" />

                          <span className="truncate max-w-[100px]">

                            {prod.location}

                          </span>

                        </p>

                      </div>


                      <NextLink
                        href={`/marketplace/${prod.id}`}
                        className="
                          p-2 rounded-lg
                          bg-[#0D2A5C]
                          text-white
                          hover:bg-[#FF7A00]
                          transition-colors
                        "
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


        {/* ==========================================
            6. CONTACT SECTION
        ========================================== */}

        <section className="
          py-12 bg-white
          border-t border-[#E6EBF2]
        ">

          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
          ">

            <div className="
              bg-gradient-to-r
              from-[#FFF1E5]
              to-[#F4F7FB]
              border border-[#FF7A00]/20
              rounded-3xl
              p-8 lg:p-12
              flex flex-col lg:flex-row
              items-center justify-between gap-8
            ">

              <div className="
                space-y-3
                text-center lg:text-left
              ">

                <span className="
                  text-xs font-bold
                  text-[#FF7A00]
                  tracking-wider uppercase
                ">

                  Business & Recruitment Assistance

                </span>


                <h3 className="
                  text-2xl sm:text-3xl
                  font-extrabold
                  text-[#0D2A5C]
                ">

                  Need Help Finding Workers
                  or Advertising on CheremoSphere?

                </h3>


                <p className="
                  text-sm text-[#5B6B82]
                  max-w-xl
                ">

                  Reach the CheremoSphere team directly
                  through WhatsApp or telephone.

                </p>

              </div>


              <div className="
                flex flex-col sm:flex-row
                items-center gap-3
                shrink-0 w-full lg:w-auto
              ">

                <a
                  href="https://wa.me/254719678760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full sm:w-auto
                    inline-flex items-center
                    justify-center gap-2
                    bg-[#16A34A]
                    hover:bg-green-700
                    text-white font-bold
                    text-sm px-6 py-3.5
                    rounded-xl shadow-md
                    transition-all
                  "
                >

                  <MessageCircle className="w-5 h-5" />

                  WhatsApp: 0719678760

                </a>


                <a
                  href="tel:+254719678760"
                  className="
                    w-full sm:w-auto
                    inline-flex items-center
                    justify-center gap-2
                    bg-[#0D2A5C]
                    hover:bg-[#071836]
                    text-white font-bold
                    text-sm px-6 py-3.5
                    rounded-xl shadow-md
                    transition-all
                  "
                >

                  <PhoneCall className="w-4 h-4" />

                  Call Us Today

                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

    </Layout>
  );
}