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
      // Floor thresholds (current: ~18% stmts) to stop regression.
      // Roadmap: 80% + Codecov badge (mocked-Puppeteer e2e lands in this PR).
      thresholds: {
        statements: 15,
        branches: 12,
        functions: 20,
        lines: 15
      }
    }
  }
});
