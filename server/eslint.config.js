import js from '@eslint/js';
import globals from 'globals';
import pluginNode from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  pluginNode.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
    },
  },
];
