/**
 * 全域元件載入
 */
// 單元件
import { type App } from 'vue';
import RdInformation from '../../common/information/index.vue';
import RdLink from '../../common/link/index.vue';
import RdRouterLink from '../../common/link/router-link.vue';
import RdPagination from '../../common/pagination/index.vue';
import RdSwitch from '../../common/switch/index.vue';

// 單文件元件集合
const sfcComponents = [
  RdInformation,
  RdLink,
  RdRouterLink,
  RdPagination,
  RdSwitch,
];

// 插件元件 (提供 install 方法)
import RdButton from '../../common/button/index';
import RdCard from '../../common/card/index';
import RdIcon from '../../common/icon/index';
import RdSelect from '../../common/select/index';
import RdLayout from '../../common/layout/index';
import RdSubTabs from '../../common/sub-tab/index';
import RdDropdown from '../../common/dropdown/index';

// 插件元件集合
const pluginComponents = [
  RdCard,
  RdButton,
  RdIcon,
  RdSelect,
  RdLayout,
  RdSubTabs,
  RdDropdown,
];

// ElComponent
import {
  ElAlert,
  ElBadge,
  ElButtonGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElPopover,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElCollapseTransition,
  ElAutocomplete,
  ElDivider,
} from 'element-plus';

// 重定名元件集合 (ElComponent -> RdComponent )
const renameComponents = [
  // 警示
  ElAlert,
  // 徽章
  ElBadge,
  // 標籤
  ElTag,
  // 按鈕
  ElButtonGroup,
  // 排版
  ElRow,
  ElCol,
  // 日期選擇
  ElDatePicker,
  // 對話框
  ElDialog,
  // 時間選擇
  ElTimePicker,
  ElTimeSelect,
  // 表單
  ElForm,
  ElFormItem,
  // 表格
  ElTable,
  ElTableColumn,
  // 輸入框
  ElInput,
  ElInputNumber,
  // 多選框
  ElCheckbox,
  ElCheckboxGroup,
  ElCheckboxButton,
  // 單選框
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  // 彈出提示
  ElTooltip,
  ElPopover,
  // scrollbar
  ElScrollbar,
  // 頁籤
  ElTabs,
  ElTabPane,
  // 縮合動畫
  ElCollapseTransition,
  // 自動填入
  ElAutocomplete,
  // 分隔線
  ElDivider,
];

const install = (app: App) => {
  sfcComponents.forEach(sfc => {
    app.component(sfc.name, sfc);
  });
  pluginComponents.forEach(plugin => {
    app.use(plugin);
  });
  renameComponents.forEach(elc => {
    const newname = elc.name.replace(/El/i, 'Rd');
    app.component(newname, elc);
  });
};

export default { install };

// 全域元件定義，有加入才會有全域元件相關提示 (如 props 型別提示)
declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdInformation: typeof RdInformation;
    RdLink: typeof RdLink;
    RdRouterLink: typeof RdRouterLink;
    RdPagination: typeof RdPagination;
    // 開關
    RdSwitch: typeof RdSwitch;
    // 警示
    RdAlert: typeof ElAlert;
    // 徽章
    RdBadge: typeof ElBadge;
    // 標籤
    RdTag: typeof ElTag;
    // 按鈕
    RdButtonGroup: typeof ElButtonGroup;
    // 排版
    RdRow: typeof ElRow;
    RdCol: typeof ElCol;
    // 日期選擇
    RdDatePicker: typeof ElDatePicker;
    // 對話框
    RdDialog: typeof ElDialog;
    // 時間選擇
    RdTimePicker: typeof ElTimePicker;
    RdTimeSelect: typeof ElTimeSelect;
    // 表單
    RdForm: typeof ElForm;
    RdFormItem: typeof ElFormItem;
    // 表格
    RdTable: typeof ElTable;
    RdTableColumn: typeof ElTableColumn;
    // 輸入框
    RdInput: typeof ElInput;
    RdInputNumber: typeof ElInputNumber;
    // 多選框
    RdCheckbox: typeof ElCheckbox;
    RdCheckboxGroup: typeof ElCheckboxGroup;
    RdCheckboxButton: typeof ElCheckboxButton;
    // 單選框
    RdRadio: typeof ElRadio;
    RdRadioGroup: typeof ElRadioGroup;
    RdRadioButton: typeof ElRadioButton;
    // 彈出提示
    RdTooltip: typeof ElTooltip;
    RdPopover: typeof ElPopover;
    // scrollbar
    RdScrollbar: typeof ElScrollbar;
    // 頁籤
    RdTabs: typeof ElTabs;
    RdTabPane: typeof ElTabPane;
    // 自動填入
    RdAutocomplete: typeof ElAutocomplete;
    // 分隔線
    RdDivider: typeof ElDivider;
  }
}
