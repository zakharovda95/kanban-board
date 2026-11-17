import { AUTH_GUEST_ROUTE_NAMES, AUTH_PUBLIC_ROUTE_NAMES } from '~/constants/auth.constants.ts';
import { useUserStore } from '~/stores/user.store.ts';

export default defineNuxtRouteMiddleware(async to => {
  const userStore = useUserStore();

  if (!userStore.isInitialized) {
    await userStore.tryInitialize();
  }

  if (userStore.isAuth && AUTH_GUEST_ROUTE_NAMES.includes(String(to.name))) {
    return navigateTo('/boards');
  }

  if (!userStore.isAuth && !AUTH_PUBLIC_ROUTE_NAMES.includes(String(to.name))) {
    return navigateTo('/auth/login');
  }
});
