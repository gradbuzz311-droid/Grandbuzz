"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import { 
  ArrowRight, 
  Heart,
  Clock
} from "lucide-react";
import { getAvatarUrl, getThumbnailUrl } from "@/utils/helpers";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch recent posts
      const { data: recent } = await supabase
        .from('posts')
        .select(`
          id, title, slug, thumbnail_url, view_count, likes,
          author:profiles(full_name, avatar_url, role),
          categories:post_categories(category:categories(name))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      setRecentPosts(recent || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-brand-green/30 overflow-x-hidden">
      {/* Premium Navbar */}
      <nav className="h-24 px-8 flex items-center justify-between border-b border-brand-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="relative h-12 w-48">
          <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain" priority />
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="/posts" className="text-xs font-black uppercase tracking-[0.2em] text-brand-midnight/40 hover:text-brand-midnight transition-colors">Insights</Link>
        </div>
      </nav>

      <main>
        <HeroSection />

        {/* Recent Feed */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-black text-brand-midnight tracking-tight leading-[0.9] mb-4">
              Latest <br className="md:hidden"/>Intelligence.
            </h2>
            <p className="text-brand-midnight/40 font-medium max-w-md text-lg">
              Raw, unfiltered advice from the students who are currently navigating the grind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               Array(5).fill(0).map((_, i) => (
                 <div key={i} className="h-96 rounded-[32px] bg-brand-cream animate-pulse" />
               ))
            ) : (
              recentPosts.slice(0, 5).map((post) => {
                const isAuthorAdmin = post.author?.role === 'admin';
                const authorName = isAuthorAdmin ? "GradBuzz" : (post.author?.full_name || "GradBuzz Writer");
                const authorAvatar = isAuthorAdmin ? "/logo_nobg.png" : getAvatarUrl(post.author?.avatar_url);

                return (
                  <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col h-full bg-white rounded-[32px] border border-brand-border p-4 hover:shadow-2xl hover:shadow-brand-midnight/5 transition-all">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                      <Image 
                        src={getThumbnailUrl(post.thumbnail_url)} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        unoptimized={true}
                      />
                      <div className="absolute top-4 left-4">
                        {post.categories?.[0] && (
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-midnight text-[8px] font-black uppercase tracking-widest rounded-lg">
                            {post.categories[0].category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow px-2">
                      <h3 className="font-display text-2xl font-black text-brand-midnight mb-6 leading-tight group-hover:text-brand-green transition-colors tracking-tight">
                        {post.title}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden relative border border-brand-border bg-white">
                            <Image 
                              src={authorAvatar} 
                              alt={authorName} 
                              fill 
                              className="object-cover" 
                              unoptimized={true}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-brand-midnight/60">{authorName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-midnight/20">
                           <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span className="text-[10px] font-black">{post.likes || 0}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span className="text-[10px] font-black">5m</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link href="/posts" className="group flex items-center gap-4 px-10 py-5 bg-brand-midnight text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-midnight/20">
               Explore Full Archive
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      {/* Professional Multi-Column Footer */}
      <footer className="bg-white border-t border-brand-border pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link href="/" className="relative h-12 w-48 block">
                <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" />
              </Link>
              <p className="text-brand-midnight/50 font-medium text-lg max-w-sm leading-relaxed">
                The definitive intelligence platform for the modern student. Built by the grind, for the grind.
              </p>
              <div className="flex items-center gap-6 pt-4">
                 <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
                    Initiative by Sikshanext Private Limited
                 </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-brand-midnight uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Home</Link></li>
                <li><Link href="/posts" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Insights</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Contributors</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Mission</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-brand-midnight uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">Cookie Settings</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">
               © 2026 GradBuzz Platform. All Rights Reserved.
            </p>
            <div className="flex gap-8">
               <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">Designed in D.C.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
