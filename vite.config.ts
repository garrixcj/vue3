import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import dynamicImport from 'vite-plugin-dynamic-import';
import eslintPlugin from 'vite-plugin-eslint';
import stylelintPlugin from 'vite-plugin-stylelint';
import usePluginImport from 'vite-plugin-importer';
import { visualizer } from 'rollup-plugin-visualizer';

const i18nPath =
  process.env.NODE_ENV === 'production'
    ? 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
    : 'vue-i18n/dist/vue-i18n.cjs.js';

const analyzeMode = !!+process.env.ANALYZE;
const analyzer = analyzeMode ? visualizer() : null;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './src/languages'),
    }),
    dynamicImport(),
    eslintPlugin(),
    stylelintPlugin({
      cache: false,
    }),
    usePluginImport({
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false,
    }),
    analyzer,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue-i18n': i18nPath,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: (source: string, filename: string) => {
          // 載每個scss檔之前，先import prepend檔
          let prepend = `@import "@/assets/scss/_prepend.scss";`;

          // element-default.scss除外，會噴錯，因為@use、@forward之前不能有任何輸出
          if (
            /src\/components\/style\/scss\/_element-default\.scss$/.test(
              filename,
            )
          ) {
            prepend = '';
          }

          return prepend + source;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      path: '/sockjs-node/',
      clientPort: 80,
    },
  },
});
