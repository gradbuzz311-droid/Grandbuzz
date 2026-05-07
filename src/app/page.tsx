import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { 
  ArrowRight, 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Share2, 
  TrendingUp,
  Award,
  Users,
  Search,
  ChevronRight
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();

  // Fetch Stats
  const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

  // Fetch Featured Post
  const { data: featuredPosts } = await supabase
    .from('posts')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const featuredPost = featuredPosts?.[0];

  // Fetch Recent Posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-green/30">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative h-12 w-40">
            <Image src="/logo.png" alt="GradBuzz Logo" fill className="object-contain" priority />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/posts" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-midnight transition-colors">Insights</Link>
            <Link href="/about" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-midnight transition-colors">Our Mission</Link>
            <Link href="/team" className="text-sm font-bold text-brand-midnight/60 hover:text-brand-midnight transition-colors">Contributors</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-brand-midnight px-4 py-2 hover:bg-brand-cream rounded-xl transition-all">Sign In</Link>
            <Link href="/apply" className="bg-brand-midnight text-white text-sm font-bold px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-midnight/10">Become a Writer</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/20 rounded-full">
                <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">By Students, For Students</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-display font-black text-brand-midnight leading-[0.9] tracking-tighter">
                Real advice for <br />
                <span className="text-brand-green">real student</span> life.
              </h1>
              
              <p className="text-lg md:text-xl text-brand-midnight/60 max-w-xl leading-relaxed font-medium">
                From landing FAANG internships to surviving finals — we bring you field-tested insights from the campus trenches.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/posts" className="flex items-center gap-2 bg-brand-green text-brand-midnight font-black px-8 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-green/20 group">
                  Start Reading
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-6 border-l border-brand-border">
                  <div>
                    <p className="text-2xl font-black text-brand-midnight leading-none">{postCount || 0}+</p>
                    <p className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Published Articles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full bg-white rounded-[40px] border border-brand-border p-4 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
               <div className="w-full h-full relative rounded-[32px] overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1523240715639-93f8faa09793?auto=format&fit=crop&q=80" 
                    alt="Students collaborating" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-1">Coming Next</p>
                    <p className="text-lg font-black text-brand-midnight">The 2024 Placement Survival Guide is almost here.</p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Featured Post - Only shows if admin marks one */}
        {featuredPost && (
          <section className="max-w-7xl mx-auto px-6 mb-32">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-display font-black text-brand-midnight">Featured Insight</h2>
                <div className="w-20 h-2 bg-brand-green rounded-full" />
              </div>
              <Link href="/featured" className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors">View Spotlight Archive</Link>
            </div>
            
            <Link href={`/posts/${featuredPost.slug}`} className="group block relative aspect-[21/9] w-full bg-white rounded-[40px] overflow-hidden border border-brand-border shadow-xl">
              <Image 
                src={featuredPost.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"} 
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-12 max-w-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden relative">
                    <Image src={featuredPost.author?.avatar_url || "/avatar-placeholder.png"} alt="Author" fill className="object-cover" />
                  </div>
                  <span className="text-sm font-bold text-white/80">{featuredPost.author?.full_name || "GradBuzz Team"}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs font-bold text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">Featured</span>
                </div>
                <h3 className="text-5xl font-display font-black text-white leading-tight">{featuredPost.title}</h3>
                <div className="flex items-center gap-6 text-white/60">
                   <div className="flex items-center gap-2"><Heart size={18} /> {featuredPost.likes || 0}</div>
                   <div className="flex items-center gap-2"><MessageSquare size={18} /> {featuredPost.comments || 0}</div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Feed */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-black text-brand-midnight tracking-tight flex items-center gap-3">
              <TrendingUp className="text-brand-green" />
              The Latest Buzz
            </h2>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-brand-border shadow-sm">
              <button className="px-4 py-2 text-xs font-bold bg-brand-midnight text-white rounded-lg">All Posts</button>
              <button className="px-4 py-2 text-xs font-bold text-brand-midnight/40 hover:text-brand-midnight rounded-lg transition-all">Career</button>
              <button className="px-4 py-2 text-xs font-bold text-brand-midnight/40 hover:text-brand-midnight rounded-lg transition-all">Academics</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts?.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-brand-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={post.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"} 
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Insights</span>
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-brand-midnight/40 text-[10px] font-bold uppercase tracking-widest">
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-brand-midnight group-hover:text-brand-green transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="pt-4 mt-auto border-t border-brand-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-cream overflow-hidden relative">
                        <Image src={post.author?.avatar_url || "/avatar-placeholder.png"} alt="Author" fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-midnight/60">{post.author?.full_name || "GradBuzz Writer"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-midnight/30">
                       <Heart size={14} />
                       <MessageSquare size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/posts" className="inline-flex items-center gap-2 text-sm font-black text-brand-midnight border-b-2 border-brand-green pb-1 hover:text-brand-green transition-all">
              Load More Stories
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-midnight text-white pt-24 pb-12 rounded-t-[60px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-12 w-48 brightness-0 invert">
                <Image src="/logo.png" alt="GradBuzz Logo" fill className="object-contain" />
              </div>
              <p className="text-white/40 max-w-sm font-medium leading-relaxed">
                The most authentic student-run platform for academic and career advice in India. No fluff, just real talk.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {['twitter', 'instagram', 'linkedin'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-green hover:text-brand-midnight transition-all cursor-pointer">
                    <div className="capitalize font-black text-[10px]">{s[0]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-green">Explore</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li className="hover:text-white transition-colors"><Link href="/posts">All Insights</Link></li>
                <li className="hover:text-white transition-colors"><Link href="/career">Career Advice</Link></li>
                <li className="hover:text-white transition-colors"><Link href="/academics">Academics</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-brand-green">Connect</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li className="hover:text-white transition-colors"><Link href="/apply">Apply as Contributor</Link></li>
                <li className="hover:text-white transition-colors"><Link href="/contact">Contact Support</Link></li>
                <li className="hover:text-white transition-colors"><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2024 GradBuzz. Designed with passion for students.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
              <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
              <span className="hover:text-white transition-colors cursor-pointer">COOKIES</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
