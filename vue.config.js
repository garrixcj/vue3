// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  assetsDir: 'static',
  css: {
    loaderOptions: {
      scss: {
        prependData: content => {
          const { resourcePath, rootContext } = content;
          const relativePath = path.relative(rootContext, resourcePath);
          if (
            relativePath === 'src/components/style/scss/_element-default.scss'
          ) {
            return '';
          }
          return `@import "~@/assets/scss/prepend";`;
        },
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('i18n-resource')
      .test(/\.(json5?|ya?ml)$/)
      .include.add(path.resolve(__dirname, './src/languages'))
      .end()
      .type('javascript/auto')
      .use('i18n-resource')
      .loader('@intlify/vue-i18n-loader');
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader');
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');
  },
};
