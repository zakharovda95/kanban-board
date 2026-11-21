<template>
  <div class="flex w-full flex-col gap-12">
    <span class="text-14">Настройка разрешений</span>
    <UIAccordion title="Профиль" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Редактирование профиля" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление профиля" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Доски" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Создание досок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка досок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Супер доска 1" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Просмотр доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Перемещение задач по доске" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Супер доска 2" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Просмотр доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Перемещение задач по доске" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Новая доска" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Просмотр доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Перемещение задач по доске" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Отличная доска" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Просмотр доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Перемещение задач по доске" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>

    <UIAccordion title="Супер доска" :background-color="EColor.LIGHT_100">
      <div class="flex flex-col gap-8">
        <UILabel text="Просмотр доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление доски" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Изменение порядка колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление колонок" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>

        <UIDivider variant="dashed" />

        <UILabel text="Создание задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Редактирование задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Перемещение задач по доске" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
        <UILabel text="Удаление задач" position="between" direction="row">
          <UISwitcher v-model="val" size="medium" />
        </UILabel>
      </div>
    </UIAccordion>
  </div>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';

import UIAccordion from '~/components/ui/UIAccordion.vue';
import UIDivider from '~/components/ui/UIDivider.vue';
import UILabel from '~/components/ui/UILabel.vue';
import UISwitcher from '~/components/ui/UISwitcher.vue';

const val = ref(false);
</script>
