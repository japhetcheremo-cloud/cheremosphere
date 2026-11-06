import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Wrench, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken } from '@/lib/api';

export default function PostFreelanceServicePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    pricing_type: 'starting_at',
    price: '',
    currency: 'KES',
    location: 'Nairobi, Kenya',
    availability: 'Available for Hire',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getToken()) {
      router.push('/login?redirect=/freelance/post');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      await apiFetch('/freelance/services/', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        })
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/freelance');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to advertise service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Advertise a Professional Service — CheremoSphere">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <NextLink href="/freelance" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </NextLink>

        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-10 shadow-xs">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Freelancers & Trades</span>
            <h1 className="text-2xl font-extrabold text-[#0D2A5C] mt-1">Advertise Your Professional Services</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              List web development, graphic design, programming, plumbing, electrical, tutoring, or consultancy.
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto" />
              <h3 className="text-xl font-bold text-[#16A34A]">Service Profile Published!</h3>
              <p className="text-xs text-[#5B6B82]">Clients can now discover your services and contact you for quotes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Web Development with React & Next.js or Commercial Electrical Wiring"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Pricing Model *</label>
                  <select
                    value={formData.pricing_type}
                    onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  >
                    <option value="starting_at">Starting At</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="contact_for_quote">Contact for Quote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Price (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi & Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Skills & Tools *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Next.js, Django, TypeScript, Tailwind"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Service Description & Deliverables *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe what clients get, past client projects, delivery turnaround time, and revisions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <NextLink href="/freelance" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#5B6B82] hover:bg-gray-50">
                  Cancel
                </NextLink>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
