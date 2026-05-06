"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  FileText, 
  Clock, 
  Users, 
  ClipboardList,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    contributors: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      
      const [
        { count: postsCount },
        { count: pendingCount },
        { count: contributorsCount },
        { count: applicationsCount }
      ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'contributor'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        totalPosts: postsCount || 0,
        pendingPosts: pendingCount || 0,
        contributors: contributorsCount || 0,
        applications: applicationsCount || 0
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { 
      label: "Total Posts", 
      value: stats.totalPosts, 
      icon: <FileText className="text-blue-500" />, 
      href: "/admin/posts",
      color: "bg-blue-50"
    },
    { 
      label: "Pending Review", 
      value: stats.pendingPosts, 
      icon: <Clock className="text-orange-500" />, 
      href: "/admin/posts?status=pending",
      color: "bg-orange-50"
    },
    { 
      label: "Active Contributors", 
      value: stats.contributors, 
      icon: <Users className="text-green-500" />, 
      href: "/admin/contributors",
      color: "bg-green-50"
    },
    { 
      label: "New Applications", 
      value: stats.applications, 
      icon: <ClipboardList className="text-purple-500" />, 
      href: "/admin/applications",
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl text-brand-midnight font-bold">Dashboard</h1>
        <p className="text-brand-midnight/60 font-medium">Welcome to your GradBuzz command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link 
            key={card.label}
            href={card.href}
            className="group bg-white border border-brand-border rounded-3xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.color} transition-colors`}>
                {card.icon}
              </div>
              <ArrowUpRight className="text-brand-border group-hover:text-brand-midnight transition-colors" size={20} />
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-midnight mb-1">
                {loading ? "..." : card.value}
              </div>
              <div className="text-sm font-medium text-brand-midnight/40 group-hover:text-brand-midnight/60 transition-colors">
                {card.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/50 border border-brand-border rounded-[2.5rem] p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center mb-4">
            <TrendingUp className="text-brand-green" size={32} />
          </div>
          <h3 className="text-xl font-display font-bold text-brand-midnight mb-2">Growth Tracking</h3>
          <p className="text-brand-midnight/40 max-w-sm mx-auto">Analytics and performance tracking will appear here as your content grows.</p>
        </div>
        
        <div className="bg-brand-midnight text-white rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 leading-tight">Ready to publish something new?</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">Ensure your content meets the GradBuzz quality standards before submitting for review.</p>
          </div>
          <Link 
            href="/admin/posts/new" 
            target="_blank"
            className="bg-brand-green text-brand-midnight font-bold py-4 px-6 rounded-2xl text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-green/20"
          >
            Create New Post
          </Link>
        </div>
      </div>
    </div>
  );
}



