"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Insights', href: '/posts' },
    { name: 'Contributors', href: '#' },
    { name: 'About', href: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-b border-brand-border py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="relative h-10 w-36 md:h-12 md:w-44 shrink-0">
          <Image 
            src="/gradbuzz.png" 
            alt="GradBuzz" 
            fill 
            className="object-contain object-left" 
            priority 
          />
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-midnight/40 hover:text-brand-midnight transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/posts" 
            className="px-6 py-3 bg-brand-midnight text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-midnight/10"
          >
            Explore Insights
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-midnight p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-brand-cream flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" onClick={() => setIsOpen(false)} className="relative h-10 w-36">
                <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-brand-midnight">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-display font-black text-brand-midnight"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/posts"
                onClick={() => setIsOpen(false)}
                className="mt-8 px-8 py-5 bg-brand-midnight text-white rounded-2xl text-sm font-black uppercase tracking-widest text-center"
              >
                Explore Insights
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
