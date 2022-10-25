<i18n
  src="@/languages/user/member_two_factor_auth/binding_data_summary.json"
></i18n>
<template lang="pug">
.binding-data-summary
  //- 提示訊息
  rd-information.binding-data-hint
    ul.spacing
      li {{ t('binding_list_hint') }}
      li {{ t('two_verification_switch') }}
      ul.sub-list
        i18n-t(keypath="binding_list_hint2" tag="li")
          template(#function)
            rd-link(
              v-if="checkPlatformPerm"
              underline
              :href="platformPermUrl"
              target="_blank"
            ) {{ t('station_security_settings') }}
            span(v-else) {{ t('station_security_settings') }}
        li {{ t('binding_list_hint3') }}
      li {{ t('two_factor_verification_type') }}
      ul.sub-list
        li UB Auth：{{ t('binding_list_hint4') }}
        li {{ t('sms_verification') }}：{{ t('binding_list_hint5') }}

  //- 搜尋欄
  .search-bar
    rd-form(ref="formRef" size="large" inline :model="form" :rules="rules")
      //- 廳主
      rd-form-item(:label="t('domain')" prop="domain" required)
        domain-selector(v-model:value="form.domain" quick-search)
      //- 會員帳號
      rd-form-item(prop="users")
        template(#label)
          label {{ t('member_account') }}
          rd-tooltip(placement="top")
            i.mdi.mdi-information
            template(#content)
              div {{ t('username_rule_api') }}
        //- 批次搜尋
        .search-bar__batch
          batch-input(
            ref="batchInputRef"
            v-model:value="form.users"
            v-model:visible="batchVisible"
            :rule="rules.users"
            :batch-input-placeholder="t('please_enter_member_account')"
            :batch-info-text="t('username_batch_note_1', { num: 200 })"
            :batch-textarea-placeholder="batchTextarea"
            :max-rows="200"
          )
            template(#append)
              //- 匯入檔案
              el-upload(
                accept=".csv"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="importFile"
              )
                rd-button(type="default" size="large") {{ t('import_file') }}

          //- 範例下載
          rd-button(text @click="downloadExample") {{ t('sample_download') }}
          rd-tooltip(popper-class="binding-tooltip" placement="top")
            i.mdi.mdi-information
            template(#content)
              li {{ t('upload_list_notice_1') }}
              li {{ t('upload_list_notice_2') }}
              .download-msg - {{ t('upload_list_notice_2_1') }}
              .download-msg - {{ t('upload_list_notice_2_2') }}
              li {{ t('upload_list_notice_3') }}

        template(#error="scope")
          .el-form-item__error(v-show="!batchVisible") {{ scope.error }}

      //- 綁定時間
      rd-form-item(:label="t('binding_time')" prop="date")
        rd-date-picker(
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="default"
          :disabled-date="disabledDates"
          :model-value="form.date"
          :range-separator="t('to')"
          :start-placeholder="t('start_time')"
          :end-placeholder="t('end_time')"
          :prevent-disable-date-selection="true"
          @update:model-value="setDateTime"
        )
      //- 搜尋
      rd-form-item
        rd-button(type="search" @click="search(formRef)")
          i.mdi.mdi-magnify
          span {{ t('search') }}

    .domain-binding-status(v-if="searched")
      .domain-binding-status__label
        rd-link(
          v-if="checkPlatformPerm"
          underline
          :href="platformPermUrl"
          target="_blank"
        ) {{ t('station_security_settings') }}
        span(v-else) {{ t('station_security_settings') }}
        span {{ t('two_verification') }}
      rd-tag.domain-binding-status__status(v-if="authSwitch" type="success") {{ t('enable') }}
      rd-tag.domain-binding-status__status(v-else type="danger") {{ t('disable') }}

  binding-table
  binding-hint(
    v-model="hintVisible"
    :users="notFoundUsers"
    @confirm="hintVisible = false"
  )
</template>

<script lang="ts">
import { defineComponent, provide, reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { TabRouteWatch, QuerySetting } from '@/components/utils/route-watch';
import { notify } from '@/components/utils/notification';
import BatchInput from '@/components/custom/batch-input/index.vue';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import { useAccess } from '@/plugins/access/view';
import { ElUpload, type UploadProps, type FormInstance } from 'element-plus';
import dayjs from 'dayjs';
import BindingTable from './table.vue';
import BindingHint from './hint.vue';
import domainAPI from '@/api/domain';
import userAPI from '@/api/user';

export default defineComponent({
  name: 'BindingDataSummary',
  components: {
    DomainSelector,
    BatchInput,
    BindingTable,
    BindingHint,
    ElUpload,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const watcher = new TabRouteWatch('bindingDataSummary');
    const searched = ref(false);
    provide('BindingDataSummary:searched', searched);

    // 批次視窗
    const batchVisible = ref(false);
    // 批次內容
    const batchTextarea = `${t('input_rule')}：\n - ${t(
      'user_name_not_null',
    )}\n - ${t('form_verify_msg_3', {
      min: 4,
      max: 20,
    })}\n - ${t('form_verify_msg_2')}`;
    // 搜尋提示訊息
    const hintVisible = ref(false);
    // 查無帳號的使用者
    const notFoundUsers = ref<string[]>([]);

    const formRef = ref<FormInstance>();
    const form = reactive({
      // 廳主
      domain: '' as '' | number,
      // 會員帳號
      users: [] as string[],
      // 綁定時間
      date: ['', ''] as [string, string],
      // 綁定類型 ('binding'：已綁定、'1'：UBAuth、'2'：短信驗證)
      type: 'binding',
    });
    // 提供給下層搜尋用
    provide('BindingDataSummary:searchForm', form);

    // 會員雙重驗證開關
    const authSwitch = ref(false);

    // 站台安全防護設置 url
    const platformPermUrl = '/web/main/loginVerification';

    // 會員帳號驗證規則
    const multiUserNameValid = (rule: never, value: string[]) => {
      return new Promise<void>((resolve, reject) => {
        if (value.length > 200) {
          reject(new Error(t('username_number_limit', { num: 200 })));
        }
        value.forEach((item: string) => {
          if (item) {
            if (!/^[a-z0-9]+$/.test(item)) {
              reject(new Error(t('form_verify_msg_2')));
            } else if (value.length > 200) {
              reject(
                new Error(
                  t('username_rule_error_msg', {
                    min: 4,
                    max: 20,
                  }),
                ),
              );
            }
          } else {
            reject(new Error(t('user_name_not_null')));
          }
        });
        resolve();
      });
    };
    // 驗證規則
    const rules = {
      domain: [
        {
          required: true,
          message: t('select_domain'),
          trigger: 'change',
        },
      ],
      users: [{ validator: multiUserNameValid, trigger: 'change' }],
    };

    // 不能設未來時間
    const disabledDates = (time: Date) => {
      return dayjs(time.getTime()) > dayjs(Date.now()).utcOffset(-4);
    };

    // 避免日期為 null 的情形
    const setDateTime = (event: [string, string] | null) => {
      form.date = event === null ? ['', ''] : event;
    };

    // 回上一頁 query
    const querySet = new QuerySetting([
      // 廳主
      {
        key: 'domain',
        get: () => form.domain,
        number: true,
      },
      // 會員帳號
      {
        key: 'users',
        get: () => form.users,
        filter: () => form.users.length > 0,
        optional: true,
      },
      // 綁定開始時間
      {
        key: 'start_date_time',
        get: () => form.date[0],
        filter: () => form.date.length > 0,
        optional: true,
      },
      // 綁定結束時間
      {
        key: 'end_date_time',
        get: () => form.date[1],
        filter: () => form.date.length > 0,
        optional: true,
      },
      // 綁定類型
      {
        query: 'binding_type',
        key: 'mem_2fa_way',
        get: () => form.type,
        filter: () => form.type !== 'binding',
        default: 'binding',
      },
    ]);

    // 匯入檔案
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const importFile: UploadProps['onChange'] = (file: any) => {
      if (!file) {
        return;
      } else if (file.raw.type !== 'text/csv') {
        notify.error(t('upload_file_not_csv'));
        return;
      }

      const dataNum = 200;
      const fileReader = new FileReader();

      fileReader.onload = e => {
        // e.target：檔案資訊
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const data: string[] = (e.target as any).result.split(/\s+/).splice(1);

        if (data.length > dataNum) {
          notify.error(t('exceed_max_and_can_not_import'));
          return;
        } else {
          form.users = data;
        }
      };
      fileReader.readAsText(file.raw);
    };

    // 範例下載
    const downloadExample = () => {
      window.open('/hex/user_name/example_export');
    };

    // 驗證會員是否綁定
    const checkBinding = () => {
      if (form.users.length > 0) {
        userAPI
          .checkBinding(form.domain as number, { ...querySet.getParam() })
          .then(resp => {
            if (resp.data.result) {
              // 查無帳號的使用者
              const unbind = resp.data.data.unbind;
              notFoundUsers.value = unbind;
              if (unbind.length > 0) {
                hintVisible.value = true;
              }
            }
          });
      }
    };

    // 取得 會員雙重驗證 開關
    const getAuthSwitch = () => {
      if (form.domain) {
        domainAPI.getMemberSwitch(form.domain as number).then(resp => {
          if (resp.data.result) {
            authSwitch.value = resp.data.data;
          }
        });
      }
    };

    // 搜尋
    const search = () => {
      if (!formRef.value) return;
      formRef.value.validate(valid => {
        if (valid) {
          form.type = 'binding';
          watcher.queryRoute(querySet.getQuery());
          checkBinding();
          getAuthSwitch();
        }
      });
    };

    // 判斷是否有 站台安全防護設置 權限
    const checkPlatformPerm = useAccess('PlatformSecurityProtectionSet');

    onMounted(() => {
      checkBinding();
      getAuthSwitch();
    });

    watcher.setWatcher((query: { domain: number }) => {
      // 若有廳主代表已有搜尋
      if (query.domain !== 0) {
        searched.value = true;
        querySet.setField();
      }
    });

    return {
      t,
      searched,
      batchVisible,
      batchTextarea,
      hintVisible,
      notFoundUsers,
      formRef,
      form,
      authSwitch,
      platformPermUrl,
      rules,
      disabledDates,
      setDateTime,
      importFile,
      downloadExample,
      search,
      checkPlatformPerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.binding-data-summary {
  @include form-label-color;

  .search-bar__batch {
    @include inline-flex-basic;
    @include space;
  }

  .domain-binding-status {
    @include inline-flex-basic;
    @include space;
    margin-bottom: 10px;

    &__label {
      margin-left: 2px;
      color: $text-3;
    }
  }
}

.binding-tooltip {
  .download-msg {
    padding-left: 15px;
  }
}
</style>
