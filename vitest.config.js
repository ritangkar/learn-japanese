import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/unit/**/*.test.js'], environment: 'node', globalSetup: ['tests/setup/global.js'] } });
