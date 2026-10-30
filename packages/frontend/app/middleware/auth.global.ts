import { AUTH_PUBLIC_ROUTE_NAMES, AUTH_PUBLIC_ROUTE_NAMES_MAP } from '~/constants/auth.constants.ts';
import { useAuthStore } from '~/stores/auth.store.ts';

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.tryInitialize();
  }

  if (authStore.isAuth && to.name === AUTH_PUBLIC_ROUTE_NAMES_MAP.AUTH) {
    return navigateTo('/boards');
  }

  if (!authStore.isAuth && !AUTH_PUBLIC_ROUTE_NAMES.includes(String(to.name))) {
    return navigateTo('/auth?view=login');
  }
});
