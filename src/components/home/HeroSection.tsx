"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Bookmark,
  Users,
  LineChart,
  Target,
  Search,
  Code,
  AlertCircle
} from 'lucide-react';

const Card = ({ children, className = "", delay = 0, rotate = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate }}
    animate={{ 
      opacity: 1, 
      y: [0, -15, 0],
      rotate
    }}
    transition={{ 
      opacity: { duration: 0.8, delay },
      y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: 0 }
    }}
    className={`absolute bg-white rounded-2xl shadow-[0_20px_50px_rgba(13,27,42,0.1)] p-5 border border-brand-border/50 group hover:z-50 transition-shadow hover:shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const StorySnippet = ({ category, title, icon: Icon, color }: any) => (
  <div className="w-52 md:w-60 space-y-4">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={16} className="text-brand-midnight" />
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-brand-green">{category}</p>
      <h3 className="text-sm font-black text-brand-midnight leading-tight">
        {title}
      </h3>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-brand-border/30">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-brand-cream border border-brand-border" />
        <div className="w-10 h-2 bg-brand-cream rounded-full" />
      </div>
      <Bookmark size={12} className="text-brand-midnight/20" />
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-32 px-6 overflow-hidden bg-brand-cream/30">
      {/* Background Dots */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0D1B2A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="space-y-8">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-green"
            >
              Curated student insights
            </motion.p>
            <h1 className="font-display text-5xl md:text-8xl font-black text-brand-midnight leading-[0.9] tracking-tight">
              Real insights <br/> for students <br/>
              <span className="text-brand-midnight/20 italic font-accent lowercase">building</span> <br className="hidden md:block"/>
              their future.
            </h1>
            <p className="text-brand-midnight/60 text-lg md:text-2xl font-medium max-w-lg leading-relaxed font-sans">
              GradBuzz brings together developers, professors, recruiters, and students to share practical advice that actually helps.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <Link 
              href="/posts" 
              className="px-10 py-5 bg-brand-midnight text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-midnight/20"
            >
              Explore Insights
            </Link>
            <Link 
              href="#" 
              className="px-10 py-5 border-2 border-brand-midnight/10 text-brand-midnight rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-midnight hover:text-white transition-all"
            >
              Become a Contributor
            </Link>
          </div>
        </motion.div>

        {/* Right Visual (Motion Cards) */}
        <div className="relative h-[600px] hidden lg:block">
          <Card className="top-0 left-10" delay={0} rotate={-2}>
            <StorySnippet 
              category="Internships"
              title="How I cracked my first internship at Google"
              icon={Target}
              color="bg-brand-green/10"
            />
          </Card>

          <Card className="top-32 right-10" delay={1.5} rotate={3}>
            <StorySnippet 
              category="Placements"
              title="What recruiters actually look for in a portfolio"
              icon={Search}
              color="bg-brand-accent/10"
            />
          </Card>

          <Card className="bottom-20 left-40" delay={0.8} rotate={1}>
            <StorySnippet 
              category="Career Insights"
              title="Common mistakes students make in interviews"
              icon={AlertCircle}
              color="bg-brand-green/10"
            />
          </Card>

          <Card className="bottom-0 right-20" delay={2} rotate={-1}>
            <StorySnippet 
              category="Projects"
              title="Building full-stack projects that stand out"
              icon={Code}
              color="bg-brand-midnight/5"
            />
          </Card>

          {/* Stats Badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 -translate-y-1/2 p-4 bg-brand-midnight text-white rounded-2xl shadow-2xl flex items-center gap-4 z-20"
          >
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-brand-green" />
             </div>
             <div>
                <p className="text-sm font-black leading-none">Global Network</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Connecting Students</p>
             </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 right-[-20px] p-4 bg-white rounded-2xl border border-brand-border shadow-2xl flex flex-col items-center"
          >
             <p className="text-2xl font-black text-brand-green leading-none">98%</p>
             <p className="text-[9px] font-black uppercase tracking-widest text-brand-midnight/30">Success Rate</p>
          </motion.div>
        </div>

        {/* Mobile Visual (Static Cluster) */}
        <div className="lg:hidden grid grid-cols-1 gap-6 pt-10">
           <div className="bg-white p-6 rounded-[32px] border border-brand-border shadow-xl">
              <StorySnippet 
                category="Internships"
                title="How I cracked my first internship at Google"
                icon={Target}
                color="bg-brand-green/10"
              />
           </div>
        </div>

      </div>
    </section>
  );
}
