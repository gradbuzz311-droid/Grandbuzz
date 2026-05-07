"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  FileText, 
  Coffee, 
  Terminal, 
  GraduationCap 
} from 'lucide-react';

const TopicCard = ({ title, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-brand-border hover:border-brand-green/30 transition-all hover:shadow-2xl hover:shadow-brand-midnight/5 group">
    <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-brand-midnight/60 group-hover:text-brand-green transition-colors" />
    </div>
    <h3 className="text-sm font-black text-brand-midnight uppercase tracking-widest">{title}</h3>
  </div>
);

export default function WhySection() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="font-display text-4xl md:text-6xl font-black text-brand-midnight leading-tight tracking-tight">
            Most student advice <br className="hidden md:block"/> online is either <br className="hidden md:block"/> 
            <span className="text-brand-midnight/20 italic font-accent">outdated</span> or generic.
          </h2>
          <div className="space-y-6 max-w-lg">
            <p className="text-brand-midnight/60 text-lg md:text-xl font-medium leading-relaxed">
              GradBuzz is built to make practical knowledge easier to find. No generic tips—just real insights.
            </p>
            <p className="text-brand-midnight/40 text-base md:text-lg font-medium leading-relaxed">
              Instead of random tips, students get insights directly from people with real experience — engineers, professors, recruiters, and students who&apos;ve already gone through the process.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <TopicCard title="Placements" icon={Briefcase} />
          <TopicCard title="Internships" icon={Search} />
          <TopicCard title="Resume Reviews" icon={FileText} />
          <TopicCard title="Campus Life" icon={Coffee} />
          <TopicCard title="Coding Interviews" icon={Terminal} />
          <TopicCard title="Higher Studies" icon={GraduationCap} />
        </div>
      </div>
    </section>
  );
}
