<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-form(inline)
  //- 服務項目
  rd-form-item.basic-item(
    v-if="showGroup('service')"
    :label="t('service_items')"
    prop="service"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('service')"
      :indeterminate="advancedForm.service.length > 0 && !checkSelectAll('service')"
      @change="selectAll('service', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.service"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.service"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`url_service_items_tag_${option.label}`) }}
  //- 域名狀態
  rd-form-item.basic-item(
    v-if="showGroup('domainNameStatus')"
    :label="t('domain_name_status')"
    prop="domainNameStatus"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('domainNameStatus')"
      :indeterminate="advancedForm.domainNameStatus.length > 0 && !checkSelectAll('domainNameStatus')"
      @change="selectAll('domainNameStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.domainNameStatus"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.domainNameStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`domain_name_status_tag_${option.label}`) }}
  //- 憑證狀態
  rd-form-item.basic-item(
    v-if="showGroup('sslStatus')"
    :label="t('ssl_status')"
    prop="sslStatus"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('sslStatus')"
      :indeterminate="advancedForm.sslStatus.length > 0 && !checkSelectAll('sslStatus')"
      @change="selectAll('sslStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.sslStatus"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.sslStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ t(`ssl_status_tag_${option.label}`) }}
  //- 異常狀態
  rd-form-item.basic-item(
    v-if="showGroup('abnormalState')"
    :label="t('abnormal_state')"
    prop="abnormalState"
  )
    rd-checkbox.basic-item__space(
      :model-value="abnormalStateSelectAll"
      :indeterminate="abnormalStateGroup.length > 0 && !abnormalStateSelectAll"
      @change="abnormalStatusAct.selectAll"
    )
    rd-checkbox-group(
      size="small"
      :model-value="abnormalStateGroup"
      @click="abnormalStatusAct.select($event.target.value)"
    )
      rd-checkbox-button(
        v-for="(option, key) in abnormalStateOptions"
        :key="key"
        :label="option.label"
        :class="[`${option.type}-convert`, 'button-width']"
      )
        .abnormal-label {{ option.dict }}
        rd-badge(
          v-if="getBadgeCount(option.label) > 0"
          :type="option.type"
          :value="getBadgeCount(option.label)"
        )

    //- 異常細項
    rd-button.detail-btn(
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
      rd-form.detail(label-width="70px")
        //- 無法開啟
        rd-form-item.basic-item(:label="t('can_not_open')")
          rd-checkbox-group.detail__flex-warp(
            size="small"
            :model-value="advancedForm.failToOpen"
            @change="selectAbnormalDetail('failToOpen', $event)"
          )
            rd-checkbox-button.detail__button-width(
              v-for="(option, key) in advancedConditions.failToOpen"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
        //- 部分開啟
        rd-form-item.basic-item(:label="t('partially_open')")
          rd-checkbox-group.detail__flex-warp(
            size="small"
            :model-value="advancedForm.partiallyOpen"
            @change="selectAbnormalDetail('partiallyOpen', $event)"
          )
            rd-checkbox-button.detail__button-width(
              v-for="(option, key) in advancedConditions.partiallyOpen"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
        //- 可開啟
        rd-form-item.basic-item(:label="t('can_be_opened')")
          rd-checkbox-group.detail__flex-warp(
            size="small"
            :model-value="advancedForm.openable"
            @change="selectAbnormalDetail('openable', $event)"
          )
            rd-checkbox-button.detail__button-width(
              v-for="(option, key) in advancedConditions.openable"
              :key="key"
              :label="option.label"
              :class="option.type"
            )
              span {{ t(`url_abnormal_state_tag_${option.label}`) }}
  //- IP類型
  rd-form-item.basic-item(
    v-if="showGroup('ipType')"
    :label="t('ip_type')"
    prop="ipType"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('ipType')"
      :indeterminate="advancedForm.ipType.length > 0 && !checkSelectAll('ipType')"
      @change="selectAll('ipType', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.ipType"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.ipType"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 購買方式
  rd-form-item.basic-item(
    v-if="showGroup('purchaseMethod')"
    :label="t('ways_to_purchase')"
    prop="purchaseMethod"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('purchaseMethod')"
      :indeterminate="advancedForm.purchaseMethod.length > 0 && !checkSelectAll('purchaseMethod')"
      @change="selectAll('purchaseMethod', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.purchaseMethod"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.purchaseMethod"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 攻擊狀態
  rd-form-item.basic-item(
    v-if="showGroup('attackStatus')"
    :label="t('attack_status')"
    prop="attackStatus"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('attackStatus')"
      :indeterminate="advancedForm.attackStatus.length > 0 && !checkSelectAll('attackStatus')"
      @change="selectAll('attackStatus', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.attackStatus"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
        v-for="(option, key) in advancedConditions.attackStatus"
        :key="key"
        :label="option.label"
        :class="option.type"
      )
        span {{ option.dict }}
  //- 成長％數
  rd-form-item.basic-item(
    v-if="showGroup('growingPercent')"
    :label="t('growing_percent')"
    prop="growingPercent"
  )
    rd-checkbox.basic-item__space(
      :model-value="checkSelectAll('growingPercent')"
      :indeterminate="advancedForm.growingPercent.length > 0 && !checkSelectAll('growingPercent')"
      @change="selectAll('growingPercent', $event)"
    )
    rd-checkbox-group(
      v-model="advancedForm.growingPercent"
      size="small"
      @change="select"
    )
      rd-checkbox-button.button-width(
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
import { type CheckboxValueType } from 'element-plus';
import {
  type PropType,
  type Ref,
  defineComponent,
  inject,
  ref,
  computed,
} from 'vue';
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
    // 異常狀態
    const abnormalStateGroup = inject(
      'UrlManagement:abnormalStateGroup',
    ) as Ref<AbnormalStateConditions[]>;
    // 進階條件選項
    const advancedConditions = inject(
      'UrlManagement:advancedConditions',
    ) as AdvancedConditionsOptions;

    // 點擊「單一群組」全選 Checkbox(不包含異常狀態)
    const selectAll = (
      groupName: AdvancedConditions,
      value: CheckboxValueType,
    ) => {
      const groupValues = map(advancedConditions[groupName], 'label');
      // 預設全取消
      advancedForm[groupName] = [];
      if (value) {
        advancedForm[groupName] = groupValues;
      }
      emit('change');
    };
    // 點擊「單一群組」的子條件(不包含異常狀態)
    const select = () => {
      emit('change');
    };
    // 檢查全選
    const checkSelectAll = (groupName: AdvancedConditions) => {
      return (
        advancedForm[groupName].length === advancedConditions[groupName].length
      );
    };

    // 進階條件 - 異常狀態選項
    const abnormalStateOptions: {
      label: AbnormalStateConditions;
      type: 'danger' | 'warning' | 'success';
      dict: string;
    }[] = [
      { label: 'failToOpen', type: 'danger', dict: t('can_not_open') },
      {
        label: 'partiallyOpen',
        type: 'warning',
        dict: t('partially_open'),
      },
      { label: 'openable', type: 'success', dict: t('can_be_opened') },
    ];
    // 異常狀態 - 全選
    const abnormalStateSelectAll = computed(() => {
      return abnormalStateOptions.every(
        item =>
          advancedForm[item.label].length ===
          advancedConditions[item.label].length,
      );
    });

    // 同步異常細項
    const syncAbnormalDetail = (
      value: AbnormalStateConditions[],
      selectedAll: CheckboxValueType,
    ) => {
      value.forEach((key: AbnormalStateConditions) => {
        // 預設全取消
        advancedForm[key] = [];
        // 全選
        if (selectedAll) {
          advancedForm[key] = map(advancedConditions[key], 'label');
        }
      });
    };
    // 異常狀態
    const abnormalStatusAct = {
      // 點擊「異常狀態」全選
      selectAll: (value: CheckboxValueType) => {
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
      select: (key: AbnormalStateConditions) => {
        if (typeof key !== 'undefined') {
          let selectAll = false;
          // 預設先濾掉
          abnormalStateGroup.value = abnormalStateGroup.value.filter(
            item => item !== key,
          );
          if (advancedForm[key].length !== advancedConditions[key].length) {
            abnormalStateGroup.value = [...abnormalStateGroup.value, key];
            selectAll = true;
          }
          // 異常狀態 同步 異常細項
          syncAbnormalDetail([key], selectAll);
          emit('change');
        }
      },
    };
    // 點擊「異常細項」的子條件
    const selectAbnormalDetail = (
      groupName: AbnormalStateConditions,
      value: CheckboxValueType[],
    ) => {
      // 設定異常細項值
      advancedForm[groupName] = value as number[];
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
      checkSelectAll,
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
.basic-item {
  margin-bottom: 5px;
  &__space {
    margin-right: 5px;
  }
}

.button-width {
  min-width: 100px;
}

.detail {
  &__flex-warp {
    flex-wrap: wrap;
  }
  &__button-width {
    min-width: 130px;
    margin-bottom: 5px;
  }
}

.detail-btn {
  margin-left: 10px;
}
</style>
