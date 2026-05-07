import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gradbuzz.sikshanext.in';
  const supabase = await createClient();

  // Define static routes
  const staticRoutes = [
    '',
    '/about',
    '/posts',
    '/login',
    '/contributor/apply',
    '/mission',
    '/privacy',
    '/terms',
    '/cookies'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch dynamic post routes
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published');

    const dynamicRoutes = (posts || []).map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticRoutes;
  }
}
