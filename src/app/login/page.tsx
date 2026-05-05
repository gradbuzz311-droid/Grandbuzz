"use client";

import { useState } from "react";
import Image from "next/image";
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
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-border">
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center">
              <Image
                src="/gradbuzz.png"
                alt="GradBuzz Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
          
          <h1 className="font-display text-3xl font-extrabold text-brand-midnight text-center mb-2">Welcome Back</h1>
          <p className="text-brand-midnight/50 text-center text-sm mb-8 font-medium italic">GradBuzz Editorial Platform</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-2 px-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-cream/30 border border-brand-border rounded-xl py-3 px-4 font-sans text-sm focus:border-brand-green outline-none transition-all"
                placeholder="editor@gradbuzz.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-brand-midnight/50 uppercase tracking-widest block mb-2 px-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-cream/30 border border-brand-border rounded-xl py-3 px-4 font-sans text-sm focus:border-brand-green outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded-xl font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-midnight text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-midnight/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <div className="p-6 bg-brand-cream/20 border-t border-brand-border text-center">
          <p className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">
            Restricted access for authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
