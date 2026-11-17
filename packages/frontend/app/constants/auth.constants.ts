export const AUTH_PUBLIC_ROUTE_NAMES_MAP = {
  AUTH: 'auth',
  AUTH_LOGIN: 'auth-login',
  AUTH_REGISTER: 'auth-register',
  ABOUT: 'about',
  DOCS: 'docs',
} as const;

export const AUTH_PUBLIC_ROUTE_NAMES: string[] = Object.values(AUTH_PUBLIC_ROUTE_NAMES_MAP);

export const AUTH_GUEST_ROUTE_NAMES: string[] = [
  AUTH_PUBLIC_ROUTE_NAMES_MAP.AUTH,
  AUTH_PUBLIC_ROUTE_NAMES_MAP.AUTH_LOGIN,
  AUTH_PUBLIC_ROUTE_NAMES_MAP.AUTH_REGISTER,
];
