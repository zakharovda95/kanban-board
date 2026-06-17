export function getRandomHexColor(): string {
  const color = Math.floor(Math.random() * 0xffffff);

  return `#${color.toString(16).padStart(6, '0')}`;
}
