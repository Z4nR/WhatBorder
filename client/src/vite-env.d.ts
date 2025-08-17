/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND: string;
  readonly VITE_WSS: string;
  readonly VITE_SECRET: string;
  readonly VITE_USER: string;
}

interface importMeta {
  readonly env: ImportMetaEnv;
}
