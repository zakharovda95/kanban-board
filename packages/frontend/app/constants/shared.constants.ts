import { EColor } from '@kanban-board/common';

import type { TBaseAction, TBaseActionButtonData } from '~/types/shared.types';

export const BASE_ACTIONS_BUTTONS_DATA: Record<TBaseAction, TBaseActionButtonData> = {
  update: {
    action: 'update',
    icon: 'pencil-line',
    color: EColor.ORANGE,
  },
  delete: {
    action: 'delete',
    icon: 'delete-2-line',
    color: EColor.RED,
  },
  move: {
    action: 'move',
    icon: 'move-line',
    color: EColor.GREEN,
  },
  copy: {
    action: 'copy',
    icon: 'copy-line',
    color: EColor.GREEN,
  },
  share: {
    action: 'share',
    icon: 'share-2-line',
    color: EColor.BLUE,
  },
};
