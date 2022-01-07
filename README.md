# admin

Vector 控端專案
vue 3

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
    └── store
        └── modules Vuex狀態模組
```

### 使用套件

```
# css normalize 初始化所有瀏覽器為相同樣式
yarn add normalize.css

# element ui 前端元件套件
yarn add element-plus

# mdi icon
yarn add @mdi/font

# 基於 promise 的前端 http library
yarn add axios

# cookie 處理
yarn add js-cookie
yarn add -D @types/js-cookie

# websocket
yarn add vue-native-websocket-vue3

# lodash
yarn add lodash
yarn add -D @types/lodash

# 時間套件
yarn add dayjs

# 十進位數值計算
yarn add big.js
yarn add -D @types/big.js

# 多國語系
yarn add vue-i18n@9.1.9
yarn add -D @intlify/vue-i18n-loader # webpack 語系預編譯

# echart
yarn add echarts
yarn add vue-echarts

# 程式碼高亮
yarn add vue-highlightjs

# 拖曳元件
yarn add vuedraggable@next

# import 寫法轉換（參考：https://t.ly/jMYp）
yarn add -D babel-plugin-import

# pug 模板語言
yarn add -D pug
yarn add -D pug-plain-loader
yarn add -D @prettier/plugin-pug

# stylelint CSS風格檢查工具
yarn add -D stylelint
yarn add -D postcss
yarn add -D stylelint-config-recommended-scss
yarn add -D stylelint-config-recess-order
yarn add -D stylelint-config-prettier
yarn add -D stylelint-prettier
yarn add -D postcss-html
yarn add -D stylelint-config-html
yarn add -D stylelint-webpack-plugin

# vue核心升級
yarn add vue@next
yarn add vue-router@next
yarn add vuex@next

# vue編譯核心升級
yarn add -D @vue/compiler-sfc
```
