"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ContributorApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    working_company: "",
    profession: "",
    linkedin: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('contributor_applications')
        .insert([formData]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting application:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-brand-border text-center space-y-6">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-brand-green" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-brand-midnight">Application Sent!</h1>
          <p className="text-brand-midnight/50 text-sm leading-relaxed">
            Thank you for applying to be a contributor at GradBuzz. Our team will review your profile and get back to you via email shortly.
          </p>
          <Link href="/" className="inline-block w-full py-4 bg-brand-midnight text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center p-6 py-12 md:py-20">
      <Link href="/" className="mb-12 hover:opacity-80 transition-opacity">
        <Image src="/gradbuzz.png" alt="GradBuzz" width={140} height={40} className="object-contain" priority />
      </Link>

      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 border border-brand-border space-y-10">
        <header className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-brand-midnight/40 hover:text-brand-midnight transition-colors uppercase tracking-widest mb-2">
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 className="text-3xl font-bold text-brand-midnight tracking-tight">Become a Contributor</h1>
          <p className="text-brand-midnight/50 text-sm">
            Share your experiences and help the next generation of students build better careers.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/60 block">Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/60 block">Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/60 block">Working Company</label>
              <input 
                type="text" 
                required 
                value={formData.working_company}
                onChange={(e) => setFormData({...formData, working_company: e.target.value})}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="e.g. Google, SikshaNext" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-brand-midnight/60 block">Profession</label>
              <input 
                type="text" 
                required 
                value={formData.profession}
                onChange={(e) => setFormData({...formData, profession: e.target.value})}
                className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
                placeholder="e.g. Software Engineer" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-brand-midnight/60 block">LinkedIn Profile URL</label>
            <input 
              type="url" 
              required 
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="w-full border border-brand-border rounded-xl py-3.5 px-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-brand-midnight/20"
              placeholder="https://linkedin.com/in/johndoe" 
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-4 px-5 rounded-2xl font-bold animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand-midnight text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>

      <footer className="mt-20 text-center space-y-4">
        <p className="text-[10px] font-bold text-brand-midnight/20 uppercase tracking-widest leading-relaxed">
          © 2026 GradBuzz. All Rights Reserved. <br className="md:hidden" />
          An initiative by Sikshanext Private Limited.
        </p>
      </footer>
    </div>
  );
}
