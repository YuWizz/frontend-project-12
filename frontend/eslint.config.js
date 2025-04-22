import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
    plugins: {
      react: pluginReactConfig.plugins.react,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      "react-refresh": pluginReactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  pluginJs.configs.recommended,

  {
     rules: {
        ...pluginReactConfig.rules,
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
     }
  },
  {
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    plugins: {
        "jsx-a11y": pluginJsxA11y,
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
    }
  },

  eslintConfigPrettier,
];
