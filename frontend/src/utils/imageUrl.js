/**
 * Returns the correct image URL based on the environment.
 * In development, images are served from localhost:5000.
 * In production, images are served from the Render backend.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/600x800?text=Fashion+Cloth';
  if (imagePath.startsWith('http')) return imagePath;

  // In development, always point to the local backend port 5000
  const baseUrl = import.meta.env.MODE === 'development'
    ? `http://${window.location.hostname}:5000`
    : 'https://fashion-9hk0.onrender.com';

  // Clean the path to avoid double slashes
  const cleanPath = imagePath.replace(/^\/+/, '');

  return `${baseUrl}/${cleanPath}`;
};
cleanPath = normalizedPath.substring(uploadsIndex);
  } else {
  cleanPath = normalizedPath.replace(/^\/+/, '');
  cleanPath = `uploads/${cleanPath}`;
}

const finalUrl = `${baseUrl}/${cleanPath}`;
// Log the generated URL for debugging in the browser console
if (import.meta.env.MODE === 'development') {
  console.log(`[Image Resolution] Input: ${imagePath} -> Output: ${finalUrl}`);
}

return finalUrl;
};
