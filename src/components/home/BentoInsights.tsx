"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { getThumbnailUrl } from "@/utils/helpers";

const InsightCard = ({ post, className = "", large = false }: any) => (
  <Link 
    href={`/posts/${post.slug}`}
    className={`group relative overflow-hidden rounded-[32px] border border-brand-border bg-white p-4 flex flex-col hover:shadow-2xl hover:shadow-brand-midnight/5 transition-all ${className}`}
  >
    <div className={`relative rounded-2xl overflow-hidden mb-6 ${large ? 'aspect-[21/10]' : 'aspect-[16/10]'}`}>
      <Image 
        src={getThumbnailUrl(post.thumbnail_url)} 
        alt={post.title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        unoptimized={true}
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-midnight text-[8px] font-black uppercase tracking-widest rounded-lg">
          {post.categories?.[0]?.category?.name || "Insight"}
        </span>
      </div>
    </div>
    
    <div className="flex flex-col flex-grow px-2">
      <h3 className={`${large ? 'text-2xl md:text-4xl' : 'text-xl'} font-black text-brand-midnight mb-4 leading-tight group-hover:text-brand-green transition-colors tracking-tight`}>
        {post.title}
      </h3>
      {large && (
        <p className="text-brand-midnight/50 font-medium line-clamp-2 mb-6 max-w-2xl">
          {post.meta_description}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-border/50">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-brand-midnight/20" />
          <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">5 Mins Read</span>
        </div>
        <ArrowRight size={16} className="text-brand-midnight/20 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </Link>
);

export default function BentoInsights({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null;

  const featured = posts[0];
  const sidePosts = posts.slice(1, 3);
  const bottomPosts = posts.slice(3, 5);

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="font-display text-4xl md:text-7xl font-black text-brand-midnight leading-[0.9] tracking-tight">
            Featured <br/> <span className="text-brand-green">Insights.</span>
          </h2>
          <Link href="/posts" className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-midnight/40 hover:text-brand-midnight border-b border-brand-midnight/10 pb-1">
            View full archive
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Featured Card */}
          <div className="lg:col-span-8">
            <InsightCard post={featured} large={true} />
          </div>

          {/* Side Stacked Cards */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {sidePosts.map((post) => (
              <InsightCard key={post.id} post={post} className="flex-1" />
            ))}
          </div>

          {/* Bottom Smaller Cards */}
          {bottomPosts.map((post) => (
            <div key={post.id} className="lg:col-span-6">
              <InsightCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
