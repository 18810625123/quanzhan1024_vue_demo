import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, {VantResolve} from 'vite-plugin-style-import';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        styleImport({
            resolves: [VantResolve()],
        }),
    ],
    define: {
      'process.env': process.env
    },
    alias: {
        "@": path.resolve(__dirname, "src")
    },
    server: {
        host: '0.0.0.0',
        port: 4201
    },
    base: '/' //build生产环境的dist要用
})
