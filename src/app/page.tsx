"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Zap,
  Heart,
  Clock
} from "lucide-react";
import { getAvatarUrl, getThumbnailUrl } from "@/utils/helpers";

export default function Home() {
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    posts: 0,
    contributors: 0,
    readers: 0,
    reach: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch featured post
      const { data: featured } = await supabase
        .from('posts')
        .select(`
          id, title, slug, meta_description, thumbnail_url, created_at,
          author:profiles(full_name, avatar_url, role),
          categories:post_categories(category:categories(name))
        `)
        .eq('featured', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 2. Fetch recent posts
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

      // 3. Fetch Real Stats
      const [postsCount, contributorsCount, viewsSum] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'contributor'),
        supabase.from('posts').select('view_count').eq('status', 'published')
      ]);

      const totalViews = viewsSum.data?.reduce((acc, p) => acc + (p.view_count || 0), 0) || 0;

      setStats({
        posts: postsCount.count || 0,
        contributors: contributorsCount.count || 0,
        readers: totalViews > 1000 ? Math.floor(totalViews/1000) : totalViews,
        reach: (postsCount.count || 0) * 125 // Conservative reach estimation
      });

      setFeaturedPost(featured);
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
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-24 max-w-7xl mx-auto">
          {loading ? (
             <div className="h-[70vh] rounded-[40px] bg-brand-cream animate-pulse" />
          ) : featuredPost ? (
            (() => {
              const isAuthorAdmin = featuredPost.author?.role === 'admin';
              const authorName = isAuthorAdmin ? "GradBuzz" : (featuredPost.author?.full_name || "GradBuzz Writer");
              const authorAvatar = isAuthorAdmin ? "/logo_nobg.png" : getAvatarUrl(featuredPost.author?.avatar_url);

              return (
                <Link href={`/posts/${featuredPost.slug}`} className="group block relative rounded-[40px] overflow-hidden bg-brand-midnight h-[70vh] min-h-[500px]">
                  <Image 
                    src={getThumbnailUrl(featuredPost.thumbnail_url)} 
                    alt={featuredPost.title}
                    fill 
                    className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                    unoptimized={featuredPost.thumbnail_url?.startsWith('data:')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                    <div className="max-w-3xl space-y-6">
                      <div className="flex gap-2">
                        {featuredPost.categories?.map((c: any) => (
                          <span key={c.category.name} className="px-4 py-1.5 bg-brand-green text-brand-midnight text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {c.category.name}
                          </span>
                        ))}
                      </div>
                      <h1 className="font-display text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
                        {featuredPost.title}
                      </h1>
                      <p className="text-white/60 text-lg md:text-xl font-medium line-clamp-2 max-w-2xl leading-relaxed">
                        {featuredPost.meta_description}
                      </p>
                      <div className="flex items-center gap-4 pt-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-green relative shadow-xl shadow-brand-midnight/50 bg-white">
                          <Image 
                            src={authorAvatar} 
                            alt={authorName} 
                            fill 
                            className="object-cover" 
                            unoptimized={true}
                          />
                        </div>
                        <div>
                          <p className="text-white font-black text-sm">{authorName}</p>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Featured Insight</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()
          ) : null}
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-y border-brand-border py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Published Insights', value: `${stats.posts}+`, icon: BookOpen },
              { label: 'Active Contributors', value: `${stats.contributors}+`, icon: Users },
              { label: 'Student Readers', value: `${stats.readers}+`, icon: TrendingUp },
              { label: 'Weekly Reach', value: `${stats.reach}k+`, icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group">
                <stat.icon className="text-brand-green group-hover:scale-110 transition-transform" size={20} />
                <h3 className="text-3xl font-display font-black text-brand-midnight tracking-tight">{stat.value}</h3>
                <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-widest leading-none">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Feed */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="font-display text-5xl md:text-7xl font-black text-brand-midnight tracking-tight leading-[0.9] mb-4">
                Latest <br/>Intelligence.
              </h2>
              <p className="text-brand-midnight/40 font-medium max-w-md text-lg">
                Raw, unfiltered advice from the students who are currently navigating the grind.
              </p>
            </div>
            <Link href="/posts" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-midnight hover:text-brand-green transition-all">
               View All Stories
               <div className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all">
                  <ArrowRight size={16} />
               </div>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               Array(6).fill(0).map((_, i) => (
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
                        unoptimized={post.thumbnail_url?.startsWith('data:')}
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
            
            {!loading && recentPosts.length >= 5 && (
              <Link href="/posts" className="group flex flex-col items-center justify-center h-full bg-brand-midnight rounded-[32px] p-12 text-center hover:scale-[1.02] transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ArrowRight size={24} className="text-brand-midnight" />
                </div>
                <h3 className="font-display text-2xl font-black text-white mb-4">Load More Stories</h3>
                <p className="text-white/40 text-sm font-medium">Explore our full archive of student intelligence</p>
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Minimal Side-by-Side Footer */}
      <footer className="py-12 px-6 border-t border-brand-border bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="relative h-8 w-32 shrink-0">
              <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain" />
            </Link>
            <div className="hidden md:block w-px h-6 bg-brand-border" />
            <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
               By Sikshanext Private Limited
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Mission</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Contributors</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Cookies</Link>
          </div>

          <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">
             © 2026 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
