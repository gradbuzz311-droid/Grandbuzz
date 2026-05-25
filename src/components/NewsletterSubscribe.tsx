'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // Assuming a newsletter_subscribers table exists. If not, this acts as a mock success.
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error && error.code !== '23505') { // 23505 is unique violation, meaning already subscribed
        throw error;
      }

      setStatus('success');
      setMessage("You're in! Thanks for subscribing.");
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-brand-cream/50 rounded-2xl p-8 md:p-12 text-center border border-brand-border mt-16 mb-8 max-w-3xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-brand-midnight mb-4">Get the best of GradBuzz in your inbox</h3>
      <p className="text-brand-midnight/60 mb-8 max-w-xl mx-auto">
        Join our weekly newsletter for the latest student insights, career advice, and community stories.
      </p>

      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-5 py-3 rounded-xl border border-brand-border bg-white text-brand-midnight focus:outline-none focus:ring-2 focus:ring-brand-green/50 placeholder:text-brand-midnight/30 transition-all"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl bg-brand-green text-brand-midnight font-bold hover:bg-brand-green/90 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      
      {status === 'success' && <p className="text-green-600 font-medium mt-4 text-sm">{message}</p>}
      {status === 'error' && <p className="text-red-500 font-medium mt-4 text-sm">{message}</p>}
    </div>
  );
}
