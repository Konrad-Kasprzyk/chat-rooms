import Goal from "common/models/goal.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";

/**
 * This function recursively sorts all arrays inside the provided document.
 */
export default function sortAllDocumentArrays(
  document: User | UserDetails | Workspace | WorkspaceSummary | Task | Goal
) {
  const doc = document as { [key in string]: any };
  sortAllObjectArrays(doc);
}

function sortAllObjectArrays(obj: { [key in string]: any }) {
  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) {
      obj[key].sort();
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      sortAllObjectArrays(obj[key]);
    }
  }
}
