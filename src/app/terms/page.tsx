import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
      <nav className="h-16 px-6 flex items-center border-b border-brand-border bg-brand-cream/90 backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="relative h-8 w-32"><Image src="/gradbuzz.png" alt="GradBuzz" fill className="object-contain object-left" priority /></Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <h1 className="text-[36px] font-display font-bold tracking-tight">Terms and Conditions</h1>

        <section className="space-y-4 text-[16px] text-brand-midnight/70 leading-relaxed">
          <p>These Terms and Conditions govern the use of the GradBuzz platform. By accessing or using GradBuzz, users agree to comply with these terms.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Platform Purpose</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">GradBuzz is a curated educational and informational platform designed to share student-focused insights, experiences, and career-related knowledge. Content is intended for informational purposes only.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">User Responsibilities</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">Users agree to use the platform respectfully, avoid misuse or harmful activity, avoid copying or redistributing content without permission, and avoid posting spam or misleading information.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Contributor Guidelines</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">Approved contributors are expected to provide original content, avoid plagiarism, avoid misleading claims, maintain respectful communication, and share accurate experiences. GradBuzz reserves the right to edit, reject, or remove submissions and contributors.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Intellectual Property</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">All branding, design elements, and platform content belong to GradBuzz unless otherwise stated. Contributors retain ownership of their original work while granting GradBuzz permission to display and distribute submitted content.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Limitation of Liability</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">GradBuzz is not liable for career decisions made based on content, external website issues, temporary service interruptions, or contributor opinions. Users access and use the platform at their own discretion.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px] font-bold">Contact</h2>
          <p className="text-[16px] text-brand-midnight/70 leading-relaxed">Questions regarding these terms may be directed through the official GradBuzz contact channels.</p>
        </section>
      </main>

      <footer className="py-10 px-6 border-t border-brand-border bg-white text-center">
        <p className="text-[12px] text-brand-midnight/25">© 2026 GradBuzz. Initiative by Sikshanext Private Limited.</p>
      </footer>
    </div>
  );
}
