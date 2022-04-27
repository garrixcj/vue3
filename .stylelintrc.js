module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    indentation: 2,
    'block-opening-brace-space-before': 'always',
    'declaration-colon-space-after': 'always',
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'scss/no-global-function-names': null,
    'scss/at-if-no-null': null,
    'scss/at-extend-no-missing-placeholder': null,
    'prettier/prettier': [
      true,
      {
        singleQuote: true,
        tabWidth: 2,
      },
    ],
    // .vue 解析使用
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],
  },
};
