"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )},
    { name: "Posts", href: "/admin/posts", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 fixed h-full bg-white border-r border-brand-border z-30">
        <div className="p-8">
          <Link href="/admin">
            <Image
              src="/gradbuzz.png"
              alt="GradBuzz"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? "bg-brand-green text-brand-midnight shadow-sm"
                    : "text-brand-midnight/60 hover:bg-brand-cream hover:text-brand-midnight"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-brand-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-brand-midnight/60 hover:text-brand-midnight hover:bg-brand-cream rounded-xl transition-all text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar / Drawer */}
      <div
        className={`fixed inset-0 bg-brand-midnight/20 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 flex justify-between items-center">
          <Image
            src="/gradbuzz.png"
            alt="GradBuzz"
            width={120}
            height={36}
            className="object-contain"
          />
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-midnight">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm ${
                  isActive ? "bg-brand-green text-brand-midnight" : "text-brand-midnight/60"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-transparent sticky top-0 z-20">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-brand-midnight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-brand-midnight/5 border border-brand-border flex items-center justify-center text-brand-midnight overflow-hidden cursor-pointer hover:border-brand-midnight/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 pt-4 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


