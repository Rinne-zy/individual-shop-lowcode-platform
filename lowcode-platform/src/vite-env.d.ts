/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AXIOS_BASE_URL: string;
  readonly VITE_H5_RENDERER_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}