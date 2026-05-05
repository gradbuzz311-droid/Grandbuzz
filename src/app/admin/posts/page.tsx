"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name),
          categories:post_categories(
            category:categories(name)
          )
        `)
        .order('created_at', { ascending: false });

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
    }
  };

  return (
    <div className="flex-grow p-6 md:p-10 max-w-[1120px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-brand-midnight">Manage Posts</h1>
          <p className="text-brand-midnight/50 font-medium italic">Your editorial archive and active insights.</p>
        </div>
        <Link 
          href="/admin/posts/new"
          className="px-6 py-4 bg-brand-midnight text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-midnight/90 transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center italic text-brand-midnight/40">Loading insights...</div>
      ) : posts.length === 0 ? (
        <div className="py-24 bg-white rounded-3xl border border-brand-border border-dashed flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <h2 className="font-display text-xl font-bold text-brand-midnight">No posts found</h2>
          <p className="text-brand-midnight/40 text-sm mt-1">Start writing your first insight to see it here.</p>
          <Link href="/admin/posts/new" className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-green hover:underline">Write Now →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-cream/30 border-b border-brand-border">
                <th className="px-6 py-4 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-brand-border/50 hover:bg-brand-cream/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {post.thumbnail_url && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border shrink-0">
                          <Image src={post.thumbnail_url} alt="" width={40} height={40} className="object-cover h-full" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-brand-midnight text-sm leading-snug group-hover:text-brand-green transition-colors">{post.title}</p>
                        <p className="text-[10px] text-brand-midnight/40 font-medium italic">By {post.author?.full_name || 'Admin'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {post.categories?.map((c: any, i: number) => (
                        <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-brand-midnight/60">{c.category.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      post.status === 'published' 
                        ? 'bg-brand-green/10 text-brand-green border-brand-green/20' 
                        : 'bg-brand-midnight/5 text-brand-midnight/40 border-brand-midnight/10'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/posts/${post.slug}`} target="_blank" className="text-[10px] font-bold text-brand-midnight/60 hover:text-brand-green uppercase tracking-widest transition-colors">View</Link>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-[10px] font-bold text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
