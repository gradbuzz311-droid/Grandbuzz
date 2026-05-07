"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  BookOpen, 
  Trophy, 
  UserCheck 
} from 'lucide-react';

const ContributorCard = ({ title, description, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-brand-cream/50 p-8 rounded-[40px] border border-brand-border/50 hover:bg-white hover:border-brand-green/30 transition-all group"
  >
    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
      <Icon size={28} className="text-brand-midnight/40 group-hover:text-brand-green transition-colors" />
    </div>
    <h3 className="text-xl font-black text-brand-midnight mb-4">{title}</h3>
    <p className="text-brand-midnight/50 font-medium leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default function WhoWritesSection() {
  return (
    <section className="py-32 px-6 bg-[#FDFCF8]">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-black text-brand-midnight leading-tight tracking-tight">
            Built on real experiences, <br/> 
            <span className="text-brand-midnight/20 italic font-accent">not</span> recycled advice.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ContributorCard 
            title="Software Engineers"
            description="Sharing interview prep, technical projects, and career lessons from the industry."
            icon={Code2}
            delay={0.1}
          />
          <ContributorCard 
            title="Professors"
            description="Helping students understand academics, research, and long-term academic growth."
            icon={BookOpen}
            delay={0.2}
          />
          <ContributorCard 
            title="Placed Students"
            description="Explaining what actually worked during their placement season and interview rounds."
            icon={Trophy}
            delay={0.3}
          />
          <ContributorCard 
            title="Recruiters"
            description="Giving direct insight into hiring expectations and how to stand out as a candidate."
            icon={UserCheck}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
