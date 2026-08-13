export const ERROR_BOARD_TEXT = 'Произошла ошибка при загрузке доски.';

export const BOARD_MESSAGES = {
  loadBoard: 'Загружаем доски...',
  chooseBoard: 'Выберите доску в меню слева.',
  noBoards: 'Вы еще не добавили ни одной доски.\n\rДобавьте новую доску для начала работы.',
  errorLoading: 'Произошла ошибка при загрузке доски.',
  changesOccurred: 'Список досок обновлен',
  activeBoardWasDeleted: 'Активная доска была удалена и больше недоступна',
  namelessBoardWasDeleted: 'Доска была удалена',
  boardCreated: 'Доска создана',
  boardUpdated: 'Доска обновлена',
  boardDeleted: 'Доска удалена',
  newBoardAdded: (title: string) => `Добавлена новая доска «${title}»`,
  boardWasUpdated: (title: string) => `Обновлена доска «${title}»`,
  boardWasDeleted: (title: string) => `Доска «${title}» была удалена`,
};
