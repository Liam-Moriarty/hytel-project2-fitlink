/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react() as any],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Run tests in a single fork
      },
    },

    // Force sequential execution
    fileParallelism: false,
    maxConcurrency: 1,

    // Add these for better isolation
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    isolate: true, // Isolate each test file
  },
})
