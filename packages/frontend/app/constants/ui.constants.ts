import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';

export const ACTION_BUTTON_LABEL = 'Применить';
export const CONFIRMATION_MODAL_TEXT = 'Восстановить данные будет невозможно!';

export const SCROLLBAR_OPTIONS_Y: OverlayScrollbarsComponentProps['options'] = {
  overflow: { x: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    theme: 'os-theme-modal',
  },
};

export const SCROLLBAR_OPTIONS_X: OverlayScrollbarsComponentProps['options'] = {
  overflow: { y: 'hidden' },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 500,
    theme: 'os-theme-board',
  },
};
