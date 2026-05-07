import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-cream font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
            <div className="h-12 md:h-16 w-3/4 bg-gray-200 animate-pulse rounded-xl mb-8"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full aspect-[21/9] bg-gray-200 animate-pulse rounded-3xl mb-12"></div>
          
          <div className="space-y-6">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
