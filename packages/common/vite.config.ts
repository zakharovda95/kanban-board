import path from 'node:path';
import { builtinModules } from 'node:module';

import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['argon2', 'node-gyp-build', 'node:crypto', 'dayjs', 'transliteration'],
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
  },
});
