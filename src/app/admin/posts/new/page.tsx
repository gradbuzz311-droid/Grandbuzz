"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";

export default function NewPostPage() {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);
  const [tags, setTags] = useState<string[]>(["Academic", "Modern"]);
  const [newTag, setNewTag] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (data) setAvailableCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

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

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleCommand("insertImage", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Please enter a title");
    setIsSaving(true);
    
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return alert("You must be logged in to save");

    const { data: post, error: postError } = await supabase.from('posts').insert({
      title,
      content,
      slug,
      status: status.toLowerCase(),
      author_id: userData.user.id,
      thumbnail_url: thumbnail, // In a real app, upload this to Storage first
    }).select().single();

    if (postError) {
      alert("Error saving post: " + postError.message);
    } else if (post && selectedCategories.length > 0) {
      // Link categories
      const categoryLinks = selectedCategories.map(catId => ({
        post_id: post.id,
        category_id: catId
      }));
      await supabase.from('post_categories').insert(categoryLinks);
      alert("Post saved successfully!");
    } else {
      alert("Post saved successfully!");
    }
    
    setIsSaving(false);
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-64px)] relative bg-white lg:flex-row flex-col">
      <input 
        type="file" 
        ref={editorImageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleEditorImageUpload} 
      />

      {/* Main Writing Canvas */}
      <main className="flex-1 lg:mr-80 px-4 md:px-10 py-10 transition-all bg-white overflow-y-auto">
        <div className="max-w-[720px] mx-auto relative">
          {/* Action Buttons (Mobile only) */}
          <div className="lg:hidden flex justify-between items-center mb-8 border-b border-brand-border pb-4">
             <h2 className="font-display text-xl font-bold">New Post</h2>
             <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-brand-green text-brand-midnight text-xs font-bold rounded-lg uppercase tracking-widest disabled:opacity-50"
             >
                {isSaving ? "Saving..." : "Save"}
             </button>
          </div>

          {/* Notion-style Toolbar */}
          <div className="sticky top-0 z-40 mb-8 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-brand-border rounded-xl shadow-sm overflow-x-auto no-scrollbar">
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleCommand("bold"); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70"
              title="Bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v1h2a1 1 0 110 2h-2v2h2a1 1 0 110 2h-2v2h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1H7a1 1 0 110-2h2v-2H7a1 1 0 110-2h2V7H7a1 1 0 110-2h2V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleCommand("italic"); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70 font-bold italic"
              title="Italic"
            >
              I
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleCommand("underline"); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70 underline font-bold"
              title="Underline"
            >
              U
            </button>
            <div className="w-px h-6 bg-brand-border mx-1"></div>
            <button onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "H1"); }} className="px-2 py-1 hover:bg-brand-cream rounded-lg text-xs font-bold text-brand-midnight/70">H1</button>
            <button onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "H2"); }} className="px-2 py-1 hover:bg-brand-cream rounded-lg text-xs font-bold text-brand-midnight/70">H2</button>
            <button onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "H3"); }} className="px-2 py-1 hover:bg-brand-cream rounded-lg text-xs font-bold text-brand-midnight/70">H3</button>
            <div className="w-px h-6 bg-brand-border mx-1"></div>
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleCommand("insertUnorderedList"); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70"
              title="Bullet List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "BLOCKQUOTE"); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70"
              title="Quote"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7h10v2H5V7zm0 4h7v2H5v-2z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="w-px h-6 bg-brand-border mx-1"></div>
            <button 
              onMouseDown={(e) => { e.preventDefault(); editorImageInputRef.current?.click(); }}
              className="p-2 hover:bg-brand-cream rounded-lg flex items-center justify-center text-brand-midnight/70"
              title="Upload Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Post Title Area */}
          <textarea
            ref={titleRef}
            className="w-full bg-transparent border-none resize-none font-display text-4xl md:text-5xl font-extrabold text-brand-midnight placeholder:text-brand-border/40 focus:ring-0 p-0 mb-6 overflow-hidden"
            placeholder="Post Title"
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Editor Area with CSS-based placeholder */}
          <div
            ref={editorRef}
            className={`prose prose-lg font-sans text-brand-midnight/80 leading-relaxed min-h-[500px] pb-32 outline-none focus:outline-none relative empty:before:content-[attr(data-placeholder)] empty:before:text-brand-border/40 empty:before:italic empty:before:absolute empty:before:pointer-events-none`}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Start writing your academic insight..."
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
          ></div>
        </div>
      </main>

      {/* Right Management Sidebar */}
      <aside className="w-full lg:w-80 lg:fixed lg:right-0 lg:top-16 lg:bottom-0 p-6 border-l border-brand-border bg-brand-cream/30 overflow-y-auto z-30">
        {/* Thumbnail Section */}
        <div className="mb-8">
          <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-3">Thumbnail Image</label>
          <div className="relative group aspect-video w-full border-2 border-dashed border-brand-border rounded-xl overflow-hidden bg-white hover:bg-brand-cream transition-colors cursor-pointer">
            {thumbnail ? (
              <div className="relative w-full h-full">
                <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
                <button 
                  onClick={() => setThumbnail(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-border mb-2 group-hover:text-brand-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm font-bold text-brand-midnight/70">Click to upload</p>
                <p className="text-[10px] text-brand-midnight/40 mt-1 font-bold uppercase">1200x630 (PNG/JPG)</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Multi-Category Selection */}
        <div className="mb-8">
          <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-3">Categories</label>
          <div className="grid grid-cols-2 gap-2">
            {availableCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${
                  selectedCategories.includes(cat.id) 
                    ? 'bg-brand-green border-brand-green text-brand-midnight' 
                    : 'bg-white border-brand-border text-brand-midnight/60 hover:border-brand-green'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-8">
          <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-3">Tags</label>
          <div className="space-y-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type tag and press Enter..."
              className="w-full bg-white border border-brand-border rounded-lg py-2 px-3 font-sans text-xs font-medium focus:border-brand-green transition-all outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-brand-midnight/10 text-brand-midnight px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-brand-midnight/20">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-1">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="mb-8 p-5 rounded-2xl border border-brand-border bg-white shadow-sm">
          <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-4">Publishing</label>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-brand-midnight">Status</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">{status}</span>
              <button
                onClick={() => setStatus(status === "Draft" ? "Published" : "Draft")}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${status === "Published" ? 'bg-brand-green' : 'bg-brand-border'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${status === "Published" ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-brand-midnight text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-midnight/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Processing..." : (status === "Draft" ? "Save Draft" : "Publish Now")}
          </button>
        </div>

        {/* SEO Optimization */}
        <div className="mb-8 pb-20 lg:pb-0">
          <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-3">SEO Details</label>
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest mb-1.5 block">URL Slug</span>
              <input
                className="w-full bg-white border border-brand-border rounded-lg py-2.5 px-3 font-sans text-xs font-medium focus:border-brand-green transition-all outline-none"
                placeholder="post-url-slug"
                type="text"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest mb-1.5 block">Meta Description</span>
              <textarea
                className="w-full bg-white border border-brand-border rounded-lg py-2.5 px-3 font-sans text-xs font-medium focus:border-brand-green transition-all outline-none resize-none"
                placeholder="Brief summary for search engines..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}


