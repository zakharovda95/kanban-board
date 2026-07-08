export type TPluralForms = [string, string, string];

export class StringUtility {
  public static pluralize(value: number, forms: TPluralForms): string | null {
    if (value === null || value === undefined) return null;

    const abs = Math.abs(value);
    const mod10 = abs % 10;
    const mod100 = abs % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return forms[0];
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return forms[1];
    }

    return forms[2];
  }
}
