import imageUrls from "../../public/profile-image-placeholder.json";

// return a random image placeholder for a profile
export function getRandomProfileImageUrl(): string {
  const randomImageIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomImageIndex];
}
