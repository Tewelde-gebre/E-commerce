/**
 * Returns the correct image URL based on the environment.
 * In development, images are served from localhost:5000.
 * In production, images are served from the Render backend.
 */
const BACKEND_URL = import.meta.env.MODE === 'development'
  ? 'http://127.0.0.1:5000'
  : 'https://fashion-9hk0.onrender.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Ensure we don't have double slashes if imagePath starts with /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${cleanPath}`;
};
