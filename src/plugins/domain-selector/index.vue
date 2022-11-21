<i18n src="./lang.json"></i18n>
<template lang="pug">
rd-select(
  v-bind="$attrs"
  :value="value"
  :quick-search="{ filter }"
  :popper-setting="{ width: 'auto' }"
  @change="change"
)
  rd-option(
    v-if="allOpt"
    key="all-opt"
    :value="allOptionsSet.value !== undefined ? allOptionsSet.value : 'all'"
    :label="allOptionsSet.label !== undefined ? allOptionsSet.label : t('all')"
    :option="{}"
  )
    template(v-if="$slots.allLabel" #default="{ current }")
      slot(name="allLabel" :current="current")
  rd-option(
    v-for="(domain, index) in domains"
    :key="index"
    :value="domain.value"
    :label="domain.label"
    :option="domain.option"
  )
    template(v-if="!noCode" #suffix="{ current: { option } }")
      span {{ `[${option.login_code}]` }}

  template(v-if="!noCode" #selected="{ current }")
    span {{ current?.label || '' }}
    span(v-if="!!current?.option?.login_code") {{ `[${current.option.login_code}]` }}
</template>

<script lang="ts">
import strmatcher from '@/components/utils/string-match';
import { computed, defineComponent, onMounted, type PropType } from 'vue';
import { useDomainList, DomainOption } from './domain';
import { useI18n } from 'vue-i18n';

type AllOptionSetting = {
  value?: string | number; // 全選替代 value
  label?: string; // 全選替代 label
};

export default defineComponent({
  name: 'DomainSelector',
  props: {
    value: {
      type: [Array, String, Number] as PropType<
        string[] | number[] | string | number
      >,
      required: true,
    },
    enable: Boolean,
    noCode: { type: Boolean, default: false },
    // 全選功能
    allOpt: {
      type: [Boolean, Object as () => AllOptionSetting],
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const { domains, getDomainList } = useDomainList();
    onMounted(() => {
      // 只會取得開放廳主
      getDomainList();
    });

    const change = (value: string | number) => {
      emit('update:value', value);
    };

    const allOptionsSet = computed(() =>
      typeof props.allOpt !== 'boolean' ? props.allOpt : {},
    );

    // 快搜過濾
    const filter = (keyword: string, domain: DomainOption): boolean => {
      const escapeRegexpString = (value = '') =>
        String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
      const re = new RegExp(escapeRegexpString(keyword), 'i');
      return (
        re.test(domain.label) ||
        (!props.noCode && re.test(domain.option.login_code)) ||
        strmatcher.match(domain.label, keyword)
      );
    };

    return {
      t,
      change,
      domains,
      allOptionsSet,
      filter,
    };
  },
});
</script>
