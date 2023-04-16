/**
 * This collection is for transactions while making and assigning short ids per project
 */
export default interface Counter {
  id: string;
  projectId: string;
  nextUserShortId: string;
  // short id is 32-126 ASCII chars
  nextTaskShortId: string;
  // search id is number of item: 1, 2, 3, ...
  nextTaskSearchId: number;
  nextLabelShortId: string;
  nextColumnShortId: string;
  nextGoalShortId: string;
  nextGoalSearchId: number;
}
