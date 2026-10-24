export const VALIDATION_MESSAGES = {
  mustBeString: 'Значение должно быть строкой',
  required: 'Поле обязательно для заполнения',
  maxLength: (max: number): string => `Длина не должна превышать ${max} символов`,
  minLength: (min: number): string => `Длина не должна быть меньше ${min} символов`,
  mustBeHexColor: 'Укажите цвет в формате HEX, например #3B82F6',
  idRequired: 'Необходимо указать идентификатор',
  idMustBeInteger: 'Идентификатор должен быть целым числом',
  idMustBePositive: 'Идентификатор должен быть положительным числом',
} as const;
