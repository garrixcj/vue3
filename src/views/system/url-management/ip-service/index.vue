<i18n src="@/languages/system_setting/url_management/ip_service.json"></i18n>
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
    //- IP關鍵字
    rd-form-item(
      v-if="displayField('ip')"
      :label="form.type === 'site' ? 'IP' : ''"
      prop="ip"
      :required="form.type === 'ip'"
    )
      rd-input(
        v-model="form.ip"
        :placeholder="form.type === 'ip' ? t('please_enter_the_complete_ip_address') : t('not_required')"
      )
    //- 搜尋
    rd-form-item
      rd-button(type="search" @click="search")
        i.mdi.mdi-magnify
        span {{ t('search') }}

before-search-empty(v-show="!searched" :label="t('start_search')")
//- 進階搜尋列
advanced-conditions(
  v-if="searched"
  :show-usage-groups="['ipType', 'purchaseMethod', 'attackStatus']"
  @change="advancedConditionAct.change"
)
//- 列表資料
list(
  v-if="searched"
  ref="listRef"
  @change="listAct.change"
  @export="exportList"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, intersection, toInteger } from 'lodash';
import { type Ref, defineComponent, provide, inject, ref } from 'vue';
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
import { setExportPermName, doExportIPServiceList } from '../common/export';
import { useList } from './list';
import type { SiteOption } from '../common/list';
import type { IPServiceListData } from '../common/type';

export default defineComponent({
  name: 'IPService', // 網址管理 - IP服務
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
      return item.value !== 'domainName';
    });

    // 進階條件
    const { advancedForm, advancedFormKeys, abnormalStateGroup } =
      useAdvancedConditions();
    provide('UrlManagement:advancedForm', advancedForm);
    provide('UrlManagement:abnormalStateGroup', abnormalStateGroup);

    const listRef = ref();
    // 列表相關
    const {
      listData,
      orgListData,
      listCondition,
      listAngleTotalData,
      getList,
    } = useList();
    provide('IPService:listData', listData);
    provide('IPService:listCondition', listCondition);
    provide('IPService:listAngleTotalData', listAngleTotalData);

    const watcher = useTabWatcher('ipService');
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
        key: 'ip',
        get: () => form.ip,
        set: (val: string) => {
          form.ip = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      // 進階條件
      {
        key: 'ip_type',
        query: 'ipType',
        get: () => advancedForm.ipType,
        set: (val: number[]) => {
          advancedForm.ipType = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.ipType),
        optional: true,
        numberArray: true,
      },
      {
        key: 'purchase_method',
        query: 'purchaseMethod',
        get: () => advancedForm.purchaseMethod,
        set: (val: number[]) => {
          advancedForm.purchaseMethod = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.purchaseMethod),
        optional: true,
        numberArray: true,
      },
      {
        key: 'attack_status',
        query: 'attackStatus',
        get: () => advancedForm.attackStatus,
        set: (val: number[]) => {
          advancedForm.attackStatus = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.attackStatus),
        optional: true,
        numberArray: true,
      },
      // Table條件
      {
        key: 'table_filter',
        query: 'angle',
        get: () => listCondition.formAngle,
        set: (val: 'all' | number) => {
          listCondition.formAngle = val === 'all' ? val : toInteger(val);
        },
        filter: type => !(type === 'api' && listCondition.formAngle === 'all'),
        optional: true,
        default: 'all',
      },
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
    ]);

    // 設定列表資料
    const setTableData = () => {
      listData.value = filterData();

      // 分頁總數
      listCondition.total = listData.value.length;

      // 分頁顯示筆數
      if (!isEmpty(listData.value)) {
        listData.value = listData.value.filter(
          (item: IPServiceListData, key: number) => {
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
      return orgListData.value.reduce(
        (acc: IPServiceListData[], item: IPServiceListData) => {
          let result = acc;
          const rowData = {
            ipType: [item.ipType],
            purchaseMethod: [item.purchaseMethod],
            attackStatus: item.attackStatus,
          };
          // 判斷有中點擊的進階條件
          const isAdSearch: boolean = advancedFormKeys.some(key => {
            // 單一進階條件點擊項目
            const clickASData = advancedForm[key];
            if (!isEmpty(clickASData)) {
              const fieldData: number[] = rowData[key as keyof typeof rowData];
              return !isEmpty(intersection(clickASData, fieldData));
            }
            return false;
          });

          // 判斷列表顯示角度
          const isTableAngle =
            listCondition.formAngle === 'all' ||
            (listCondition.formAngle === 1 && item.ipType === 1) ||
            (listCondition.formAngle === 2 && item.ipType === 2);

          if (isTableAngle && (isAdSearch || isNotAdvancedCondition)) {
            result = [...result, item];
          }
          return result;
        },
        [],
      );
    };

    // 列表
    const listAct = {
      reset: () => {
        listCondition.formAngle = 'all';
        listCondition.page = 1;
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
      },
    };

    // 匯出列表資料
    const exportList = (note: string) => {
      setLoading(true);
      setExportPermName('UrlIpServiceExport');

      const query = querySet.getQuery() as FormType;
      const params = querySet.getParam();

      // 判斷是否有備註
      if (!isEmpty(note)) {
        params.export_remark = note;
      }

      return doExportIPServiceList(
        query.type,
        query.site,
        locale.value,
        params,
      ).then(resp => {
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
        setExportPermName('UrlIpService');
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
        return getList(form, querySet.getParam()).then(resp => {
          if (resp) {
            setTableData();
          }
          updateApi.value = false;
          setLoading(false);
        });
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
      // Table
      listRef,
      listAct,
      // 匯出相關
      exportList,
    };
  },
});
</script>
