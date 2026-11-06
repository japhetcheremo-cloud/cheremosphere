import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { LogIn, Key, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, setToken, setStoredUser } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (u = username, p = password) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<{ token: string; user: any }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username: u, password: p })
      });

      setToken(res.token);
      setStoredUser(res.user);

      const redirect = (router.query.redirect as string) || '/dashboard';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    handleLogin(u, p);
  };

  return (
    <Layout title="Log In — CheremoSphere">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 shadow-xs">
          
          <div className="text-center mb-8">
            <img src="/logo-horizontal.svg" alt="CheremoSphere" className="h-10 mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-[#0D2A5C]">Welcome Back</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              Sign in to manage your jobs, products, and applications.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold mb-4">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#24344D] mb-1">Username or Email</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or kevin_dev"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24344D] mb-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Instant Demo Quick-Login Accounts for Rapid Testing */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="text-[11px] font-bold text-[#5B6B82] uppercase tracking-wider block mb-3 text-center">
              Quick 1-Click Role Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'AdminPassword2026!')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-[#0D2A5C] text-left hover:bg-gray-50 transition-colors"
              >
                <p className="font-bold text-[#0D2A5C]">Admin / Owner</p>
                <p className="text-[10px] text-[#5B6B82]">Japhet Cheremo</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('safari_tech', 'Password123!')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-[#0D2A5C] text-left hover:bg-gray-50 transition-colors"
              >
                <p className="font-bold text-[#0D2A5C]">Employer</p>
                <p className="text-[10px] text-[#5B6B82]">Safari Tech Hub</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kevin_dev', 'Password123!')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-[#0D2A5C] text-left hover:bg-gray-50 transition-colors"
              >
                <p className="font-bold text-[#0D2A5C]">Freelancer</p>
                <p className="text-[10px] text-[#5B6B82]">Kevin (Engineer)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('mama_mboga_direct', 'Password123!')}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-[#0D2A5C] text-left hover:bg-gray-50 transition-colors"
              >
                <p className="font-bold text-[#0D2A5C]">Seller / Agrobiz</p>
                <p className="text-[10px] text-[#5B6B82]">Grace Wanjiku</p>
              </button>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-[#5B6B82]">
            Don't have an account yet?{' '}
            <NextLink href="/register" className="text-[#FF7A00] font-bold hover:underline">
              Create an account free
            </NextLink>
          </div>

        </div>
      </div>
    </Layout>
  );
}
