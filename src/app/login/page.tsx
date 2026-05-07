"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Fetch user role for redirection
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .single();

      if (profile?.role === 'admin') {
        router.push("/admin");
      } else if (profile?.role === 'contributor') {
        router.push("/contributor");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-brand-border">
        <div className="p-12">
          <div className="flex justify-center mb-10">
            <Link href="/" className="relative h-12 w-40">
              <Image
                src="/gradbuzz.png"
                alt="GradBuzz Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
          
          <h1 className="font-display text-4xl font-black text-brand-midnight text-center mb-2 tracking-tighter">Welcome.</h1>
          <p className="text-brand-midnight/40 text-center text-sm mb-10 font-medium">Editorial Platform Access</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em] block px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-cream/20 border border-brand-border rounded-2xl py-4 px-5 font-sans text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="editor@gradbuzz.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em] block px-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-cream/20 border border-brand-border rounded-2xl py-4 px-5 font-sans text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-4 px-5 rounded-2xl font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-midnight text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-midnight/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Authenticating..." : "Sign In to Platform"}
            </button>
          </form>
        </div>
        
        <div className="p-8 bg-brand-cream/20 border-t border-brand-border text-center">
          <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em]">
            An initiative by Sikshanext Private Limited
          </p>
        </div>
      </div>
    </div>
  );
}
