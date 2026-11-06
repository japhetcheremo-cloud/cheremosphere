import React from 'react';
import NextLink from 'next/link';
import { Briefcase, UserCheck, ShoppingBag, Wrench, MessageSquarePlus, X } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  if (!isOpen) return null;

  const actions = [
    {
      title: 'Post a Job Vacancy',
      subtitle: 'Hire talent for full-time, part-time, or contract roles',
      href: '/jobs/post',
      icon: Briefcase,
      color: 'bg-blue-50 text-[#0D2A5C] border-blue-200',
      badge: 'For Employers & Recruiters'
    },
    {
      title: 'Ask for a Job',
      subtitle: 'Broadcast what job you are seeking so employers find you',
      href: '/ask-for-a-job/post',
      icon: UserCheck,
      color: 'bg-orange-50 text-[#FF7A00] border-orange-200',
      badge: 'For Job Seekers'
    },
    {
      title: 'Sell a Product',
      subtitle: 'List electronics, fashion, food, agriculture, or gear',
      href: '/marketplace/sell',
      icon: ShoppingBag,
      color: 'bg-green-50 text-[#16A34A] border-green-200',
      badge: 'For Sellers & Businesses'
    },
    {
      title: 'Advertise a Service',
      subtitle: 'Offer freelance design, development, plumbing, or tutoring',
      href: '/freelance/post',
      icon: Wrench,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'For Freelancers & Pros'
    },
    {
      title: 'Publish a Professional Update',
      subtitle: 'Share achievements, announcements, or business updates',
      href: '/network',
      icon: MessageSquarePlus,
      color: 'bg-slate-50 text-[#24344D] border-slate-200',
      badge: 'For All Members'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D2A5C] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Create & Publish on CheremoSphere</h3>
            <p className="text-xs text-blue-200 mt-0.5">What would you like to share or announce today?</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-6 space-y-3 max-h-[80vh] overflow-y-auto">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <NextLink
                key={idx}
                href={act.href}
                onClick={onClose}
                className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#FF7A00] hover:bg-[#FFF1E5]/40 transition-all hover:shadow-sm"
              >
                <div className={`p-3 rounded-xl border ${act.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors">
                      {act.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#5B6B82] bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B82] mt-1 line-clamp-1">{act.subtitle}</p>
                </div>
              </NextLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F4F7FB] border-t border-[#E6EBF2] text-center">
          <p className="text-xs text-[#5B6B82]">
            All posts connect instantly to the CheremoSphere national & international directory.
          </p>
        </div>
      </div>
    </div>
  );
}
