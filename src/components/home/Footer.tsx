"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="relative h-12 w-48 block">
              <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" />
            </Link>
            <p className="text-brand-midnight/50 font-medium text-xl max-w-sm leading-relaxed font-sans">
              Where student ambition meets real advice. The definitive intelligence platform for the modern student.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
                  Initiative by Sikshanext Private Limited
               </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-brand-midnight uppercase tracking-[0.3em]">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/posts" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Insights Feed</Link></li>
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Become a Contributor</Link></li>
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Our Mission</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-brand-midnight uppercase tracking-[0.3em]">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.2em]">
             © 2026 GradBuzz Intelligence Network. All Rights Reserved.
          </p>
          <div className="flex gap-8">
             <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">Crafted for the modern grind</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
