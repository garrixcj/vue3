import { type App, type PropType } from 'vue';
import { ElButton, type ButtonType } from 'element-plus';
import { type ComponentSize } from 'element-plus/es/constants';

// 按鈕尺寸
const rdButtonSize = {
  type: String as PropType<
    ComponentSize | 'icon' | 'icon-small' | 'icon-large' | 'icon-default'
  >,
  default: 'default',
} as const;

// 按鈕類型
const rdButtonType = {
  type: String as PropType<
    ButtonType | 'secondary' | 'search' | 'gradient' | 'transparent'
  >,
  default: 'default',
} as const;

const RdButton = {
  ...ElButton,
  props: {
    ...ElButton.props,
    size: rdButtonSize,
    type: rdButtonType,
  },
};

export default {
  install: (app: App): void => {
    app.component('RdButton', RdButton);
  },
};
