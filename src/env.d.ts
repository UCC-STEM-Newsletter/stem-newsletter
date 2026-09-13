/// <reference types="astro/client" />

/** Vite `?raw` imports (used for the inline theme boot script). */
declare module '*?raw' {
  const content: string;
  export default content;
}
