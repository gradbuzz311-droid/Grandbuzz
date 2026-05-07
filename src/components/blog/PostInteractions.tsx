"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  LogIn,
  Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAvatarUrl } from "@/utils/helpers";

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
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Use refs for debouncing
  const likeTimeout = useRef<NodeJS.Timeout | null>(null);
  const bookmarkTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      checkUserInteractions();
    }
    // Fetch total comments count regardless of login status
    fetchCommentCount();
  }, [isLoggedIn]);

  const fetchCommentCount = async () => {
    const { count } = await supabase
      .from('post_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);
    if (count !== null) setComments(Array(count).fill({}));
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from('post_interactions')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('type', 'like');
    if (count !== null) setLikes(count);
  };

  useEffect(() => {
    fetchCommentCount();
    fetchLikeCount();
  }, [postId]);

  const checkUserInteractions = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;
    setCurrentUser(user);

    // Check likes
    const { data: likeData } = await supabase
      .from('post_interactions')
      .select('type')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('type', 'like')
      .maybeSingle();

    if (likeData) setHasLiked(true);

    // Check bookmarks
    const { data: bookmarkData } = await supabase
      .from('post_bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (bookmarkData) setHasBookmarked(true);
  };

  const fetchComments = async () => {
    const { data: commentsData } = await supabase
      .from('post_comments')
      .select('id, content, created_at, user_id')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (commentsData && commentsData.length > 0) {
      // Fetch profiles manually to avoid Foreign Key relation errors
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
        
      const profileMap = (profiles || []).reduce((acc: any, p: any) => {
        acc[p.id] = p;
        return acc;
      }, {});

      const enrichedComments = commentsData.map(c => ({
        ...c,
        author: profileMap[c.user_id] || { full_name: 'Anonymous', avatar_url: null }
      }));
      setComments(enrichedComments);
    } else {
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (isInteracting) return;
    setIsInteracting(true);

    const isCurrentlyLiked = hasLiked;
    // Optimistic UI update (ensuring it never goes below 0)
    setHasLiked(!isCurrentlyLiked);
    setLikes(prev => Math.max(0, isCurrentlyLiked ? prev - 1 : prev + 1));

    // Debounce the actual DB call to prevent spam
    if (likeTimeout.current) clearTimeout(likeTimeout.current);
    
    likeTimeout.current = setTimeout(async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      
      if (isCurrentlyLiked) {
        // Unlike
        await supabase.from('post_interactions').delete().eq('post_id', postId).eq('user_id', user?.id).eq('type', 'like');
      } else {
        // Like
        await supabase.from('post_interactions').insert({ post_id: postId, user_id: user?.id, type: 'like' });
      }
      setIsInteracting(false);
    }, 500); // 500ms debounce
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (isInteracting) return;
    setIsInteracting(true);

    const isCurrentlyBookmarked = hasBookmarked;
    setHasBookmarked(!isCurrentlyBookmarked);

    if (bookmarkTimeout.current) clearTimeout(bookmarkTimeout.current);

    bookmarkTimeout.current = setTimeout(async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (isCurrentlyBookmarked) {
        await supabase.from('post_bookmarks').delete().eq('post_id', postId).eq('user_id', user?.id);
      } else {
        await supabase.from('post_bookmarks').insert({ post_id: postId, user_id: user?.id });
      }
      setIsInteracting(false);
    }, 500);
  };

  const toggleComments = () => {
    if (!showComments && (!comments[0] || !comments[0].id)) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !currentUser) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: currentUser.id,
        content: newComment.trim()
      })
      .select('id, content, created_at, user_id')
      .maybeSingle();

    if (!error && data) {
      // Fetch the current user's profile to display immediately
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', currentUser.id)
        .maybeSingle();

      const newCommentData = {
        ...data,
        author: myProfile || { full_name: 'You', avatar_url: null }
      };
      
      setComments([newCommentData, ...comments]);
      setNewComment("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-8 py-6 border-y border-brand-border my-10">
        <button 
          onClick={handleLike}
          disabled={isInteracting}
          className={`flex items-center gap-2 transition-all ${hasLiked ? 'text-red-500 scale-110' : 'text-brand-midnight/40 hover:text-brand-midnight'} disabled:opacity-50`}
        >
          <Heart size={24} fill={hasLiked ? "currentColor" : "none"} />
          <span className="text-sm font-bold">{likes}</span>
        </button>

        <button 
          onClick={toggleComments}
          className={`flex items-center gap-2 transition-all ${showComments ? 'text-brand-midnight' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
        >
          <MessageSquare size={24} fill={showComments ? "currentColor" : "none"} />
          <span className="text-sm font-bold">{initialComments + comments.length}</span>
        </button>

        <button 
          onClick={handleBookmark}
          disabled={isInteracting}
          className={`flex items-center gap-2 transition-all ${hasBookmarked ? 'text-brand-midnight scale-110' : 'text-brand-midnight/40 hover:text-brand-midnight'} disabled:opacity-50`}
        >
          <Bookmark size={24} fill={hasBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-8 mb-16 animate-in slide-in-from-top-4 fade-in duration-300">
          <h3 className="text-xl font-bold mb-6">Discussion</h3>
          
          {isLoggedIn ? (
            <form onSubmit={submitComment} className="flex gap-4 mb-8">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 bg-white border border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="bg-brand-midnight text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={16} />
                Post
              </button>
            </form>
          ) : (
            <div className="bg-brand-midnight/5 rounded-xl p-6 text-center mb-8 border border-brand-border">
              <p className="text-sm text-brand-midnight/60 mb-4">Log in to join the conversation</p>
              <button onClick={() => setShowLoginModal(true)} className="bg-white px-6 py-2 rounded-lg font-bold text-sm border border-brand-border shadow-sm">
                Sign In
              </button>
            </div>
          )}

          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-midnight/10 overflow-hidden relative shrink-0">
                    <Image src={getAvatarUrl(comment.author?.avatar_url)} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="flex-1 bg-white border border-brand-border rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-brand-midnight">{comment.author?.full_name || "Anonymous"}</span>
                      <span className="text-[10px] text-brand-midnight/40">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-brand-midnight/80">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-brand-midnight/40 text-sm py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      )}

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
              <button 
                onClick={() => window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`}
                className="bg-brand-midnight text-white py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all w-full"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
