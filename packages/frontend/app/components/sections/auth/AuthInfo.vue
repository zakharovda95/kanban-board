<template>
  <div class="bg-light-base rounded-12 flex w-full flex-col">
    <div class="flex w-full cursor-pointer items-center justify-between gap-12 p-12" @click="isBodyOpen = !isBodyOpen">
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
      <div v-if="isBodyOpen" class="full flex flex-col px-12">
        <p class="text-14 my-12">
          Так как это <span class="font-bold">демонстрационный проект</span>, и мне не очень хочется собирать Ваши
          <span class="font-bold">персональные данные</span>, и нести за них ответственность, созданный аккаунт будет
          иметь <span class="font-bold">ряд особенностей:</span>
        </p>
        <ul class="editor-ul">
          <li v-for="elem of info" :key="elem.id" class="text-14" v-html="elem.text" />
        </ul>
      </div>
    </UIAnimatedHeight>
  </div>
</template>

<script setup lang="ts">
import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIAnimatedHeight from '~/components/ui/UIAnimatedHeight.vue';

const isBodyOpen = ref(false);

const info: Array<{ id: number; text: string }> = [
  {
    id: 1,
    text: 'Для создания аккаунта <b>не требуется</b> указывать персональные данные: имя, фамилию, email, номер телефона и др.',
  },
  {
    id: 1,
    text: 'Система <b>читает Ваши cookie</b> для персонализации, а так же <b>хранит Ваш IP-адрес</b>',
  },
  {
    id: 1,
    text: 'На один IP-адрес <b>можно создать не более 5 аккаунтов.</b> Через 7 дней счетчик сбрасывается.',
  },
  {
    id: 5,
    text: 'При регистрации можно выбрать Имя и Фамилию из более чем <b>40 000 случайных комбинаций</b>, зарезервированных системой. После регистрации <b>изменить данные не получится.</b>',
  },
  {
    id: 3,
    text: 'Данные, необходимые для аутентификации <b>будут сгенерированы и предоставлены системой.</b>',
  },
  {
    id: 4,
    text: 'Утраченные данные, необходимые для аутентификации <b>восстановить невозможно</b>. Если данные потеряны - создайте новый аккаунт.',
  },
  {
    id: 2,
    text: 'Аккаунт создается на 7 дней, после этого аккаунт и все данные <b>будут стерты из базы данных. Не создавайте и не храните ничего важного!</b>',
  },
];
</script>
