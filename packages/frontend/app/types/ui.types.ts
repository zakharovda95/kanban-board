import type { EIconSize, EIconSizeSmall } from '~/enums/global.enums';

export type TUIComputedSizeMap = {
  small: TUIComputedSize;
  medium: TUIComputedSize;
  large: TUIComputedSize;
};

export type TUIComputedSize = {
  element: string;
  icon?: EIconSize | EIconSizeSmall | number;
};

export type TUIInputAutocomplete =
  | 'on'
  | 'off'
  | 'name'
  | 'email'
  | 'username'
  | 'current-password'
  | 'new-password'
  | 'one-time-code'
  | 'tel'
  | 'url'
  | 'street-address'
  | 'postal-code'
  | 'country'
  | 'organization';

export type TUIInputMode = 'text' | 'email' | 'tel' | 'none' | 'url' | 'numeric' | 'decimal' | 'search' | undefined;
