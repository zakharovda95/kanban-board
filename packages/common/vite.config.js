"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    resolve: {
        alias: {
            '@': (0, node_path_1.resolve)(__dirname, 'src'),
        },
    },
    build: {
        lib: {
            entry: (0, node_path_1.resolve)(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: function () { return 'index.js'; },
        },
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
    },
});
