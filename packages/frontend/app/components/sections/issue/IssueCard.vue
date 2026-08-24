<template>
  <article
    class="issue-card rounded-8 bg-light-base group flex h-fit w-full cursor-pointer flex-col gap-8 border border-transparent p-8 duration-300 select-none"
    :class="{ 'disabled-element hover:border-transparent!': isLoading }"
    @click="openIssueDetails"
  >
    <header class="flex w-full items-start justify-between gap-8">
      <div class="flex flex-col gap-8">
        <div class="flex gap-4">
          <StopPreventWrapper>
            <UIBadge
              class="cursor-pointer"
              :background-color="color"
              :color="color ? ColorUtility.getTextColor(color, 170) : EColor.LIGHT_BASE"
              append-icon="mingcute:copy-line"
              size="small"
              @click:badge="copyIssueId"
            >
              {{ issueString }}
            </UIBadge>
          </StopPreventWrapper>

          <UIBadge v-if="false" :background-color="EColor.RED" size="small">Просрочена</UIBadge>
        </div>

        <IssueDate :created-at="issue.createdAt" :days-passed-since-creation="daysPassedSinceCreation" />
      </div>

      <UILoader v-if="isLoading" :size="EIconSizeSmall.MEDIUM" />
      <StopPreventWrapper v-else>
        <ActionsButtons
          :actions="['copy', 'share']"
          :button-background-color="EColor.LIGHT_BASE"
          @copy="copyIssueTitle"
          @share="copyIssueLink"
        />
      </StopPreventWrapper>
    </header>

    <div class="flex">
      <h4 class="text-14 cursor-text font-medium select-text">{{ issue.title }}</h4>
    </div>

    <IssueDetailsModal
      v-if="issueDetails"
      :is-open="isModalOpen"
      :issue="issueDetails"
      @update:is-open="closeIssueDetails"
      @update:issue="updateIssue"
      @delete:issue="emit('delete:issue', $event)"
    />
  </article>
</template>

<script setup lang="ts">
import {
  ColorUtility,
  EColor,
  EIssueEvent,
  getErrorMessage,
  type TDeleteIssueEmitPayload,
  type TIssue,
  type TIssueBase,
} from '@kanban-board/common';

import { useIssueInfo } from '~/composables/app/use-issue-info.composable';
import { useSocket } from '~/composables/use-socket.composable.ts';
import { useTryCatchFinally } from '~/composables/use-try-catch-finally.composable';
import { EIconSizeSmall } from '~/enums/global.enums';

import IssueDate from '~/components/sections/issue/IssueDate.vue';
import IssueDetailsModal from '~/components/sections/issue/IssueDetailsModal.vue';
import ActionsButtons from '~/components/shared/ActionsButtons.vue';
import StopPreventWrapper from '~/components/shared/StopPreventWrapper.vue';
import UIBadge from '~/components/ui/UIBadge.vue';
import UILoader from '~/components/ui/UILoader.vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    issue: TIssueBase;
  }>(),
  {
    color: EColor.GREEN,
  },
);

const emit = defineEmits<{
  'update:issue': [payload: TIssueBase];
  'delete:issue': [payload: TDeleteIssueEmitPayload];
}>();

const { issue } = toRefs(props);

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { listen } = useSocket();

const { issueString, daysPassedSinceCreation, issueIdFromQuery, copyIssueId, copyIssueTitle, copyIssueLink } =
  useIssueInfo(issue);

const needOpenCardOnInit = computed(() => issue.value.id === issueIdFromQuery.value);
const isModalOpen = ref(needOpenCardOnInit.value);

const {
  data: issueDetails,
  isLoading,
  call: fetchIssueDetails,
} = useTryCatchFinally({
  callback: async () => $fetch<TIssue>(`/api/issues/${issue.value.id}`, { method: 'GET' }),
  catchCallback: (error: unknown) => toast.error({ message: getErrorMessage(error) }),
  callOnInit: needOpenCardOnInit.value,
});

let stopListen: (() => void) | null = null;
const openIssueDetails = async () => {
  if (isLoading.value) return;

  await fetchIssueDetails();

  isModalOpen.value = true;
  router.replace({ query: { ...route.query, issue: issueString.value } });

  // если у кого-то открыта задача, которая обновлена кем-то еще - будет рефетч для актуализации данных
  stopListen = listen(EIssueEvent.UPDATED, (updatedIssue: TIssueBase) => {
    if (updatedIssue.id === issueIdFromQuery.value) fetchIssueDetails();
  });
};

const closeIssueDetails = () => {
  isModalOpen.value = false;
  router.replace({ query: { ...route.query, issue: undefined } });

  if (stopListen) stopListen();
};

const computedColor = computed(() => props.color || EColor.GREEN);

const updateIssue = (issue: TIssueBase) => {
  fetchIssueDetails();
  emit('update:issue', issue);
};
</script>

<style scoped>
.issue-card:hover {
  border-color: v-bind(computedColor);
}
</style>
