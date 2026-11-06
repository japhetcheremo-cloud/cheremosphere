import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { User, Mail, Key, Phone, ArrowRight, CheckSquare, Square } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, setToken, setStoredUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: 'Nairobi, Kenya',
    headline: '',
    is_job_seeker: true,
    is_employer: false,
    is_freelancer: false,
    is_seller: false,
    is_business_owner: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleRole = (role: 'is_job_seeker' | 'is_employer' | 'is_freelancer' | 'is_seller' | 'is_business_owner') => {
    setFormData(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ token: string; user: any }>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setToken(res.token);
      setStoredUser(res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Free Account — CheremoSphere">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 sm:p-10 shadow-xs">
          
          <div className="text-center mb-8">
            <img src="/logo-horizontal.svg" alt="CheremoSphere" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-[#0D2A5C]">Join CheremoSphere</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              One account connects you to jobs, freelancing, marketplace, and networking.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Roles Selection Pill Box */}
            <div className="bg-[#F4F7FB] p-4 rounded-2xl border border-gray-200 mb-2">
              <label className="block text-xs font-bold text-[#0D2A5C] mb-2">
                What are you joining CheremoSphere for? (Select all that apply)
              </label>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'is_job_seeker', label: 'Find a Job' },
                  { key: 'is_employer', label: 'Hire Talent (Employer)' },
                  { key: 'is_freelancer', label: 'Freelance & Services' },
                  { key: 'is_seller', label: 'Sell Marketplace Products' },
                  { key: 'is_business_owner', label: 'Promote a Business' },
                ].map(r => {
                  const isChecked = (formData as any)[r.key];
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => toggleRole(r.key as any)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#0D2A5C] text-white border-[#0D2A5C]'
                          : 'bg-white text-[#24344D] border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4 text-[#FF7A00]" /> : <Square className="w-4 h-4 text-gray-400" />}
                      <span className="font-semibold truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Japhet"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Cheremo"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  placeholder="0719678760"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="Nairobi, Kenya"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24344D] mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer mt-4"
            >
              {loading ? 'Creating Your Account...' : 'Create CheremoSphere Account'}
            </button>
          </form>

          <div className="text-center mt-6 text-xs text-[#5B6B82]">
            Already have an account?{' '}
            <NextLink href="/login" className="text-[#FF7A00] font-bold hover:underline">
              Log in here
            </NextLink>
          </div>

        </div>
      </div>
    </Layout>
  );
}
