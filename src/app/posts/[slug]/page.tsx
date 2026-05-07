import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PostInteractions from "@/components/blog/PostInteractions";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      categories:post_categories(
        category:categories(name, slug)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-brand-cream/30 selection:bg-brand-green/30">
      {/* Top Bar for Article */}
      <nav className="h-20 bg-white border-b border-brand-border sticky top-0 z-40 px-6 flex items-center justify-between">
        <Link href="/" className="relative h-10 w-32">
          <Image src="/logo.png" alt="GradBuzz" fill className="object-contain" />
        </Link>
        <div className="flex items-center gap-4">
           <Link href="/posts" className="text-xs font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Back to Feed</Link>
        </div>
      </nav>

      {/* Article Hero */}
      <header className="relative w-full h-[70vh] min-h-[500px] bg-brand-midnight overflow-hidden">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight to-brand-midnight/80" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/20 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center">
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-wrap justify-center gap-3">
              {post.categories?.map((c: any) => (
                <Link 
                  key={c.category.slug}
                  href={`/categories/${c.category.slug}`}
                  className="bg-brand-green text-brand-midnight px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform border border-brand-green/20"
                >
                  {c.category.name}
                </Link>
              ))}
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-green relative shadow-xl shadow-brand-midnight/50">
                   <Image src={post.author?.avatar_url || "/avatar-placeholder.png"} alt={post.author?.full_name || "Author"} fill className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-white leading-none mb-1">{post.author?.full_name || 'GradBuzz Editor'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-green">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-left">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Read Time</p>
                 <p className="text-sm font-bold text-white">5 Mins</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div 
          className="prose prose-xl prose-brand max-w-none font-sans text-brand-midnight/90 leading-relaxed 
          prose-headings:font-display prose-headings:font-black prose-headings:text-brand-midnight 
          prose-p:font-medium prose-p:text-brand-midnight/70 prose-a:text-brand-green prose-a:font-bold hover:prose-a:text-brand-midnight transition-all"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Social Interactions */}
        <PostInteractions 
          postId={post.id} 
          initialLikes={post.likes} 
          initialComments={post.comments} 
          isLoggedIn={!!user} 
        />
        
        <footer className="mt-20 pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 relative bg-white rounded-2xl border border-brand-border p-3 shadow-sm">
                <Image src="/logo.png" alt="GradBuzz Logo" fill className="object-contain p-2" />
             </div>
             <div>
                <p className="text-xs font-black text-brand-midnight uppercase tracking-[0.2em] mb-1">Published By</p>
                <p className="text-lg font-display font-black text-brand-midnight">GradBuzz Editorial Team</p>
                <p className="text-sm font-medium text-brand-midnight/40">Real advice for real student life.</p>
             </div>
          </div>
          
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-brand-midnight text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">
                Share this story
             </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
    </article>
  );
}
