export function getAvatarUrl(path: string | null | undefined) {
  if (!path) return "/avatar-placeholder.png";
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Assuming the path is from the 'avatars' bucket in Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return path; // Fallback
  
  return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
}

export function getThumbnailUrl(path: string | null | undefined) {
  if (!path) return "/hero-placeholder.jpg";
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return path;
  
  return `${supabaseUrl}/storage/v1/object/public/posts/${path}`;
}
