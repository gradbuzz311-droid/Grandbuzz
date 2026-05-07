"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Clock
} from "lucide-react";

export default function NewPostPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [userRole, setUserRole] = useState<string>("reader");

  // Fetch user role
  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data) setUserRole(data.role);
      }
    }
    fetchUserRole();
  }, [supabase]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setAvailableCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  // Auto-generate slug
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCategory = async (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (!newCategoryName.trim()) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ 
        name: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      })
      .select()
      .single();

    if (data) {
      setAvailableCategories([...availableCategories, data]);
      setSelectedCategories([...selectedCategories, data.id]);
      setNewCategoryName("");
    } else if (error) {
      alert("Error creating category: " + error.message);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a title");
    setIsSaving(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("You must be logged in to save");

      let finalThumbnailUrl = thumbnail;

      // Upload image to storage if a new file was selected
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, thumbnailFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        
        finalThumbnailUrl = publicUrl;
      }

      const { data: post, error: postError } = await supabase.from('posts').insert({
        title,
        content,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        status,
        author_id: userData.user.id,
        thumbnail_url: finalThumbnailUrl,
      }).select().single();

      if (postError) throw postError;

      if (selectedCategories.length > 0) {
        const categoryLinks = selectedCategories.map(catId => ({
          post_id: post.id,
          category_id: catId
        }));
        await supabase.from('post_categories').insert(categoryLinks);
      }

      alert("Post saved successfully!");
      router.push("/admin/posts");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      {/* Top Navigation / Header */}
      <header className="h-16 bg-white border-b border-brand-border sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 hover:bg-brand-cream rounded-full transition-all">
            <ChevronLeft size={20} />
          </Link>
          <span className="font-bold text-sm uppercase tracking-widest text-brand-midnight/40">New Post</span>
        </div>
        
        <div className="flex items-center gap-3">
          {userRole === 'admin' ? (
            <>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-midnight/60 hover:text-brand-midnight transition-all">
                <Eye size={18} />
                Preview
              </button>
              <button 
                onClick={() => { setStatus('published'); handleSave(); }}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-brand-green text-brand-midnight text-sm font-bold rounded-xl shadow-sm hover:bg-brand-green/90 transition-all disabled:opacity-50"
              >
                <Globe size={18} />
                {isSaving ? "Publishing..." : "Publish Now"}
              </button>
            </>
          ) : (
            <button 
              onClick={() => { setStatus('pending'); handleSave(); }}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              <Clock size={18} />
              {isSaving ? "Submitting..." : "Submit for Review"}
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex lg:flex-row flex-col">
        {/* Main Editor Section */}
        <main className="flex-1 p-6 md:p-12 lg:p-16 bg-white border-r border-brand-border">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Title Section - Updated size */}
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[24px] md:text-[28px] lg:text-[32px] font-display font-bold border-none p-0 focus:ring-0 placeholder:text-brand-border/40 bg-transparent leading-tight text-brand-midnight"
              />
              <textarea 
                placeholder="Brief subtitle or description..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                className="w-full text-[14px] md:text-[15px] lg:text-[16px] font-sans font-medium text-brand-midnight/60 border-none p-0 focus:ring-0 placeholder:text-brand-border/40 bg-transparent resize-none leading-relaxed"
              />
            </div>

            {/* Thumbnail Upload - Updated with instant local preview */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-widest block">Featured Image</label>
              <div className="relative group aspect-video w-full border-2 border-dashed border-brand-border rounded-3xl overflow-hidden bg-brand-cream/5 hover:bg-brand-cream/20 transition-all cursor-pointer">
                {thumbnail ? (
                  <div className="relative w-full h-full">
                    <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" unoptimized />
                    <button 
                      onClick={() => setThumbnail(null)}
                      className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:text-red-500 transition-all z-10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-10 text-center">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-brand-border">
                      <Upload size={20} className="text-brand-green" />
                    </div>
                    <p className="text-base font-bold text-brand-midnight">Upload cover image</p>
                    <p className="text-xs text-brand-midnight/40 mt-1">Recommended: 1200 x 630 pixels</p>
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
        <aside className="w-full lg:w-80 p-8 space-y-10 bg-brand-cream/20 h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
          {/* Status Toggle */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest">
              <Settings size={14} />
              Publishing
            </label>
            <div className="flex bg-white p-1 rounded-xl border border-brand-border shadow-sm">
              <button 
                onClick={() => setStatus('draft')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${status === 'draft' ? 'bg-brand-midnight text-white shadow-sm' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
              >
                Draft
              </button>
              <button 
                onClick={() => setStatus('pending')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${status === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
              >
                Review
              </button>
              {userRole === 'admin' && (
                <button 
                  onClick={() => setStatus('published')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${status === 'published' ? 'bg-brand-green text-brand-midnight shadow-sm' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
                >
                  Publish
                </button>
              )}
            </div>
          </div>

          {/* Categories - Updated with inline creation */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block">Categories</label>
            <div className="space-y-3">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="New category..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleCreateCategory}
                  className="w-full bg-white border border-brand-border rounded-xl py-2.5 pl-3 pr-10 text-xs font-medium focus:border-brand-green outline-none transition-all"
                />
                <button 
                  onClick={handleCreateCategory}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-midnight/40 hover:text-brand-green transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`text-xs font-bold py-2 px-3.5 rounded-xl border transition-all ${
                      selectedCategories.includes(cat.id) 
                        ? 'bg-brand-midnight text-white border-brand-midnight shadow-md' 
                        : 'bg-white border-brand-border text-brand-midnight/60 hover:border-brand-midnight hover:text-brand-midnight'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
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



