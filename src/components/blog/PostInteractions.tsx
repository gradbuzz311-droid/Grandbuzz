"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  LogIn 
} from "lucide-react";
import Link from "next/link";

interface PostInteractionProps {
  postId: string;
  initialLikes?: number;
  initialComments?: number;
  initialBookmarks?: number;
  isLoggedIn: boolean;
}

export default function PostInteractions({ 
  postId, 
  initialLikes = 0, 
  initialComments = 0, 
  isLoggedIn 
}: PostInteractionProps) {
  const supabase = createClient();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      checkUserInteractions();
    }
    incrementView();
  }, [isLoggedIn]);

  const checkUserInteractions = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    const { data } = await supabase
      .from('post_interactions')
      .select('type')
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (data) {
      setHasLiked(data.some(i => i.type === 'like'));
    }
  };

  const incrementView = async () => {
    // Basic view increment logic
    await supabase.rpc('increment_views', { post_id: postId });
  };

  const handleInteraction = async (type: 'like' | 'bookmark' | 'comment') => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (type === 'like') {
      if (hasLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', postId)
          .eq('type', 'like');
        
        if (!error) {
          setLikes(prev => prev - 1);
          setHasLiked(false);
        }
      } else {
        // Like
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        const { error } = await supabase
          .from('post_interactions')
          .insert({ post_id: postId, user_id: user?.id, type: 'like' });
        
        if (!error) {
          setLikes(prev => prev + 1);
          setHasLiked(true);
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-8 py-6 border-y border-brand-border my-10">
        <button 
          onClick={() => handleInteraction('like')}
          className={`flex items-center gap-2 transition-all ${hasLiked ? 'text-red-500 scale-110' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
        >
          <Heart size={24} fill={hasLiked ? "currentColor" : "none"} />
          <span className="text-sm font-bold">{likes}</span>
        </button>

        <button 
          onClick={() => handleInteraction('comment')}
          className="flex items-center gap-2 text-brand-midnight/40 hover:text-brand-midnight transition-all"
        >
          <MessageSquare size={24} />
          <span className="text-sm font-bold">{initialComments}</span>
        </button>

        <button 
          onClick={() => handleInteraction('bookmark')}
          className="flex items-center gap-2 text-brand-midnight/40 hover:text-brand-midnight transition-all"
        >
          <Bookmark size={24} />
        </button>

        <button className="ml-auto text-brand-midnight/40 hover:text-brand-midnight transition-all">
          <Share2 size={24} />
        </button>
      </div>

      {/* Auth Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-midnight/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto">
              <LogIn size={32} className="text-brand-green" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-brand-midnight">Join the conversation</h3>
              <p className="text-sm text-brand-midnight/60 font-medium leading-relaxed">
                Log in to like, comment, and bookmark this insight from the GradBuzz community.
              </p>
            </div>
            <div className="grid gap-3">
              <Link 
                href="/login" 
                className="bg-brand-midnight text-white py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all"
              >
                Sign In Now
              </Link>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-sm font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
