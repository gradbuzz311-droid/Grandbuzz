"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Target, 
  Search, 
  Code, 
  AlertCircle,
  Bookmark,
  Users,
  LineChart
} from 'lucide-react';

const FloatingCard = ({ 
  children, 
  className = "", 
  delay = "0s", 
  rotation = "0deg" 
}: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: string, 
  rotation?: string 
}) => (
  <div 
    className={`absolute bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-brand-border/50 animate-float transition-all hover:scale-105 hover:z-50 ${className}`}
    style={{ 
      animationDelay: delay,
      transform: `rotate(${rotation})`
    }}
  >
    {children}
  </div>
);

const StoryCard = ({ 
  category, 
  title, 
  author, 
  role, 
  icon: Icon, 
  color,
  avatar
}: any) => (
  <div className="space-y-4 w-48 md:w-64">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-brand-midnight" />
    </div>
    <div className="space-y-1">
      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-green">{category}</p>
      <h3 className="text-sm md:text-lg font-black text-brand-midnight leading-tight line-clamp-2">
        {title}
      </h3>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-brand-border/30">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-cream border border-brand-border overflow-hidden relative">
           <Image src={avatar || "/logo_nobg.png"} alt={author} fill className="object-cover" unoptimized={true} />
        </div>
        <div>
          <p className="text-[8px] md:text-[10px] font-black text-brand-midnight">{author}</p>
          <p className="text-[6px] md:text-[8px] font-medium text-brand-midnight/40">{role}</p>
        </div>
      </div>
      <Bookmark size={14} className="text-brand-midnight/20" />
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-cream/30 px-6 py-20">
      {/* Background Connecting Lines (Static SVG) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <path 
            d="M 100 200 Q 300 100 500 300 T 900 200" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-brand-green"
            strokeDasharray="4 4"
          />
          <path 
            d="M 200 500 Q 500 400 800 600" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-brand-green"
            strokeDasharray="4 4"
          />
          <circle cx="100" cy="200" r="3" className="fill-brand-green" />
          <circle cx="500" cy="300" r="3" className="fill-brand-green" />
          <circle cx="900" cy="200" r="3" className="fill-brand-green" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-10 animate-fade-in-up">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black text-brand-midnight leading-[0.9] tracking-tight">
              Real insights. <br/>
              <span className="text-brand-green">Student to student.</span>
            </h1>
            <p className="text-brand-midnight/60 text-lg md:text-2xl font-medium max-w-lg leading-relaxed">
              Curated knowledge. Practical advice. Career clarity. Navigating the campus grind together.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/posts" className="group flex items-center gap-4 px-10 py-5 bg-brand-midnight text-white rounded-[24px] text-sm font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-midnight/20">
               Get Started
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mini Stats Card */}
          <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-brand-border w-fit shadow-xl shadow-brand-midnight/5">
             <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center">
                <LineChart size={24} className="text-brand-green" />
             </div>
             <div>
                <p className="text-lg font-black text-brand-midnight leading-none">12,540+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/30">Insights shared by students</p>
             </div>
          </div>
        </div>

        {/* Right Visual (Floating Network) */}
        <div className="relative h-[600px] hidden lg:block">
          
          {/* Main Story Cards */}
          <FloatingCard className="top-0 left-10" delay="0s" rotation="-2deg">
            <StoryCard 
              category="Internships"
              title="How I cracked my first internship at Google"
              author="Ananya P."
              role="Software Engineer"
              icon={Target}
              color="bg-brand-green/10"
            />
          </FloatingCard>

          <FloatingCard className="top-20 right-0" delay="1s" rotation="3deg">
            <StoryCard 
              category="Placements"
              title="What recruiters actually look for in a portfolio"
              author="Rohan S."
              role="Placement Mentor"
              icon={Search}
              color="bg-brand-accent/10"
            />
          </FloatingCard>

          <FloatingCard className="bottom-20 left-40" delay="0.5s" rotation="1deg">
            <StoryCard 
              category="Career Insights"
              title="Common mistakes students make in interviews"
              author="Kavya R."
              role="Career Coach"
              icon={AlertCircle}
              color="bg-brand-green/10"
            />
          </FloatingCard>

          <FloatingCard className="bottom-0 right-10" delay="1.5s" rotation="-1deg">
            <StoryCard 
              category="Projects"
              title="Building full-stack projects that stand out"
              author="Vikram M."
              role="Full Stack Developer"
              icon={Code}
              color="bg-brand-midnight/5"
            />
          </FloatingCard>

          {/* Mini Badge Card */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 p-4 bg-brand-midnight text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-float animate-delay-1000 z-20">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-brand-green" />
             </div>
             <div>
                <p className="text-sm font-black leading-none">Join 25K+</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">active learners</p>
             </div>
          </div>

          {/* Satisfaction Badge */}
          <div className="absolute top-1/3 right-[-40px] p-4 bg-white rounded-2xl border border-brand-border shadow-2xl flex flex-col items-center animate-float animate-delay-500">
             <p className="text-2xl font-black text-brand-green leading-none">98%</p>
             <p className="text-[8px] font-black uppercase tracking-widest text-brand-midnight/30">Found it helpful</p>
          </div>

        </div>

        {/* Mobile Visual (Simplified) */}
        <div className="lg:hidden grid grid-cols-1 gap-6 pt-10">
           <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-xl">
              <StoryCard 
                category="Trending"
                title="How I cracked my first internship at Google"
                author="Ananya P."
                role="Software Engineer"
                icon={Target}
                color="bg-brand-green/10"
              />
           </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-20px) rotate(var(--tw-rotate, 0deg)); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-1000 { animation-delay: 1s; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
