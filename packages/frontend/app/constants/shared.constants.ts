import { EColor } from '@kanban-board/common';

import type { TAction, TActionButtonData } from '~/types/shared.types';

export const ACTIONS_BUTTONS_DATA: Record<TAction, TActionButtonData> = {
  update: {
    action: 'update',
    icon: 'pencil-line',
    backgroundColor: EColor.ORANGE,
    color: EColor.LIGHT_BASE,
  },
  delete: {
    action: 'delete',
    icon: 'delete-2-line',
    backgroundColor: EColor.RED,
    color: EColor.LIGHT_BASE,
  },
  copy: {
    action: 'copy',
    icon: 'copy-line',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  share: {
    action: 'share',
    icon: 'share-2-line',
    backgroundColor: EColor.BLUE,
    color: EColor.LIGHT_BASE,
  },
  setup: {
    action: 'setup',
    icon: 'settings-5-line',
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
  },
  moveToStart: {
    action: 'moveToStart',
    icon: 'arrow-to-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToEnd: {
    action: 'moveToEnd',
    icon: 'arrow-to-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToPrevious: {
    action: 'moveToPrevious',
    icon: 'align-arrow-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToNext: {
    action: 'moveToNext',
    icon: 'align-arrow-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
};
