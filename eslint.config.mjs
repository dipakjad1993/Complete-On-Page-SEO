export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'screenshots/**', 'data/**']
  },
  // Legacy monolith: lax (warn) — being split incrementally, not reformatted in one PR.
  {
    files: ['helpers.js', 'levels.js', 'server.js', 'public/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': 'warn'
    }
  },
  // New code: strict senior bar.
  {
    files: ['src/**/*.js', 'bin/**/*.js', 'mcp-server.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-empty': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      eqeqeq: ['error', 'smart'],
      curly: 'error',
      'no-throw-literal': 'error',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['tests/**/*.js', 'vitest.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
    rules: {
      'no-empty': 'error',
      curly: 'error'
    }
  }
];
