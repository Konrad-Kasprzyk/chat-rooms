import typia from "typia";

export default interface WorkspaceCounter {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * @minLength 1
   */
  workspaceId: string;
  /**
   * Short id is 32-126 ASCII chars.
   * @minLength 1
   */
  nextTaskShortId: string;
  /**
   * Search id is number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextTaskSearchId: number;
  /**
   * Label id is 32-126 ASCII chars.
   * @minLength 1
   */
  nextLabelId: string;
  /**
   * Column id is 32-126 ASCII chars.
   * @minLength 1
   */
  nextColumnId: string;
  /**
   * Short id  is 32-126 ASCII chars.
   * @minLength 1
   */
  nextGoalShortId: string;
  /**
   * Search id is number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextGoalSearchId: number;
  /**
   * Search id is number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextNormSearchId: number;
}

export const validateWorkspaceCounter = typia.createValidateEquals<WorkspaceCounter>();
