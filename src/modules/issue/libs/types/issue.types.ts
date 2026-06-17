export type TIssue = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  columnId: number;
  order: number;
};

export type TCreateIssue = Pick<TIssue, 'title' | 'description' | 'columnId'>;
export type TUpdateIssue = Pick<TIssue, 'title' | 'description'>;

export type TMoveIssue = Partial<Pick<TIssue, 'columnId'>> & {
  nextIssueId?: number;
  previousIssueId?: number;
};
