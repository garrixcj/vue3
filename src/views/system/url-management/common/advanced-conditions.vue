<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-form(inline :model="advancedForm")
  //- 服務項目
  rd-form-item(
    v-if="showGroup('service')"
    :label="t('service_items')"
    prop="service"
  )
    rd-checkbox(
      v-model="groupCheckAll.service"
      :indeterminate="advancedForm.service.length > 0 && !groupCheckAll.service"
      @change="selectAll('service', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.service"
      size="small"
      @change="select('service', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.service"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`url_service_items_tag_${option.label}`) }}
  //- 域名狀態
  rd-form-item(
    v-if="showGroup('domainNameStatus')"
    :label="t('domain_name_status')"
    prop="domainNameStatus"
  )
    rd-checkbox(
      v-model="groupCheckAll.domainNameStatus"
      :indeterminate="advancedForm.domainNameStatus.length > 0 && !groupCheckAll.domainNameStatus"
      @change="selectAll('domainNameStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.domainNameStatus"
      size="small"
      @change="select('domainNameStatus', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.domainNameStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`domain_name_status_tag_${option.label}`) }}
  //- 憑證狀態
  rd-form-item(
    v-if="showGroup('sslStatus')"
    :label="t('ssl_status')"
    prop="sslStatus"
  )
    rd-checkbox(
      v-model="groupCheckAll.sslStatus"
      :indeterminate="advancedForm.sslStatus.length > 0 && !groupCheckAll.sslStatus"
      @change="selectAll('sslStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.sslStatus"
      size="small"
      @change="select('sslStatus', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.sslStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`ssl_status_tag_${option.label}`) }}
  //- 異常狀態
  rd-form-item(
    v-if="showGroup('abnormalState')"
    :label="t('abnormal_state')"
    prop="abnormalState"
  )
    rd-checkbox(
      v-model="abnormalStateSelectAll"
      :indeterminate="abnormalStateGroup.length > 0 && !abnormalStateSelectAll"
      @change="abnormalStatusAct.selectAll"
    )
    rd-checkbox-group(size="small" :model-value="abnormalStateGroup")
      rd-checkbox-button(
        v-for="(option, key) in abnormalStateOptions"
        :key="key"
        :label="option.label"
        :class="`${option.type}-convert`"
        @change="abnormalStatusAct.select(option.label, $event)"
      )
        .abnormal-label {{ option.dict }}
        rd-badge(
          v-if="getBadgeCount(option.label) > 0"
          :type="option.type"
          :value="getBadgeCount(option.label)"
        )

    //- 異常細項
    rd-button.abnormal-detail-btn(
      ref="btnRef"
      v-click-outside="onClickOutside"
      size="small"
      @click="visible = true"
    ) {{ t('exception_details') }}
    rd-popover(
      ref="popoverRef"
      placement="bottom"
      trigger="click"
      virtual-triggering
      :visible="visible"
      :virtual-ref="btnRef"
      :width="510"
    )
      rd-form.abnormal-detail-form(
        label-width="70px"
        inline
        :model="advancedForm"
      )
        //- 無法開啟
        rd-form-item(:label="t('can_not_open')" prop="service")
          rd-checkbox-group(
            size="small"
            :model-value="advancedForm.notOpen"
            @change="selectAbnormalDetail('notOpen', $event)"
          )
            rd-checkbox-button(
              v-for="(option, key) in advancedConditions.notOpen"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
        //- 部分開啟
        rd-form-item(:label="t('partially_open')" prop="service")
          rd-checkbox-group(
            size="small"
            :model-value="advancedForm.partiallyOpen"
            @change="selectAbnormalDetail('partiallyOpen', $event)"
          )
            rd-checkbox-button(
              v-for="(option, key) in advancedConditions.partiallyOpen"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
        //- 可開啟
        rd-form-item(:label="t('can_be_opened')" prop="service")
          rd-checkbox-group(
            size="small"
            :model-value="advancedForm.open"
            @change="selectAbnormalDetail('open', $event)"
          )
            rd-checkbox-button(
              v-for="(option, key) in advancedConditions.open"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
  //- IP類型
  rd-form-item(v-if="showGroup('ipType')" :label="t('ip_type')" prop="ipType")
    rd-checkbox(
      v-model="groupCheckAll.ipType"
      :indeterminate="advancedForm.ipType.length > 0 && !groupCheckAll.ipType"
      @change="selectAll('ipType', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.ipType"
      size="small"
      @change="select('ipType', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.ipType"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 購買方式
  rd-form-item(
    v-if="showGroup('purchaseMethod')"
    :label="t('ways_to_purchase')"
    prop="purchaseMethod"
  )
    rd-checkbox(
      v-model="groupCheckAll.purchaseMethod"
      :indeterminate="advancedForm.purchaseMethod.length > 0 && !groupCheckAll.purchaseMethod"
      @change="selectAll('purchaseMethod', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.purchaseMethod"
      size="small"
      @change="select('purchaseMethod', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.purchaseMethod"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 攻擊狀態
  rd-form-item(
    v-if="showGroup('attackStatus')"
    :label="t('attack_status')"
    prop="attackStatus"
  )
    rd-checkbox(
      v-model="groupCheckAll.attackStatus"
      :indeterminate="advancedForm.attackStatus.length > 0 && !groupCheckAll.attackStatus"
      @change="selectAll('attackStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.attackStatus"
      size="small"
      @change="select('attackStatus', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.attackStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 成長％數
  rd-form-item(
    v-if="showGroup('growingPercent')"
    :label="t('growing_percent')"
    prop="growingPercent"
  )
    rd-checkbox(
      v-model="groupCheckAll.growingPercent"
      :indeterminate="advancedForm.growingPercent.length > 0 && !groupCheckAll.growingPercent"
      @change="selectAll('growingPercent', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.growingPercent"
      size="small"
      @change="select('growingPercent', $event)"
    )
      rd-checkbox-button(
        v-for="(option, key) in advancedConditions.growingPercent"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { map, uniq } from 'lodash';
import { type PropType, defineComponent, inject, ref } from 'vue';
import {
  clickOutside,
  useClickOutside,
} from '@/components/utils/popper/click-outside';
import type { AdvancedConditionsOptions } from './list';
import type {
  AdvancedConditionsType,
  AbnormalStateConditions,
  AdvancedConditions,
} from './type';

export default defineComponent({
  name: 'UrlAdvancedConditions', // 網址管理 - 客端域名 - 進階條件
  directives: {
    clickOutside,
  },
  props: {
    // 顯示使用群組
    showUsageGroups: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });

    const { visible, popoverRef, onClickOutside } = useClickOutside();
    const btnRef = ref();

    // 進階條件表單
    const advancedForm = inject('UrlManagement:advancedForm') as Record<
      AdvancedConditionsType,
      number[]
    >;
    // 進階條件選項
    const advancedConditions = inject(
      'UrlManagement:advancedConditions',
    ) as AdvancedConditionsOptions;
    // 群組全選
    const groupCheckAll = inject(
      'UrlManagement:advancedGroupCheckAll',
    ) as Record<AdvancedConditionsType, boolean>;

    // 點擊「單一群組」全選 Checkbox(不包含異常狀態)
    const selectAll = (groupName: AdvancedConditions, value: boolean) => {
      const groupValues = map(advancedConditions[groupName], 'label');
      // 預設全取消
      advancedForm[groupName] = [];
      if (value) {
        advancedForm[groupName] = groupValues;
      }
      emit('change');
    };
    // 點擊「單一群組」的子條件(不包含異常狀態)
    const select = (groupName: AdvancedConditions, value: number[]) => {
      // 若選中的項目數量等同全部的項目數量，為全選
      groupCheckAll[groupName] =
        value.length === advancedConditions[groupName].length;
      emit('change');
    };

    // 進階條件 - 異常狀態選項
    const abnormalStateOptions: {
      label: AbnormalStateConditions;
      type: string;
      dict: string;
    }[] = [
      { label: 'notOpen', type: 'danger', dict: t('can_not_open') },
      {
        label: 'partiallyOpen',
        type: 'warning',
        dict: t('partially_open'),
      },
      { label: 'open', type: 'success', dict: t('can_be_opened') },
    ];
    // 進階條件 - 異常狀態
    const abnormalStateGroup = ref<AbnormalStateConditions[]>([]);
    const abnormalStateSelectAll = ref(false);

    // 同步異常細項
    const syncAbnormalDetail = (
      value: AbnormalStateConditions[],
      selectedAll: boolean,
    ) => {
      value.forEach((key: AbnormalStateConditions) => {
        // 預設全取消
        advancedForm[key] = [];
        groupCheckAll[key] = false;
        // 全選
        if (selectedAll) {
          advancedForm[key] = map(advancedConditions[key], 'label');
          groupCheckAll[key] = true;
        }
      });
    };
    // 異常狀態
    const abnormalStatusAct = {
      // 判斷全選
      checkAll: () => {
        abnormalStateSelectAll.value = abnormalStateOptions.every(
          item => groupCheckAll[item.label],
        );
      },
      // 點擊「異常狀態」全選
      selectAll: (value: boolean) => {
        const groupValues = map(abnormalStateOptions, 'label');
        // 預設全取消
        abnormalStateGroup.value = [];
        if (value) {
          abnormalStateGroup.value = groupValues;
        }
        // 異常狀態 同步 異常細項
        syncAbnormalDetail(groupValues, value);
        emit('change');
      },
      // 點擊「異常狀態」的單一條件
      select: (detailName: AbnormalStateConditions, val: boolean) => {
        let selectAll = val;
        // 預設先濾掉
        abnormalStateGroup.value = abnormalStateGroup.value.filter(
          (item: AbnormalStateConditions) => item !== detailName,
        );
        // 判斷異常細項無權選時，需先全選
        if (
          advancedForm[detailName].length !==
          advancedConditions[detailName].length
        ) {
          abnormalStateGroup.value = [...abnormalStateGroup.value, detailName];
          selectAll = true;
        }
        // 異常狀態 同步 異常細項
        syncAbnormalDetail([detailName], selectAll);
        // 異常狀態全選
        abnormalStatusAct.checkAll();
        emit('change');
      },
      // 清空值
      clear: () => {
        abnormalStateGroup.value = [];
        abnormalStateSelectAll.value = false;
      },
    };
    // 點擊「異常細項」的子條件
    const selectAbnormalDetail = (
      groupName: AbnormalStateConditions,
      value: number[],
    ) => {
      const checkedCount = value.length;
      // 若選中的項目數量等同全部的項目數量，為全選
      groupCheckAll[groupName] =
        checkedCount === advancedConditions[groupName].length;
      // 設定異常細項值
      advancedForm[groupName] = value;
      // 設定異常狀態值
      abnormalStateGroup.value = abnormalStateGroup.value.filter(
        item => item !== groupName,
      );
      if (value.length > 0) {
        abnormalStateGroup.value = uniq([
          ...abnormalStateGroup.value,
          groupName,
        ]);
      }
      // 異常狀態全選
      abnormalStatusAct.checkAll();
      emit('change');
    };

    // 取得 Badge 數量
    const getBadgeCount = (key: AbnormalStateConditions) => {
      return advancedForm[key].length;
    };
    // 顯示群組
    const showGroup = (groupName: string) => {
      return props.showUsageGroups?.includes(groupName);
    };

    return {
      t,
      advancedForm,
      abnormalStateOptions,
      abnormalStateGroup,
      abnormalStateSelectAll,
      advancedConditions,
      groupCheckAll,
      selectAll,
      select,
      abnormalStatusAct,
      getBadgeCount,
      showGroup,
      // 異常細項相關
      visible,
      popoverRef,
      btnRef,
      onClickOutside,
      selectAbnormalDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 5px;
}

:deep(.el-checkbox-group) {
  margin-left: 5px;
  label {
    min-width: 100px;
  }
}

.abnormal-detail-form {
  :deep(.el-checkbox-group) {
    display: block;
    label {
      min-width: 130px;
      margin-bottom: 5px;
    }
  }
}

.abnormal-detail-btn {
  margin-left: 10px;
}
</style>
