"use client";

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { label: 'College', description: 'Building the foundation' },
  { label: 'Skills', description: 'Deepening expertise' },
  { label: 'Projects', description: 'Real-world application' },
  { label: 'Internships', description: 'Professional exposure' },
  { label: 'Placements', description: 'Securing the future' },
  { label: 'Career', description: 'Continuous growth' },
];

export default function JourneySection() {
  return (
    <section className="py-32 px-6 bg-[#FDFCF8]">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-black text-brand-midnight leading-tight tracking-tight">
            Every student journey <br/> 
            <span className="text-brand-midnight/20 italic font-accent">looks</span> different.
          </h2>
        </div>

        {/* Desktop Roadmap */}
        <div className="hidden lg:block relative py-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-border z-0" />
          <div className="flex justify-between relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-border flex items-center justify-center mb-6 group-hover:border-brand-green group-hover:scale-110 transition-all shadow-xl shadow-brand-midnight/5 bg-[#FDFCF8]">
                   <div className="w-4 h-4 rounded-full bg-brand-border group-hover:bg-brand-green transition-colors" />
                </div>
                <h3 className="text-sm font-black text-brand-midnight uppercase tracking-widest mb-2">{step.label}</h3>
                <p className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest max-w-[100px] text-center">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Roadmap */}
        <div className="lg:hidden space-y-12 relative">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-brand-border z-0" />
          {steps.map((step, i) => (
            <motion.div 
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-8 relative z-10"
            >
              <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-border flex items-center justify-center shrink-0 shadow-lg">
                 <div className="w-3 h-3 rounded-full bg-brand-green" />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-black text-brand-midnight uppercase tracking-widest mb-1">{step.label}</h3>
                <p className="text-brand-midnight/40 text-sm font-medium">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
