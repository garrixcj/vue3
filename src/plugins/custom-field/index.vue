<i18n src="./lang.json"></i18n>
<template lang="pug">
.custom-fields
  field-filter(
    :popover="popover"
    :fields="fieldsInfo.data"
    :defaultValue="customOptions"
    @confirm="confirm"
  )
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, onBeforeUpdate } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOperateApi, FieldsInfoType } from './custom-field';
import { notify } from '@/components/utils/notification';
import FieldFilter from '@/components/custom/field-filter/index.vue';
import { useLoadingStore } from '@/stores/loading';
import { type Placement } from 'element-plus';

export default defineComponent({
  name: 'CustomeFields', // 自訂欄位
  components: {
    FieldFilter,
  },
  props: {
    // 欄位資訊
    fieldsInfo: {
      type: Object as PropType<FieldsInfoType>,
      required: true,
    },
    // 標題
    title: {
      type: String,
      required: false,
    },
    // 寬度
    width: {
      type: Number,
      required: false,
    },
  },
  emits: ['displayColumns'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { customOptions, getOperateCustomFields, putCustomColumns } =
      useOperateApi();
    const popover = ref({
      confirmText: t('apply'),
      cancelText: t('cancel'),
      placement: 'bottom',
      title: props.title,
      width: props.width,
    } as {
      // 標題
      title: string;
      // 確認按紐文字
      confirmText?: string;
      // 取消按鈕文字
      cancelText?: string;
      // 寬度
      width?: number | string;
      // placement
      placement?: Placement;
    });

    onMounted(() => {
      getOperateCustomFields(props.fieldsInfo);
    });

    onBeforeUpdate(() => {
      emit('displayColumns', customOptions.value);
    });

    // 處理loading遮罩
    const loadingStore = useLoadingStore();
    const setLoading = (status: boolean) => {
      loadingStore.axios = status;
    };

    const confirm = (fields: string[]) => {
      setLoading(true);
      putCustomColumns(fields, props.fieldsInfo).then(() => {
        notify.success({
          title: t('success'),
        });
        emit('displayColumns', fields);
        setLoading(false);
      });
    };

    return {
      t,
      popover,
      customOptions,
      confirm,
    };
  },
});
</script>
