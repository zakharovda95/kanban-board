export function sleep(timeout: number = 1000, withError: boolean = false): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (withError) reject(new Error('Тестовая ошибка'));
      else resolve();
    }, timeout);
  });
}
