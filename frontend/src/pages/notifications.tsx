import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Bell, Check, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, NotificationItem } from '@/lib/api';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await apiFetch<{ results?: NotificationItem[] } | NotificationItem[]>('/notifications/');
      setNotifications(Array.isArray(res) ? res : (res.results || []));
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push('/login?redirect=/notifications');
      return;
    }
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/notifications/read-all/', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read/`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, is_read: true }) : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Notifications — CheremoSphere">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E6EBF2]">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D2A5C]">Notifications</h1>
            <p className="text-xs text-[#5B6B82] mt-0.5">Stay updated on job applications, messages, and inquiries.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#5B6B82]">Loading your notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center space-y-2">
            <Bell className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="text-base font-bold text-[#0D2A5C]">No notifications yet</h3>
            <p className="text-xs text-[#5B6B82]">You will receive updates when someone applies to your jobs or contacts you.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.is_read ? 'bg-white border-[#E6EBF2] opacity-80' : 'bg-orange-50/40 border-[#FF7A00]/40 shadow-xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0D2A5C]">{n.title}</h4>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                    )}
                  </div>
                  <p className="text-xs text-[#24344D]">{n.message}</p>
                  <p className="text-[10px] text-[#5B6B82]">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                {n.action_url && (
                  <NextLink
                    href={n.action_url}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-[#0D2A5C] hover:text-white text-[#0D2A5C] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </NextLink>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
