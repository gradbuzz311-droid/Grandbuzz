import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-border">
      <div className="flex justify-between items-center max-w-[1120px] mx-auto px-6 md:px-10 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/gradbuzz.png"
            alt="GradBuzz Logo"
            width={160}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/education" className="text-brand-midnight/80 font-sans hover:text-brand-green transition-colors font-medium">
            Education
          </Link>
          <Link href="/jobs" className="text-brand-midnight/80 font-sans hover:text-brand-green transition-colors font-medium">
            Jobs
          </Link>
          <Link href="/interviews" className="text-brand-midnight/80 font-sans hover:text-brand-green transition-colors font-medium">
            Interviews
          </Link>
          <Link href="/campus-life" className="text-brand-midnight/80 font-sans hover:text-brand-green transition-colors font-medium">
            Campus Life
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center border-b border-brand-midnight/20 pb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-midnight/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-brand-midnight py-0 px-2 w-32 placeholder:text-brand-midnight/40"
              placeholder="Search..."
              type="text"
            />
          </div>
          <button className="bg-brand-green text-brand-midnight px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-80 transition-all shadow-sm">
            Write
          </button>
        </div>
      </div>
    </header>
  );
}
