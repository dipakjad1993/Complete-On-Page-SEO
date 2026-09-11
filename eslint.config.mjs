export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'screenshots/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': 'warn'
    }
  },
  {
    files: ['tests/**/*.js', 'vitest.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' }
  }
];
