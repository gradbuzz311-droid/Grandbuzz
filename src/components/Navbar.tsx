"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, Heart, MessageSquare, Bookmark, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Auth state listener
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    router.refresh();
  };

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-brand-cream/90 backdrop-blur-lg border-b border-brand-border" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="relative h-8 w-32">
            <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/posts" className="text-[13px] font-medium text-brand-midnight/50 hover:text-brand-midnight transition-colors">Insights</Link>
            <Link href="/about" className="text-[13px] font-medium text-brand-midnight/50 hover:text-brand-midnight transition-colors">About</Link>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-brand-midnight/5 border border-brand-border flex items-center justify-center hover:bg-brand-midnight/10 transition-colors"
                >
                  <User size={20} className="text-brand-midnight/60" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-brand-border overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-brand-border bg-brand-cream/30">
                          <p className="text-[11px] font-bold text-brand-midnight/30 uppercase tracking-widest mb-1">Signed in as</p>
                          <p className="text-[13px] font-bold text-brand-midnight truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-cream transition-colors text-[13px] font-medium text-brand-midnight">
                            <User size={16} className="text-brand-midnight/40" />
                            Your Profile
                          </Link>
                          <Link href="/profile?tab=liked" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-cream transition-colors text-[13px] font-medium text-brand-midnight">
                            <Heart size={16} className="text-brand-midnight/40" />
                            Liked
                          </Link>
                          <Link href="/profile?tab=bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-cream transition-colors text-[13px] font-medium text-brand-midnight">
                            <Bookmark size={16} className="text-brand-midnight/40" />
                            Bookmarks
                          </Link>
                          <hr className="my-2 border-brand-border" />
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-[13px] font-medium text-red-600"
                          >
                            <LogOut size={16} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="text-[13px] font-semibold text-white bg-brand-midnight px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Sign up</Link>
            )}
          </div>
          
          <button className="md:hidden" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 30, stiffness: 300 }} 
            className="fixed inset-0 z-[60] bg-brand-cream p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative h-8 w-32">
                <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" />
              </Link>
              <button onClick={() => setMenuOpen(false)}><X size={24} /></button>
            </div>
            
            <div className="flex flex-col gap-6">
              <Link href="/posts" onClick={() => setMenuOpen(false)} className="text-3xl font-display font-bold text-brand-midnight">Insights</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="text-3xl font-display font-bold text-brand-midnight">About</Link>
              
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-3xl font-display font-bold text-brand-midnight">Profile</Link>
                  <button 
                    onClick={handleSignOut}
                    className="mt-6 text-center text-sm font-semibold text-white bg-red-600 py-4 rounded-xl"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-6 text-center text-sm font-semibold text-white bg-brand-midnight py-4 rounded-xl">Sign up</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
