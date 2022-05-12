# admin

Vector 控端專案

- 建構工具：Vite
- 預設模板：vue-ts

## 初始化專案

```bash
yarn install
```

## 指令列表

### 運行開發環境：啟動預編譯與熱蟲載

```bash
yarn dev
```

### 建構應用程式：編譯及最小化程式碼

```bash
yarn build
```

### 建構並分析應用程式：編譯及最小化程式碼；會額外產生一份打包後的分析圖

```bash
yarn build:analyze
```

### 檢查所有 Lint 規則與 TS 型別：stylelint、eslint、vue-tsc

```bash
yarn lint
```

### 檢查 Stylelint 規則

```bash
yarn lint:style
```

### 檢查 ESLint 規則

```bash
yarn lint:eslint
```

### 檢查 TypeScript 型別

```bash
yarn lint:tsc
```

### 檢查並修復所有 Lint 規則：stylelint、eslint

```bash
yarn fix
```

### 檢查並修復 Stylelint 規則

```bash
yarn fix:style
```

### 檢查並修復 ESLint 規則

```bash
yarn fix:eslint
```

### 執行 TypeScript 型別檢查

```bash
yarn lint:tsc
```

## 專案結構

```text
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

## 使用套件

```bash
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
yarn add lodash-es
yarn add -D @types/lodash-es

# VueUse - Composition Api 工具庫
yarn add @vueuse/core

# 時間套件
yarn add dayjs

# 十進位數值計算
yarn add big.js
yarn add -D @types/big.js

# 多國語系
yarn add vue-i18n
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
yarn add -D @prettier/plugin-pug

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

# 型別輔助
yarn add -D @types/node

# 依賴分析
yarn add -D rollup-plugin-visualizer
```
