export enum EUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum EUserWorkspaceStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum EUserWorkspaceRole {
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum EProfileUserPermissionType {
  PROFILE_EDIT = 'PROFILE_EDIT',
  PROFILE_DELETE = 'PROFILE_DELETE',
}

export enum EBoardUserPermissionType {
  BOARDS_CREATE = 'BOARDS_CREATE',
  BOARDS_MOVE = 'BOARDS_MOVE',
}

export enum EBoardAccessUserPermissionType {
  BOARD_VIEW = 'BOARD_VIEW',
  BOARD_EDIT = 'BOARD_EDIT',
  BOARD_DELETE = 'BOARD_DELETE',

  COLUMN_CREATE = 'COLUMN_CREATE',
  COLUMN_EDIT = 'COLUMN_EDIT',
  COLUMN_MOVE = 'COLUMN_MOVE',
  COLUMN_DELETE = 'COLUMN_DELETE',

  ISSUE_CREATE = 'ISSUE_CREATE',
  ISSUE_EDIT = 'ISSUE_EDIT',
  ISSUE_MOVE = 'ISSUE_MOVE',
  ISSUE_DELETE = 'ISSUE_DELETE',
}
