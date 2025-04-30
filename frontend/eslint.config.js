import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import stylisticJs from '@stylistic/eslint-plugin-js';
import stylisticJsx from '@stylistic/eslint-plugin-jsx';

export default [
  { ignores: ['dist/'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
    },
    plugins: {
      'react': pluginReactConfig.plugins.react,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      'react-refresh': pluginReactRefresh,
      '@stylistic/js': stylisticJs,
      '@stylistic/jsx': stylisticJsx,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  pluginJs.configs.recommended,

  {
    rules: {
      ...pluginReactConfig.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/arrow-parens': ['error', 'as-needed'],
      '@stylistic/js/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/jsx/jsx-indent': ['error', 2],
      '@stylistic/jsx/jsx-indent-props': ['error', 2],
      '@stylistic/jsx/jsx-closing-bracket-location': ['error', 'line-aligned'],
      '@stylistic/jsx/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    },
  },
  {
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    plugins: {
      'jsx-a11y': pluginJsxA11y,
    },
    rules: pluginJsxA11y.configs.recommended.rules,
  },
  {
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
