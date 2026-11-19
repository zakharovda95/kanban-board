<template>
  <UIAccordion close-on-click-outside>
    <template #header>
      <p class="text-medium"><span class="text-green block font-bold">Привет!</span> Нажми, чтобы прочитать условия!</p>
    </template>
    <p class="my-12">
      <span class="text-blue font-bold">KANBAN BOARD</span> &mdash; это демонстрационный проект.<br >Я не храню Ваши
      <span class="font-bold">персональные данные</span>, чтобы не нести за них ответственность.
    </p>
    <p>В связи с этим созданный аккаунт будет иметь <span class="font-bold">ряд особенностей:</span></p>
    <ul class="editor-ul">
      <li v-for="elem of info" :key="elem.id" v-html="elem.text" />
    </ul>
  </UIAccordion>
</template>

<script setup lang="ts">
import { MAX_ACCOUNTS_PER_IP } from '@kanban-board/common';

import UIAccordion from '~/components/ui/UIAccordion.vue';

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
</script>
