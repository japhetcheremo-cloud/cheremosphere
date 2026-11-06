import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { 
  User, Briefcase, ShoppingBag, Wrench, Bookmark, 
  Bell, FileText, CheckCircle2, PlusCircle, ArrowRight, Settings 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { 
  apiFetch, getToken, getStoredUser, User as UserType, 
  JobVacancy, JobRequest, ProductListing, FreelanceService 
} from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'seeker' | 'employer' | 'seller' | 'freelancer'>('seeker');

  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [mySavedJobs, setMySavedJobs] = useState<any[]>([]);
  const [myJobRequests, setMyJobRequests] = useState<JobRequest[]>([]);
  const [myVacancies, setMyVacancies] = useState<JobVacancy[]>([]);
  const [myProducts, setMyProducts] = useState<ProductListing[]>([]);
  const [myServices, setMyServices] = useState<FreelanceService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    const user = getStoredUser();
    setCurrentUser(user);

    if (user?.is_employer && !user.is_job_seeker) {
      setActiveTab('employer');
    } else if (user?.is_seller && !user.is_job_seeker) {
      setActiveTab('seller');
    }

    async function loadDashboardData() {
      try {
        const [appRes, savedRes, reqRes, vacRes, prodRes, srvRes] = await Promise.allSettled([
          apiFetch<any[]>('/jobs/applications/my/'),
          apiFetch<any[]>('/jobs/saved/'),
          apiFetch<{ results?: JobRequest[] } | JobRequest[]>('/job-seeking/requests/my/'),
          apiFetch<JobVacancy[]>('/jobs/employer/vacancies/'),
          apiFetch<ProductListing[]>('/marketplace/products/my/'),
          apiFetch<FreelanceService[]>('/freelance/services/my/'),
        ]);

        if (appRes.status === 'fulfilled') setMyApplications(appRes.value);
        if (savedRes.status === 'fulfilled') setMySavedJobs(savedRes.value);
        if (reqRes.status === 'fulfilled') {
          const val = reqRes.value;
          setMyJobRequests(Array.isArray(val) ? val : (val.results || []));
        }
        if (vacRes.status === 'fulfilled') setMyVacancies(vacRes.value);
        if (prodRes.status === 'fulfilled') setMyProducts(prodRes.value);
        if (srvRes.status === 'fulfilled') setMyServices(srvRes.value);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <Layout title="User Dashboard — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] text-white flex items-center justify-center font-black text-2xl shadow-md">
              {currentUser?.username[0].toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : currentUser?.username}
                </h1>
                {currentUser?.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                )}
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {currentUser?.headline || currentUser?.email}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentUser?.active_roles?.map((r, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                    {r}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Multi-Role Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E6EBF2] pb-4 mb-8 overflow-x-auto">
          {[
            { id: 'seeker', label: 'Job Seeker Hub', icon: Briefcase },
            { id: 'employer', label: 'Employer Portal', icon: FileText },
            { id: 'seller', label: 'Seller & Marketplace', icon: ShoppingBag },
            { id: 'freelancer', label: 'Freelancer & Services', icon: Wrench },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-[#0D2A5C] text-white shadow-xs'
                    : 'bg-white text-[#5B6B82] border border-[#E6EBF2] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: JOB SEEKER HUB */}
        {activeTab === 'seeker' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs">
                <span className="text-xs font-bold text-[#5B6B82] uppercase">Submitted Applications</span>
                <p className="text-3xl font-extrabold text-[#0D2A5C] mt-2">{myApplications.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs">
                <span className="text-xs font-bold text-[#5B6B82] uppercase">Bookmarked Jobs</span>
                <p className="text-3xl font-extrabold text-[#FF7A00] mt-2">{mySavedJobs.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E6EBF2] shadow-xs">
                <span className="text-xs font-bold text-[#5B6B82] uppercase">Job-Seeking Broadcasts</span>
                <p className="text-3xl font-extrabold text-[#16A34A] mt-2">{myJobRequests.length}</p>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0D2A5C]">My Applications Pipeline</h3>
                <NextLink href="/jobs" className="text-xs font-bold text-[#FF7A00] hover:underline">
                  Browse More Jobs
                </NextLink>
              </div>

              {myApplications.length === 0 ? (
                <p className="text-xs text-[#5B6B82] py-4">No job applications submitted yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myApplications.map((app: any) => (
                    <div key={app.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-[#0D2A5C]">{app.vacancy_title}</h4>
                        <p className="text-[#5B6B82]">{app.company_name} • Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold px-3 py-1 rounded-full uppercase bg-blue-50 text-[#0D2A5C]">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Job Requests */}
            <div className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0D2A5C]">My "Ask for a Job" Broadcasts</h3>
                <NextLink href="/ask-for-a-job/post" className="btn-primary text-xs px-3.5 py-1.5 font-bold rounded-lg">
                  Broadcast New Request
                </NextLink>
              </div>

              {myJobRequests.length === 0 ? (
                <p className="text-xs text-[#5B6B82] py-4">You have not published any job-seeking requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {myJobRequests.map(r => (
                    <div key={r.id} className="p-4 rounded-xl bg-[#F4F7FB] border border-[#E6EBF2] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#0D2A5C] text-xs sm:text-sm">{r.job_sought}</h4>
                        <p className="text-[11px] text-[#5B6B82]">{r.preferred_location} • Status: {r.is_fulfilled ? 'Fulfilled' : 'Active'}</p>
                      </div>
                      <span className="text-xs font-bold text-[#FF7A00]">{r.availability}</span>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0D2A5C]">Employer Recruitment Portal</h3>
                <p className="text-xs text-[#5B6B82]">Manage vacancies, view received CVs, and update candidate statuses.</p>
              </div>
              <NextLink href="/jobs/post" className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-xs">
                Post New Vacancy
              </NextLink>
            </div>

            {myVacancies.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">
                <p className="font-bold text-sm text-[#0D2A5C] mb-1">No vacancies published yet</p>
                <p>Post a vacancy to start receiving verified candidate applications and CVs.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myVacancies.map(vac => (
                  <div key={vac.id} className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D2A5C] capitalize">
                        {vac.employment_type.replace('_', ' ')}
                      </span>
                      <h4 className="text-base font-bold text-[#0D2A5C] mt-1">{vac.title}</h4>
                      <p className="text-xs text-[#5B6B82]">{vac.location} • Status: <strong className="capitalize">{vac.status}</strong></p>
                    </div>

                    <div className="flex items-center gap-3">
                      <NextLink
                        href={`/jobs/${vac.id}`}
                        className="btn-outline text-xs px-4 py-2 font-bold rounded-lg"
                      >
                        View Vacancy
                      </NextLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SELLER & MARKETPLACE */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0D2A5C]">Marketplace Seller Dashboard</h3>
                <p className="text-xs text-[#5B6B82]">Manage products, inventory, and incoming trade inquiries.</p>
              </div>
              <NextLink href="/marketplace/sell" className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-xs">
                Sell New Product
              </NextLink>
            </div>

            {myProducts.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">
                <p className="font-bold text-sm text-[#0D2A5C] mb-1">No products listed for sale yet</p>
                <p>List electronics, agriculture, fashion, or vehicles to sell to buyers across Kenya.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myProducts.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-[#FF7A00] bg-[#FFF1E5] px-2 py-0.5 rounded-md">
                      {p.category_name}
                    </span>
                    <h4 className="text-sm font-bold text-[#0D2A5C]">{p.title}</h4>
                    <p className="text-base font-black text-[#FF7A00]">KES {Number(p.price).toLocaleString()}</p>
                    <p className="text-xs text-[#5B6B82]">{p.stock_quantity} in stock • {p.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FREELANCER & SERVICES */}
        {activeTab === 'freelancer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0D2A5C]">Freelance & Trades Hub</h3>
                <p className="text-xs text-[#5B6B82]">Advertise skills, showcase portfolio, and receive client project inquiries.</p>
              </div>
              <NextLink href="/freelance/post" className="btn-primary text-xs px-4 py-2.5 font-bold rounded-xl shadow-xs">
                Advertise New Service
              </NextLink>
            </div>

            {myServices.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">
                <p className="font-bold text-sm text-[#0D2A5C] mb-1">No services advertised yet</p>
                <p>Offer graphic design, web development, plumbing, electrical, or tutoring.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myServices.map(s => (
                  <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#E6EBF2] shadow-xs space-y-2">
                    <h4 className="text-sm font-bold text-[#0D2A5C]">{s.title}</h4>
                    <p className="text-xs text-[#5B6B82] line-clamp-2">{s.description}</p>
                    <p className="text-sm font-bold text-[#16A34A]">
                      {s.price ? `KES ${Number(s.price).toLocaleString()}` : 'Quote on request'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
