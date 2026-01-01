/// <reference types="vite/client" />

// Explicitly declare the env values we expect to use in this project.
// This augments the definitions provided by `vite/client` and gives
// us proper type checking/autocomplete for `import.meta.env`.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASE_PATH?: string;
  // add other VITE_... variables here as needed
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
