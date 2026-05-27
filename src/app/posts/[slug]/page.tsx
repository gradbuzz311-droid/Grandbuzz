import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PostInteractions from "@/components/blog/PostInteractions";
import ShareButton from "@/components/blog/ShareButton";
import Navbar from "@/components/Navbar";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: getThumbnailUrl(post.thumbnail_url),
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GradBuzz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gradbuzz.sikshanext.in/logo_nobg.png',
      },
    },
  };

  const { data: readNextPosts } = await supabase
    .from('posts')
    .select(`
      id, slug, title, thumbnail_url, created_at,
      author:profiles(full_name, avatar_url, role),
      categories:post_categories(category:categories(name))
    `)
    .eq('status', 'published')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <article className="min-h-screen bg-brand-cream/30 selection:bg-brand-green/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Image Container with Gap */}
      <div className="px-4 md:px-12 pt-28 md:pt-32 max-w-6xl mx-auto">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-brand-midnight rounded-2xl md:rounded-3xl overflow-hidden">
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
              <span 
                key={c.category.slug}
                className="bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-lg text-[11px] font-semibold border border-brand-green/20 cursor-default"
              >
                {c.category.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-[22px] md:text-[32px] font-bold text-brand-midnight leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between gap-3 sm:gap-6 py-6 md:py-8 border-y border-brand-border/50 w-full">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-brand-border relative bg-white shrink-0">
                 <Image 
                  src={authorAvatar} 
                  alt={authorName} 
                  fill 
                  className="object-cover" 
                  unoptimized={true}
                 />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] md:text-[13px] font-semibold text-brand-midnight leading-none mb-1 truncate">{authorName}</p>
                <p className="text-[10px] md:text-[12px] text-brand-midnight/40 truncate">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6 md:gap-8 shrink-0">
              <div className="w-px h-8 bg-brand-border/50 hidden sm:block" />
              <div>
                <p className="text-[10px] md:text-[12px] text-brand-midnight/30 leading-none mb-1">Read time</p>
                <p className="text-xs md:text-sm font-bold text-brand-midnight">5 Mins</p>
              </div>
            </div>

            <div className="ml-auto shrink-0">
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

        {/* Newsletter Section */}
        <div>
          <NewsletterSubscribe />
        </div>
      </main>

      {/* Read Next Section */}
      {readNextPosts && readNextPosts.length > 0 && (
        <section className="bg-white py-20 border-t border-brand-border/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-midnight mb-10">Read Next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {readNextPosts.map((related: any) => (
                <Link key={related.id} href={`/posts/${related.slug}`} className="group block">
                  <div className="relative aspect-[16/10] bg-brand-midnight rounded-xl overflow-hidden mb-4">
                    <Image
                      src={getThumbnailUrl(related.thumbnail_url)}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-brand-midnight text-lg leading-snug group-hover:text-brand-green transition-colors">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-20 pt-12 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 relative">
              <Image src="/logo_nobg.png" alt="GradBuzz Logo" fill className="object-contain" />
           </div>
           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
               <p className="text-[12px] text-brand-midnight/30">
                  Initiative by Sikshanext Private Limited.
               </p>
               <div className="hidden md:block w-1 h-1 bg-brand-midnight/10 rounded-full" />
               <p className="text-[12px] text-brand-midnight/20">
                  © 2026 All rights reserved.
               </p>
           </div>
        </div>
      </footer>
    </article>
  );
}
