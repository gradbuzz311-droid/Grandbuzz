"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ContributorCTA() {
  return (
    <section className="py-40 px-6 bg-brand-midnight relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-display text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tight">
            Want to share <br/> something <span className="text-brand-green">useful?</span>
          </h2>
          <p className="text-white/40 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            We’re inviting professionals, professors, and experienced students to contribute practical insights that genuinely help others grow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            href="#" 
            className="inline-flex items-center gap-4 px-12 py-6 bg-brand-green text-brand-midnight rounded-[24px] text-sm font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-green/20"
          >
            Apply as Contributor
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
