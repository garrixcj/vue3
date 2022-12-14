<i18n src="@/languages/system_setting/url_management/agent_url.json"></i18n>
<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
//- 基本搜尋列
.header
  rd-form(ref="formRef" inline :model="form" :rules="rules")
    //- 搜尋條件
    rd-form-item(:label="t('search_condition')" prop="type")
      rd-select(v-model:value="form.type" :options="typeOptions")
    //- 站別
    rd-form-item(v-if="displayField('site')" prop="site")
      rd-select(
        v-model:value="form.site"
        :quick-search="customSearch"
        :selected-setting="{ maxWidth: 240 }"
        :popper-setting="{ width: 'auto' }"
      )
        rd-option(
          v-for="(option, index) in siteOptions"
          :key="index"
          :value="option.value"
          :label="option.label"
          :option="option"
        )
          template(#suffix)
            | {{ `[ ${option.code} ]` }}
        template(#selected="{ current }")
          | {{ `${current?.label} [${current?.option.code}]` }}
    //- 域名關鍵字
    rd-form-item(
      v-if="displayField('domainName')"
      :label="form.type === 'site' ? t('domain_name') : ''"
      prop="domainName"
      :required="form.type === 'domainName'"
    )
      //- 單一搜尋
      rd-input.domain-input(
        v-model="form.domainName"
        :placeholder="t('input_keyword_at_least', { num: 6 })"
      )
        template(#append)
          rd-checkbox(disabled :model-value="true") {{ t('fuzzy') }}
    //- 搜尋
    rd-form-item
      rd-button(type="search" @click="search")
        i.mdi.mdi-magnify
        span {{ t('search') }}

before-search-empty(v-show="!searched" :label="t('start_search')")

//- 子頁籤
rd-sub-tabs(v-if="searched" v-model="subActiveTab")
  rd-sub-tab-pane(
    v-for="(tab, key) in subTabs"
    :key="key"
    :label="tab.label"
    :name="tab.key"
  )

//- 進階搜尋列
advanced-conditions(
  v-if="searched"
  :show-usage-groups="['abnormalState']"
  @change="advancedConditionAct.change"
)
//- 列表資料
list(
  v-if="searched"
  ref="listRef"
  @change="listAct.change"
  @sortChange="listAct.sort"
  @export="exportList"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, intersection, orderBy } from 'lodash';
import {
  type Ref,
  defineComponent,
  watch,
  computed,
  provide,
  inject,
  ref,
} from 'vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import AdvancedConditions from '../common/advanced-conditions.vue';
import List from './table.vue';
import { useTabWatcher, useQuery } from '@/components/utils/route-watch';
import { notify } from '@/components/utils/notification';
import {
  type FormType,
  useForm,
  useFormField,
  useFormOptions,
  useValidationRules,
  useAdvancedConditions,
} from '../common/search';
import {
  setExportPermName,
  doExportAgentDomainNameList,
} from '../common/export';
import { useList } from './list';
import type { SiteOption } from '../common/list';
import type { ListData, AbnormalStateConditions } from '../common/type';

export default defineComponent({
  name: 'AgentDomainName', // 網址管理 - 管端域名
  components: {
    BeforeSearchEmpty,
    AdvancedConditions,
    List,
  },
  setup() {
    const { t, locale } = useI18n({ useScope: 'local' });

    // Loading
    const setLoading = inject('UrlManagement:setLoading') as Function;
    // 已搜尋
    const searched = ref(false);
    // 更新API資料
    const updateApi = ref(false);
    // 自定義快搜
    const customSearch = inject<object>('UrlManagement:customSearch');
    // 站別列表
    const siteOptions = inject('UrlManagement:siteList') as Ref<SiteOption[]>;

    const formRef = ref();
    // 表單相關
    const { form, initForm } = useForm();
    // 表單欄位
    const { displayField } = useFormField(form);
    // 驗證相關
    const { rules } = useValidationRules(t);

    // 表單下拉選項
    let { typeOptions } = useFormOptions(t);
    typeOptions.value = typeOptions.value.filter(item => {
      return item.value !== 'ip';
    });

    // 子頁籤
    const subActiveTab = ref('domain');
    const subTabs = ref([
      { key: 'domain', label: t('domain_site'), value: 1 },
      { key: 'agent', label: t('agent_site'), value: 2 },
    ]);
    // 取得子頁籤選擇的端口ID
    const getEntranceID = computed(() => {
      return subTabs.value.filter(item => item.key === subActiveTab.value)[0]
        ?.value;
    });

    // 進階條件
    const { advancedForm, advancedFormKeys, abnormalStateGroup } =
      useAdvancedConditions();
    provide('UrlManagement:advancedForm', advancedForm);
    provide('UrlManagement:abnormalStateGroup', abnormalStateGroup);

    const listRef = ref();
    // 列表資料
    const { listData, orgListData, listCondition, getList } = useList();
    provide('AgentDomainName:listData', listData);
    provide('AgentDomainName:listCondition', listCondition);

    // 監聽 子頁籤 切換
    watch(
      () => subActiveTab.value,
      () => {
        if (searched.value) {
          updateApi.value = true;
          advancedConditionAct.clear();
          watcher.queryRoute(querySet.getQuery({ ignoreCached: true }));
        }
      },
    );

    const watcher = useTabWatcher('agentDomain');
    const querySet = useQuery([
      {
        key: 'type',
        get: () => form.type,
        set: (val: FormType['type']) => {
          form.type = val;
        },
        default: '',
        cached: true,
      },
      {
        key: 'site',
        get: () => form.site,
        set: (val: string) => {
          form.site = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      {
        key: 'domain_name',
        query: 'domainName',
        get: () => form.domainName,
        set: (val: string) => {
          form.domainName = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      // 子頁籤
      {
        key: 'subTab',
        get: () => subActiveTab.value,
        set: (val: string) => {
          subActiveTab.value = val;
        },
        default: '',
        cached: true,
      },
      // 進階條件
      {
        key: 'fail_to_open',
        query: 'failToOpen',
        get: () => advancedForm.failToOpen,
        set: (val: number[]) => {
          advancedForm.failToOpen = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.failToOpen),
        optional: true,
        numberArray: true,
      },
      {
        key: 'partially_open',
        query: 'partiallyOpen',
        get: () => advancedForm.partiallyOpen,
        set: (val: number[]) => {
          advancedForm.partiallyOpen = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.partiallyOpen),
        optional: true,
        numberArray: true,
      },
      {
        key: 'openable',
        get: () => advancedForm.openable,
        set: (val: number[]) => {
          advancedForm.openable = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.openable),
        optional: true,
        numberArray: true,
      },
      {
        key: 'service_error',
        query: 'abnormalStatus',
        get: () => [
          ...advancedForm.failToOpen,
          ...advancedForm.partiallyOpen,
          ...advancedForm.openable,
        ],
        default: [],
        filter: type =>
          !(type === 'route') &&
          !isEmpty([
            ...advancedForm.failToOpen,
            ...advancedForm.partiallyOpen,
            ...advancedForm.openable,
          ]),
        optional: true,
        numberArray: true,
      },
      // Table條件
      {
        key: 'page',
        get: () => listCondition.page,
        set: (val: number) => {
          listCondition.page = updateApi.value ? 1 : val;
        },
        default: 1,
        number: true,
      },
      {
        key: 'size',
        get: () => listCondition.size,
        set: (val: number) => {
          listCondition.size = val;
        },
        default: 1000,
        number: true,
      },
      {
        key: 'sort',
        get: () => listCondition.sort,
        set: (val: 'id' | 'automaticRenewalDate') => {
          listCondition.sort = updateApi.value ? 'id' : val;
        },
        default: 'id',
      },
      {
        key: 'order',
        get: () => listCondition.order,
        set: (val: 'asc' | 'desc') => {
          listCondition.order = updateApi.value ? 'asc' : val;
        },
        default: 'asc',
      },
    ]);

    // 設定列表資料
    const setTableData = () => {
      listData.value = filterData();

      // 分頁總數
      listCondition.total = listData.value.length;

      // 排序
      listData.value = orderBy(
        listData.value,
        [listCondition.sort],
        [listCondition.order],
      );

      // 分頁顯示筆數
      if (!isEmpty(listData.value)) {
        listData.value = listData.value.filter(
          (item: ListData, key: number) => {
            const mixNum = (listCondition.page - 1) * listCondition.size;
            const maxNum = listCondition.page * listCondition.size;
            return mixNum <= key && key < maxNum;
          },
        );
      }
      // 重置 Scrollbar 位置
      listRef.value?.scrollTo();
    };
    // 過濾列表資料
    const filterData = () => {
      const isNotAdvancedCondition = advancedFormKeys.every(
        key => advancedForm[key].length === 0,
      );
      return orgListData.value.reduce((acc: ListData[], item: ListData) => {
        let result = acc;
        // 判斷有中點擊的進階條件
        const isAdSearch = advancedFormKeys.some(key => {
          // 單一進階條件點擊項目
          const clickASData: number[] = advancedForm[key];
          if (!isEmpty(clickASData)) {
            let fieldData: number[] = [];
            // 異常狀態
            if (['failToOpen', 'partiallyOpen', 'openable'].includes(key)) {
              fieldData = item.abnormalState;
            }
            return !isEmpty(intersection(clickASData, fieldData));
          }
          return false;
        });

        if (isAdSearch || isNotAdvancedCondition) {
          result = [...result, item];
        }
        return result;
      }, []);
    };

    // 列表
    const listAct = {
      reset: () => {
        listCondition.page = 1;

        // 排序重置
        listRef.value?.sortClear();
      },
      sort: (
        field: 'automaticRenewalDate',
        order: 'ascending' | 'descending' | null,
      ) => {
        // 排序對應表
        const orders: {
          ascending: 'asc';
          descending: 'desc';
        } = { ascending: 'asc', descending: 'desc' };
        listCondition.sort = 'id';
        listCondition.order = 'asc';
        if (order !== null) {
          listCondition.order = orders[order];
          listCondition.sort = field;
        }
        watcher.queryRoute(querySet.getQuery());
      },
      change: () => {
        watcher.queryRoute(querySet.getQuery());
      },
    };
    // 進階條件
    const advancedConditionAct = {
      change: () => {
        listAct.reset();
        watcher.queryRoute(querySet.getQuery());
      },
      clear: () => {
        // 還原進階條件
        advancedFormKeys.forEach(key => {
          advancedForm[key] = [];
        });
        abnormalStateGroup.value = [];
      },
      init: () => {
        abnormalStateGroup.value = (
          [
            'failToOpen',
            'partiallyOpen',
            'openable',
          ] as AbnormalStateConditions[]
        ).filter(key => !isEmpty(advancedForm[key]));
      },
    };

    // 匯出列表資料
    const exportList = (note: string) => {
      setLoading(true);
      setExportPermName('AgentUrlExport');

      const query = querySet.getQuery() as FormType;
      const params = querySet.getParam();

      // 判斷是否有備註
      if (!isEmpty(note)) {
        params.export_remark = note;
      }

      return doExportAgentDomainNameList(
        query.type,
        query.site,
        getEntranceID.value,
        locale.value,
        params,
      ).then(resp => {
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
        setExportPermName('AgentUrl');
        setLoading(false);
      });
    };

    // 點擊搜尋按鈕
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          updateApi.value = true;
          // 還原列表條件
          listAct.reset();
          // 還原進階條件
          advancedConditionAct.clear();
          watcher.queryRoute(querySet.getQuery({ ignoreCached: true }));
        }
      });
    };
    // 更新列表資料
    const updateList = () => {
      querySet.setField();
      if (!searched.value || updateApi.value) {
        setLoading(true);
        searched.value = true;
        return getList(form, getEntranceID.value, querySet.getParam()).then(
          resp => {
            if (resp) {
              advancedConditionAct.init();
              setTableData();
            }
            updateApi.value = false;
            setLoading(false);
          },
        );
      }
      setTableData();
    };
    // route watcher
    watcher.setWatcher((query: FormType) => {
      // 若有Type代表已有搜尋
      if (query.type && query.type !== '') {
        updateList();
      } else {
        searched.value = false;
        // 初始化表單
        initForm();
      }
    });

    return {
      t,
      // 站別相關
      customSearch,
      siteOptions,
      // 搜尋相關
      searched,
      search,
      // 搜尋表單
      formRef,
      form,
      rules,
      typeOptions,
      displayField,
      // 進階條件
      advancedConditionAct,
      // 子頁籤
      subActiveTab,
      subTabs,
      // Table
      listRef,
      listAct,
      // 匯出相關
      exportList,
    };
  },
});
</script>
