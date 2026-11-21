<template>
  <div
    class="rounded-8 bg-light-100 flex size-full h-60 items-center justify-start gap-24 border border-transparent p-8 duration-300 select-none"
    :class="{ 'hover:border-green cursor-pointer': !readonly }"
    @click.stop="openModal()"
  >
    <UserInfo :user="user" />

    <UIModal v-model:is-open="isModalOpen" :title="title" body-class="w-full laptop:w-320!">
      <div class="flex w-full flex-col gap-12" @click.stop>
        <slot />
      </div>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
import type { TUser } from '@kanban-board/common';

import UserInfo from '~/components/sections/user/UserInfo.vue';
import UIModal from '~/components/ui/modals/UIModal.vue';

const props = withDefaults(
  defineProps<{
    user: TUser;
    title?: string;
    readonly?: boolean;
  }>(),
  {
    title: 'Мой профиль',
    readonly: false,
  },
);

const isModalOpen = ref(false);

const openModal = () => {
  if (props.readonly) return;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

defineExpose({ closeModal });
</script>
