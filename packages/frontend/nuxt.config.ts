import tailwindcss from '@tailwindcss/vite';

import { DEFAULT_HOST, DEFAULT_PORT } from './app/constants/app-config.constants';

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

  devServer: {
    port: Number(process.env.FRONTEND_PORT) || DEFAULT_PORT,
    host: process.env.FRONTEND_HOST || DEFAULT_HOST,
  },

  css: ['~/assets/styles/fonts.css', '~/assets/styles/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
  },
});
