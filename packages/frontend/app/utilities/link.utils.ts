import type { RouteLocationRaw } from 'vue-router';

export function isExternalLink(link: string | RouteLocationRaw): boolean {
  if (!link || typeof link === 'object') return false;
  return link.startsWith('http://') || link.startsWith('https://');
}
