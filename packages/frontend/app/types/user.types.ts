import type { TUser } from '@kanban-board/common';

export type TUserNameFormData = Pick<TUser, 'firstName' | 'lastName'>;

export type TUserProfileFormData = TUserNameFormData & Pick<TUser, 'avatar'>;
