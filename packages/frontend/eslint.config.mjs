import withNuxt from './.nuxt/eslint.config.mjs';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default withNuxt({
  files: ['**/*.{ts,mts,tsx,vue}'],

  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },

  plugins: {
    'simple-import-sort': simpleImportSort,
  },

  rules: {
    // разрешаем v-html
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-v-html': 'off',

    // группировка импортов
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^node:'],
          ['^vue', '^@?\\w'],
          ['^@/app', '^@/', '^~/'],
          ['^@/components', '^~/components'],
          ['^~/pages', '^~/layouts', '^@/pages', '^@/layouts'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // разрешаем статичные классы-утилиты
    '@typescript-eslint/no-extraneous-class': 'off',
  },
});
