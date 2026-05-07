"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, Briefcase, Search, FileText, Coffee, Terminal, GraduationCap, Code2, BookOpen, Trophy, UserCheck, Clock, Bookmark, Target, Code, AlertCircle, Building2, Layers, LayoutGrid, CheckSquare, TrendingUp } from "lucide-react";
import { getThumbnailUrl } from "@/utils/helpers";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("posts")
        .select(`id, title, slug, thumbnail_url, meta_description, created_at, categories:post_categories(category:categories(name))`)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(4);
      setPosts(data || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-brand-cream/90 backdrop-blur-lg border-b border-brand-border" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority /></Link>
          <div className="hidden md:flex items-center gap-8">
            {["Insights", "Contributors", "About"].map(l => (
              <Link key={l} href={l === "Insights" ? "/posts" : "#"} className="text-[13px] font-medium text-brand-midnight/50 hover:text-brand-midnight transition-colors">{l}</Link>
            ))}
            <Link href="/posts" className="text-[13px] font-semibold text-white bg-brand-midnight px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Explore Insights</Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 z-[60] bg-brand-cream p-8 flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" /></Link>
              <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {["Insights", "Contributors", "About"].map(l => (
                <Link key={l} href={l === "Insights" ? "/posts" : "#"} onClick={() => setMenuOpen(false)} className="text-3xl font-display font-bold text-brand-midnight">{l}</Link>
              ))}
              <Link href="/posts" onClick={() => setMenuOpen(false)} className="mt-6 text-center text-sm font-semibold text-white bg-brand-midnight py-4 rounded-xl">Explore Insights</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <h1 className="font-display text-[44px] md:text-[64px] font-bold text-brand-midnight leading-[1.05] tracking-tight">
              Real insights for<br />students building<br />their future.
            </h1>
            <p className="text-brand-midnight/50 text-lg leading-relaxed max-w-md">
              Practical advice from engineers, professors, recruiters, and students who&apos;ve been through it.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/posts" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-midnight text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Explore Insights <ArrowRight size={16} />
              </Link>
              <Link href="#contributor-cta" className="px-7 py-3.5 border border-brand-border text-brand-midnight rounded-xl text-sm font-semibold hover:bg-white transition-colors">
                Become a Contributor
              </Link>
            </div>
          </motion.div>

          {/* Floating cards */}
          <div className="relative h-[420px] hidden lg:block">
            {[
              { t: "How I cracked my first internship", c: "Internships", icon: Target, x: "left-0 top-0", d: 0, r: -2 },
              { t: "What recruiters actually look for", c: "Placements", icon: Search, x: "right-0 top-8", d: 0.8, r: 2 },
              { t: "Building projects that stand out", c: "Projects", icon: Code, x: "left-12 bottom-0", d: 1.2, r: 1 },
              { t: "Things students should learn earlier", c: "Career", icon: AlertCircle, x: "right-4 bottom-8", d: 1.6, r: -1 },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ opacity: { duration: 0.6, delay: card.d }, y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: card.d } }}
                className={`absolute ${card.x} bg-white rounded-2xl p-5 border border-brand-border w-56 shadow-sm`}
                style={{ transform: `rotate(${card.r}deg)` }}>
                <p className="text-[10px] font-semibold text-brand-green uppercase tracking-wider mb-1">{card.c}</p>
                <p className="text-[14px] font-semibold text-brand-midnight leading-snug">{card.t}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-brand-border/50">
                  <div className="w-4 h-4 rounded-full bg-brand-cream border border-brand-border" />
                  <div className="w-12 h-1.5 bg-brand-cream rounded-full" />
                  <Bookmark size={10} className="ml-auto text-brand-midnight/15" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile single card */}
          <div className="lg:hidden bg-white rounded-2xl p-5 border border-brand-border">
            <p className="text-[10px] font-semibold text-brand-green uppercase tracking-wider mb-1">Internships</p>
            <p className="text-[14px] font-semibold text-brand-midnight leading-snug">How I cracked my first internship</p>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section className="py-24 px-6 bg-white border-y border-brand-border">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <motion.div {...fade} className="space-y-6">
            <h2 className="font-display text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight">
              Most student advice is either outdated or generic.
            </h2>
            <p className="text-brand-midnight/50 text-[17px] leading-relaxed max-w-md">
              GradBuzz is built to surface practical knowledge from people with real experience — not recycled tips from the internet.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { n: "Placements", i: Briefcase }, { n: "Internships", i: Search }, { n: "Resume Reviews", i: FileText },
              { n: "Campus Life", i: Coffee }, { n: "Coding Interviews", i: Terminal }, { n: "Higher Studies", i: GraduationCap },
            ].map(({ n, i: Icon }) => (
              <div key={n} className="bg-brand-cream/60 rounded-xl p-5 border border-brand-border/50 hover:border-brand-green/30 transition-colors group">
                <Icon size={20} className="text-brand-midnight/30 mb-3 group-hover:text-brand-green transition-colors" />
                <p className="text-[13px] font-semibold text-brand-midnight">{n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WRITES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h2 {...fade} className="font-display text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight text-center">
            Built on real experiences.
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Software Engineers", d: "Interview prep, projects, and career lessons.", i: Code2 },
              { t: "Professors", d: "Academic guidance and long-term growth.", i: BookOpen },
              { t: "Placed Students", d: "What actually worked during placements.", i: Trophy },
              { t: "Recruiters", d: "Hiring expectations and how to stand out.", i: UserCheck },
            ].map(({ t, d, i: Icon }) => (
              <motion.div key={t} {...fade} className="bg-white rounded-2xl p-6 border border-brand-border hover:border-brand-green/30 transition-colors">
                <Icon size={24} className="text-brand-midnight/25 mb-4" />
                <h3 className="text-[15px] font-bold text-brand-midnight mb-2">{t}</h3>
                <p className="text-[14px] text-brand-midnight/45 leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED INSIGHTS ── */}
      {!loading && posts.length > 0 && (
        <section className="py-24 px-6 bg-white border-y border-brand-border">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex items-end justify-between">
              <motion.h2 {...fade} className="font-display text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight">Featured Insights</motion.h2>
              <Link href="/posts" className="text-[13px] font-medium text-brand-midnight/40 hover:text-brand-midnight transition-colors hidden sm:block">View all →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {posts.slice(0, 4).map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="group bg-brand-cream/40 rounded-2xl border border-brand-border p-4 hover:border-brand-green/30 transition-colors">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    <Image src={getThumbnailUrl(post.thumbnail_url)} alt={post.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" unoptimized />
                    {post.categories?.[0] && (
                      <span className="absolute top-3 left-3 bg-white/90 text-[10px] font-semibold uppercase tracking-wider text-brand-midnight px-2.5 py-1 rounded-md">
                        {post.categories[0].category.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] font-bold text-brand-midnight leading-snug mb-2 group-hover:text-brand-green transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-2 text-brand-midnight/30">
                    <Clock size={13} />
                    <span className="text-[12px] font-medium">5 min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── JOURNEY ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div {...fade} className="text-center space-y-3 mb-12">
            <h2 className="font-display text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-tight">
              Every student journey looks different.
            </h2>
            <p className="text-brand-midnight/40 text-[16px] max-w-lg mx-auto">
              There&apos;s no single path to growth — only continuous learning, experimentation, and progress.
            </p>
          </motion.div>

          {/* Desktop milestone cards */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { t: "College", d: "The beginning of curiosity, exploration, and new opportunities.", i: Building2 },
              { t: "Skills", d: "Learning technologies, communication, and problem-solving step by step.", i: Layers },
              { t: "Projects", d: "Turning ideas into real work that demonstrates capability.", i: LayoutGrid },
              { t: "Internships", d: "Getting practical exposure, teamwork, and industry understanding.", i: Briefcase },
              { t: "Placements", d: "Preparing for interviews, building confidence, and facing opportunities.", i: CheckSquare },
              { t: "Career", d: "Continuing growth beyond college through real-world experience.", i: TrendingUp },
            ].map(({ t, d, i: Icon }, idx) => (
              <motion.div key={t} {...fade} transition={{ delay: idx * 0.08 }} className="bg-white rounded-2xl p-5 border border-brand-border hover:border-brand-green/40 transition-all group text-center">
                <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green/10 transition-colors">
                  <Icon size={18} className="text-brand-midnight/30 group-hover:text-brand-green transition-colors" />
                </div>
                <p className="text-[13px] font-bold text-brand-midnight mb-1">{t}</p>
                <p className="text-[12px] text-brand-midnight/35 leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile vertical timeline */}
          <div className="md:hidden space-y-6 relative pl-10">
            <div className="absolute top-2 bottom-2 left-[18px] w-px bg-brand-border" />
            {[
              { t: "College", d: "The beginning of curiosity, exploration, and new opportunities.", i: Building2 },
              { t: "Skills", d: "Learning technologies, communication, and problem-solving step by step.", i: Layers },
              { t: "Projects", d: "Turning ideas into real work that demonstrates capability.", i: LayoutGrid },
              { t: "Internships", d: "Getting practical exposure, teamwork, and industry understanding.", i: Briefcase },
              { t: "Placements", d: "Preparing for interviews, building confidence, and facing opportunities.", i: CheckSquare },
              { t: "Career", d: "Continuing growth beyond college through real-world experience.", i: TrendingUp },
            ].map(({ t, d, i: Icon }) => (
              <motion.div key={t} {...fade} className="flex items-start gap-4 relative">
                <div className="w-9 h-9 rounded-full bg-white border-2 border-brand-border flex items-center justify-center shrink-0 -ml-10">
                  <Icon size={14} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-brand-midnight">{t}</p>
                  <p className="text-[13px] text-brand-midnight/35 leading-relaxed">{d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTOR CTA ── */}
      <section id="contributor-cta" className="py-28 px-6 bg-brand-midnight">
        <motion.div {...fade} className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="font-display text-[36px] md:text-[52px] font-bold text-white leading-[1.1] tracking-tight">
            Want to share something useful?
          </h2>
          <p className="text-white/40 text-[17px] leading-relaxed">
            We&apos;re inviting professionals, professors, and experienced students to contribute insights that genuinely help others grow.
          </p>
          <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-brand-midnight rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            Apply as Contributor <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-brand-border py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="relative h-8 w-32 block"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" /></Link>
            <p className="text-brand-midnight/40 text-[14px] leading-relaxed max-w-sm">Where student ambition meets real advice. An initiative by Sikshanext Private Limited.</p>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] font-bold text-brand-midnight/30 uppercase tracking-wider">Platform</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/posts" className="text-[14px] text-brand-midnight/45 hover:text-brand-midnight transition-colors">Insights</Link>
              <Link href="/mission" className="text-[14px] text-brand-midnight/45 hover:text-brand-midnight transition-colors">Our Mission</Link>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] font-bold text-brand-midnight/30 uppercase tracking-wider">Legal</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/terms" className="text-[14px] text-brand-midnight/45 hover:text-brand-midnight transition-colors">Terms</Link>
              <Link href="/privacy" className="text-[14px] text-brand-midnight/45 hover:text-brand-midnight transition-colors">Privacy</Link>
              <Link href="/cookies" className="text-[14px] text-brand-midnight/45 hover:text-brand-midnight transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-brand-border">
          <p className="text-[12px] text-brand-midnight/20">© 2026 GradBuzz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
