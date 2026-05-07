"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPosts() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name),
          categories:post_categories(
            category:categories(name)
          )
        `);

      // If contributor, only show their own posts
      if (profile?.role === 'contributor') {
        query = query.eq('author_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert("Error deleting post: " + error.message);
    } else {
      setPosts(posts.filter(p => p.id !== id));
      setActiveMenu(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-4xl font-bold text-brand-midnight">Posts</h1>
        <Link 
          href="/admin/posts/new"
          target="_blank"
          className="px-6 py-3 bg-brand-green text-brand-midnight text-sm font-bold rounded-xl hover:bg-brand-green/90 transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-midnight/40 italic">Loading your insights...</div>
      ) : posts.length === 0 ? (
        <div className="py-24 bg-white/50 rounded-3xl border border-brand-border border-dashed flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-brand-midnight">No posts yet</h2>
          <p className="text-brand-midnight/40 text-sm mt-1">Ready to share some buzz? Start your first post.</p>
          <Link href="/admin/posts/new" target="_blank" className="mt-8 text-sm font-bold text-brand-green hover:underline">Create Post →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white border border-brand-border p-4 rounded-2xl flex items-center gap-6 hover:border-brand-green/30 hover:shadow-sm transition-all group relative"
            >
              {/* Thumbnail */}
              <div className="w-32 h-20 rounded-lg overflow-hidden bg-brand-cream border border-brand-border shrink-0">
                {post.thumbnail_url ? (
                  <Image src={post.thumbnail_url} alt="" width={128} height={80} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-midnight/10">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-bold text-brand-midnight group-hover:text-brand-green transition-colors truncate">{post.title}</h3>
                <p className="text-sm text-brand-midnight/40 truncate max-w-xl">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${post.status === 'published' ? 'text-brand-green' : 'text-brand-midnight/40'}`}>
                    {post.status}
                  </span>
                  <span className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                  className="p-2 text-brand-midnight/40 hover:text-brand-midnight hover:bg-brand-cream rounded-full transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {activeMenu === post.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                    <div className="absolute right-0 top-10 w-40 bg-white border border-brand-border rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                      <Link 
                        href={`/admin/posts/${post.id}/edit`}
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-brand-midnight hover:bg-brand-cream transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

