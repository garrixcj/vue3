module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
