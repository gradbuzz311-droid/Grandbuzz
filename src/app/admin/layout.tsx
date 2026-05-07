"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ClipboardList, 
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";

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
      } else if (profile) {
        setRole(profile.role);
        if (profile.role === 'reader') {
          router.push("/");
        }
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Posts", icon: FileText, path: "/admin/posts" },
    { name: "Users", icon: Users, path: "/admin/contributors" },
    { name: "Applications", icon: ClipboardList, path: "/admin/applications" },
  ];

  // Force show all items for now to fix the empty sidebar
  const filteredMenu = menuItems;

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-brand-border flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
             <img src="/logo.png" alt="GradBuzz" className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-bold transition-all group ${
                  isActive 
                    ? "bg-brand-midnight text-white shadow-lg shadow-brand-midnight/10" 
                    : "text-brand-midnight/40 hover:bg-brand-cream hover:text-brand-midnight"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? "text-brand-green" : "group-hover:text-brand-green"} />
                  {item.name}
                </div>
                {isActive && <ChevronRight size={16} className="text-brand-green" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 max-h-screen overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
