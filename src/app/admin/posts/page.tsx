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

  const [userRole, setUserRole] = useState<string>("reader");

  useEffect(() => {
    async function fetchPosts() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile) setUserRole(profile.role);

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(full_name),
          categories:post_categories(
            category:categories(name)
          )
        `);

      if (profile?.role === 'contributor') {
        query = query.eq('author_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    if (userRole !== 'admin') return;
    const { error } = await supabase.from('posts').update({ featured: !currentStatus }).eq('id', id);
    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, featured: !currentStatus } : p));
    }
  };

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
        <div className="space-y-1">
          <h1 className="font-display text-4xl font-bold text-brand-midnight">Insights Manager</h1>
          <p className="text-sm text-brand-midnight/40 font-medium">Track performance and manage your content.</p>
        </div>
        <Link 
          href="/admin/posts/new"
          target="_blank"
          className="px-6 py-3 bg-brand-midnight text-white text-sm font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Insight
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-midnight/40 italic">Syncing with campus trenches...</div>
      ) : posts.length === 0 ? (
        <div className="py-24 bg-white/50 rounded-3xl border border-brand-border border-dashed flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-brand-midnight">No articles published</h2>
          <p className="text-brand-midnight/40 text-sm mt-1">Ready to start the buzz? Share your first student guide.</p>
          <Link href="/admin/posts/new" target="_blank" className="mt-8 text-sm font-bold text-brand-green hover:underline">Create Post →</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white border border-brand-border p-5 rounded-[24px] flex items-center gap-6 hover:border-brand-green/30 hover:shadow-xl hover:shadow-brand-midnight/5 transition-all group relative"
            >
              {/* Thumbnail */}
              <div className="w-32 h-24 rounded-2xl overflow-hidden bg-brand-cream border border-brand-border shrink-0 relative">
                {post.thumbnail_url ? (
                  <Image src={post.thumbnail_url} alt="" width={128} height={96} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-midnight/10">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg>
                  </div>
                )}
                {post.featured && (
                  <div className="absolute top-2 right-2 bg-brand-green text-brand-midnight p-1 rounded-lg shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-brand-midnight group-hover:text-brand-green transition-colors truncate">{post.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                    post.status === 'published' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' : 
                    post.status === 'pending' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                    'bg-brand-cream text-brand-midnight/40 border border-brand-border'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Performance Stats */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-brand-midnight/40 group-hover:text-brand-midnight transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-bold">{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-midnight/40 group-hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs font-bold">{post.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-midnight/40 group-hover:text-brand-green transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.24L3 21l1.174-4.823C3.447 14.758 3 12.83 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs font-bold">{post.comments || 0}</span>
                    </div>
                  </div>
                  
                  <div className="w-1 h-1 bg-brand-border rounded-full" />
                  
                  <span className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-[0.2em]">
                    {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {userRole === 'admin' && (
                  <button 
                    onClick={() => toggleFeatured(post.id, post.featured)}
                    className={`p-2.5 rounded-xl border transition-all ${post.featured ? 'bg-brand-green/20 border-brand-green text-brand-green' : 'bg-white border-brand-border text-brand-midnight/20 hover:border-brand-midnight/40 hover:text-brand-midnight'}`}
                    title={post.featured ? "Unfeature Post" : "Feature on Landing Page"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                    className="p-2.5 text-brand-midnight/40 hover:text-brand-midnight hover:bg-brand-cream border border-brand-border rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {activeMenu === post.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 top-12 w-48 bg-white border border-brand-border rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <Link 
                          href={`/admin/posts/${post.id}/edit`}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-midnight hover:bg-brand-cream transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Insight
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
      )}
    </div>
  );
}

