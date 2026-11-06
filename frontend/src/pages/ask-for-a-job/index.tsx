import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { UserCheck, MapPin, Search, PlusCircle, CheckCircle, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, JobRequest } from '@/lib/api';

export default function AskForAJobPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (location) q.append('location', location);
      const res = await apiFetch<{ results?: JobRequest[] } | JobRequest[]>(`/job-seeking/requests/?${q.toString()}`);
      setRequests(Array.isArray(res) ? res : (res.results || []));
    } catch (err) {
      console.error('Error loading job requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [search, location]);

  const handleStartChat = async (userId: number, jobSought: string) => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    try {
      const conv = await apiFetch<any>('/chat/conversations/', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: userId,
          subject: `Inquiry regarding: ${jobSought}`,
          message: `Hello! I saw your job-seeking request for "${jobSought}" on CheremoSphere and would like to discuss an opportunity.`
        })
      });
      router.push(`/chat?id=${conv.id}`);
    } catch (err: any) {
      alert(err.message || 'Could not start conversation.');
    }
  };

  return (
    <Layout title="Ask for a Job — CheremoSphere Reverse Hiring">
      <div className="bg-[#0D2A5C] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Reverse Recruitment</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">"Ask for a Job" Directory</h1>
            <p className="text-blue-200 text-sm mt-1 max-w-2xl">
              Job seekers broadcast what roles they seek. Employers and hiring clients can discover candidates directly and hire immediately.
            </p>
          </div>
          <NextLink
            href="/ask-for-a-job/post"
            className="btn-primary text-sm font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Your Job Request</span>
          </NextLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6EBF2] shadow-xs mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills, job sought (e.g. Accountant, Driver, Graphic Designer)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Location (e.g. Nairobi, Bungoma)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        {/* List of Requests */}
        {loading ? (
          <div className="py-16 text-center text-[#5B6B82]">Loading candidate broadcasts...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center">
            <UserCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-[#0D2A5C]">No job requests found</h3>
            <p className="text-sm text-[#5B6B82] mt-1">Be the first to broadcast what job you are looking for.</p>
            <NextLink href="/ask-for-a-job/post" className="btn-primary mt-4 inline-flex">
              Post Your Request
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(req => (
              <div 
                key={req.id} 
                className={`bg-white border p-6 rounded-2xl shadow-xs transition-all flex flex-col justify-between ${
                  req.is_fulfilled ? 'border-gray-200 opacity-70' : 'border-[#E6EBF2] hover:border-[#FF7A00]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-[#FF7A00] bg-[#FFF1E5] px-2.5 py-1 rounded-md">
                      {req.category}
                    </span>
                    {req.is_fulfilled ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-[#16A34A] flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Fulfilled
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D2A5C]">
                        Active • {req.availability}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0D2A5C]">{req.job_sought}</h3>
                  <p className="text-xs font-semibold text-[#5B6B82] mt-1">
                    Candidate: {req.user.first_name ? `${req.user.first_name} ${req.user.last_name}` : req.user.username} • <span className="text-[#0D2A5C]">{req.preferred_location}</span>
                  </p>

                  <div className="bg-[#F4F7FB] p-3 rounded-xl my-3 text-xs text-[#24344D] leading-relaxed">
                    <p className="font-semibold text-[#0D2A5C] mb-1">Introduction:</p>
                    {req.personal_introduction}
                  </div>

                  <div className="space-y-1.5 text-xs text-[#5B6B82]">
                    <p><strong className="text-[#0D2A5C]">Skills:</strong> {req.skills}</p>
                    <p><strong className="text-[#0D2A5C]">Qualifications:</strong> {req.qualifications}</p>
                    {req.expected_salary && (
                      <p><strong className="text-[#0D2A5C]">Expected Pay:</strong> <span className="text-[#16A34A] font-semibold">{req.expected_salary}</span></p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#5B6B82]">
                    Type: <strong className="capitalize text-[#0D2A5C]">{req.employment_type.replace('_', ' ')}</strong>
                  </span>

                  <button
                    onClick={() => handleStartChat(req.user.id, req.job_sought)}
                    className="btn-secondary text-xs px-4 py-2 font-bold rounded-lg cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact Candidate</span>
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
