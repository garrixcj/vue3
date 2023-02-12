# Blupprint Plus 元件庫

基於 Vue 3 與 Element+ 的樣式基礎修改的內部元件庫、樣式庫與函式庫合成內部的 UI Framework

## 依賴

```
# vue 核心升級
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

# pug 模板語言
yarn add -D pug
yarn add -D @prettier/plugin-pug

# scss css 預處理器
yarn add -D sass
```

## 專案結構

```
components 共用元件
├── common 共用元件客製（全域提供）
├── custom 客製化元件（按需引入）
├── style 共用樣式庫
└── utils 共用 library 與樣式插件
```

### component 共用元件定義

為了在多個不同的前端端口都可以運作共用元件，加入共用元件時必須考慮**更少的商業邏輯與更多的靈活性**，並且有明確的元件定義與定位。最好預計的使用率不會過低

- 好的範例：

  - Element+、Antd Design 等 Vue 相關 UI framework 提供的元件
  - [CSS Layout](https://csslayout.io/) 提供的 pattern

- 不好的範例：

  - 按下去會 call api 的按鈕：api 屬於商業邏輯
  - 帳號資訊卡片：帳號資料屬於商業邏輯

- 模稜兩可的範例：

  - 狀態按鈕：不是放諸四海都能放的元件，但是「狀態」的邏輯不會過於商業，而且整個模板能夠通用在內部

> vue 對元件的定義：提供了 HTML DOM 元素的擴充性，也可將部分模板、程式碼封裝起來以便開發者維護以及重複使用。<br>
> UIUX 對元件的定義：將常用的、固定樣式的、刻成元件，而元件化也可以將類似的樣式透過增加參數衍伸出單一樣式的變體。好處是工程師能快速套用、加速開發。
> 針對上述定義，我們對於 components 的設計理念是：
>
> - 單論元件本身的話，元件僅是針對 `*.vue` 檔案的代名詞，而我們歸納的 components 是 ui framework，是`包含`共用元件的部分，也就是無商業邏輯的 `*.vue` 樣式模板檔案
> - 針對樣式的部分可以利用 scss 做成常用樣式庫，但本身是無模板的固定樣式，一樣能方便套用
> - 針對顯示邏輯或是計算邏輯等非商業邏輯可以寫入 js 函式庫提供給頁面共用邏輯
> - 相對於 UIUX 的元件定義，我們更傾向是在實作面上給予符合「使用情境」的`工具`，不限制於只有`*.vue`，而 UIUX 的元件則比較偏向畫面物件的分類歸納
> - 並非 **「uiux 覺得這用到第二次，就能放進 components」**，能放進 components 資料夾的都應該要確定其有合理的定位與定義

### common 共用元件客製（全域提供）

主要針對 Element+ 的元件，微調其樣式後包裝並提供。

具有以下特性：

- 幾乎只有樣式邏輯，接近沒有其餘邏輯的 HTML DOM 元件
- 大部分僅是客製化原本元件的樣式，沒有改動任何屬性的使用方式
- 少部分是因原本元件樣式上或元件行為上與設計不同而寫成新元件，但預期使用率偏高且只有幾乎樣式邏輯
- 使用上可以在 vnode 本身全域提供，換取撰寫上的方便性
- 客製的模板邏輯若過於複雜，即使預期使用率高，只有樣式邏輯也不建議放置此處，因為可讀性不優

固定檔案命名說明：

- \_var.scss 覆蓋變數用的檔案
- \_theme.scss 提供該元件的 @mixin 的其餘樣式
- style.scss 強制覆蓋原本元件樣式
- index.ts 提供 install / use 的 vue plugin，若該資料夾內有複數的 \*.vue 檔則作爲多個元件的提供窗口

> 內部程式使用 Element+ 提供的 scss 變數修改，所以大多僅是 scss 檔，這是為了不要過多的客製化不合理的元件行為
> scss 檔案使用 \_ 開頭的原因是他在最後 `style/scss` 的檔案才會整合提供，且無任何 class 結構撰寫，僅有變數與共用樣式函數

### custom 客製化元件（按需引入）

針對多層邏輯或模板不易閱讀的共用元件

具有以下特性：

- 除了樣式邏輯以外，還會具有商業邏輯以外的邏輯（例如顯示或計算邏輯）
- 模板過於複雜
- 預期使用率不夠高
- 按需引入元件（即是需要自行 import）

> 共用與泛用的差異：
>
> - 共用是在實務上預期使用率高，將既有的元件歸納成共用
> - 泛用是放諸四海在不只內部專案都能夠合理使用的，具有通用的 Design pattern，會被列為泛用
> - custom 屬於共用
> - 在考慮「custom -> common」時，要考慮的是，是否值得犧牲 vnode 的效能來換取方便性

> 全域提供與按需引入的差異：
> vue 3 為了提供更多 typescript 的適用性，選擇捨棄 Option Api 的使用方式，傾向使用更多表明引入來源的撰寫方式，可以更明確的追溯到來源程式。<br>
> 在這方向上我們可以得知基本上對於 vue 3 來說按需引入的方式會比全域提供來得好<br>
> 但實務上要每個引用在撰寫上並不方便，所以我們折衷將泛用的元件列為全域提供，讓其達到等同在寫 HTML DOM 同樣的方便，但不夠泛用的元件我們會列為按需引入，保留追朔來源的功能

### style 共用樣式庫

提供共用的樣式，不涉及模板與邏輯的撰寫

檔案說明：

- mdi/ 調整 mdi 字體的壓縮方式優化
- \_color-cust.scss 顏色客製變數
- \_game-color.scss 遊戲大廳顏色客製變數
- \_options.scss 偏向功能類的 scss mixin library（泛用等級樣式）
- \_reboot.scss 對 HTML DOM 樣式的再定義
- \_themes.scss 偏向共用樣式類的 scss mixin theme（統一樣式 class)
- \_variables.scss 基礎變數
- element-cust.scss `common/` 的樣式客製總集
- element-default.scss 變數覆蓋 Element+ 預設樣式

