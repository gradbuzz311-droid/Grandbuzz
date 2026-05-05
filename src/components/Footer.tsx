import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-16 bg-brand-cream border-t border-brand-border">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1120px] mx-auto px-6 md:px-10 gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-display font-bold text-brand-midnight">GradBuzz</div>
          <p className="text-brand-midnight/70 font-sans max-w-xs text-center md:text-left text-sm">
            Empowering the next generation of professionals with clarity and insight.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-8">
          <Link href="/about" className="text-brand-midnight/70 font-sans hover:text-brand-accent transition-colors text-sm">
            About Us
          </Link>
          <Link href="/contact" className="text-brand-midnight/70 font-sans hover:text-brand-accent transition-colors text-sm">
            Contact
          </Link>
          <Link href="/privacy" className="text-brand-midnight/70 font-sans hover:text-brand-accent transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-brand-midnight/70 font-sans hover:text-brand-accent transition-colors text-sm">
            Terms of Service
          </Link>
        </nav>
        <div className="text-brand-midnight/60 font-sans text-sm">
          © {new Date().getFullYear()} GradBuzz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
