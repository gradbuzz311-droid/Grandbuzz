"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Briefcase, 
  BookOpen,
  Search,
  Filter
} from "lucide-react";

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role_description: string;
  experience: string;
  proposed_topics: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setApplications(data);
    setLoading(false);
  }

  async function handleAction(id: string, userId: string, action: 'approved' | 'rejected') {
    setProcessingId(id);
    const supabase = createClient();

    try {
      // 1. Update application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: action })
        .eq('id', id);

      if (appError) throw appError;

      // 2. If approved, update user role to contributor
      if (action === 'approved') {
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'contributor' })
          .eq('id', userId);

        if (roleError) throw roleError;
      }

      // 3. Refresh list
      await fetchApplications();
    } catch (err) {
      console.error("Action failed:", err);
      alert("Failed to process application. Check console for details.");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-brand-midnight font-bold">Applications</h1>
          <p className="text-brand-midnight/60 font-medium">Review and approve new content contributors.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-border rounded-3xl p-6">
          <div className="text-sm font-medium text-brand-midnight/40 mb-1">Total Received</div>
          <div className="text-2xl font-bold text-brand-midnight">{applications.length}</div>
        </div>
        <div className="bg-white border border-brand-border rounded-3xl p-6">
          <div className="text-sm font-medium text-brand-midnight/40 mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-brand-midnight">
            {applications.filter(a => a.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-3xl p-6 text-green-600">
          <div className="text-sm font-medium text-brand-midnight/40 mb-1">Approved Today</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-brand-border rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-brand-midnight/40 italic">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <UserPlus size={48} className="text-brand-border mb-4" />
            <div className="text-xl font-display font-bold text-brand-midnight mb-2">No applications found</div>
            <p className="text-brand-midnight/40">When users apply to be contributors, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {applications.map((app) => (
              <div key={app.id} className="p-8 hover:bg-brand-cream/10 transition-colors group">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  <div className="space-y-6 flex-1">
                    {/* Header: Name & Status */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-midnight text-white flex items-center justify-center font-bold text-lg">
                        {app.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-brand-midnight">{app.full_name}</h3>
                        <div className="flex items-center gap-2 text-brand-midnight/40 text-sm font-medium">
                          <Mail size={14} />
                          {app.email}
                        </div>
                      </div>
                      <span className={`ml-auto lg:ml-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        app.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        app.status === 'approved' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-brand-midnight/40 text-xs font-bold uppercase tracking-wider">
                          <Briefcase size={12} />
                          Background / Role
                        </div>
                        <p className="text-brand-midnight/80 font-medium">{app.role_description || "Not specified"}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-brand-midnight/40 text-xs font-bold uppercase tracking-wider">
                          <BookOpen size={12} />
                          Proposed Topics
                        </div>
                        <p className="text-brand-midnight/80 font-medium">{app.proposed_topics || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-brand-midnight/40 text-xs font-bold uppercase tracking-wider">Experience</div>
                      <p className="text-brand-midnight/70 leading-relaxed text-sm bg-brand-cream/30 p-4 rounded-2xl border border-brand-border/50">
                        {app.experience || "No experience details provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {app.status === 'pending' && (
                    <div className="flex lg:flex-col gap-3 shrink-0">
                      <button
                        onClick={() => handleAction(app.id, app.user_id, 'approved')}
                        disabled={processingId === app.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-brand-midnight font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(app.id, app.user_id, 'rejected')}
                        disabled={processingId === app.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-brand-border text-brand-midnight/60 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