### utils 共用 library 與樣式插件

最終使用方式會是以 `*.ts` 引入的共用邏輯函式庫

特別檔案說明

- rd/index.ts `common/` 全域提供的 vue plugin
- rd/lang.json components 內部使用自己的字典檔來避免被外部牽制
- loading/ 最終是使用 `directive` 方式提供，是有模板的 library 特例

## 改動須知

當有新增或異動時要注意的事項與關鍵檔案

### 通用規則

- 資料夾與檔案 namecase：`kebab-case`
  - 部分特例：`_kebab-case.scss`、`README.md`
- 至少要有一層資料夾，不要讓檔案散落
- `index.vue`為主體元件，根據資料夾命名決定他是什麼
- `index.ts`為多元件插件，主要提供`install`方法使用。每當有新的元件被歸類，需要加入`index.ts`的提供範圍。
- 元件如果有階層關係上面兩個都應該提供
- `*.vue` 元件內 name 必須要有 `Rd` 前綴
- 性質相近或相互依賴的檔案都可放置於同一個資料夾
- 元件使用字典只能使用`rd/lang.json`
- 針對複雜邏輯的資料結構建議提供`*.d.ts`的宣告檔來另外查看型別

### 異動 common/

- 對於 Element+ 客製樣式，提供`*.scss`檔案既可
- 通常單一元件會放置於 `元件名/index.vue`
- 有多個元件的時候
  - 有階層關係：`index.vue`、`index.ts`都應該提供，例如：select
  - 沒有階層關係：全域元件載入時要個別單一引用。例如：link/router-link
  - 沒有主體元件 (index.vue)：相似元件歸類於同資料夾，並提供`index.ts`。例如：icon
  - 組合
- 全域提供的依據是`rd/index.ts`，有改動`common`的檔案時，視狀況會需要調整內部的引用與提供，以及 type 宣告

### 異動 custom/

- 本資料夾提供的元件沒有全域引用問題，按需求自行引用，不需考慮`rd/index.ts`
- 複雜邏輯建議抽取`*.ts`，但不需要抽進`utils`

### 異動 typescript library

- `utils/`的`index.ts`是主要 library 的意思，不是多元件插件的 install provider
- 使用方式基本上都會是`import`，請自行寫好`export`

### 異動 scss 檔案

- `_`開頭檔案的意思是**部分 (partial)**，預期是被引用的，不是最終的輸出結果。通常不含 class 結構的 scss variable library 或是 scss mixin library 會使用`_`開頭命名檔案。以下範例說明：
  - `style/element-cust.scss` 含有 class 結構，預期為最終輸出檔案，一般不屬於「其他檔案的一部分」
  - `style/_reboot.scss` 含有 class 結構，預期為其他專案客製化的前提，屬於「其他檔案的一部分」
  - `common/button/_var_.scss` 不含 class 結構，必定屬於「其他檔案的一部分」
  - `common/button/style.scss` 含有 class 結構，但 button 本身應屬於獨立元件；同時為「其他檔案的一部分」，也具有「獨立運作」的特性。不寫`_`比較能夠同時符合兩者

> [underscore reference](https://stackoverflow.com/questions/34889962/why-put-in-front-of-the-file-name-or-in-scss-css)
