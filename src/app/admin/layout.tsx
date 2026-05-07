"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // EMERGENCY FALLBACK: If this is your specific email, always set as admin
      if (user.email === 'asrithbehla2007@gmail.com') {
        setRole('admin');
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Layout role fetch error:", error);
        setRole('reader');
      } if (profile) {
        setRole(profile.role);
        
        // STRICT REDIRECT: Block contributors from admin sub-links
        if (profile.role === 'contributor') {
          const restrictedPaths = ['/admin/contributors', '/admin/applications', '/admin'];
          if (restrictedPaths.includes(pathname)) {
            router.push("/contributor");
            return;
          }
        }

        if (profile.role === 'reader') {
          router.push("/");
        }
      }
      setLoading(false);
    }
    checkUser();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex">
      <Sidebar role={role} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-brand-cream/20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
