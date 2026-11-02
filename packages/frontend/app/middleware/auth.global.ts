import { AUTH_PUBLIC_ROUTE_NAMES, AUTH_PUBLIC_ROUTE_NAMES_MAP } from '~/constants/auth.constants.ts';
import { useUserStore } from '~/stores/user.store.ts';

export default defineNuxtRouteMiddleware(async to => {
  const userStore = useUserStore();

  if (!userStore.isInitialized) {
    await userStore.tryInitialize();
  }

  if (userStore.isAuth && to.name === AUTH_PUBLIC_ROUTE_NAMES_MAP.AUTH) {
    return navigateTo('/boards');
  }

  if (!userStore.isAuth && !AUTH_PUBLIC_ROUTE_NAMES.includes(String(to.name))) {
    return navigateTo('/auth?view=login');
  }
});
