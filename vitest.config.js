import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'output', '.bridgetown-cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/_components/**/*.js', 'frontend/javascript/**/*.js'],
      exclude: ['tests/**', 'node_modules/**'],
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '$components': './src/_components',
      '$styles': './frontend/styles'
    }
  }
});