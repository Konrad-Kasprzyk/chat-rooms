export default interface Column {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  name: string;
  completedTasksColumn: boolean;
}
