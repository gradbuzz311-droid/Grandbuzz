"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import WhySection from "@/components/home/WhySection";
import WhoWritesSection from "@/components/home/WhoWritesSection";
import BentoInsights from "@/components/home/BentoInsights";
import JourneySection from "@/components/home/JourneySection";
import ContributorCTA from "@/components/home/ContributorCTA";
import Footer from "@/components/home/Footer";
import { getAvatarUrl, getThumbnailUrl } from "@/utils/helpers";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch recent posts for Bento Grid (need 5 posts)
      const { data: recent } = await supabase
        .from('posts')
        .select(`
          id, title, slug, thumbnail_url, meta_description, created_at,
          author:profiles(full_name, avatar_url, role),
          categories:post_categories(category:categories(name))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPosts(recent || []);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-green/30 overflow-x-hidden">
      <Navbar />

      <main>
        <HeroSection />
        
        <WhySection />
        
        <WhoWritesSection />
        
        {!loading && recentPosts.length > 0 && (
          <BentoInsights posts={recentPosts} />
        )}
        
        <JourneySection />
        
        <ContributorCTA />
      </main>

      <Footer />
    </div>
  );
}
