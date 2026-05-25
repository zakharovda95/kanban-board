import type { TCreateIssue, TPatchIssue, TUpdateIssue } from '@/modules/issues/libs/issues.types';

export class CreateIssueDto implements TCreateIssue {
  title: string;
  description: string;
  columnId: number;
}

export class UpdateIssueDto implements TUpdateIssue {
  title: string;
  description: string;
}

export class PatchIssueDto implements TPatchIssue {
  columnId: number;
}
