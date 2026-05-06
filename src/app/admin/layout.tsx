import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Header */}
      <header className="flex justify-between items-center px-8 py-4 w-full z-40 bg-white border-b border-brand-border sticky top-0 h-16">
        <div className="flex items-center gap-4">
          <Image
            src="/gradbuzz.png"
            alt="GradBuzz Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <h2 className="font-display text-xl font-extrabold text-brand-midnight">GradBuzz Admin</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-brand-midnight/70 text-sm font-medium hover:text-brand-green hover:bg-brand-cream px-3 py-1.5 rounded transition-all">
            View Site
          </Link>
          <button className="text-brand-midnight/70 text-sm font-medium hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-all">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

