module.exports = {
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  trailingComma: 'all',
  pugAttributeSeparator: 'none',
  pugSortAttributesBeginning: [
    // DEFINITION
    '^:?is$',
    '^v-is$',
    // LIST_RENDERING
    '^v-for$',
    // CONDITIONALS
    '^v-if$',
    '^v-else-if$',
    '^v-else$',
    '^v-show$',
    '^v-cloak$',
    // RENDER_MODIFIERS
    '^v-once$',
    '^v-pre$',
    // GLOBAL
    '^:?id$',
    // UNIQUE
    '^:?key$',
    '^:?ref$',
    // SLOT
    '^#',
    '^v-slot',
    '^slot$',
    // TWO_WAY_BINDING
    '^v-model',
    // OTHER_DIRECTIVES
    '^v-(loading|highlightjs)',
    // OTHER_ATTR
    '^v-bind$',
    '^cols$',
    '^name$',
    '^:?type$',
    '^:value$',
    '^:?label$',
    '^:headers$',
    '^:items$',
    '^:?item-text$',
    '^:?item-value$',
    '^:?item-disabled$',
    '^:?placeholder$',
    '^:?src$',
    '^:?color$',
    '^:?text-color$',
    '^:?icon$',
    '^:?small$',
  ],
  pugSortAttributesEnd: [
    // OTHER_ATTR
    '^:?hint$',
    '^:?persistent-hint$',
    '^prepend-',
    '^append-',
    '^:to$',
    '^exact$',
    '^:(?!(width|height|loading|disabled|data-))',
    '^target$',
    '^:?width$',
    '^:?height$',
    '^:loading$',
    '^:disabled$',
    '^:?data-',
    // EVENTS
    '^v-on',
    '^@click:prepend',
    '^@click:append',
    '^@click',
    '^@',
    // CONTENT
    '^v-text$',
    '^v-html$',
  ],
};
