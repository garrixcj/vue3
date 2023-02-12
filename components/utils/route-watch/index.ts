/**
 * 針對路由的監聽行為
 * 執行順序：
 * 按鈕點擊觸發
 * -> 同路由更改query (set query and router push)
 * -> watch觸發改變
 * -> call 搜尋的 API
 * -> 渲染畫面
 */
import { watch } from 'vue';
import {
  useRoute,
  useRouter,
  type Router,
  type RouteLocationNormalized,
} from 'vue-router';
import { isArray } from 'lodash';

export type WatcherOption = {
  // create 先行執行，若有需要預先搜尋的可以關閉來調整時序
  immediate?: boolean;
};

/**
 * 一般的 route 的 watch query 行為類別
 * @construct 需要 useRoute 跟 useRouter 只能在 setup() 內使用
 * @functions setWatcher 設置監聽路由參數變化時觸發的事件
 * @functions queryRoute 觸發路由參數更新後執行 router push
 */
export class RouteWatch {
  route: RouteLocationNormalized;
  router: Router;
  immediate: boolean;
  constructor(option: WatcherOption = {}) {
    this.route = useRoute();
    this.router = useRouter();
    this.immediate = true;
    if (typeof option.immediate !== 'undefined') {
      this.immediate = option.immediate;
    }
  }

  /**
   * 設定 watch query 異動時將執行的動作，例如 call API 搜尋
   */
  setWatcher(watchFunction: Function) {
    watch(
      () => this.route.query,
      (newValue?: object) => watchFunction(newValue),
      {
        deep: true,
        immediate: this.immediate,
      },
    );
  }
  /**
   * 原路由經query改變後執行自身跳轉，改變view
   */
  queryRoute(query: object) {
    const re = this.route.query?.re === '0' ? 1 : 0;
    this.router.push({ query: { ...query, re } });
  }
}
// use lib: useWatcher
export const useWatcher = (option: WatcherOption = {}) => {
  return new RouteWatch(option);
};

/**
 * tab 功能元件的 route 的 watch query 行為類別
 * @construct 需要 useRoute 跟 useRouter 只能在 setup() 內使用
 * @functions setWatcher 設置監聽路由參數變化時觸發的事件
 * @functions queryRoute 觸發路由參數更新後執行 router push
 */
export class TabRouteWatch extends RouteWatch {
  tab: string;
  constructor(tab: string, option: WatcherOption = {}) {
    super(option);
    this.tab = tab;
  }
  /**
   * 設定 watch query 異動時將執行的動作，例如 call API 搜尋
   */
  setWatcher(watchFunction: Function) {
    watch(
      () => this.route.query,
      (newValue?: object) => {
        if (this.route.query.tab === this.tab) {
          watchFunction(newValue);
        }
      },
      {
        deep: true,
        immediate: this.immediate,
      },
    );
  }
  /**
   * 原路由經query改變後執行自身跳轉，改變view
   */
  queryRoute(query: object) {
    const re = this.route.query?.re === '0' ? 1 : 0;
    this.router.push({ query: { ...query, re, tab: this.tab } });
  }
}
// use lib: useTabWatcher
export const useTabWatcher = (tab: string, option: WatcherOption = {}) => {
  return new TabRouteWatch(tab, option);
};

export type SetUsing = 'api' | 'route';

export type QuerySet = {
  // api 對應的 key
  key: string;
  // route query 使用的 key (query未使用時將會自動帶入key)
  query?: string;
  // 取得key對應響應值
  get?: () => unknown;
  // router query 變化時觸發的 set function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set?: (val: any, query?: any) => void;
  // 預設值/預設執行，變化值消失時觸發
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: unknown | ((query?: any) => void);
  // [custom]移除該key時的特殊判斷式 (type是判斷給予param或query的依據)
  filter?: (
    type: SetUsing,
    current?: { current: unknown; option: ArgumentOption },
  ) => boolean | (() => boolean);
  // 選填，當value為""或undefined時移除(getParam或getQuery都會移除)；
  optional?: boolean;
  // 必填，對api或route客製化
  required?: SetUsing;
  // 宣告布林值紀錄二元數字，布林轉換成0|1(getQuery時會給予0|1)
  binary?: boolean;
  // 宣告數值型態為數字，避免被url改為字串，字串會被轉成數字(set時會給予數字)
  number?: boolean;
  // 暫存，取得時會取route query的舊值，而不是get的值
  cached?: boolean;
  // 選項，過濾用的選項
  options?: unknown[];
  // 宣告數值型態為數字陣列，避免被url改為字串
  numberArray?: boolean;
  // 宣告數值型態為陣列，避免被url改為字串
  array?: boolean;
};

/**
 * argument option 參數選項
 * getParam 與 getQuery 帶入參數可選選項
 */
