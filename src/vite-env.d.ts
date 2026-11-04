/// <reference types="vite/client" />

// Typed environment variables (only VITE_* ones reach the browser)
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
