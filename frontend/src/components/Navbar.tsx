import React, { useState, useEffect } from 'react';
import Link from 'next/router';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { 
  Briefcase, ShoppingBag, Users, MessageSquare, 
  Bell, PlusCircle, User, LogOut, Menu, X, ChevronDown, CheckCircle
} from 'lucide-react';
import { getToken, getStoredUser, removeToken, removeStoredUser, User as UserType } from '@/lib/api';
import CreateModal from './CreateModal';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, [router.pathname]);

  const handleLogout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
    router.push('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && router.pathname === '/') return true;
    if (path !== '/' && router.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E6EBF2] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <NextLink href="/" className="flex items-center gap-2 group">
                <img 
                  src="/logo-horizontal.svg" 
                  alt="CheremoSphere Logo" 
                  className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102" 
                />
              </NextLink>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NextLink 
                href="/" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Home
              </NextLink>

              <NextLink 
                href="/jobs" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/jobs') && !router.pathname.includes('/post') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Jobs
              </NextLink>

              <NextLink 
                href="/ask-for-a-job" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/ask-for-a-job') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Ask for a Job
              </NextLink>

              <NextLink 
                href="/freelance" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/freelance') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Services
              </NextLink>

              <NextLink 
                href="/marketplace" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/marketplace') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Marketplace
              </NextLink>

              <NextLink 
                href="/network" 
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/network') ? 'text-[#FF7A00] bg-[#FFF1E5]' : 'text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100'
                }`}
              >
                Network
              </NextLink>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Central Create Button */}
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#FF7A00] hover:bg-[#E66E00] text-white text-sm font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <NextLink 
                    href="/chat" 
                    className="p-2 text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100 rounded-lg relative"
                    title="Messages"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </NextLink>

                  <NextLink 
                    href="/notifications" 
                    className="p-2 text-[#24344D] hover:text-[#0D2A5C] hover:bg-gray-100 rounded-lg relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </NextLink>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-200 hover:border-[#0D2A5C] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.first_name ? user.first_name[0] : user.username[0]}
                      </div>
                      <span className="text-sm font-semibold text-[#0D2A5C] max-w-[100px] truncate">
                        {user.first_name || user.username}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold text-[#0D2A5C] truncate">{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          {user.is_verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] mt-1">
                              <CheckCircle className="w-3 h-3" /> Verified Member
                            </span>
                          )}
                        </div>

                        <NextLink 
                          href="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#24344D] hover:bg-gray-50 hover:text-[#FF7A00]"
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </NextLink>

                        <NextLink 
                          href="/contact" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#24344D] hover:bg-gray-50"
                        >
                          Official Office & Help
                        </NextLink>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button 
                          onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 text-left font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NextLink 
                    href="/login" 
                    className="text-sm font-semibold text-[#0D2A5C] px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Log In
                  </NextLink>
                  <NextLink 
                    href="/register" 
                    className="text-sm font-semibold text-white bg-[#0D2A5C] hover:bg-[#071836] px-4 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    Register Free
                  </NextLink>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-[#FF7A00] text-white p-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-[#0D2A5C] hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-2">
            <NextLink 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Home
            </NextLink>
            <NextLink 
              href="/jobs" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Find Jobs
            </NextLink>
            <NextLink 
              href="/ask-for-a-job" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Ask for a Job (Reverse Job Search)
            </NextLink>
            <NextLink 
              href="/freelance" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Freelance & Professional Services
            </NextLink>
            <NextLink 
              href="/marketplace" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Marketplace & Businesses
            </NextLink>
            <NextLink 
              href="/network" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-[#24344D] hover:bg-gray-50"
            >
              Professional Network Feed
            </NextLink>

            <div className="border-t border-gray-100 pt-3">
              {user ? (
                <div className="space-y-2">
                  <NextLink 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-bold text-[#0D2A5C] bg-[#F4F7FB]"
                  >
                    User Dashboard ({user.username})
                  </NextLink>
                  <NextLink 
                    href="/chat" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base text-[#24344D]"
                  >
                    Private Messages
                  </NextLink>
                  <NextLink 
                    href="/notifications" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base text-[#24344D]"
                  >
                    Notifications
                  </NextLink>
                  <button 
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="block w-full text-left px-3 py-2 text-base font-semibold text-[#DC2626]"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <NextLink 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg border border-[#0D2A5C] text-[#0D2A5C] font-semibold text-sm"
                  >
                    Log In
                  </NextLink>
                  <NextLink 
                    href="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center py-2.5 rounded-lg bg-[#0D2A5C] text-white font-semibold text-sm"
                  >
                    Register
                  </NextLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating / Interactive Create Action Modal */}
      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
