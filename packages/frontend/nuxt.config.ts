export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/image",
    "dayjs-nuxt",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-tiptap-editor",
    "nuxt-toast",
    "nuxt-color-picker",
  ],
});