export type ArgumentOption = {
  // 強制使用 get 取得，不使用cache
  ignoreCached?: boolean;
};

/**
 * query設定：用於取得call api的param或router.push的query
 * @construct 需要 useRoute 只能在 setup() 內使用；請帶入QuerySet[]
 * @functions getParam 取得給 api 的 param，除了移除不會對取得數值異動
 * @functions getQuery 取得給 router 的 query，
 * @functions setField 針對 query 變化重設響應值
 */
export class QuerySetting {
  route: RouteLocationNormalized;
  querySets: QuerySet[];
  constructor(queries = [] as QuerySet[]) {
    this.route = useRoute();
    this.querySets = queries;
  }
  /**
   * 重設 query set
   * @param {QuerySet[]} queries
   * @return {object}
   */
  setQuerySet(queries = [] as QuerySet[]) {
    this.querySets = queries;
  }
  /**
   * 取得給 api 的 param
   * @return {object}
   */
  getParam() {
    return this.querySets.reduce((acc, set) => {
      const current = set.get?.();

      // 過濾 function
      if (set.filter && !set.filter('api')) {
        // 被過濾後不加入
        return acc;
      }
      // 選填，判斷不合法值不加入 / 設定default將判斷default值
      if (set.optional) {
        if (set.required === 'api') {
          // api強制帶入，空值與預設依舊回傳
          acc[set.key] = typeof current !== 'undefined' ? current : set.default;
          return acc;
        } else if (
          current === '' ||
          typeof current === 'undefined' ||
          (set.default &&
            typeof set.default !== 'function' &&
            current === set.default)
        ) {
          // 判斷選填後，不帶入
          return acc;
        }
      }

      acc[set.key] = current;
      return acc;
    }, {} as { [key: string]: unknown });
  }
  /**
   * 取得給 router 的 query
   * @param {ArgumentOption} option
   * @return {object}
   */
  getQuery(option: ArgumentOption = {}) {
    return this.querySets.reduce((acc, set) => {
      const target = set.query || set.key;
      let current = set.get?.();
      // 暫存
      if (set.cached && !option.ignoreCached) {
        current = this.route.query[set.query || set.key] || '';
      }
      // 非使用暫存資料時 過濾
      if (!(set.cached && !option.ignoreCached && current !== '')) {
        // 過濾 function
        if (set.filter && !set.filter('route', { current, option })) {
          // 被過濾後不加入
          return acc;
        }
      }
      // 選填，判斷不合法值不加入 / 設定default將判斷default值
      if (set.optional) {
        if (set.required === 'route') {
          // route強制帶入，空值與預設依舊回傳
          acc[target] = typeof current !== 'undefined' ? current : set.default;
          return acc;
        } else if (
          current === '' ||
          typeof current === 'undefined' ||
          (set.default &&
            typeof set.default !== 'function' &&
            current === set.default)
        ) {
          // 判斷選填後，不帶入
          return acc;
        }
      }
      if (set.binary) {
        // 二元選項
        acc[target] = +!!current;
        return acc;
      }

      acc[target] = current;
      return acc;
    }, {} as { [key: string]: unknown });
  }
  /**
   * 偵測 query 變化後的 set 方式(對響應值變化)
   */
  setField() {
    this.querySets.forEach(set => {
      const target = set.query || set.key;
      if (this.route.query[target]) {
        if (set.number || set.binary) {
          // query 存在且型態為數字轉回數字
          const value = parseInt(this.route.query[target] as string, 10);
          set.options?.indexOf(value) !== -1
            ? set.set?.(value, this.route.query)
            : set.set?.(set.default, this.route.query);
        } else if (set.numberArray) {
          const value = isArray(this.route.query[target])
            ? (this.route.query[target] as string[]).map(num =>
                parseInt(num as string, 10),
              )
            : [parseInt(this.route.query[target] as string, 10)];
          set.options?.indexOf(value) !== -1
            ? set.set?.(value, this.route.query)
            : set.set?.(set.default, this.route.query);
        } else if (set.array) {
          const value = isArray(this.route.query[target])
            ? this.route.query[target]
            : [this.route.query[target]];
          set.options?.indexOf(value) !== -1
            ? set.set?.(value, this.route.query)
            : set.set?.(set.default, this.route.query);
        } else {
          const value = this.route.query[target];
          set.options?.indexOf(value) !== -1
            ? set.set?.(value, this.route.query)
            : set.set?.(set.default, this.route.query);
        }
      } else {
        if (typeof set.default === 'function') {
          // 執行預設
          set.default(this.route.query);
        } else {
          // 不存在、非數字一率給予原值或預設
          set.set?.(this.route.query[target] || set.default, this.route.query);
        }
      }
    });
  }
}

// use lib: useQuery
export const useQuery = (queries: QuerySet[] = []) => {
  return new QuerySetting(queries);
};
