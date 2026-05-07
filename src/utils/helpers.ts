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

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1920;
        const scale = Math.min(MAX_WIDTH / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
