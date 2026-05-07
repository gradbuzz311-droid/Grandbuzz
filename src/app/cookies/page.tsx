import Link from "next/link";
import Image from "next/image";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <nav className="h-16 px-6 flex items-center border-b border-brand-border bg-brand-cream/90 backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority /></Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-[36px] font-display font-bold tracking-tight">Cookies Policy</h1>

        <section className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
          <p>Cookies are small text files stored on your device when you visit a website. They help websites remember preferences, improve performance, and understand user behavior.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">How GradBuzz Uses Cookies</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">GradBuzz may use cookies to improve website functionality, remember user preferences, analyze traffic and engagement, and understand which content is useful to visitors.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Types of Cookies</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Essential", d: "Required for basic website functionality." },
              { t: "Analytics", d: "Help us understand visitor behavior, traffic sources, and popular content." },
              { t: "Preference", d: "Used to remember settings like theme preferences and interface choices." },
            ].map(({ t, d }) => (
              <div key={t} className="bg-white rounded-xl p-5 border border-brand-border">
                <p className="text-[14px] font-bold text-brand-midnight mb-2">{t}</p>
                <p className="text-[13px] text-brand-midnight/45 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Third-Party Cookies</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">Some third-party services integrated into GradBuzz may also place cookies, including analytics tools, embedded media, and hosting providers.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Managing Cookies</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">Users can control or disable cookies through browser settings. Disabling cookies may affect some website functionality.</p>
        </section>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}
