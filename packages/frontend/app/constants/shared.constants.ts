import { EColor } from '@kanban-board/common';

import type { TAction, TActionButtonData } from '~/types/shared.types';

export const ACTIONS_BUTTONS_DATA: Record<TAction, TActionButtonData> = {
  update: {
    action: 'update',
    icon: 'mingcute:pencil-line',
    backgroundColor: EColor.ORANGE,
    color: EColor.LIGHT_BASE,
  },
  delete: {
    action: 'delete',
    icon: 'mingcute:delete-2-line',
    backgroundColor: EColor.RED,
    color: EColor.LIGHT_BASE,
  },
  copy: {
    action: 'copy',
    icon: 'mingcute:copy-line',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  share: {
    action: 'share',
    icon: 'mingcute:share-2-line',
    backgroundColor: EColor.BLUE,
    color: EColor.LIGHT_BASE,
  },
  setup: {
    action: 'setup',
    icon: 'mingcute:settings-5-line',
    backgroundColor: EColor.LIGHT_200,
    color: EColor.LIGHT_800,
  },
  moveToStart: {
    action: 'moveToStart',
    icon: 'mingcute:arrow-to-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToEnd: {
    action: 'moveToEnd',
    icon: 'mingcute:arrow-to-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToPrevious: {
    action: 'moveToPrevious',
    icon: 'mingcute:align-arrow-left-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
  moveToNext: {
    action: 'moveToNext',
    icon: 'mingcute:align-arrow-right-fill',
    backgroundColor: EColor.GREEN,
    color: EColor.LIGHT_BASE,
  },
};
