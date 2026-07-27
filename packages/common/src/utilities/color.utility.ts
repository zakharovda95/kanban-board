import { EColor } from '../enums';

export class ColorUtility {
  public static getRandomHexColor(): string {
    const color = Math.floor(Math.random() * 0xffffff);
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  public static getTextColor(
    hex: string,
    threshold: number = 150,
  ): EColor.LIGHT_BASE | EColor.LIGHT_800 {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    return brightness > threshold ? EColor.LIGHT_800 : EColor.LIGHT_BASE;
  }
}
