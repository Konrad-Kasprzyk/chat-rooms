import type HEX_ARRAY from "../types/hexArray";

export default interface Counter {
  id: string;
  projectId: string;
  nextTaskShortId: HEX_ARRAY;
  nextGoalShortId: HEX_ARRAY;
  nextStatusShortId: HEX_ARRAY;
  nextTypeShortId: HEX_ARRAY;
}
