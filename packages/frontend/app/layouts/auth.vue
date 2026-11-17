<template>
  <div class="flex h-dvh flex-col">
    <TheHeader />

    <main class="laptop:flex-row flex flex-1 flex-col">
      <div class="flex size-full flex-col items-center justify-center p-12">
        <div class="mt-24 flex w-full max-w-480 flex-col items-center gap-24">
          <TheLogo variant="for-page" show-version />
          <AuthInfo />
          <slot />
        </div>
      </div>
    </main>

    <TheFooter class="laptop:flex hidden" />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/layouts/shared/header/TheHeader.vue';
import TheFooter from '~/components/layouts/shared/TheFooter.vue';
import AuthInfo from '~/components/sections/auth/AuthInfo.vue';
import TheLogo from '~/components/shared/TheLogo.vue';
</script>
