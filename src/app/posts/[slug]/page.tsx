import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PostInteractions from "@/components/blog/PostInteractions";
import ShareButton from "@/components/blog/ShareButton";
import { getAvatarUrl, getThumbnailUrl } from "@/utils/helpers";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url, role),
      categories:post_categories(
        category:categories(name, slug)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  const isAuthorAdmin = post.author?.role === 'admin';
  const authorName = isAuthorAdmin ? "GradBuzz" : (post.author?.full_name || 'GradBuzz Editor');
  const authorAvatar = isAuthorAdmin ? "/logo_nobg.png" : getAvatarUrl(post.author?.avatar_url);

  return (
    <article className="min-h-screen bg-brand-cream/30 selection:bg-brand-green/30">
      {/* Top Bar for Article */}
      <nav className="h-20 bg-white border-b border-brand-border sticky top-0 z-40 px-6 flex items-center justify-between">
        <Link href="/" className="relative h-12 w-48">
          <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" />
        </Link>
        <div className="flex items-center gap-4">
           <Link href="/posts" className="text-xs font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight transition-colors">Back to Feed</Link>
        </div>
      </nav>

      {/* Hero Image Container with Gap */}
      <div className="px-6 pt-8 max-w-7xl mx-auto">
        <div className="relative w-full aspect-[21/9] min-h-[300px] md:min-h-[450px] bg-brand-midnight rounded-[32px] overflow-hidden shadow-2xl">
          <Image
            src={getThumbnailUrl(post.thumbnail_url)}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized={true}
          />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* Article Metadata Below Image */}
        <header className="mb-16 space-y-8">
          <div className="flex flex-wrap gap-3">
            {post.categories?.map((c: any) => (
              <Link 
                key={c.category.slug}
                href={`/categories/${c.category.slug}`}
                className="bg-brand-green/10 text-brand-green px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-midnight transition-all border border-brand-green/20"
              >
                {c.category.name}
              </Link>
            ))}
          </div>
          
          <h1 className="font-display text-3xl md:text-5xl font-black text-brand-midnight leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-brand-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-border relative bg-white shrink-0">
                 <Image 
                  src={authorAvatar} 
                  alt={authorName} 
                  fill 
                  className="object-cover" 
                  unoptimized={true}
                 />
              </div>
              <div>
                <p className="text-xs font-black text-brand-midnight uppercase tracking-widest leading-none mb-1">{authorName}</p>
                <p className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="w-px h-8 bg-brand-border/50 hidden sm:block" />
              <div>
                <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-widest leading-none mb-1">Read Time</p>
                <p className="text-sm font-bold text-brand-midnight">5 Mins</p>
              </div>
            </div>

            <div className="ml-auto">
              <ShareButton title={post.title} />
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-xl prose-brand max-w-none font-sans text-brand-midnight/90 leading-relaxed 
          prose-headings:font-display prose-headings:font-black prose-headings:text-brand-midnight 
          prose-p:font-medium prose-p:text-brand-midnight/70 prose-a:text-brand-green prose-a:font-bold hover:prose-a:text-brand-midnight transition-all"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Social Interactions */}
        <div className="mt-20">
          <PostInteractions 
            postId={post.id} 
            initialLikes={post.likes} 
            initialComments={post.comments} 
            isLoggedIn={!!user} 
          />
        </div>
        
        <footer className="mt-20 pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 relative">
                <Image src="/logo_nobg.png" alt="GradBuzz Logo" fill className="object-contain" />
             </div>
             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
                   Initiative by Sikshanext Private Limited.
                </p>
                <div className="hidden md:block w-1 h-1 bg-brand-midnight/10 rounded-full" />
                <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">
                   © 2026 All Rights Reserved.
                </p>
             </div>
          </div>
        </footer>
      </main>
    </article>
  );
}
