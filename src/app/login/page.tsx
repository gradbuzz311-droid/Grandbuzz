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
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      setError(null);
      setIsSignup(false);
      alert("Check your email to confirm your account.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }

    const { data: profile } = await supabase.from('profiles').select('role').single();
    if (profile?.role === 'admin') router.push("/admin");
    else if (profile?.role === 'contributor') router.push("/contributor");
    else router.push("/");
    router.refresh();
  };

  const handleOAuth = async (provider: 'google' | 'linkedin_oidc') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-brand-border">
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <Link href="/" className="relative h-10 w-36">
              <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain" priority />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-brand-midnight text-center mb-8">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 py-3.5 border border-brand-border rounded-xl text-[14px] font-medium text-brand-midnight hover:bg-brand-cream/50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={() => handleOAuth('linkedin_oidc')} className="w-full flex items-center justify-center gap-3 py-3.5 border border-brand-border rounded-xl text-[14px] font-medium text-brand-midnight hover:bg-brand-cream/50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-[12px] text-brand-midnight/30">or</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/50 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/50 block">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="••••••••" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] py-3 px-4 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-brand-midnight text-white font-semibold text-[14px] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-[13px] text-brand-midnight/40 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignup(!isSignup); setError(null); }} className="text-brand-green font-semibold hover:underline">
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        <div className="px-10 py-5 bg-brand-cream/30 border-t border-brand-border text-center">
          <p className="text-[12px] text-brand-midnight/25">An initiative by Sikshanext Private Limited</p>
        </div>
      </div>
    </div>
  );
}
