/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path, { join } from 'path'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })
const IS_ELECTRON = process.env.IS_ELECTRON

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: './',
  base: '/',
  clearScreen: IS_ELECTRON ? false : true,
  plugins: [
    react(),

    /**
     * @see https://github.com/vbenjs/vite-plugin-svg-icons
     */
    createSvgIconsPlugin({
      iconDirs: [join(__dirname, './assets/icons')],
      symbolId: 'icon-[name]',
    }),
  ],
  build: {
    target: IS_ELECTRON ? 'esnext' : 'modules',
    sourcemap: true,
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      plugins: [
        visualizer({
          filename: './bundle-stats.html',
          gzipSize: true,
          projectRoot: './',
          template: 'treemap',
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': join(__dirname, '../'),
    },
  },
  server: {
    port: Number(process.env['ELECTRON_WEB_SERVER_PORT'] || 42710),
    strictPort: IS_ELECTRON ? true : false,
    proxy: {
      '/netease/': {
        target: `http://127.0.0.1:${
          process.env.ELECTRON_DEV_NETEASE_API_PORT || 3000
        }`,
        changeOrigin: true,
        rewrite: path => (IS_ELECTRON ? path : path.replace(/^\/netease/, '')),
      },
      '/yesplaymusic/': {
        target: `http://127.0.0.1:${
          process.env.ELECTRON_DEV_NETEASE_API_PORT || 3000
        }`,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})