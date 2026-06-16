export function getRandomRgba(alpha = 1): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getRandomHexColor(): string {
  const color = Math.floor(Math.random() * 0xffffff);

  return `#${color.toString(16).padStart(6, '0')}`;
}
