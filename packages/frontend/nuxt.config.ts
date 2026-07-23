import { ENodeEnv } from '@kanban-board/common';
import tailwindcss from '@tailwindcss/vite';

import { DEFAULT_HOST, DEFAULT_PORT } from './app/constants/app-config.constants';

const NODE_ENV = process.env.NODE_ENV;

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // ssr: false,

  devtools: { enabled: NODE_ENV === ENodeEnv.DEVELOPMENT },

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
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    public: {
      NODE_ENV: NODE_ENV,
      BASE_URL: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/api`,
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

  icon: {
    componentName: 'NuxtIcon',
    mode: 'svg',
    cssLayer: 'base',
    provider: 'iconify',
    class: 'ui-icon',
    clientBundle: {
      scan: true,
    },
    customCollections: [],
  },

  routeRules: {
    '/': { redirect: 'boards' },
    '/boards': { ssr: true },
    '/boards/*': { ssr: true },
  },
});
