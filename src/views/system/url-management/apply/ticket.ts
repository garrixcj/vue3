import { reactive, ref } from 'vue';
import { url as urlAPI } from '@/api/domain';
import type {
  CallbackUrlList,
  PostApplyFailedResponse,
  BasicSetting,
} from './apply';
import type {
  TicketInfo,
  TicketDetailUrl,
  TicketDetailUrlFromApi,
} from '../detail/detail';
import keyBy from 'lodash/keyBy';

// 取得工單相關
export const useTicket = () => {
  // 工單資訊
  const ticketInfo = reactive<TicketInfo>({
    id: 0,
    siteGroup: '',
    domain: 0,
    status: 0,
  });
  // 工單資本資料部分
  const ticketBasicData = reactive<BasicSetting>({
    buy: 'bbin',
    management: 'bbin',
    domainType: 'normal',
    highRisk: 'over',
    checkItem: '',
    websiteProviderPerm: false,
    websiteProvider: '',
    username: '',
    password: '',
    applyTime: '',
    finishTime: '',
  });
  // 工單網址部分
  const ticketUrlList = ref<TicketDetailUrl[]>([]);
  // 取得單一工單內容
  const getTicket = (id: number) => {
    return urlAPI.getTicket(id).then(response => {
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
        ticketInfo.id = data.id;
        ticketInfo.siteGroup = data.site_group;
        ticketInfo.domain = data.domain;
        ticketInfo.status = data.status;

        // 塞入工單資料 - 基本資料
        ticketBasicData.buy = data.company_purchase ? 'bbin' : 'domain';
        ticketBasicData.management = data.company_maintenance
          ? 'bbin'
          : 'domain';
        ticketBasicData.domainType = data.web_layout;
        ticketBasicData.highRisk = data.force_binding ? 'binding' : 'over';
        ticketBasicData.checkItem = checkItem;
        ticketBasicData.websiteProviderPerm = data.provider_permission;
        ticketBasicData.websiteProvider = data.domain_provider;
        ticketBasicData.username = data.provider_account;
        ticketBasicData.password = data.provider_password;
        ticketBasicData.applyTime = data.created_at;
        ticketBasicData.finishTime = data.finished_at;

        // 塞入工單資料 - 域名設定
        ticketUrlList.value = data.domain_names.map(
          (obj: TicketDetailUrlFromApi) => ({
            domain: obj.domain_name,
            progress: obj.progress_rate,
            message: obj.message,
          }),
        );
      }
    });
  };

  // 送出後得到回傳的列表
  const callbackUrlList = ref<CallbackUrlList[]>([]);
  // 送出後得到的單號
  const ticketId = ref<number>(0);

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
      // 格式檢查的結果
      const format = !Object.keys(failedFormat).includes(url);
      // dns檢查的結果
      const dns = !Object.keys(failedDns).includes(url);

      return {
        domain: url,
        format,
        formatMsg: format ? '' : failedFormat[url].result,
        dns,
        dnsMsg: dns ? '' : failedDns[url].result,
        result: format && dns,
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

  // 整理「廳主買」時需帶的參數
  const arrangeCustomerOption = (
    data: BasicSetting,
    managementIsBBin: boolean,
  ) => {
    let option = {};
    // 當bbin管且有網址商權限時，帶網址商相關細項，其餘的帶檢查項目
    if (managementIsBBin && data.websiteProviderPerm) {
      option = {
        domain_provider: data.websiteProvider,
        provider_account: data.username,
        provider_password: data.password,
      };
    } else {
      let checkItem = '';
      // 轉換要帶到後端的值
      switch (data.checkItem) {
        case 'txt':
          checkItem = 'TXT';
          break;
        case 'nameserver':
          checkItem = 'name server';
          break;
      }
      option = {
        verify_mode: checkItem,
      };
    }

    return option;
  };

  /**
   * 新增廳主買工單
   * @param  {string} site 站別
   * @param  {boolean} companyMaintenance 是否為公司管
   * @param  {string} webLayout 網域類型 (normal:一般型、simple:簡易型)
   * @param  {boolean} highRisk 是否為高風險域名綁定
   * @param  {boolean} providerPerm 是否有網址商權限
   * @param  {string[]} domainNames 新增的網域列表 array
   * @param  {object} options 選填
   */
  const postCustomerTicket = (
    site: string,
    companyMaintenance: boolean,
    webLayout: string,
    highRisk: boolean,
    providerPerm: boolean,
    domainNames: string[],
    options: object,
  ) => {
    return urlAPI
      .postCustomerTicket(
        site,
        companyMaintenance,
        webLayout,
        highRisk,
        providerPerm,
        domainNames,
        options,
      )
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

  return {
    ticketInfo,
    ticketBasicData,
    ticketUrlList,
    getTicket,
    ticketId,
    callbackUrlList,
    arrangeCustomerOption,
    postCompanyTicket,
    postCustomerTicket,
  };
};
