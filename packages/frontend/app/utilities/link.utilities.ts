import type { RouteLocation } from 'vue-router';

export function isExternalLink(link: string | RouteLocation): boolean {
  if (!link || typeof link === 'object') return false;
  return link.startsWith('http://') || link.startsWith('https://');
}

export function prepareRouteHash(hash: string): string {
  return hash.startsWith('#') ? hash.slice(1) : hash;
}
