import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 30000,
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['server.js', 'helpers.js', 'levels.js', 'src/**/*.js'],
      exclude: ['node_modules/**', 'tests/**', 'public/**', 'screenshots/**'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 55,
        lines: 60
      }
    }
  }
});
