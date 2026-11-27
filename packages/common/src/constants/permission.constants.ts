import {
  EBoardAccessPermissionField,
  EBoardPermissionField,
  EProfilePermissionField,
} from '../enums/permission.enums.js';

/** Названия разрешений на действия с собственным профилем. **/
export const PROFILE_PERMISSION_LABELS: Record<EProfilePermissionField, string> = {
  [EProfilePermissionField.PROFILE_EDIT]: 'Редактирование профиля',
  [EProfilePermissionField.PROFILE_DELETE]: 'Удаление профиля',
};

/** Названия разрешений на действия с досками в целом. **/
export const BOARD_PERMISSION_LABELS: Record<EBoardPermissionField, string> = {
  [EBoardPermissionField.BOARDS_CREATE]: 'Создание досок',
  [EBoardPermissionField.BOARDS_MOVE]: 'Перемещение досок',
};

/** Названия разрешений на действия с конкретной доской. **/
export const BOARD_ACCESS_PERMISSION_LABELS: Record<EBoardAccessPermissionField, string> = {
  [EBoardAccessPermissionField.BOARD_VIEW]: 'Просмотр доски',
  [EBoardAccessPermissionField.BOARD_EDIT]: 'Редактирование доски',
  [EBoardAccessPermissionField.BOARD_DELETE]: 'Удаление доски',

  [EBoardAccessPermissionField.COLUMN_CREATE]: 'Создание колонок',
  [EBoardAccessPermissionField.COLUMN_EDIT]: 'Редактирование колонок',
  [EBoardAccessPermissionField.COLUMN_MOVE]: 'Перемещение колонок',
  [EBoardAccessPermissionField.COLUMN_DELETE]: 'Удаление колонок',

  [EBoardAccessPermissionField.ISSUE_CREATE]: 'Создание задач',
  [EBoardAccessPermissionField.ISSUE_EDIT]: 'Редактирование задач',
  [EBoardAccessPermissionField.ISSUE_MOVE]: 'Перемещение задач',
  [EBoardAccessPermissionField.ISSUE_DELETE]: 'Удаление задач',
};
