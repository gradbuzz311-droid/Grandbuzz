import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col p-4 space-y-2 bg-brand-cream border-r border-brand-border w-64 z-50">
        <div className="flex items-center justify-center px-4 py-6">
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            <Image
              src="/gradbuzz.png"
              alt="GradBuzz Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-2 mt-8">
          <Link
            href="/admin"
            className="bg-brand-green text-brand-midnight font-bold rounded-full px-4 py-3 flex items-center gap-3 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-sans text-sm">Dashboard</span>
          </Link>
          <Link
            href="/admin/posts"
            className="text-brand-midnight/80 font-medium px-4 py-3 flex items-center gap-3 hover:bg-brand-border/50 rounded-full transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="font-sans text-sm">Posts</span>
          </Link>
          <Link
            href="/admin/users"
            className="text-brand-midnight/80 font-medium px-4 py-3 flex items-center gap-3 hover:bg-brand-border/50 rounded-full transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-sans text-sm">Users</span>
          </Link>
        </nav>

        <div className="mt-auto space-y-2 pb-4">
          <Link
            href="/admin/posts/new"
            className="block w-full text-center bg-brand-midnight text-white rounded-lg py-3 font-bold mb-6 hover:bg-brand-midnight/90 transition-colors text-sm"
          >
            New Post
          </Link>
          <button className="w-full text-left text-brand-midnight/80 font-medium px-4 py-3 flex items-center gap-3 hover:bg-brand-border/50 rounded-full transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="font-sans text-sm">Settings</span>
          </button>
          <button className="w-full text-left text-brand-midnight/80 font-medium px-4 py-3 flex items-center gap-3 hover:bg-brand-border/50 rounded-full transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span className="font-sans text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-8 py-4 w-full z-40 bg-white border-b border-brand-border sticky top-0 h-16">
          <div className="flex items-center">
            <h2 className="font-display text-xl font-extrabold text-brand-midnight">GradBuzz</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-72">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-midnight/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full bg-brand-cream/50 border border-brand-border rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:outline-none text-sm transition-all placeholder:text-brand-midnight/40"
                placeholder="Search data..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-brand-midnight/70 text-sm font-medium hover:text-brand-green hover:bg-brand-cream px-3 py-1.5 rounded transition-all">
                View Site
              </Link>
              <div className="w-8 h-8 rounded-full border border-brand-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-brand-cream">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-brand-midnight/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {children}
      </main>
    </div>
  );
}
