import Goal from "common/clientModels/goal.model";
import Task from "common/clientModels/task.model";
import User from "common/clientModels/user.model";
import UserDetails from "common/clientModels/userDetails.model";
import Workspace from "common/clientModels/workspace.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";

/**
 * This function sorts all arrays of strings inside the provided document.
 * Does not sort arrays in nested objects or arrays where not all elements are strings.
 */
export default function sortDocumentStringArrays(
  document: User | UserDetails | Workspace | WorkspaceSummary | Task | Goal
) {
  const doc = document as { [key in string]: any };
  for (const key of Object.keys(doc)) {
    if (Array.isArray(doc[key])) {
      const array = doc[key] as Array<any>;
      if (array.every((element) => typeof element === "string")) array.sort();
    }
  }
}
