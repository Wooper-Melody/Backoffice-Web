// https://firebasestorage.googleapis.com/v0/b/<BUCKET>/o/<ENCODED_PATH>?alt=media
export function getFirebaseStorageUrl(path?: string | null): string | undefined {
  if (!path) return undefined

  // If the path is already an absolute URL, return it as is
  if (/^https?:\/\//i.test(path)) return path

  // Ensure no duplicate slashes
  const normalized = path.startsWith("/") ? path.substring(1) : path

  // Get the public bucket exposed at build time (NEXT_PUBLIC_...)
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET

  if (!bucket) {
    // If no bucket is configured, return the original path and warn in console
    // (in production it's advisable to ensure NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is defined)
    // eslint-disable-next-line no-console
    console.warn("Firebase storage bucket is not configured in ENV (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET). Returning the path unmodified.")
    return normalized
  }

  const encodedPath = encodeURIComponent(normalized)
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`
}
