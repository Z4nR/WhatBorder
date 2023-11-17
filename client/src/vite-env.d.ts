/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND: string;
}

interface importMeta {
  readonly env: ImportMetaEnv;
}
