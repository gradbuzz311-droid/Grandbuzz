"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft,
  Heart,
  Clock,
  Filter
} from "lucide-react";
import { getAvatarUrl, getThumbnailUrl } from "@/utils/helpers";

export default function PostsFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name, avatar_url),
          categories:post_categories(category:categories(name))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      {/* Navigation */}
      <nav className="h-20 bg-white border-b border-brand-border sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">
          <ArrowLeft size={16} />
          Back Home
        </Link>
        <Link href="/" className="relative h-8 w-32">
          <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain" />
        </Link>
        <div className="w-24" /> {/* Spacer */}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16">
           <h1 className="font-display text-5xl md:text-8xl font-black text-brand-midnight tracking-tight leading-none mb-6">
             The Feed.
           </h1>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-brand-midnight/40 font-medium max-w-xl text-lg">
                The full archive of GradBuzz intelligence. Filtered by passion, backed by experience.
              </p>
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-border rounded-xl text-xs font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-all">
                    <Filter size={14} />
                    Filter
                 </button>
              </div>
           </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
               <div key={i} className="h-96 rounded-[32px] bg-brand-cream animate-pulse" />
             ))
          ) : posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col h-full bg-white rounded-[32px] border border-brand-border p-5 hover:shadow-2xl hover:shadow-brand-midnight/5 transition-all">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
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
              
              <div className="flex flex-col flex-grow">
                <h3 className="font-display text-2xl font-black text-brand-midnight mb-6 leading-tight group-hover:text-brand-green transition-colors tracking-tight">
                  {post.title}
                </h3>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-brand-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-brand-border">
                      <Image 
                        src={getAvatarUrl(post.author?.avatar_url)} 
                        alt="Author" 
                        fill 
                        className="object-cover" 
                        unoptimized={post.author?.avatar_url?.startsWith('data:')}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-brand-midnight/60">{post.author?.full_name || "GradBuzz Writer"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-brand-midnight/20">
                     <div className="flex items-center gap-1.5">
                        <Heart size={14} />
                        <span className="text-[10px] font-black">{post.likes || 0}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span className="text-[10px] font-black">5m</span>
                     </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Simplified Footer for Feed */}
      <footer className="py-20 px-6 border-t border-brand-border bg-white text-center">
         <Link href="/" className="relative h-10 w-32 block mx-auto mb-8">
           <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain" />
         </Link>
         <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em] mb-1">
            © 2026 GradBuzz. All Rights Reserved.
         </p>
         <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">
            Initiative by Sikshanext Private Limited.
         </p>
      </footer>
    </div>
  );
}
