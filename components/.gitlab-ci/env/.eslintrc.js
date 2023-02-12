/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-undef': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'context', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          '$scope', // for Angular 1 scopes
          'staticContext', // for ReactRouter context
        ],
      },
    ],
    'global-require': 'off',
    'max-len': 'off',
    'prefer-destructuring': 'off',
    'no-control-regex': 'off',
    'arrow-parens': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'off',
    'vue/html-self-closing': 'off',
    'vue/name-property-casing': 'off',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 3,
        multiline: {
          max: 1,
        },
      },
    ],
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'property',
        format: null,
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
          object: false,
          Function: false,
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
