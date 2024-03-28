import USER_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDTOInitValues.constant";
import USER_DETAILS_DTO_INIT_VALUES from "backend/constants/docsInitValues/userDetailsDTOInitValues.constant";
import WORKSPACE_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceDTOInitValues.constant";
import WORKSPACE_SUMMARY_DTO_INIT_VALUES from "backend/constants/docsInitValues/workspace/workspaceSummaryDTOInitValues.constant";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import { Timestamp } from "firebase-admin/firestore";

type validDocsInitValues = {
  user: [UserDTO, typeof USER_DTO_INIT_VALUES];
  userDetails: [UserDetailsDTO, typeof USER_DETAILS_DTO_INIT_VALUES];
  workspace: [WorkspaceDTO, typeof WORKSPACE_DTO_INIT_VALUES];
  workspaceSummary: [WorkspaceSummaryDTO, typeof WORKSPACE_SUMMARY_DTO_INIT_VALUES];
};

/**
 * Ensures that the specified document fields are equal to the specified initial document values.
 * Ensures that all dates were created at the same time.
 */
export default function checkInitValues<K extends keyof validDocsInitValues>(
  ...args: validDocsInitValues[K]
): void {
  const docToCheck = args[0];
  const initValues = args[1];
  // Assert that all dates were created at the same time.
  let dateFromServer: Timestamp | undefined = undefined;
  for (const key of Object.keys(initValues)) {
    const valueToCheck = (docToCheck as { [key in string]: any })[key];
    const initValue = (initValues as { [key in string]: any })[key];
    if (valueToCheck instanceof Timestamp) {
      const dateToCheck = valueToCheck;
      if (dateFromServer) expect(dateToCheck.toString()).toStrictEqual(dateFromServer.toString());
      else dateFromServer = dateToCheck;
    } else expect(valueToCheck).toStrictEqual(initValue);
  }
}
