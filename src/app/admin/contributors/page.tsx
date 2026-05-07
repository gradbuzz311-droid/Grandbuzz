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
  X,
  Upload,
  Briefcase,
  Lock,
  Loader2,
  Camera,
  AlignLeft,
  Edit2
} from "lucide-react";

interface Contributor {
  id: string;
  full_name: string;
  email: string;
  role: string;
  role_description: string;
  bio: string;
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
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role_description: "",
    bio: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchContributors();
  }, []);

  async function fetchContributors() {
    const supabase = createClient();
    setLoading(true);
    
    // Explicitly listing columns to debug if one is missing
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, role_description, bio, updated_at')
      .neq('role', 'admin')
      .neq('role', 'reader')
      .order('full_name');

    if (error) {
      console.error("Fetch error:", error);
      // If columns are missing, this will help identify which one
    }

    if (data) setContributors(data as any);
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function handleRemove(id: string) {
    if (!confirm("Are you sure you want to remove this contributor?")) return;
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ role: 'reader' }).eq('id', id);
    if (!error) await fetchContributors();
  }

  const openEditModal = (contributor: Contributor) => {
    setEditingContributor(contributor);
    setFormData({
      email: contributor.email || "", // Email might not be in profiles table normally, we might need a join or just leave it
      password: "", // Don't edit password here
      full_name: contributor.full_name || "",
      role_description: contributor.role_description || "",
      bio: contributor.bio || ""
    });
    setAvatarPreview(contributor.avatar_url || null);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingContributor(null);
    setFormData({ email: "", password: "", full_name: "", role_description: "", bio: "" });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      let publicUrl = avatarPreview || "";
      
      // 1. Handle Image Upload if new file selected
      if (avatarFile) {
        const fileName = `${Math.random()}.${avatarFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, avatarFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl: url } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        publicUrl = url;
      }

      if (editingContributor) {
        // UPDATE Existing
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role_description: formData.role_description,
            bio: formData.bio,
            avatar_url: publicUrl
          })
          .eq('id', editingContributor.id);

        if (error) throw error;
        alert("Contributor updated successfully!");
      } else {
        // CREATE New
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        const signupClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
        );

        const { data, error: authError } = await signupClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.full_name, avatar_url: publicUrl } }
        });

        if (authError) throw authError;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              role: 'contributor',
              role_description: formData.role_description,
              bio: formData.bio,
              full_name: formData.full_name,
              avatar_url: publicUrl
            })
            .eq('id', data.user.id);

          if (profileError) throw profileError;
          alert("Contributor added successfully!");
        }
      }

      closeForm();
      await fetchContributors();
    } catch (err: any) {
      alert(err.message || "Operation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContributors = contributors.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl text-brand-midnight font-bold">Contributors</h1>
          <p className="text-brand-midnight/60 font-medium">Manage your verified team of writers and editors.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-brand-green text-brand-midnight font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-brand-green/10">
            <Plus size={20} /> Add Contributor
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20 group-focus-within:text-brand-midnight" size={20} />
          <input 
            type="text" placeholder="Search contributors..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-brand-border rounded-2xl focus:border-brand-green outline-none font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-white border border-brand-border rounded-[2.5rem] p-8 h-64 animate-pulse" />) : filteredContributors.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <Users size={48} className="text-brand-border mb-4" />
            <h3 className="text-xl font-display font-bold text-brand-midnight mb-2">No contributors found</h3>
            <p className="text-brand-midnight/40">Ensure you have run the SQL to add 'bio' and 'role_description' columns.</p>
          </div>
        ) : filteredContributors.map((user) => (
          <div key={user.id} className="group bg-white border border-brand-border rounded-[2.5rem] p-8 transition-all hover:shadow-xl flex flex-col h-full border-b-4 border-b-transparent hover:border-b-brand-green">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-cream border border-brand-border flex items-center justify-center text-brand-midnight text-2xl font-display font-bold overflow-hidden shadow-inner">
                {user.avatar_url ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" /> : user.full_name?.charAt(0)}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase tracking-widest">{user.role}</div>
                <button 
                  onClick={() => openEditModal(user)}
                  className="p-2 bg-brand-cream hover:bg-brand-midnight hover:text-white rounded-xl transition-all"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-display font-bold text-brand-midnight mb-1 group-hover:text-brand-green transition-colors">{user.full_name}</h3>
              <div className="flex items-center gap-2 text-brand-midnight/70 text-xs font-bold uppercase tracking-wider mb-4">
                <Briefcase size={12} className="text-brand-green" />
                {user.role_description || "Verified Contributor"}
              </div>
              
              {user.bio && (
                <p className="text-brand-midnight/60 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                  "{user.bio}"
                </p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-border/50 mt-auto">
              <div className="flex items-center gap-2">
                <button onClick={() => handleRemove(user.id)} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-cream/50 text-brand-midnight/60 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 text-sm transition-all"><UserMinus size={16} />Remove</button>
                <button className="p-3 bg-brand-cream/50 text-brand-midnight/60 rounded-xl hover:bg-brand-midnight hover:text-white transition-all"><Shield size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-midnight/60 backdrop-blur-sm" onClick={closeForm} />
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-brand-border bg-brand-cream/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-midnight">{editingContributor ? "Edit Contributor" : "Add Contributor"}</h2>
                <p className="text-sm text-brand-midnight/40 font-medium">Update account details and permissions.</p>
              </div>
              <button onClick={closeForm} className="p-2 hover:bg-brand-midnight/5 rounded-xl"><X size={24} className="text-brand-midnight/40" /></button>
            </div>

            <form onSubmit={handleAction} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative w-24 h-24 rounded-3xl bg-brand-cream border-2 border-dashed border-brand-border flex items-center justify-center overflow-hidden group">
                  {avatarPreview ? <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={32} className="text-brand-midnight/20" />}
                  <label className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload size={20} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest">Profile Photo</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" placeholder="John Doe" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl outline-none font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Working Company</label>
                  <input required type="text" placeholder="e.g. Developer at Google" value={formData.role_description} onChange={(e) => setFormData({...formData, role_description: e.target.value})} className="w-full px-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl outline-none font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Bio / Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-brand-midnight/20" size={18} />
                  <textarea 
                    required 
                    placeholder="Tell us about their expertise..." 
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl outline-none font-medium resize-none"
                  />
                </div>
              </div>

              {!editingContributor && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20" size={18} />
                      <input required type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl outline-none font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-midnight/20" size={18} />
                      <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-brand-cream/30 border border-brand-border rounded-xl outline-none font-medium" />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeForm} className="flex-1 py-4 px-6 border border-brand-border text-brand-midnight/60 font-bold rounded-2xl hover:bg-brand-cream/50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 px-6 bg-brand-green text-brand-midnight font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingContributor ? <Shield size={20} /> : <Plus size={20} />)}
                  {editingContributor ? "Update Profile" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
