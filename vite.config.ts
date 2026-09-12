import { fileURLToPath, URL } from 'node:url'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/roll-or-hold/',
  plugins: [preact()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
})
