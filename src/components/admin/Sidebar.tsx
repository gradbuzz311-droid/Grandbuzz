"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ClipboardList, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role: string | null;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: role === 'admin' ? "/admin" : "/contributor", roles: ["admin", "contributor"] },
    { name: "Posts", icon: FileText, path: "/admin/posts", roles: ["admin", "contributor"] },
    { name: "Users", icon: Users, path: "/admin/contributors", roles: ["admin"] },
    { name: "Applications", icon: ClipboardList, path: "/admin/applications", roles: ["admin"] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role || ''));

  return (
    <aside className="w-80 bg-white border-r border-brand-border flex flex-col sticky top-0 h-screen shadow-sm">
      <div className="p-8">
        <Link href="/" className="relative h-12 w-40 block">
          <Image src="/logo.png" alt="GradBuzz Logo" fill className="object-contain" />
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

      <div className="p-8 border-t border-brand-border">
        <div className="mb-6">
           <p className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-[0.2em] mb-1">GradBuzz Editorial</p>
           <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-[0.1em]">© 2026 Sikshanext</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-red-500 hover:bg-red-50 transition-all shadow-sm shadow-red-500/5"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
