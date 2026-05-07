import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <nav className="h-16 px-6 flex items-center border-b border-brand-border bg-brand-cream/90 backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority /></Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-[36px] font-display font-bold tracking-tight">Privacy Policy</h1>

        <section className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
          <p>Your privacy matters to us. This Privacy Policy explains how GradBuzz collects, uses, and protects information when you use our website.</p>
          <p>By accessing or using GradBuzz, you agree to the practices described in this policy.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Information We Collect</h2>
          <div className="text-[16px] text-brand-midnight/70 leading-relaxed space-y-3">
            <p><strong>Information you provide:</strong> name, email address, contributor application details, profile information, submitted articles, and communication messages.</p>
            <p><strong>Automatically collected:</strong> browser type, device information, pages visited, session duration, referring links, and general analytics data.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">How We Use Information</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">We use collected information to operate the platform, review contributor applications, improve website performance, understand content engagement, maintain security, and prevent misuse. We do not sell personal data.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Contributor Information</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">If you apply as a contributor, your submitted information may be reviewed internally. Approved contributor details such as name, role, and profile may appear publicly alongside published articles.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Cookies and Analytics</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">GradBuzz may use cookies and analytics tools to improve performance, understand visitor behavior, remember preferences, and optimize user experience. You can disable cookies through your browser settings.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Data Protection</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">We take reasonable steps to protect user information. However, no online platform can guarantee complete security. Users should also protect their own accounts and devices responsibly.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Contact</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">For questions regarding privacy or data concerns, users may contact GradBuzz through the official contact channels listed on the website.</p>
        </section>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}
