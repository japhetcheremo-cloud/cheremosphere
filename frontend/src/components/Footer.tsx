import React from 'react';
import NextLink from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D2A5C] text-white pt-16 pb-12 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-900/60">
          
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-2 space-y-4">
            <NextLink href="/" className="inline-block">
              <img 
                src="/logo-horizontal-dark.svg" 
                alt="CheremoSphere Wordmark" 
                className="h-11 w-auto object-contain"
              />
            </NextLink>

            <p className="text-[#E6EBF2] text-sm leading-relaxed max-w-sm">
              Your skills. Your opportunities. All in one place.
              <br />
              <strong className="text-[#FF7A00] font-semibold">Jobs. Connect. Market. Grow.</strong>
            </p>

            <p className="text-xs text-blue-200/80 leading-relaxed max-w-sm">
              An all-in-one digital ecosystem connecting job seekers, employers, recruiters, freelancers, service providers, businesses, and sellers across Kenya and internationally.
            </p>

            {/* Quick WhatsApp Action Pill */}
            <div className="pt-2">
              <a 
                href="https://wa.me/254719678760" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp: 0719678760</span>
              </a>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#FF7A00] tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-sm text-[#E6EBF2]">
              <li>
                <NextLink href="/jobs" className="hover:text-[#FF7A00] transition-colors">
                  Find Job Vacancies
                </NextLink>
              </li>
              <li>
                <NextLink href="/jobs/post" className="hover:text-[#FF7A00] transition-colors">
                  Post a Job (Employers)
                </NextLink>
              </li>
              <li>
                <NextLink href="/ask-for-a-job" className="hover:text-[#FF7A00] transition-colors">
                  Ask for a Job (Reverse Board)
                </NextLink>
              </li>
              <li>
                <NextLink href="/freelance" className="hover:text-[#FF7A00] transition-colors">
                  Freelance & Pro Services
                </NextLink>
              </li>
              <li>
                <NextLink href="/marketplace" className="hover:text-[#FF7A00] transition-colors">
                  Marketplace Products
                </NextLink>
              </li>
              <li>
                <NextLink href="/network" className="hover:text-[#FF7A00] transition-colors">
                  Professional Network
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#FF7A00] tracking-wider uppercase">Company & Trust</h4>
            <ul className="space-y-2 text-sm text-[#E6EBF2]">
              <li>
                <NextLink href="/about" className="hover:text-[#FF7A00] transition-colors">
                  About CheremoSphere
                </NextLink>
              </li>
              <li>
                <NextLink href="/contact" className="hover:text-[#FF7A00] transition-colors">
                  Contact Office
                </NextLink>
              </li>
              <li>
                <NextLink href="/help" className="hover:text-[#FF7A00] transition-colors">
                  Help Centre & FAQs
                </NextLink>
              </li>
              <li>
                <NextLink href="/privacy" className="hover:text-[#FF7A00] transition-colors">
                  Privacy Policy
                </NextLink>
              </li>
              <li>
                <NextLink href="/terms" className="hover:text-[#FF7A00] transition-colors">
                  Terms and Conditions
                </NextLink>
              </li>
              <li>
                <a 
                  href="http://localhost:8000/admin/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Admin Dashboard</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Official Contact Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#FF7A00] tracking-wider uppercase">Official Details</h4>
            <div className="space-y-2.5 text-xs text-[#E6EBF2]">
              <p className="font-semibold text-white">Owner: Japhet Cheremo</p>
              
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                <span>Cheremo Plaza, Nairobi Mombasa Road, Kenya.</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <a href="tel:+254719678760" className="hover:text-[#FF7A00] transition-colors">
                  +254 719 678 760 / 0719678760
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <a href="mailto:japhetcheremo@gmai.com" className="hover:text-[#FF7A00] transition-colors break-all">
                  japhetcheremo@gmai.com
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-2 flex items-center gap-3">
                <a 
                  href="https://www.facebook.com/profile.php?id=61564247063691" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-950 hover:bg-[#FF7A00] text-white transition-colors"
                  title="Official Facebook Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a 
                  href="https://github.com/japhetcheremo-cloud/cheremosphere" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-950 hover:bg-[#FF7A00] text-white transition-colors"
                  title="Official GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/80 gap-4">
          <p>© {new Date().getFullYear()} CheremoSphere. All rights reserved. Founded by Japhet Cheremo.</p>
          <p className="flex items-center gap-4">
            <NextLink href="/privacy" className="hover:text-white transition-colors">Privacy</NextLink>
            <span>•</span>
            <NextLink href="/terms" className="hover:text-white transition-colors">Terms of Service</NextLink>
            <span>•</span>
            <span>Nairobi, Kenya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
