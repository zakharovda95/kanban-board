import type { EIconSize, EIconSizeSmall } from '~/enums/global.enums';

export type TUIComputedSizeMap = {
  small: TUIComputedSize;
  medium: TUIComputedSize;
  large: TUIComputedSize;
};

export type TUIComputedSize = {
  element: string;
  icon: EIconSize | EIconSizeSmall | number;
};
