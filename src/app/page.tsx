import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch latest published posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      categories:post_categories(
        category:categories(name, slug)
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10);

  const featuredPost = posts?.[0];
  const remainingPosts = posts?.slice(1) || [];

  return (
    <div className="min-h-screen bg-brand-cream font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-midnight rounded-xl flex items-center justify-center p-2 group-hover:rotate-6 transition-transform">
              <Image src="/gradbuzz.png" alt="GradBuzz Logo" width={32} height={32} />
            </div>
            <span className="font-display text-2xl font-black tracking-tighter text-brand-midnight">GradBuzz</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/categories/education" className="text-xs font-bold uppercase tracking-widest text-brand-midnight/60 hover:text-brand-green transition-colors">Education</Link>
            <Link href="/categories/jobs" className="text-xs font-bold uppercase tracking-widest text-brand-midnight/60 hover:text-brand-green transition-colors">Career</Link>
            <Link href="/categories/research" className="text-xs font-bold uppercase tracking-widest text-brand-midnight/60 hover:text-brand-green transition-colors">Research</Link>
            <Link href="/login" className="px-6 py-2 bg-brand-midnight text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-midnight/90 transition-all">Admin</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
             <div className="w-24 h-24 bg-brand-midnight/5 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
             </div>
             <h2 className="font-display text-3xl font-extrabold text-brand-midnight mb-2">No Insights Yet</h2>
             <p className="text-brand-midnight/40 font-medium italic mb-8">The editorial team is currently crafting amazing content for you.</p>
          </div>
        ) : (
          <>
            {/* Featured Post (Hero) */}
            {featuredPost && (
              <section className="relative rounded-[2rem] overflow-hidden bg-brand-midnight mb-16 shadow-2xl group border-4 border-white">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/3] md:aspect-auto h-full overflow-hidden">
                    {featuredPost.thumbnail_url ? (
                      <Image 
                        src={featuredPost.thumbnail_url} 
                        alt={featuredPost.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-brand-midnight flex items-center justify-center">
                        <Image src="/gradbuzz.png" alt="Placeholder" width={100} height={100} className="opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.categories?.map((c: any) => (
                        <span key={c.category.slug} className="px-3 py-1 bg-brand-green text-brand-midnight text-[10px] font-bold uppercase tracking-widest rounded-lg">
                          {c.category.name}
                        </span>
                      ))}
                    </div>
                    <Link href={`/posts/${featuredPost.slug}`}>
                      <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-6 leading-[1.1] hover:text-brand-green transition-colors">
                        {featuredPost.title}
                      </h2>
                    </Link>
                    <p className="text-white/60 font-sans text-sm mb-8 line-clamp-3 leading-relaxed">
                      Discover the latest academic insights and career strategies tailored for graduate students and modern learners.
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center overflow-hidden">
                          {featuredPost.author?.avatar_url ? (
                            <Image src={featuredPost.author.avatar_url} alt="Avatar" width={40} height={40} />
                          ) : (
                            <span className="text-brand-green text-xs font-bold font-display">GB</span>
                          )}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase tracking-widest">{featuredPost.author?.full_name || 'GradBuzz Editor'}</p>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            {new Date(featuredPost.created_at).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Post Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/posts/${post.slug}`}
                  className="group bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-green hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                    {post.thumbnail_url ? (
                      <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-brand-cream flex items-center justify-center">
                        <Image src="/gradbuzz.png" alt="Placeholder" width={40} height={40} className="opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mb-4">
                    {post.categories?.slice(0, 1).map((c: any) => (
                      <span key={c.category.slug} className="text-[10px] font-bold uppercase tracking-widest text-brand-green">
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-brand-midnight mb-4 leading-tight group-hover:text-brand-green transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center overflow-hidden border border-brand-border">
                       {post.author?.avatar_url ? (
                         <Image src={post.author.avatar_url} alt="Avatar" width={32} height={32} />
                       ) : (
                         <span className="text-[8px] font-bold text-brand-midnight/40">GB</span>
                       )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand-midnight uppercase tracking-widest">{post.author?.full_name || 'Editor'}</p>
                      <p className="text-[9px] font-medium text-brand-midnight/40 uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-midnight text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-white/10 pb-20 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center p-2">
                <Image src="/gradbuzz.png" alt="GradBuzz Logo" width={40} height={40} />
              </div>
              <span className="font-display text-3xl font-black tracking-tighter text-white">GradBuzz</span>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed italic font-medium">
              "Redefining academic exploration and career navigation for the next generation of ambitious graduates."
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-brand-green">Explore</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
              <li><Link href="/categories/education" className="hover:text-white transition-colors">Education</Link></li>
              <li><Link href="/categories/jobs" className="hover:text-white transition-colors">Career</Link></li>
              <li><Link href="/categories/interviews" className="hover:text-white transition-colors">Interviews</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-brand-green">Editorial</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
              <li><Link href="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Style Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Submit Insight</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          <p>© 2026 GradBuzz Platform. All rights reserved.</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
