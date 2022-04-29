# admin

Vector 控端專案

- 建構工具：Vite
- 預設模板：vue-ts

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### 專案結構

```
├── public 靜態資源
└── src
    ├── api API接口
    ├── assets 資源
    ├── components 共用元件
    │   └── utils 共用library與樣式插件
    ├── http Response Handler
    ├── languages 語系
    ├── pages 頁面元件
    ├── plugins 邏輯插件(無法共用的本地樣式與商業邏輯)
    ├── router 路由
    └── store pinia狀態模組
```

### 使用套件

```
# vue核心升級
yarn add vue@next

# vue router
yarn add vue-router@next

# pinia 狀態管理器
yarn add pinia

# css normalize 初始化所有瀏覽器為相同樣式
yarn add normalize.css

# element ui 前端元件套件
yarn add element-plus

# mdi icon
yarn add @mdi/font@6.6.96

# 基於 promise 的前端 http library
yarn add axios

# cookie 處理
yarn add js-cookie
yarn add -D @types/js-cookie

# websocket
yarn add vue-native-websocket-vue3

# lodash - JS 工具庫
yarn add lodash
yarn add -D @types/lodash

# VueUse - Composition Api 工具庫
yarn add @vueuse/core

# 時間套件
yarn add dayjs

# 十進位數值計算
yarn add big.js
yarn add -D @types/big.js

# 多國語系
yarn add vue-i18n@9.1.9
yarn add -D @intlify/vite-plugin-vue-i18n

# echart
yarn add echarts
yarn add vue-echarts

# 程式碼高亮
yarn add vue-highlightjs

# 拖曳元件
yarn add vuedraggable@next

# pug 模板語言
yarn add -D pug
yarn add -D @prettier-plugin-pug

# scss css預處理器
yarn add -D sass

# eslint 程式法風格檢查工具
yarn add -D eslint
yarn add -D eslint-plugin-vue

# prettier 程式碼風格統一
yarn add -D prettier
yarn add -D eslint-plugin-prettier
yarn add -D @vue/eslint-config-prettier
yarn add -D @rushstack/eslint-patch

# eslint typescrip 檢查支援
yarn add -D @vue/eslint-config-typescript
yarn add -D @typescript-eslint/eslint-plugin
yarn add -D @typescript-eslint/parser

# stylelint CSS風格檢查工具
yarn add -D stylelint
yarn add -D postcss
yarn add -D stylelint-config-recommended-scss
yarn add -D stylelint-config-recess-order
yarn add -D stylelint-config-prettier
yarn add -D stylelint-prettier
yarn add -D postcss-html
yarn add -D stylelint-config-html

# vite 編譯核心升級
yarn add -D @vitejs/plugin-vue

# vite 編譯額外支援
yarn add -D vite-plugin-dynamic-import
yarn add -D vite-plugin-eslint
yarn add -D vite-plugin-stylelint

# import 寫法轉換（參考：https://t.ly/jMYp）
yarn add -D vite-plugin-importer

# 型別輔助
yarn add -D @types/node
```
