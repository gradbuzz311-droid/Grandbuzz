"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  FileText, 
  Clock, 
  TrendingUp,
  MessageSquare,
  Heart,
  Eye,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function ContributorDashboard() {
  const [stats, setStats] = useState({
    published: 0,
    pending: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getContributorStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch posts count
      const { data: posts } = await supabase
        .from('posts')
        .select('status, view_count, likes')
        .eq('author_id', user.id);

      if (posts) {
        const published = posts.filter(p => p.status === 'published').length;
        const pending = posts.filter(p => p.status === 'pending').length;
        const totalViews = posts.reduce((acc, p) => acc + (p.view_count || 0), 0);
        const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);

        setStats({ published, pending, totalViews, totalLikes });
      }
      setLoading(false);
    }

    getContributorStats();
  }, [supabase]);

  const cards = [
    { label: "Published Insights", value: stats.published, icon: <FileText className="text-brand-green" />, color: "bg-brand-green/10" },
    { label: "Pending Review", value: stats.pending, icon: <Clock className="text-orange-500" />, color: "bg-orange-100" },
    { label: "Total Reach", value: stats.totalViews, icon: <Eye className="text-blue-500" />, color: "bg-blue-100" },
    { label: "Engagement", value: stats.totalLikes, icon: <Heart className="text-red-500" />, color: "bg-red-100" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="font-display text-5xl font-black text-brand-midnight tracking-tighter">Your Hub.</h1>
           <p className="text-brand-midnight/40 font-medium">Tracking your impact on the student community.</p>
        </div>
        <Link 
          href="/admin/posts/new" 
          className="flex items-center gap-2 px-8 py-4 bg-brand-midnight text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-midnight/10"
        >
          <Plus size={16} />
          Submit New Insight
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-brand-border rounded-[32px] p-8 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-6`}>
              {card.icon}
            </div>
            <div className="text-4xl font-display font-black text-brand-midnight mb-2">
              {loading ? "..." : card.value}
            </div>
            <div className="text-[10px] font-black text-brand-midnight/30 uppercase tracking-widest">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-[40px] p-10 min-h-[300px] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
            <TrendingUp className="text-brand-green" size={32} />
          </div>
          <h3 className="text-2xl font-display font-black text-brand-midnight mb-3">Audience Insights</h3>
          <p className="text-brand-midnight/40 max-w-sm mx-auto font-medium">Detailed performance charts for your posts will appear here as you gather more readers.</p>
        </div>

        <div className="bg-brand-midnight rounded-[40px] p-10 flex flex-col justify-between">
           <div className="space-y-6">
              <h3 className="text-2xl font-display font-black text-white leading-tight">Editorial Tip</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Posts with strong, relatable titles and clear "takeaways" get 3x more engagement. Keep it real.
              </p>
           </div>
           <div className="pt-10">
              <Link href="/admin/posts" className="text-brand-green text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                Manage My Posts →
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
