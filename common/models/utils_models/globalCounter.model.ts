export default interface GlobalCounter {
  /**
   * @minLength 1
   */
  id: string;
  /**
   * Short id is 32-126 ASCII chars.
   * @minLength 1
   */
  nextUserShortId: string;
}
