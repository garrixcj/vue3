import { teststrength } from './password-strength';
import { mapValues } from 'lodash';

// 必須輸入密碼
export const mustRule = {
  required: true,
  message: 'please_enter_password',
  trigger: 'change',
};

// 會員密碼規則 (6-12英數，需要有大寫)
export const regexpMemberRule = {
  pattern: new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{6,12}'),
  message: 'regexp_of_member_password',
  trigger: 'change',
};

// 管端用戶密碼規則 (6-12英數，不需要有大寫)
export const regexpUserRule = {
  pattern: new RegExp('((?=.*[a-z])(?=.*[0-9]))([a-z0-9]){6,12}'),
  message: 'regexp_of_password',
  trigger: 'change',
};

// API文件密碼規則 (至少1英文1數字，6~12位數)
export const regexpApiDocRule = {
  pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/), // 至少1英文(大小寫)1數字，6~12位數
  message: 'regexp_of_api_document_password',
  trigger: 'change',
};

export const rules = {
  mustRule,
  regexpMemberRule,
  regexpUserRule,
  regexpApiDocRule,
};

export type ValidatorOptions = {
  // 訊息翻譯
  msgTrans?: (key: string) => string;
};

export const usePasswordValidator = ({ msgTrans } = {} as ValidatorOptions) => {
  // 檢測密碼強度
  const strengthValidator = (rule: any, value: string, callback: any) => {
    // 檢測密碼強度
    if (teststrength(value) === 'badPass') {
      callback(new Error(msgTrans?.('password_weak') || 'password_weak'));
      // 檢測密碼是否與帳號相同
    } else {
      callback();
    }
  };
  const strengthRule = {
    validator: strengthValidator,
    trigger: 'change',
  };

  return {
    ...mapValues(rules, rule => ({
      ...rule,
      message: msgTrans?.(rule.message) || rule.message,
    })),
    strengthRule,
  };
};
