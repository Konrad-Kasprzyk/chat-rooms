export default interface WorkspaceCounter {
  id: string;
  workspaceId: string;
  // short id is 32-126 ASCII chars
  nextTaskShortId: string;
  // search id is number of item: 1, 2, 3, ...
  nextTaskSearchId: number;
  // label id is 32-126 ASCII chars
  nextLabelId: string;
  // column id is 32-126 ASCII chars
  nextColumnId: string;
  // short id is 32-126 ASCII chars
  nextGoalShortId: string;
  // search id is number of item: 1, 2, 3, ...
  nextGoalSearchId: number;
  // search id is number of item: 1, 2, 3, ...
  nextNormSearchId: number;
}
