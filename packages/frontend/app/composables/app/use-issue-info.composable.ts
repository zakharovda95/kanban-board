import { StringUtility, type TIssue, type TIssueBase } from '@kanban-board/common';

import { DatetimeUtility } from '~/utilities/datetime.utility';

export function useIssueInfo(issue: Ref<TIssue> | Ref<TIssueBase>) {
  const runtimeConfig = useRuntimeConfig();
  const { copy } = useClipboard();
  const toast = useToast();

  const issueString = computed(() => `task-${issue.value.id}`);

  const getDaysPassedSince = (date: Date) => {
    const daysLeft = DatetimeUtility.getDaysPassedSince(date);

    if (daysLeft === 0) return 'сегодня';
    if (daysLeft === 1) return 'вчера';
    return `${daysLeft} ${StringUtility.pluralize(daysLeft, ['день', 'дня', 'дней'])}`;
  };

  const daysPassedSinceCreation = computed(() => getDaysPassedSince(issue.value.createdAt));

  const isIssueDetails = Object.hasOwn(issue.value, 'updatedAt');
  const daysPassedSinceUpdating = computed(() =>
    isIssueDetails ? getDaysPassedSince((issue.value as TIssue).updatedAt) : null,
  );

  const copyIssueId = async () => {
    await copy(issueString.value);
    toast.success({ message: 'Номер задачи скопирован!' });
  };

  const copyIssueTitle = async () => {
    await copy(issue.value.title);
    toast.success({ message: 'Название задачи скопировано!' });
  };

  const copyIssueLink = async () => {
    await copy(`${runtimeConfig.public.FRONTEND_URL}/boards/${issue.value.boardId}?issue=${issueString.value}`);
    toast.success({ message: 'Ссылка на задачу скопирована!' });
  };

  return {
    issueString,
    daysPassedSinceCreation,
    daysPassedSinceUpdating,
    copyIssueId,
    copyIssueTitle,
    copyIssueLink,
  };
}
