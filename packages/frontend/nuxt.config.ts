import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: process.env.NODE_ENV === 'development' },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-tiptap-editor',
    'nuxt-toast',
    'nuxt-color-picker',
  ],

  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV,
    },
  },

  imports: {
    scan: false,
  },
});
