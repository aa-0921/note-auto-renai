import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fs: 'readonly',
        path: 'readonly',
        document: 'readonly',
        window: 'readonly',
        atob: 'readonly',
        File: 'readonly',
        DataTransfer: 'readonly',
        DragEvent: 'readonly',
      },
    },
    rules: {
      // 基本的なルール
      'no-console': 'off', // console.logを許可
      'no-unused-vars': 'warn',
      'no-undef': 'error',

      // コードスタイル
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      // 日本語コメントを許可
      'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
    },
    ignores: ['node_modules/', 'note-auto-core/', 'dist/', 'build/', '.husky/'],
  },
];
