<template>
  <UILabel text="Имя" :size="size" required>
    <UIInput
      v-model="formData.firstName"
      name="auth-first-name"
      full
      :size="size"
      placeholder="Укажите имя"
      readonly
      autocomplete="username"
    >
      <template #right>
        <UITooltip :class="buttonClass" text="Обновить имя">
          <UIIconButton
            icon="mingcute:refresh-2-line"
            size="small"
            :background-color="EColor.BLUE"
            @click:button="formData.firstName = getRandomFirstName()"
          />
        </UITooltip>
      </template>
    </UIInput>
  </UILabel>
  <UILabel text="Фамилия" :size="size" required>
    <UIInput
      v-model="formData.lastName"
      name="auth-last-name"
      full
      :size="size"
      placeholder="Укажите фамилию"
      readonly
      autocomplete="current-password"
    >
      <template #right>
        <UITooltip :class="buttonClass" text="Обновить фамилию">
          <UIIconButton
            icon="mingcute:refresh-2-line"
            size="small"
            :background-color="EColor.BLUE"
            @click:button="formData.lastName = getRandomLastName()"
          />
        </UITooltip>
      </template>
    </UIInput>
  </UILabel>
</template>

<script setup lang="ts">
import { EColor, RandomUtility, USER_FIRST_NAMES, USER_LAST_NAMES } from '@kanban-board/common';

import type { TSize } from '~/types/ui.types.ts';
import type { TUserNameFormData } from '~/types/user.types.ts';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIInput from '~/components/ui/inputs/UIInput.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UITooltip from '~/components/ui/UITooltip.vue';

const formData = defineModel<TUserNameFormData>('formData', { required: true });

withDefaults(
  defineProps<{
    size?: TSize;
    buttonClass?: string | null;
  }>(),
  {
    size: 'medium',
    buttonClass: null,
  },
);

const getRandomFirstName = () => RandomUtility.getRandomFromArray<string>(USER_FIRST_NAMES);
const getRandomLastName = () => RandomUtility.getRandomFromArray<string>(USER_LAST_NAMES);
</script>
