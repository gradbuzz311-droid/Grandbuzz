"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  UserMinus, 
  Shield, 
  Mail, 
  Search,
  Plus,
  ArrowRight,
  X,
  Upload,
  Briefcase,
  Lock,
  Loader2
} from "lucide-react";

interface Contributor {
  id: string;
  full_name: string;
  email: string;
  role: string;
  role_description: string;
  avatar_url: string;
  updated_at: string;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role_description: "",
    avatar_url: ""
  });

  useEffect(() => {
    fetchContributors();
  }, []);

  async function fetchContributors() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin') // DON'T SHOW ADMINS
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

  const handleInviteClick = () => {
    setNotification("Building Notify... Coming Soon!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();

    try {
      // Create user in Auth
      // Note: This might log out the admin if persistSession is true in the client.
      // Ideally this should be a server action or edge function, but for this phase:
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            avatar_url: formData.avatar_url
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        // Update profile role to contributor and add role_description
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'contributor',
            role_description: formData.role_description,
            full_name: formData.full_name,
            avatar_url: formData.avatar_url
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        alert("Contributor added successfully!");
        setIsModalOpen(false);
        setFormData({ email: "", password: "", full_name: "", role_description: "", avatar_url: "" });
        await fetchContributors();
      }
    } catch (err: any) {
      alert(err.message || "Failed to add contributor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContributors = contributors.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Custom Notification */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-brand-midnight text-brand-green px-6 py-3 rounded-2xl shadow-2xl border border-brand-green/20 animate-in slide-in-from-top-4 duration-300 flex items-center gap-3">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-bold text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl text-brand-midnight font-bold">Contributors</h1>
          <p className="text-brand-midnight/60 font-medium">Manage your verified team of writers and editors.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 bg-brand-green text-brand-midnight font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-green/10 shrink-0"
           >
            <Plus size={20} />
            Add Contributor
          </button>
          <button 
            onClick={handleInviteClick}
            className="flex items-center gap-2 px-6 py-4 bg-brand-midnight text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-midnight/10 shrink-0"
          >
            <Mail size={20} />
            Invite Link
          </button>
        </div>
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
            <p className="text-brand-midnight/40">Try adjusting your search or add someone new.</p>
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
                <div className="flex items-center gap-2 text-brand-midnight/40 text-sm font-medium mb-3">
                  <Mail size={14} />
                  {user.email || "No email provided"}
                </div>
                <div className="flex items-center gap-2 text-brand-midnight/70 text-xs font-bold uppercase tracking-wider">
                  <Briefcase size={12} className="text-brand-green" />
                  {user.role_description || "Contributor"}
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

      {/* Add Contributor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-midnight/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-brand-border flex justify-between items-center bg-brand-cream/30">
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-midnight">Add New Contributor</h2>
                <p className="text-sm text-brand-midnight/40 font-medium">Create a verified account for your team.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-midnight/5 rounded-xl transition-colors">
                <X size={24} className="text-brand-midnight/40" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Working Company</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Developer at Google"
                    value={formData.role_description}
                    onChange={(e) => setFormData({...formData, role_description: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Temporary Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Avatar URL (Optional)</label>
                <div className="relative">
                  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://example.com/photo.jpg"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 border border-brand-border text-brand-midnight/60 font-bold rounded-2xl hover:bg-brand-cream/50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] py-4 px-6 bg-brand-green text-brand-midnight font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-green/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
