<template>
  <div ref="authInfoRef" class="w-full">
    <UIWidget body-class="flex w-full flex-col">
      <div class="flex w-full cursor-pointer items-center justify-between gap-12" @click="isBodyOpen = !isBodyOpen">
        <p class="text-medium text-14">
          <span class="text-green block font-bold">Привет!</span> Нажми, чтобы прочитать условия!
        </p>
        <UIIconButton
          icon="mingcute:right-fill"
          size="small"
          :icon-class="isBodyOpen ? 'rotate-270' : 'rotate-90'"
          @click:button.stop="isBodyOpen = !isBodyOpen"
        />
      </div>
      <UIAnimatedHeight>
        <div v-if="isBodyOpen" class="full text-14 flex flex-col">
          <p class="my-12">
            <span class="text-blue font-bold">KANBAN BOARD</span> &mdash; это демонстрационный проект.<br >Я не собираю
            Ваши <span class="font-bold">персональные данные</span>, чтобы не нести за них ответственность.
          </p>
          <p>В связи с этим созданный аккаунт будет иметь <span class="font-bold">ряд особенностей:</span></p>
          <ul class="editor-ul">
            <li v-for="elem of info" :key="elem.id" v-html="elem.text" />
          </ul>
        </div>
      </UIAnimatedHeight>
    </UIWidget>
  </div>
</template>

<script setup lang="ts">
import { MAX_ACCOUNTS_PER_IP } from '@kanban-board/common';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIAnimatedHeight from '~/components/ui/UIAnimatedHeight.vue';
import UIWidget from '~/components/ui/UIWidget.vue';

const isBodyOpen = ref(false);

const info: Array<{ id: number; text: string }> = [
  {
    id: 1,
    text: 'Для создания аккаунта <b>не требуется</b> указывать персональные данные: имя, фамилию, email, номер телефона и др;',
  },
  {
    id: 2,
    text: 'Система <b>читает cookie</b>, а так же <b>хранит Ваш IP-адрес;</b>',
  },
  {
    id: 3,
    text: `На один IP-адрес <b>можно создать не более ${MAX_ACCOUNTS_PER_IP} аккаунтов;`,
  },
  {
    id: 4,
    text: 'Данные, необходимые для аутентификации <b>будут сгенерированы и предоставлены системой;</b>',
  },
  {
    id: 5,
    text: 'Утраченные данные, необходимые для аутентификации <b>восстановить невозможно</b>. Если данные потеряны - создайте новый аккаунт.',
  },
  {
    id: 6,
    text: `Время от времени происходит очистка базы данных. Не создавайте и не храните ничего важного!</b>`,
  },
];

const authInfoRef = useTemplateRef<HTMLDivElement | null>('authInfoRef');

onClickOutside(authInfoRef, () => {
  if (!isBodyOpen.value) return;
  isBodyOpen.value = false;
});
</script>
