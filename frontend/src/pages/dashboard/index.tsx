
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Briefcase,
  ShoppingBag,
  Wrench,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import Layout from '@/components/Layout';

import {
  apiFetch,
  getToken,
  getStoredUser,
  User as UserType,
  JobVacancy,
  JobRequest,
  ProductListing,
  FreelanceService,
} from '@/lib/api';

// Safely convert different API response formats into arrays.
function normalizeArray<T>(response: any): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
}

export default function DashboardPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const [activeTab, setActiveTab] = useState<
    'seeker' | 'employer' | 'seller' | 'freelancer'
  >('seeker');

  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [mySavedJobs, setMySavedJobs] = useState<any[]>([]);
  const [myJobRequests, setMyJobRequests] = useState<JobRequest[]>([]);
  const [myVacancies, setMyVacancies] = useState<JobVacancy[]>([]);
  const [myProducts, setMyProducts] = useState<ProductListing[]>([]);
  const [myServices, setMyServices] = useState<FreelanceService[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    const user = getStoredUser();
    setCurrentUser(user);

    if (user?.is_employer && !user?.is_job_seeker) {
      setActiveTab('employer');
    } else if (user?.is_seller && !user?.is_job_seeker) {
      setActiveTab('seller');
    }

    let cancelled = false;

    async function loadDashboardData() {
      const errors: string[] = [];

      const requests = [
        {
          name: 'Applications',
          request: apiFetch<any>('/jobs/applications/my/'),
          update: (data: any) => setMyApplications(normalizeArray(data)),
        },
        {
          name: 'Saved jobs',
          request: apiFetch<any>('/jobs/saved/'),
          update: (data: any) => setMySavedJobs(normalizeArray(data)),
        },
        {
          name: 'Job requests',
          request: apiFetch<any>('/job-seeking/requests/my/'),
          update: (data: any) => setMyJobRequests(normalizeArray(data)),
        },
        {
          name: 'Vacancies',
          request: apiFetch<any>('/jobs/employer/vacancies/'),
          update: (data: any) => setMyVacancies(normalizeArray(data)),
        },
        {
          name: 'Products',
          request: apiFetch<any>('/marketplace/products/my/'),
          update: (data: any) => setMyProducts(normalizeArray(data)),
        },
        {
          name: 'Services',
          request: apiFetch<any>('/freelance/services/my/'),
          update: (data: any) => setMyServices(normalizeArray(data)),
        },
      ];

      const results = await Promise.allSettled(
        requests.map(item => item.request)
      );

      if (cancelled) return;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          try {
            requests[index].update(result.value);
          } catch (error) {
            console.error(
              `Error processing ${requests[index].name}:`,
              error
            );
            errors.push(requests[index].name);
          }
        } else {
          console.error(
            `Error loading ${requests[index].name}:`,
            result.reason
          );
          errors.push(requests[index].name);
        }
      });

      if (!cancelled) {
        setLoadErrors(errors);
        setLoading(false);
      }
    }

    loadDashboardData().catch(error => {
      console.error('Dashboard loading error:', error);

      if (!cancelled) {
        setLoadErrors(['Dashboard data']);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const username = currentUser?.username || 'User';

  const fullName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
    : username;

  const initial = username.charAt(0).toUpperCase();

  const tabs = [
    { id: 'seeker', label: 'Job Seeker Hub', icon: Briefcase },
    { id: 'employer', label: 'Employer Portal', icon: FileText },
    { id: 'seller', label: 'Seller & Marketplace', icon: ShoppingBag },
    { id: 'freelancer', label: 'Freelancer & Services', icon: Wrench },
  ] as const;

  return (
    <Layout title="User Dashboard — CheremoSphere">

      {/* USER PROFILE HEADER */}

      <div className="bg-[#0D2A5C] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] text-white flex items-center justify-center font-black text-2xl shadow-md">
              {initial}
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-2xl font-extrabold tracking-tight">
                  {fullName}
                </h1>

                {currentUser?.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}

              </div>

              <p className="text-xs text-blue-200 mt-0.5">
                {currentUser?.headline || currentUser?.email || 'Welcome to CheremoSphere'}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2">

                {Array.isArray(currentUser?.active_roles) &&
                  currentUser.active_roles.map((role: string, index: number) => (
                    <span
                      key={`${role}-${index}`}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white"
                    >
                      {role}
                    </span>
                  ))}

              </div>

            </div>
          </div>

          <div className="flex items-center gap-2">

            <NextLink
              href="/chat"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
            >
              Messages
            </NextLink>

            <NextLink
              href="/notifications"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
            >
              Notifications
            </NextLink>

          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* NAVIGATION TABS */}

        <div className="flex items-center gap-2 border-b border-[#E6EBF2] pb-4 mb-8 overflow-x-auto">

          {tabs.map(tab => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selected
                    ? 'bg-[#0D2A5C] text-white shadow-sm'
                    : 'bg-white text-[#5B6B82] border border-[#E6EBF2] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

        </div>

        {/* LOADING STATE */}

        {loading && (
          <div className="bg-white rounded-2xl border border-[#E6EBF2] p-10 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full mx-auto mb-4" />

            <p className="text-sm font-bold text-[#0D2A5C]">
              Loading your dashboard...
            </p>

            <p className="text-xs text-[#5B6B82] mt-1">
              Please wait while we retrieve your information.
            </p>
          </div>
        )}

        {/* API WARNING */}

        {!loading && loadErrors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50">
            <p className="text-sm font-bold text-orange-800">
              Some dashboard information could not be loaded.
            </p>

            <p className="text-xs text-orange-700 mt-1">
              Affected sections: {loadErrors.join(', ')}. Other sections remain available.
            </p>
          </div>
        )}

        {!loading && (
          <>

            {/* TAB 1: JOB SEEKER HUB */}

            {activeTab === 'seeker' && (

              <div className="space-y-8">

                {/* STATISTICS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-sm">
                    <span className="text-xs font-bold text-[#5B6B82] uppercase">
                      Submitted Applications
                    </span>

                    <p className="text-3xl font-extrabold text-[#0D2A5C] mt-2">
                      {myApplications.length}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-sm">
                    <span className="text-xs font-bold text-[#5B6B82] uppercase">
                      Bookmarked Jobs
                    </span>

                    <p className="text-3xl font-extrabold text-[#FF7A00] mt-2">
                      {mySavedJobs.length}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-sm">
                    <span className="text-xs font-bold text-[#5B6B82] uppercase">
                      Job-Seeking Broadcasts
                    </span>

                    <p className="text-3xl font-extrabold text-green-600 mt-2">
                      {myJobRequests.length}
                    </p>
                  </div>

                </div>

                {/* APPLICATIONS */}

                <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-sm">

                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-base font-bold text-[#0D2A5C]">
                      My Applications Pipeline
                    </h3>

                    <NextLink
                      href="/jobs"
                      className="text-xs font-bold text-[#FF7A00] hover:underline"
                    >
                      Browse More Jobs
                    </NextLink>

                  </div>

                  {myApplications.length === 0 ? (

                    <p className="text-xs text-[#5B6B82] py-4">
                      No job applications submitted yet.
                    </p>

                  ) : (

                    <div className="divide-y divide-gray-100">

                      {myApplications.map((app: any, index: number) => (

                        <div
                          key={app.id ?? index}
                          className="py-3.5 flex items-center justify-between gap-4 text-xs"
                        >

                          <div>

                            <h4 className="font-bold text-[#0D2A5C]">
                              {app.vacancy_title || app.job_title || app.title || 'Job application'}
                            </h4>

                            <p className="text-[#5B6B82] mt-1">
                              {app.company_name || 'Company'}
                              {' • '}
                              Applied on{' '}
                              {app.applied_at
                                ? new Date(app.applied_at).toLocaleDateString()
                                : 'Date unavailable'}
                            </p>

                          </div>

                          <span className="font-bold px-3 py-1 rounded-full uppercase bg-blue-50 text-[#0D2A5C]">
                            {app.status || 'Pending'}
                          </span>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

                {/* JOB REQUESTS */}

                <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-sm">

                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-base font-bold text-[#0D2A5C]">
                      My "Ask for a Job" Broadcasts
                    </h3>

                    <NextLink
                      href="/ask-for-a-job/post"
                      className="btn-primary text-xs px-3.5 py-1.5 font-bold rounded-lg"
                    >
                      Broadcast New Request
                    </NextLink>

                  </div>

                  {myJobRequests.length === 0 ? (

                    <p className="text-xs text-[#5B6B82] py-4">
                      You have not published any job-seeking requests yet.
                    </p>

                  ) : (

                    <div className="space-y-3">

                      {myJobRequests.map((request, index) => (

                        <div
                          key={request.id ?? index}
                          className="p-4 rounded-xl bg-[#F4F7FB] border border-[#E6EBF2] flex items-center justify-between gap-4"
                        >

                          <div>

                            <h4 className="font-bold text-[#0D2A5C] text-xs sm:text-sm">
                              {request.job_sought}
                            </h4>

                            <p className="text-[11px] text-[#5B6B82]">
                              {request.preferred_location || 'Location not specified'}
                              {' • '}
                              Status: {request.is_fulfilled ? 'Fulfilled' : 'Active'}
                            </p>

                          </div>

                          <span className="text-xs font-bold text-[#FF7A00]">
                            {request.availability || ''}
                          </span>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </div>

            )}

            {/* TAB 2: EMPLOYER PORTAL */}

            {activeTab === 'employer' && (

              <div className="space-y-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-bold text-[#0D2A5C]">
                      Employer Recruitment Portal
                    </h3>

                    <p className="text-xs text-[#5B6B82]">
                      Manage vacancies, view received CVs, and update candidate statuses.
                    </p>

                  </div>

                  <NextLink
                    href="/jobs/post"
                    className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-sm"
                  >
                    Post New Vacancy
                  </NextLink>

                </div>

                {myVacancies.length === 0 ? (

                  <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">

                    <p className="font-bold text-sm text-[#0D2A5C] mb-1">
                      No vacancies published yet
                    </p>

                    <p>
                      Post a vacancy to start receiving verified candidate applications and CVs.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {myVacancies.map((vacancy, index) => (

                      <div
                        key={vacancy.id ?? index}
                        className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >

                        <div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D2A5C] capitalize">
                            {(vacancy.employment_type || 'Full time').replace('_', ' ')}
                          </span>

                          <h4 className="text-base font-bold text-[#0D2A5C] mt-1">
                            {vacancy.title}
                          </h4>

                          <p className="text-xs text-[#5B6B82]">
                            {vacancy.location || 'Location not specified'}
                            {' • '}
                            Status:{' '}
                            <strong className="capitalize">
                              {vacancy.status || 'Active'}
                            </strong>
                          </p>

                        </div>

                        <NextLink
                          href={`/jobs/${vacancy.id}`}
                          className="btn-outline text-xs px-4 py-2 font-bold rounded-lg"
                        >
                          View Vacancy
                        </NextLink>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

            {/* TAB 3: SELLER & MARKETPLACE */}

            {activeTab === 'seller' && (

              <div className="space-y-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-bold text-[#0D2A5C]">
                      Marketplace Seller Dashboard
                    </h3>

                    <p className="text-xs text-[#5B6B82]">
                      Manage products, inventory, and incoming trade inquiries.
                    </p>

                  </div>

                  <NextLink
                    href="/marketplace/sell"
                    className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-sm"
                  >
                    Sell New Product
                  </NextLink>

                </div>

                {myProducts.length === 0 ? (

                  <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">

                    <p className="font-bold text-sm text-[#0D2A5C] mb-1">
                      No products listed for sale yet
                    </p>

                    <p>
                      List electronics, agriculture, fashion, or vehicles to sell to buyers.
                    </p>

                  </div>

                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {myProducts.map((product, index) => (

                      <div
                        key={product.id ?? index}
                        className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-sm space-y-2"
                      >

                        <span className="text-[10px] font-bold text-[#FF7A00] bg-[#FFF1E5] px-2 py-0.5 rounded-md">
                          {product.category_name || 'Product'}
                        </span>

                        <h4 className="text-sm font-bold text-[#0D2A5C]">
                          {product.title}
                        </h4>

                        <p className="text-base font-black text-[#FF7A00]">
                          KES {Number(product.price || 0).toLocaleString()}
                        </p>

                        <p className="text-xs text-[#5B6B82]">
                          {product.stock_quantity ?? 0} in stock
                          {' • '}
                          {product.location || 'Location unavailable'}
                        </p>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

            {/* TAB 4: FREELANCER & SERVICES */}

            {activeTab === 'freelancer' && (

              <div className="space-y-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-bold text-[#0D2A5C]">
                      Freelance & Trades Hub
                    </h3>

                    <p className="text-xs text-[#5B6B82]">
                      Advertise skills, showcase portfolio, and receive client project inquiries.
                    </p>

                  </div>

                  <NextLink
                    href="/freelance/post"
                    className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-sm"
                  >
                    Advertise New Service
                  </NextLink>

                </div>

                {myServices.length === 0 ? (

                  <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">

                    <p className="font-bold text-sm text-[#0D2A5C] mb-1">
                      No services advertised yet
                    </p>

                    <p>
                      Offer graphic design, web development, plumbing, electrical, or tutoring.
                    </p>

                  </div>

                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {myServices.map((service, index) => (

                      <div
                        key={service.id ?? index}
                        className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-sm space-y-2"
                      >

                        <h4 className="text-sm font-bold text-[#0D2A5C]">
                          {service.title}
                        </h4>

                        <p className="text-xs text-[#5B6B82] line-clamp-2">
                          {service.description}
                        </p>

                        <p className="text-sm font-bold text-green-600">
                          {service.price
                            ? `KES ${Number(service.price).toLocaleString()}`
                            : 'Quote on request'}
                        </p>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

          </>
        )}

      </div>

    </Layout>
  );
}
