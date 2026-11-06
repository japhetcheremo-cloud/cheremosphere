import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Home, Briefcase, Plus, ShoppingBag, MessageSquare, User } from 'lucide-react';
import CreateModal from './CreateModal';

export default function MobileNav() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6EBF2] shadow-lg px-2 py-1.5 flex items-center justify-around">
        {/* Home */}
        <NextLink 
          href="/" 
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive('/') ? 'text-[#FF7A00]' : 'text-[#5B6B82]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NextLink>

        {/* Jobs */}
        <NextLink 
          href="/jobs" 
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive('/jobs') ? 'text-[#FF7A00]' : 'text-[#5B6B82]'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Jobs</span>
        </NextLink>

        {/* Central Create Floating Button */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex flex-col items-center -mt-5"
          aria-label="Create Action"
        >
          <div className="w-12 h-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg hover:bg-[#E66E00] active:scale-95 transition-transform border-4 border-white">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold text-[#FF7A00] mt-0.5">Create</span>
        </button>

        {/* Marketplace */}
        <NextLink 
          href="/marketplace" 
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive('/marketplace') ? 'text-[#FF7A00]' : 'text-[#5B6B82]'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Market</span>
        </NextLink>

        {/* Chat */}
        <NextLink 
          href="/chat" 
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive('/chat') ? 'text-[#FF7A00]' : 'text-[#5B6B82]'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Chat</span>
        </NextLink>

        {/* Profile */}
        <NextLink 
          href="/dashboard" 
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            isActive('/dashboard') ? 'text-[#FF7A00]' : 'text-[#5B6B82]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </NextLink>
      </div>

      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
