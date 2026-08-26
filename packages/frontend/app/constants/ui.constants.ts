import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

export const ACTION_BUTTON_LABEL = 'Применить';
export const CONFIRMATION_MODAL_TEXT = 'Восстановить данные будет невозможно!';

const SCROLLBAR_OPTIONS_COMMON: OverlayScrollbarsComponentProps['options'] = {
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    theme: 'os-theme-modal',
  },
};

export const SCROLLBAR_OPTIONS_Y: OverlayScrollbarsComponentProps['options'] = {
  overflow: { x: 'hidden' },
  ...SCROLLBAR_OPTIONS_COMMON,
};

export const SCROLLBAR_OPTIONS_X: OverlayScrollbarsComponentProps['options'] = {
  overflow: { y: 'hidden' },
  ...SCROLLBAR_OPTIONS_COMMON,
};
