import path from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, 'src/index.ts'),
        node: path.resolve(import.meta.dirname, 'src/node.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['argon2', 'node-gyp-build', 'node:crypto', 'dayjs', 'transliteration', 'zod'],
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
  },
});
