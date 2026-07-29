import { EColor } from '@kanban-board/common';

import type { TBaseAction, TBaseActionButtonData } from '~/types/shared.types';

export const BASE_ACTIONS_BUTTONS_DATA: Record<TBaseAction, TBaseActionButtonData> = {
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
  move: {
    action: 'move',
    icon: 'move-line',
    backgroundColor: EColor.GREEN,
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
};
