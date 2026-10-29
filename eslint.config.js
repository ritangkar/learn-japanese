import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'public/content/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  { languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...globals.browser, ...globals.node } }, rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }], 'no-empty': ['error', { allowEmptyCatch: true }], 'no-restricted-globals': ['error', 'indexedDB'], 'no-restricted-properties': ['error', { object: 'window', property: 'indexedDB' }] } },
  { files: ['src/pwa/sw.template.js'], languageOptions: { globals: { ...globals.serviceworker } } },
];
