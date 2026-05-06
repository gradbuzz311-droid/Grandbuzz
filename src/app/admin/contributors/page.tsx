"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  UserMinus, 
  Shield, 
  Mail, 
  MoreVertical,
  Search,
  Plus,
  ArrowRight
} from "lucide-react";

interface Contributor {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string;
  updated_at: string;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContributors();
  }, []);

  async function fetchContributors() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'reader')
      .order('full_name');

    if (data) setContributors(data);
    setLoading(false);
  }

  async function handleRemove(id: string) {
    if (!confirm("Are you sure you want to remove this contributor? They will be demoted to Reader role.")) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'reader' })
      .eq('id', id);

    if (error) {
      alert("Failed to remove contributor.");
    } else {
      await fetchContributors();
    }
  }

  const filteredContributors = contributors.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl text-brand-midnight font-bold">Contributors</h1>
          <p className="text-brand-midnight/60 font-medium">Manage your verified team of writers and editors.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-brand-midnight text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-midnight/10 shrink-0">
          <Plus size={20} />
          Invite Contributor
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20 group-focus-within:text-brand-midnight transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search contributors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-brand-border rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-brand-midnight placeholder:text-brand-midnight/20"
          />
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-brand-border rounded-[2.5rem] p-8 h-64 animate-pulse" />
          ))
        ) : filteredContributors.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <Users size={48} className="text-brand-border mb-4" />
            <h3 className="text-xl font-display font-bold text-brand-midnight mb-2">No contributors found</h3>
            <p className="text-brand-midnight/40">Try adjusting your search or invite someone new.</p>
          </div>
        ) : (
          filteredContributors.map((user) => (
            <div key={user.id} className="group bg-white border border-brand-border rounded-[2.5rem] p-8 transition-all hover:shadow-xl hover:border-brand-midnight/5">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-brand-cream border border-brand-border flex items-center justify-center text-brand-midnight text-2xl font-display font-bold overflow-hidden shadow-inner">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    user.full_name?.charAt(0)
                  )}
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase tracking-widest">
                  {user.role}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-display font-bold text-brand-midnight mb-1 group-hover:text-brand-green transition-colors">{user.full_name}</h3>
                <div className="flex items-center gap-2 text-brand-midnight/40 text-sm font-medium">
                  <Mail size={14} />
                  {user.email}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-brand-border/50">
                <button 
                  onClick={() => handleRemove(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-cream/50 text-brand-midnight/60 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-sm"
                >
                  <UserMinus size={16} />
                  Remove
                </button>
                <button className="p-3 bg-brand-cream/50 text-brand-midnight/60 rounded-xl hover:bg-brand-midnight hover:text-white transition-all">
                  <Shield size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Banner */}
      {!loading && filteredContributors.length > 0 && (
        <div className="bg-brand-green text-brand-midnight rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-display font-bold mb-2 leading-tight">Scale your content team</h3>
            <p className="font-medium text-brand-midnight/60 max-w-md leading-relaxed">Invite more verified professionals to share their knowledge with the GradBuzz community.</p>
          </div>
          <button className="relative z-10 flex items-center gap-3 px-8 py-4 bg-brand-midnight text-white font-bold rounded-2xl hover:scale-[1.05] transition-all shadow-2xl">
            Invite New Member
            <ArrowRight size={20} />
          </button>
          {/* Decorative Circle */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}
    </div>
  );
}
