import {
  EBoardAccessPermissionType,
  EBoardPermissionType,
  EProfilePermissionType,
} from '../enums/permission.enums.js';

/** Названия разрешений на действия с собственным профилем. **/
export const PROFILE_PERMISSION_LABELS: Record<EProfilePermissionType, string> = {
  [EProfilePermissionType.PROFILE_EDIT]: 'Редактирование профиля',
  [EProfilePermissionType.PROFILE_DELETE]: 'Удаление профиля',
};

/** Названия разрешений на действия с досками в целом. **/
export const BOARD_PERMISSION_LABELS: Record<EBoardPermissionType, string> = {
  [EBoardPermissionType.BOARDS_CREATE]: 'Создание досок',
  [EBoardPermissionType.BOARDS_MOVE]: 'Перемещение досок',
};

/** Названия разрешений на действия с конкретной доской. **/
export const BOARD_ACCESS_PERMISSION_LABELS: Record<EBoardAccessPermissionType, string> = {
  [EBoardAccessPermissionType.BOARD_VIEW]: 'Просмотр доски',
  [EBoardAccessPermissionType.BOARD_EDIT]: 'Редактирование доски',
  [EBoardAccessPermissionType.BOARD_DELETE]: 'Удаление доски',

  [EBoardAccessPermissionType.COLUMN_CREATE]: 'Создание колонок',
  [EBoardAccessPermissionType.COLUMN_EDIT]: 'Редактирование колонок',
  [EBoardAccessPermissionType.COLUMN_MOVE]: 'Перемещение колонок',
  [EBoardAccessPermissionType.COLUMN_DELETE]: 'Удаление колонок',

  [EBoardAccessPermissionType.ISSUE_CREATE]: 'Создание задач',
  [EBoardAccessPermissionType.ISSUE_EDIT]: 'Редактирование задач',
  [EBoardAccessPermissionType.ISSUE_MOVE]: 'Перемещение задач',
  [EBoardAccessPermissionType.ISSUE_DELETE]: 'Удаление задач',
};
