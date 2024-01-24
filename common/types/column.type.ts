type Column = {
  /**
   * Used in url, is an integer.
   * @minLength 1
   */
  id: string;
  name: string;
  completedTasksColumn: boolean;
  /**
   * Column ids that this column replaces.
   */
  replacedColumnIds: string[];
};

export default Column;
