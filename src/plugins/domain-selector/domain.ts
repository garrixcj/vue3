/**
 * Domain List 邏輯
 */
import { ref } from 'vue';
import { list as listApi } from '@/api/domain';

export type Domain = {
  id: string | number;
  name: string;
  login_code: string;
  [key: string]: unknown;
};
export type DomainOption = {
  value: string | number;
  label: string;
  option: Domain;
};

export const useDomainList = () => {
  const domains = ref<DomainOption[]>([]);

  const getDomainList = (enable = 1 as 0 | 1) => {
    listApi.getDomainList(enable).then(resp => {
      domains.value = resp.data.data.map((domain: Domain) => ({
        value: domain.id,
        label: domain.name,
        option: domain,
      }));
    });
  };

  return { domains, getDomainList };
};
