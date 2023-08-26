export default interface WorkspaceCounter {
  /**
   * Same as corresponding workspace
   * @minLength 1
   */
  id: string;
  /**
   * Id is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextTaskId: number;
  /**
   * Id is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextGoalId: number;
  /**
   * Id is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextLabelId: number;
  /**
   * Id is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextColumnId: number;
  /**
   * Id is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextNormId: number;
}
