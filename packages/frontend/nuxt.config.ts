import { ENodeEnv } from '@kanban-board/common';
import tailwindcss from '@tailwindcss/vite';

const NODE_ENV = process.env.NODE_ENV;

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: true,

  routeRules: {
    '/': { redirect: 'boards' },
    '/boards': { ssr: true },
    '/boards/*': { ssr: true },
    '/about': { prerender: true },
    '/docs': { prerender: true },
  },

  devtools: { enabled: NODE_ENV === ENodeEnv.DEVELOPMENT },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'dayjs-nuxt',
    '@pinia/nuxt',
    'nuxt-toast',
    'nuxt-color-picker',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    public: {
      NODE_ENV: NODE_ENV,
      BASE_URL: process.env.BACKEND_URL,
      FRONTEND_URL: process.env.FRONTEND_URL,
      WEBSOCKET_URL: process.env.WEBSOCKET_URL,
      VERSION: process.env.npm_package_version,
    },
  },

  imports: {
    scan: false,
  },

  devServer: {
    port: Number(process.env.FRONTEND_PORT),
    host: process.env.FRONTEND_HOST,
  },

  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/tailwind.css',
    '~/assets/styles/toasts.css',
    'vue-final-modal/style.css',
    'overlayscrollbars/overlayscrollbars.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  icon: {
    componentName: 'NuxtIcon',
    mode: 'svg',
    cssLayer: 'base',
    class: 'ui-icon',
    clientBundle: {
      scan: true,
    },
    serverBundle: {
      collections: ['mingcute'],
    },
    customCollections: [
      {
        prefix: 'icons',
        dir: './app/assets/icons',
        recursive: true,
        normalizeIconName: false,
      },
    ],
  },

  toast: {
    settings: {
      position: 'topCenter',
      timeout: 5000,
      titleColor: '#ffffff',
      titleSize: '16px',
      messageColor: '#ffffff',
      messageSize: '14px',
      progressBar: false,
      icon: undefined,
      iconColor: '#ffffff',
      close: false,
      closeOnClick: true,
      pauseOnHover: true,
      maxWidth: 300,
    },
  },
});
