export default function AdminDashboard() {
  const topPosts: any[] = []; // Empty array for now

  return (
    <section className="p-8 max-w-[1120px] mx-auto w-full space-y-12">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="font-display text-4xl text-brand-midnight font-bold">Good morning, Admin</h1>
        <p className="text-brand-midnight/70 font-sans text-lg">Here's what's happening with the GradBuzz platform today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-brand-midnight/60 uppercase tracking-wider">Total Views</p>
            <span className="bg-brand-midnight/5 text-brand-midnight/50 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              0%
            </span>
          </div>
          <p className="font-display text-3xl font-bold mt-4 text-brand-midnight">0</p>
        </div>
        
        <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-brand-midnight/60 uppercase tracking-wider">Active Posts</p>
          <p className="font-display text-3xl font-bold mt-4 text-brand-midnight">0</p>
        </div>
        
        <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-brand-midnight/60 uppercase tracking-wider">New Users</p>
          <p className="font-display text-3xl font-bold mt-4 text-brand-midnight">0</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm opacity-50">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-display text-2xl font-bold text-brand-midnight">Weekly Traffic</h3>
          <div className="flex gap-2">
             <span className="text-xs font-bold text-brand-midnight/50 uppercase tracking-wider">Not enough data</span>
          </div>
        </div>

        {/* Empty Chart */}
        <div className="h-64 w-full relative flex items-end justify-between px-2 overflow-hidden border-b border-l border-brand-border/50">
          <div className="flex-1 flex justify-between w-full absolute bottom-2 left-0 px-4 text-brand-midnight/30 font-bold text-xs uppercase tracking-widest">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-brand-border bg-brand-cream/30">
          <h3 className="font-display text-2xl font-bold text-brand-midnight">Top Performing Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-cream/50 text-xs font-bold text-brand-midnight/60 uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Views</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-brand-border">
              {topPosts.length > 0 ? (
                topPosts.map((post, index) => (
                  <tr key={index} className="hover:bg-brand-cream/30 transition-colors">
                     {/* Data will go here */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-brand-midnight/50 font-sans">
                    No posts published yet. Data will appear here once you start publishing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
