import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import dynamicImport from 'vite-plugin-dynamic-import';
import eslintPlugin from 'vite-plugin-eslint';
import stylelintPlugin from 'vite-plugin-stylelint';
import usePluginImport from 'vite-plugin-importer';
import { visualizer } from 'rollup-plugin-visualizer';

const productionMode = process.env.NODE_ENV === 'production';
const i18nPath = productionMode
  ? 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
  : 'vue-i18n/dist/vue-i18n.cjs.js';
const eslint = productionMode ? null : eslintPlugin();
const stylelint = productionMode ? null : stylelintPlugin();

const analyzeMode = process.env.ANALYZE === '1';
const analyzer = analyzeMode ? visualizer() : null;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './src/languages'),
    }),
    dynamicImport(),
    stylelint,
    eslint,
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
        additionalData: '@use "@/assets/scss/_prepend.scss" as *;',
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
