<template>
  <div class="flex size-full flex-col items-center justify-center p-12">
    <div class="mt-24 flex w-full max-w-480 flex-col items-center gap-24">
      <TheLogo variant="for-page" show-version />
      <AuthInfo />
      <Component :is="resolvedComponent" @update:tab="updateTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';

import type { TAuthTab } from '~/types/auth.types.ts';

import AuthInfo from '~/components/sections/auth/AuthInfo.vue';
import AuthLogin from '~/components/sections/auth/AuthLogin.vue';
import AuthRegister from '~/components/sections/auth/AuthRegister.vue';
import TheLogo from '~/components/shared/TheLogo.vue';

const viewQuery = useRouteQuery<TAuthTab>('view');
if (!viewQuery.value) viewQuery.value = 'register';

const currentTab = ref<TAuthTab>(viewQuery.value);
const isRegisterTab = computed(() => currentTab.value === 'register');
const resolvedComponent = computed(() => (isRegisterTab.value ? AuthRegister : AuthLogin));

const updateTab = (tab: TAuthTab): void => {
  if (!tab || tab === currentTab.value) return;
  currentTab.value = tab;
  viewQuery.value = tab;
};
</script>
