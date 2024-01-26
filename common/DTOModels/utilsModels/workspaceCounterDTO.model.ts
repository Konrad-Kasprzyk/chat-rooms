export default interface WorkspaceCounterDTO {
  /**
   * Same as the corresponding workspace id.
   * @minLength 1
   */
  id: string;
  /**
   * Url number is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextTaskUrlNumber: number;
  /**
   * Url number is a number of item: 1, 2, 3, ...
   * @type int
   * @minimum 1
   */
  nextGoalUrlNumber: number;
}
