import type HEX_ARRAY from "../types/hexArray";

/**
 * This collection is for transactions while making and assigning short ids per project
 */
export default interface Counter {
  id: string;
  projectId: string;
  nextTaskShortId: HEX_ARRAY;
  nextTaskPackShortId: HEX_ARRAY;
  nextGoalShortId: HEX_ARRAY;
  nextTaskStagesShortId: HEX_ARRAY;
  nextTaskTypeShortId: HEX_ARRAY;
}
