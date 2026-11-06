import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = "CheremoSphere — Your skills. Your opportunities. All in one place.",
  description = "CheremoSphere connects job seekers, employers, recruiters, freelancers, professional service providers, business owners, product sellers, and customers across Kenya and Africa."
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#24344D]">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
