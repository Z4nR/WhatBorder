/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API: string;
}

interface importMeta {
  readonly env: ImportMetaEnv;
}
