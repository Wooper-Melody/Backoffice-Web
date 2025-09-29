// Type declarations for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}