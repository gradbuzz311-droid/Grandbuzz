"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { 
  ChevronLeft, 
  Upload, 
  X, 
  Settings, 
  Eye, 
  Save, 
  Globe,
  Trash2
} from "lucide-react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      // Fetch categories
      const { data: cats } = await supabase.from('categories').select('id, name');
      if (cats) setAvailableCategories(cats);

      // Fetch post
      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories:post_categories(category_id)
        `)
        .eq('id', id)
        .single();

      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setStatus(post.status);
        setSlug(post.slug);
        setThumbnail(post.thumbnail_url);
        if (post.categories) {
          setSelectedCategories(post.categories.map((c: any) => c.category_id));
        }
      } else {
        alert("Post not found");
        router.push("/admin/posts");
      }
      setIsLoading(false);
    }
    fetchData();
  }, [supabase, id, router]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a title");
    setIsSaving(true);
    
    const { error: postError } = await supabase.from('posts').update({
      title,
      content,
      slug,
      status,
      thumbnail_url: thumbnail,
    }).eq('id', id);

    if (postError) {
      alert("Error updating post: " + postError.message);
    } else {
      // Update categories (delete then insert for simplicity)
      await supabase.from('post_categories').delete().eq('post_id', id);
      if (selectedCategories.length > 0) {
        const categoryLinks = selectedCategories.map(catId => ({
          post_id: id,
          category_id: catId
        }));
        await supabase.from('post_categories').insert(categoryLinks);
      }
      alert("Post updated successfully!");
    }
    
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post permanently?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      router.push("/admin/posts");
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  if (isLoading) return <div className="min-h-screen bg-brand-cream flex items-center justify-center italic text-brand-midnight/40">Loading post data...</div>;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      {/* Top Navigation / Header */}
      <header className="h-16 bg-white border-b border-brand-border sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 hover:bg-brand-cream rounded-full transition-all">
            <ChevronLeft size={20} />
          </Link>
          <span className="font-bold text-sm uppercase tracking-widest text-brand-midnight/40">Edit Post</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all mr-4"
            title="Delete Post"
          >
            <Trash2 size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-midnight/60 hover:text-brand-midnight transition-all">
            <Eye size={18} />
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-brand-green text-brand-midnight text-sm font-bold rounded-xl shadow-sm hover:bg-brand-green/90 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex lg:flex-row flex-col">
        {/* Main Editor Section */}
        <main className="flex-1 p-6 md:p-12 lg:p-20 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Title Section */}
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl md:text-5xl font-display font-bold border-none p-0 focus:ring-0 placeholder:text-brand-border/40 bg-transparent"
              />
              <textarea 
                placeholder="Brief subtitle or description..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                className="w-full text-xl font-sans text-brand-midnight/50 border-none p-0 focus:ring-0 placeholder:text-brand-border/40 bg-transparent resize-none italic"
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest block">Featured Image</label>
              <div className="relative group aspect-video w-full border-2 border-dashed border-brand-border rounded-3xl overflow-hidden bg-brand-cream/10 hover:bg-brand-cream/30 transition-all cursor-pointer">
                {thumbnail ? (
                  <div className="relative w-full h-full">
                    <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
                    <button 
                      onClick={() => setThumbnail(null)}
                      className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:text-red-500 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-brand-green" />
                    </div>
                    <p className="text-lg font-bold text-brand-midnight">Click to upload thumbnail</p>
                    <p className="text-sm text-brand-midnight/40 mt-1">Recommended: 1200 x 630 pixels</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest block">Main Content</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
        </main>

        {/* Sidebar Management Section */}
        <aside className="w-full lg:w-80 p-8 space-y-10 bg-brand-cream/30 border-l border-brand-border h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
          {/* Status Toggle */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest">
              <Settings size={14} />
              Visibility
            </label>
            <div className="flex bg-white p-1 rounded-xl border border-brand-border">
              <button 
                onClick={() => setStatus('draft')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'draft' ? 'bg-brand-midnight text-white shadow-sm' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
              >
                Draft
              </button>
              <button 
                onClick={() => setStatus('published')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'published' ? 'bg-brand-green text-brand-midnight shadow-sm' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
              >
                Publish
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`text-xs font-bold py-2 px-4 rounded-xl border transition-all ${
                    selectedCategories.includes(cat.id) 
                      ? 'bg-brand-midnight text-white border-brand-midnight' 
                      : 'bg-white border-brand-border text-brand-midnight/60 hover:border-brand-midnight hover:text-brand-midnight'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* SEO Details */}
          <div className="space-y-6 pt-6 border-t border-brand-border">
            <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block">SEO Optimization</label>
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest block">URL Slug</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-xs font-medium focus:border-brand-green outline-none transition-all"
                  placeholder="post-url-slug"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest block">Meta Description</span>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-brand-border rounded-xl py-3 px-4 text-xs font-medium focus:border-brand-green outline-none transition-all resize-none"
                  placeholder="How this post appears in search results..."
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
