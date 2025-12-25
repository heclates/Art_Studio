import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,

  {

    files: ['**/*.{js,mjs,cjs}'],
    
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        gapi: "readonly",
        google: "readonly",
      },
    },

    rules: {
      "no-unused-vars": "warn", 
      "no-undef": "warn",       
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', 'conf.js'],
  },
];