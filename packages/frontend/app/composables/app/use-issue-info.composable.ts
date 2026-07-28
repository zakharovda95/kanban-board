import { StringUtility, type TIssue } from '@kanban-board/common';

import { DatetimeUtility } from '~/utilities/datetime.utility';

export function useIssueInfo(issue: Ref<TIssue>): {
  issueNumber: ComputedRef<string>;
  daysPassedSinceCreation: ComputedRef<string>;
  daysPassedSinceUpdating: ComputedRef<string>;
  copyIssueId: () => void;
  copyIssueTitle: () => void;
  copyIssueLink: () => void;
} {
  const runtimeConfig = useRuntimeConfig();
  const { copy } = useClipboard();
  const toast = useToast();

  const getDaysPassedSince = (date: Date) => {
    const daysLeft = DatetimeUtility.getDaysPassedSince(date);

    if (daysLeft === 0) return 'сегодня';
    if (daysLeft === 1) return 'вчера';
    return `${daysLeft} ${StringUtility.pluralize(daysLeft, ['день', 'дня', 'дней'])}`;
  };

  const issueNumber = computed(() => `task-${issue.value.id}`);
  const daysPassedSinceCreation = computed(() => getDaysPassedSince(issue.value.createdAt));
  const daysPassedSinceUpdating = computed(() => getDaysPassedSince(issue.value.updatedAt));

  const copyIssueId = async () => {
    await copy(issueNumber.value);
    toast.success({ message: 'Номер задачи скопирован!' });
  };

  const copyIssueTitle = async () => {
    await copy(issue.value.title);
    toast.success({ message: 'Название задачи скопировано!' });
  };

  const copyIssueLink = async () => {
    await copy(`${runtimeConfig.public.FRONTEND_URL}/boards/${issue.value.boardId}?issue=${issueNumber.value}`);
    toast.success({ message: 'Ссылка на задачу скопирована!' });
  };

  return { issueNumber, daysPassedSinceCreation, daysPassedSinceUpdating, copyIssueId, copyIssueTitle, copyIssueLink };
}
