import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <nav className="h-16 px-6 flex items-center border-b border-brand-border bg-brand-cream/90 backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="relative h-8 w-32">
          <Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority />
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <header className="space-y-4">
          <h1 className="text-[36px] md:text-[48px] font-bold leading-tight tracking-tight">About GradBuzz</h1>
          <p className="text-brand-midnight/50 text-lg leading-relaxed">
            A modern student knowledge platform built to make practical learning and career guidance easier to access.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-[24px] font-bold">Introduction</h2>
          <div className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>GradBuzz is a curated platform focused on helping students learn from real experiences.</p>
            <p>We believe students grow faster when they have access to practical insights from people who have already gone through the journey — engineers, professors, recruiters, mentors, and experienced students.</p>
            <p>Instead of overwhelming students with generic internet advice, GradBuzz focuses on meaningful knowledge that is:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>practical</li>
              <li>relatable</li>
              <li>experience-driven</li>
              <li>student-focused</li>
            </ul>
            <p>Our goal is to create a space where learning feels clear, modern, and genuinely useful.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-bold">Why GradBuzz Was Created</h2>
          <div className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>Many students today struggle with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>information overload</li>
              <li>unclear career direction</li>
              <li>outdated guidance</li>
              <li>unrealistic expectations</li>
              <li>lack of practical exposure</li>
            </ul>
            <p>Important advice is often scattered across random videos, forums, and social media posts.</p>
            <p>GradBuzz was created to simplify that experience.</p>
            <p>We want students to discover:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>real internship experiences</li>
              <li>placement preparation strategies</li>
              <li>project-building insights</li>
              <li>career guidance</li>
              <li>academic advice</li>
              <li>practical learning resources</li>
            </ul>
            <p>all in one thoughtful and well-designed platform.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-bold">What We Believe</h2>
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl p-6 border border-brand-border">
              <h3 className="text-lg font-bold mb-2">Learning Should Feel Practical</h3>
              <p className="text-brand-midnight/60 text-sm">Students learn better when advice comes from real-world experiences.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-brand-border">
              <h3 className="text-lg font-bold mb-2">Quality Matters More Than Quantity</h3>
              <p className="text-brand-midnight/60 text-sm">We focus on meaningful insights instead of mass content.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-brand-border">
              <h3 className="text-lg font-bold mb-2">Growth Is Different For Everyone</h3>
              <p className="text-brand-midnight/60 text-sm">Every student journey is unique. There is no single roadmap for success. GradBuzz exists to support different paths, different goals, and different learning styles.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-bold">Who Contributes</h2>
          <div className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>GradBuzz invites contributions from:</p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm font-semibold text-brand-midnight">
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Software Engineers</li>
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Professors</li>
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Recruiters</li>
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Startup Founders</li>
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Experienced Students</li>
              <li className="bg-white border border-brand-border rounded-lg px-3 py-2 text-center">Industry Professionals</li>
            </ul>
            <p className="text-sm italic">All contributors are reviewed to maintain platform quality and relevance.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-bold">Our Long-Term Vision</h2>
          <div className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>We want GradBuzz to evolve into a trusted student ecosystem where:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>practical learning is prioritized</li>
              <li>students feel less lost</li>
              <li>knowledge becomes easier to navigate</li>
              <li>experienced people can guide the next generation</li>
            </ul>
            <p>The platform is still growing carefully, but the goal remains clear:</p>
            <p className="font-semibold text-brand-midnight">To build a modern, thoughtful space where students can grow with better information.</p>
          </div>
        </section>

        <section className="space-y-6 pt-12 border-t border-brand-border">
          <h2 className="text-[24px] font-bold">Built By</h2>
          <div className="bg-brand-midnight text-white rounded-3xl p-8 space-y-4">
            <p className="text-white/60 uppercase text-[10px] font-black tracking-widest">Built and managed by</p>
            <h3 className="text-2xl font-bold">SikshaNext</h3>
            <p className="text-white/70 text-sm leading-relaxed">A student-focused initiative working on modern educational and digital experiences.</p>
            <a href="https://sikshanext.in" target="_blank" rel="noopener noreferrer" className="inline-block text-brand-green font-bold text-sm hover:underline">Website: https://sikshanext.in</a>
          </div>
        </section>

        <div className="pt-8 text-center">
          <p className="text-brand-midnight/40 text-[16px] italic">
            &ldquo;Small insights can create big changes in a student&apos;s journey. GradBuzz exists to make those insights easier to discover.&rdquo;
          </p>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}
