import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

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
    <article className="min-h-screen bg-brand-cream/30">
      {/* Article Hero */}
      <header className="relative w-full h-[60vh] min-h-[400px] bg-brand-midnight overflow-hidden">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight to-brand-midnight/80" />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-4xl">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.categories?.map((c: any) => (
                <Link 
                  key={c.category.slug}
                  href={`/categories/${c.category.slug}`}
                  className="bg-brand-green text-brand-midnight px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  {c.category.name}
                </Link>
              ))}
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-white/80">
              {post.author?.avatar_url && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-green">
                  <Image src={post.author.avatar_url} alt={post.author.full_name} width={40} height={40} />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-bold text-white">{post.author?.full_name || 'GradBuzz Editor'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-green">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div 
          className="prose prose-lg prose-brand max-w-none font-sans text-brand-midnight/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="mt-16 pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-midnight rounded-full flex items-center justify-center p-2">
                <Image src="/gradbuzz.png" alt="Logo" width={32} height={32} />
             </div>
             <div>
                <p className="text-xs font-bold text-brand-midnight uppercase tracking-widest">Published By</p>
                <p className="text-sm font-medium text-brand-midnight/60">GradBuzz Editorial Team</p>
             </div>
          </div>
          
          <div className="flex gap-4">
             <button className="p-3 bg-white rounded-full border border-brand-border hover:border-brand-green transition-colors">
                <span className="sr-only">Share on Twitter</span>
                <svg className="w-5 h-5 text-brand-midnight" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
             </button>
             <button className="p-3 bg-white rounded-full border border-brand-border hover:border-brand-green transition-colors">
                <span className="sr-only">Copy Link</span>
                <svg className="w-5 h-5 text-brand-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
             </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
