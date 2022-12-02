import { ref, type Ref, provide } from 'vue';
import { url as urlAPI } from '@/api/domain';
import type {
  CallbackUrlList,
  PostApplyFailedResponse,
  TicketInfo,
  TicketDetailUrl,
  TicketDetailUrlFromApi,
  BasicSetting,
} from './detail';
import keyBy from 'lodash/keyBy';

// 取得工單相關
export const useTicket = () => {
  // 工單詳細
  const ticketInfo = ref({}) as Ref<TicketInfo>;
  const ticketBasicData = ref({}) as Ref<BasicSetting>;
  const ticketUrlList = ref([]) as Ref<TicketDetailUrl[]>;
  // 取得單一工單內容
  const getTicket = (ticketId: number) => {
    return urlAPI.getTicket(ticketId).then(response => {
      if (response.data.result && response.data.data.length > 0) {
        const data = response.data.data[0];

        // 轉換驗證狀態
        let checkItem: BasicSetting['checkItem'] = '';
        switch (data.verify_mode) {
          case 'TXT':
            checkItem = 'txt';
            break;
          case 'name server':
            checkItem = 'nameserver';
            break;
        }

        // 塞入工單資料
        ticketInfo.value = {
          id: data.id,
          siteGroup: data.site_group,
          domain: data.domain,
          status: data.status,
        };

        // 塞入工單資料 - 基本資料
        ticketBasicData.value = {
          buy: data.company_purchase ? 'bbin' : 'domain',
          management: data.company_maintenance ? 'bbin' : 'domain',
          domainType: data.web_layout,
          highRisk: data.force_binding ? 'binding' : 'over',
          checkItem: checkItem,
          websiteProviderPerm: data.provider_permission,
          websiteProvider: data.domain_provider,
          username: data.provider_account,
          password: data.provider_password,
          applyTime: data.created_at,
          finishTime: data.finished_at,
        };

        // 塞入工單資料 - 域名設定
        ticketUrlList.value = data.domain_names.map(
          (obj: TicketDetailUrlFromApi) => ({
            domain: obj.domain_name,
            progressRate: obj.progress_rate,
          }),
        );
      }
    });
  };

  // 送出後得到回傳的列表
  const callbackUrlList: Ref<CallbackUrlList[]> = ref([]);
  // 送出後得到的單號
  const ticketId: Ref<number> = ref(0);
  provide('UrlManagement:callbackUrlList', callbackUrlList);

  // 整理post的回傳
  const arrangePostCallback = (
    id: number,
    failedData: PostApplyFailedResponse,
    applyUrlList: string[],
  ) => {
    ticketId.value = id;

    // 取得格式檢查錯誤
    const failedFormat = keyBy(failedData.verify_domain, 'domain');
    // 取得dns檢查錯誤
    const failedDns = keyBy(failedData.verify_DNS, 'domain');

    // 塞到列表裡
    callbackUrlList.value = applyUrlList.map(url => {
      const formatResult = !Object.keys(failedFormat).includes(url);
      const dnsResult = !Object.keys(failedDns).includes(url);

      return {
        domain: url,
        format: formatResult,
        formatMsg: formatResult ? '' : failedFormat[url].result,
        dns: dnsResult,
        dnsMsg: dnsResult ? '' : failedDns[url].result,
        result: formatResult && dnsResult,
      };
    });
  };

  /**
   * 新增公司買工單
   * @param  {string} siteGroup 站別
   * @param  {string} webLayout 網域類型 (normal:一般型、simple:簡易型)
   * @param  {boolean} forceBinding 是否為高風險域名綁定
   * @param  {string[]} domainNames 新增的網域列表 array
   */
  const postCompanyTicket = (
    siteGroup: string,
    webLayout: string,
    forceBinding: boolean,
    domainNames: string[],
  ) => {
    return urlAPI
      .postCompanyTicket(siteGroup, webLayout, forceBinding, domainNames)
      .then(response => {
        if (response.data.result) {
          // 整理post的回傳
          arrangePostCallback(
            response.data.data.ticket_id,
            response.data.data.failed_domain_names,
            domainNames,
          );
        }

        return response.data.result;
      });
  };

  /**
   * 新增廳主買工單
   * @param  {string} site_group 站別
   * @param  {boolean} company_maintenance 是否為公司管
   * @param  {string} web_layout 網域類型 (normal:一般型、simple:簡易型)
   * @param  {boolean} force_binding 是否為高風險域名綁定
   * @param  {boolean} provider_permission 是否有網址商權限
   * @param  {string[]} domain_names 新增的網域列表 array
   * @param  {object} options 選填
   */
  const postCustomerTicket = (
    site_group: string,
    company_maintenance: boolean,
    web_layout: string,
    force_binding: boolean,
    provider_permission: boolean,
    domain_names: string[],
    options: object,
  ) => {
    return urlAPI
      .postCustomerTicket(
        site_group,
        company_maintenance,
        web_layout,
        force_binding,
        provider_permission,
        domain_names,
        options,
      )
      .then(response => {
        if (response.data.result) {
          // 整理post的回傳
          arrangePostCallback(
            response.data.data.ticket_id,
            response.data.data.failed_domain_names,
            domain_names,
          );
        }

        return response.data.result;
      });
  };
  /**
   * 作廢工單
   * @param  {number} ticketId 工單id
   */
  const abolishTicket = (ticketId: number) => {
    return urlAPI.abolishTicket(ticketId).then(response => {
      return response.data.result;
    });
  };

  return {
    ticketInfo,
    ticketBasicData,
    ticketUrlList,
    getTicket,
    ticketId,
    callbackUrlList,
    postCompanyTicket,
    postCustomerTicket,
    abolishTicket,
  };
};
