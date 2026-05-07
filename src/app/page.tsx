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
          author:profiles(full_name, avatar_url),
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
          author:profiles(full_name, avatar_url),
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
          <Link href="/contributor" className="text-xs font-black uppercase tracking-[0.2em] text-brand-midnight/40 hover:text-brand-midnight transition-colors">Contributors</Link>
          <Link href="#" className="text-xs font-black uppercase tracking-[0.2em] text-brand-midnight/40 hover:text-brand-midnight transition-colors">About</Link>
          <Link href="/login" className="px-8 py-3 bg-brand-midnight text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-midnight/10">
            Sign In
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-24 max-w-7xl mx-auto">
          {loading ? (
             <div className="h-[70vh] rounded-[40px] bg-brand-cream animate-pulse" />
          ) : featuredPost ? (
            <Link href={`/posts/${featuredPost.slug}`} className="group block relative rounded-[40px] overflow-hidden bg-brand-midnight h-[70vh] min-h-[500px]">
              <Image 
                src={getThumbnailUrl(featuredPost.thumbnail_url)} 
                alt={featuredPost.title}
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
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
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-green relative shadow-xl shadow-brand-midnight/50">
                      <Image src={getAvatarUrl(featuredPost.author?.avatar_url)} alt="Author" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">{featuredPost.author?.full_name}</p>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Featured Insight</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-y border-brand-border py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Published Insights', value: `${stats.posts}+`, icon: BookOpen },
              { label: 'Active Contributors', value: `${stats.contributors}+`, icon: Users },
              { label: 'Student Readers', value: `${stats.readers}k+`, icon: TrendingUp },
              { label: 'Weekly Reach', value: `${stats.reach}+`, icon: Zap },
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
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <h2 className="font-display text-5xl md:text-7xl font-black text-brand-midnight tracking-tight leading-[0.9] mb-4">
                Latest <br/>Intelligence.
              </h2>
              <p className="text-brand-midnight/40 font-medium max-w-md text-lg">
                Raw, unfiltered advice from the students who are currently navigating the grind.
              </p>
            </div>
            {/* Removed Redundant Link Here */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               Array(6).fill(0).map((_, i) => (
                 <div key={i} className="h-96 rounded-[32px] bg-brand-cream animate-pulse" />
               ))
            ) : recentPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col h-full bg-white rounded-[32px] border border-brand-border p-4 hover:shadow-2xl hover:shadow-brand-midnight/5 transition-all">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <Image 
                    src={getThumbnailUrl(post.thumbnail_url)} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
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
                      <div className="w-8 h-8 rounded-full overflow-hidden relative border border-brand-border bg-brand-cream">
                        <Image src={getAvatarUrl(post.author?.avatar_url)} alt="Author" fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-midnight/60">{post.author?.full_name || "GradBuzz Writer"}</span>
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
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Link href="/posts" className="inline-flex items-center gap-3 px-10 py-5 bg-brand-midnight text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-midnight/10">
              Load More Stories
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Main Footer - Premium White Style */}
      <footer className="bg-white border-t border-brand-border pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <Link href="/" className="relative h-12 w-48 block">
                <Image src="/gradbuzz.png" alt="GradBuzz Logo" fill className="object-contain" />
              </Link>
              <p className="text-brand-midnight/40 text-sm font-medium leading-relaxed max-w-xs">
                Empowering the next generation of graduates with real-world intelligence and professional clarity.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black text-brand-midnight uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/posts" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">All Insights</Link></li>
                <li><Link href="/contributor" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Our Contributors</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Our Mission</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-brand-midnight uppercase tracking-[0.2em] mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">About Sikshanext</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-brand-midnight uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-green transition-colors">Cookie Settings</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
                © 2026 GradBuzz. All Rights Reserved.
              </p>
              <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">
                An initiative by Sikshanext Private Limited.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-midnight/40 hover:bg-brand-midnight hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-midnight/40 hover:bg-brand-midnight hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
