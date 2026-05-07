"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Heart, MessageSquare, Bookmark, User as UserIcon, Clock } from "lucide-react";
import { getThumbnailUrl } from "@/utils/helpers";

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("liked");
  const [items, setItems] = useState<any[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
      
      const tab = searchParams.get("tab");
      if (tab && ["liked", "commented", "bookmarks"].includes(tab)) {
        setActiveTab(tab);
      }
    };
    checkUser();
  }, [supabase, router, searchParams]);

  useEffect(() => {
    if (!user) return;

    const fetchTabData = async () => {
      setItemsLoading(true);
      let data: any[] = [];

      try {
        if (activeTab === "liked") {
          const { data: likedData } = await supabase
            .from('post_interactions')
            .select('post:posts(id, slug, title, thumbnail_url, created_at, likes, author_id, author:profiles(full_name, avatar_url))')
            .eq('user_id', user.id)
            .eq('type', 'like')
            .limit(20);
          data = likedData?.map(item => item.post) || [];
        } else if (activeTab === "commented") {
          const { data: commentedData } = await supabase
            .from('post_comments')
            .select('post:posts(id, slug, title, thumbnail_url, created_at, likes, author_id, author:profiles(full_name, avatar_url))')
            .eq('user_id', user.id)
            .limit(40);
          // Unique posts only
          const uniquePosts = Array.from(new Set(commentedData?.map((item: any) => item.post?.id)))
            .filter(id => !!id)
            .map(id => commentedData?.find((item: any) => item.post?.id === id)?.post);
          data = uniquePosts || [];
        } else if (activeTab === "bookmarks") {
          const { data: bookmarkData } = await supabase
            .from('post_bookmarks')
            .select('post:posts(id, slug, title, thumbnail_url, created_at, likes, author_id, author:profiles(full_name, avatar_url))')
            .eq('user_id', user.id)
            .limit(20);
          data = bookmarkData?.map(item => item.post) || [];
        }
        setItems(data);
      } catch (err) {
        console.error("Error fetching tab data:", err);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab, user, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "liked", label: "Liked", icon: Heart },
    { id: "commented", label: "Commented", icon: MessageSquare },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-12">
        <header className="flex flex-col md:flex-row items-center gap-8 md:items-start text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-brand-midnight/5 border border-brand-border flex items-center justify-center shrink-0">
            <UserIcon size={48} className="text-brand-midnight/20" />
          </div>
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{user.user_metadata?.full_name || "Student Reader"}</h1>
              <p className="text-brand-midnight/40 font-medium">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white px-4 py-2 rounded-xl border border-brand-border">
                <p className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest mb-0.5">Member since</p>
                <p className="text-xs font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <div className="flex border-b border-brand-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                    activeTab === tab.id ? "text-brand-midnight" : "text-brand-midnight/30 hover:text-brand-midnight/60"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-midnight" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6">
            {itemsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-brand-border" />
              ))
            ) : items.length > 0 ? (
              items.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-brand-border hover:shadow-lg transition-all group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0">
                    <Image src={getThumbnailUrl(post.thumbnail_url)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <h3 className="font-bold text-brand-midnight group-hover:text-brand-green transition-colors line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-[11px] text-brand-midnight/40 font-medium">
                      <span className="flex items-center gap-1"><UserIcon size={12} /> {post.author?.full_name || "GradBuzz"}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-brand-midnight/5 rounded-full flex items-center justify-center mx-auto">
                  {activeTab === "liked" ? <Heart className="text-brand-midnight/20" /> : activeTab === "commented" ? <MessageSquare className="text-brand-midnight/20" /> : <Bookmark className="text-brand-midnight/20" />}
                </div>
                <p className="text-brand-midnight/40 text-sm font-medium">No {activeTab} posts yet.</p>
                <Link href="/posts" className="inline-block text-brand-green font-bold text-sm hover:underline">Explore Insights</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
