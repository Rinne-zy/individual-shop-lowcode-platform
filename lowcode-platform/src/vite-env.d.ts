/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AXIOS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}