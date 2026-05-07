"use client";

/**
 * Premium Admin/Contributor Header
 * Handles real-time profile data and role badging.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bell, Search, User } from "lucide-react";
import Image from "next/image";
import { getAvatarUrl } from "@/utils/helpers";

export default function Header() {
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    getProfile();
  }, [supabase]);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20 group-focus-within:text-brand-green transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for posts or users..." 
            className="w-full bg-brand-cream/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-green/20 transition-all placeholder:text-brand-midnight/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-brand-cream transition-colors text-brand-midnight/40 hover:text-brand-midnight">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-green rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-brand-border" />

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-brand-midnight leading-none mb-1">
              {profile?.full_name || "Loading..."}
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-brand-green">
              {profile?.role || "User"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-brand-border bg-brand-cream shadow-sm shadow-brand-midnight/5">
             <Image 
                src={getAvatarUrl(profile?.avatar_url)} 
                alt="Profile" 
                fill 
                className="object-cover" 
             />
          </div>
        </div>
      </div>
    </header>
  );
}
