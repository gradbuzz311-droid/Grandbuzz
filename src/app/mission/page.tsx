import Link from "next/link";
import Image from "next/image";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <nav className="h-16 px-6 flex items-center border-b border-brand-border bg-brand-cream/90 backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority /></Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <header className="space-y-4">
          <h1 className="text-[36px] md:text-[48px] font-display font-bold leading-tight tracking-tight">Real insights for students building their future.</h1>
          <p className="text-brand-midnight/50 text-lg leading-relaxed">GradBuzz exists to make practical student knowledge easier to discover, easier to trust, and easier to learn from.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-[24px] font-display font-bold">Our Mission</h2>
          <div className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>The internet is full of advice for students. But most of it feels disconnected from reality.</p>
            <p>Students are constantly flooded with generic motivation, recycled placement tips, outdated career advice, unrealistic productivity content, and random opinions without real experience.</p>
            <p>GradBuzz was created to change that.</p>
            <p>We believe students grow faster when they learn from people who have already gone through the process — engineers, professors, recruiters, mentors, and students with real experiences.</p>
            <p>Our goal is not to become another blogging platform. Our goal is to build a curated knowledge network where practical advice is shared clearly, honestly, and meaningfully.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-display font-bold">What Makes GradBuzz Different</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Curated Contributors", d: "Not everyone can publish. We review contributors carefully to maintain quality." },
              { t: "Practical Over Viral", d: "We prioritize useful insights over attention-grabbing content." },
              { t: "Designed for Students", d: "Built specifically for students navigating college, internships, placements, and career decisions." },
            ].map(({ t, d }) => (
              <div key={t} className="bg-white rounded-xl p-5 border border-brand-border">
                <p className="text-[14px] font-bold text-brand-midnight mb-2">{t}</p>
                <p className="text-[13px] text-brand-midnight/45 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-[24px] font-display font-bold">Our Vision</h2>
          <div className="space-y-3 text-[16px] text-brand-midnight/70 leading-relaxed">
            <p>We imagine a future where students no longer depend on random internet advice to make important decisions.</p>
            <p>We want GradBuzz to become a trusted student knowledge platform, a space for meaningful career guidance, and a bridge between experienced professionals and ambitious students.</p>
          </div>
        </section>

        <div className="pt-8 border-t border-brand-border">
          <p className="text-brand-midnight/40 text-[16px] italic">Growth becomes easier when knowledge becomes clearer. That is what GradBuzz is building.</p>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}
