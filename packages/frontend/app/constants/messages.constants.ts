export const BOARD_MESSAGES = {
  activeBoardWasDeleted: 'Активная доска была удалена и больше недоступна',
  namelessBoardWasDeleted: 'Доска была удалена',
  boardCreated: 'Доска создана',
  boardUpdated: 'Доска обновлена',
  boardDeleted: 'Доска удалена',
  newBoardAdded: (title: string) => `Добавлена новая доска «${title}»`,
  boardWasUpdated: (title: string) => `Обновлена доска «${title}»`,
  boardWasDeleted: (title: string) => `Доска «${title}» была удалена`,
};

export const COLUMN_MESSAGES = {
  columnCreated: 'Колонка создана',
  columnUpdated: 'Колонка обновлена',
  columnDeleted: 'Колонка удалена',
  namelessColumnWasDeleted: 'Колонка была удалена',
  newColumnAdded: (title: string) => `Добавлена новая колонка «${title}»`,
  columnWasUpdated: (title: string) => `Обновлена колонка «${title}»`,
  columnWasDeleted: (title: string) => `Колонка «${title}» была удалена`,
};

export const ISSUE_MESSAGES = {
  issueCreated: 'Задача создана',
  issueUpdated: 'Задача обновлена',
  issueDeleted: 'Задача удалена',
  namelessIssueWasDeleted: 'Задача была удалена',
  newIssueAdded: (title: string) => `Добавлена новая задача «${title}»`,
  issueWasUpdated: (title: string) => `Обновлена задача «${title}»`,
  issueWasDeleted: (title: string) => `Задача «${title}» была удалена`,
};
