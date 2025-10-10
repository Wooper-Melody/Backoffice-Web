// Type declarations for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_API_URL: string
    NODE_ENV: 'development' | 'production'
    NEXT_FIREBASE_STORAGE_BUCKET: string
  }
}