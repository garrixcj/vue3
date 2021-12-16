# admin

Vector 控端專案
vue 3

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

### Compiles and minifies for production

```bash
yarn build
```

### Lints and fixes files

```bash
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
