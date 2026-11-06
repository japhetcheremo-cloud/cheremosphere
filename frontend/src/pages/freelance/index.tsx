import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Search, MapPin, Wrench, Star, MessageSquare, PlusCircle, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, FreelanceService, User } from '@/lib/api';

export default function FreelanceServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<FreelanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      const res = await apiFetch<{ results?: FreelanceService[] } | FreelanceService[]>(`/freelance/services/?${q.toString()}`);
      setServices(Array.isArray(res) ? res : (res.results || []));
    } catch (err) {
      console.error('Error loading freelance services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [search]);

  const handleContactPro = async (provider: User, serviceTitle: string) => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    try {
      const conv = await apiFetch<any>('/chat/conversations/', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: provider.id,
          subject: `Inquiry on: ${serviceTitle}`,
          message: `Hello ${provider.first_name || provider.username}! I saw your service "${serviceTitle}" on CheremoSphere and would like to request a quote or discuss a project.`
        })
      });
      router.push(`/chat?id=${conv.id}`);
    } catch (err: any) {
      alert(err.message || 'Could not initiate chat.');
    }
  };

  return (
    <Layout title="Freelance & Professional Services — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Skilled Freelancers & Trades</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">Professional Services Directory</h1>
            <p className="text-blue-200 text-sm mt-1 max-w-2xl">
              Hire verified developers, designers, writers, photographers, electricians, plumbers, consultants, and tutors.
            </p>
          </div>

          <NextLink
            href="/freelance/post"
            className="btn-primary text-sm font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Advertise Your Services</span>
          </NextLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6EBF2] shadow-xs mb-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services, skills (e.g. Next.js, Logo Design, Plumbing, Tutoring)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-16 text-center text-[#5B6B82]">Loading service providers...</div>
        ) : services.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center">
            <Wrench className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-[#0D2A5C]">No services found</h3>
            <p className="text-sm text-[#5B6B82] mt-1">Be the first to list your freelance or trade services.</p>
            <NextLink href="/freelance/post" className="btn-primary mt-4 inline-flex">
              Advertise Service
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <div 
                key={s.id}
                className="bg-white border border-[#E6EBF2] hover:border-[#0D2A5C] p-6 rounded-2xl shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-[#FF7A00] bg-[#FFF1E5] px-2.5 py-0.5 rounded-md">
                      {s.category_name}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[#FF7A00]">
                      <Star className="w-3.5 h-3.5 fill-[#FF7A00]" />
                      <span>{s.rating}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors line-clamp-2">
                    {s.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#5B6B82] mt-1">
                    Provider: <strong className="text-[#0D2A5C]">{s.provider.first_name ? `${s.provider.first_name} ${s.provider.last_name}` : s.provider.username}</strong>
                  </p>

                  <p className="text-xs text-[#5B6B82] mt-2 line-clamp-3 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="mt-3 text-xs text-[#0D2A5C] bg-[#F4F7FB] p-2.5 rounded-lg">
                    <strong>Skills:</strong> {s.skills}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#5B6B82] uppercase font-bold block">{s.pricing_type.replace('_', ' ')}</span>
                    <span className="text-sm font-extrabold text-[#16A34A]">
                      {s.price ? `KES ${Number(s.price).toLocaleString()}` : 'Quote'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleContactPro(s.provider, s.title)}
                    className="btn-secondary text-xs px-3.5 py-2 font-bold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Get Quote</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
