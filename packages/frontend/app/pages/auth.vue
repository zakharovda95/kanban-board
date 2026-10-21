<template>
  <div class="flex size-full flex-col items-center justify-center p-12">
    <div class="mt-24 flex w-full max-w-480 flex-col items-center gap-24">
      <TheLogo variant="for-page" show-version />
      <AuthInfo />
      <Component :is="resolvedComponent" @update:tab="currentTab = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAuthTab } from '~/types/auth.types.ts';

import AuthInfo from '~/components/sections/auth/AuthInfo.vue';
import AuthLogin from '~/components/sections/auth/AuthLogin.vue';
import AuthRegister from '~/components/sections/auth/AuthRegister.vue';
import TheLogo from '~/components/shared/TheLogo.vue';

const currentTab = ref<TAuthTab>('register');
const isRegisterTab = computed(() => currentTab.value === 'register');

const resolvedComponent = computed(() => (isRegisterTab.value ? AuthRegister : AuthLogin));
</script>
