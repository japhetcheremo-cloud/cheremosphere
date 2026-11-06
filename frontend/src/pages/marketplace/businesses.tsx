import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Building2, MapPin, Phone, MessageCircle, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch } from '@/lib/api';

export default function BusinessProfilesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBiz() {
      try {
        const res = await apiFetch<{ results?: any[] } | any[]>('/marketplace/businesses/');
        setBusinesses(Array.isArray(res) ? res : (res.results || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBiz();
  }, []);

  return (
    <Layout title="Registered Business Profiles — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Enterprise & Trade Directory</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Verified Business Profiles</h1>
          <p className="text-blue-200 text-sm mt-1 max-w-2xl">
            Discover established companies, agribusiness dealers, logistics operators, and service providers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#5B6B82]">Loading businesses...</div>
        ) : businesses.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center text-xs text-[#5B6B82]">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#0D2A5C]">No business profiles registered yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-xs flex flex-col justify-between hover:border-[#0D2A5C] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#FF7A00] bg-[#FFF1E5] px-2.5 py-0.5 rounded-md">
                      {b.category}
                    </span>
                    {b.is_verified && (
                      <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0D2A5C]">{b.business_name}</h3>
                  <p className="text-xs font-semibold text-[#FF7A00] mt-0.5">{b.tagline}</p>
                  <p className="text-xs text-[#5B6B82] mt-2 line-clamp-3 leading-relaxed">{b.description}</p>

                  <div className="space-y-1.5 mt-4 pt-4 border-t border-gray-100 text-xs text-[#5B6B82]">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{b.physical_location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{b.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
                  {b.whatsapp && (
                    <a
                      href={`https://wa.me/${b.whatsapp.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <a
                    href={`tel:${b.phone}`}
                    className="flex-1 text-center py-2 bg-[#0D2A5C] hover:bg-[#071836] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
