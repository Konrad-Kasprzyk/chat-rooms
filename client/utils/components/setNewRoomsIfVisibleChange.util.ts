import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { Dispatch, SetStateAction } from "react";

/**
 * Compares currently rendered rooms with new rooms. Compares the length of the room arrays and
 * iterates over each room, checking that ids, titles and descriptions are the same. If a change
 * is detected, uses the provided dispatch method to re-render the changes.
 * @param currentRooms Currently rendered rooms.
 * @param nextRooms All rooms to compare with currently rendered rooms.
 * @param setRooms Dispatch method to set new rooms to re-render when there are visible changes to
 * the client.
 */
export default function setNewRoomsIfVisibleChange(
  currentRooms: WorkspaceSummary[],
  nextRooms: WorkspaceSummary[],
  setRooms: Dispatch<SetStateAction<WorkspaceSummary[]>>
) {
  if (currentRooms.length != nextRooms.length) {
    setRooms(nextRooms);
    return;
  }
  let updateRooms = false;
  for (let i = 0; i < nextRooms.length; i++) {
    if (
      currentRooms[i].id != nextRooms[i].id ||
      currentRooms[i].title != nextRooms[i].title ||
      currentRooms[i].description != nextRooms[i].description
    ) {
      updateRooms = true;
      break;
    }
  }
  if (updateRooms) setRooms(nextRooms);
}
