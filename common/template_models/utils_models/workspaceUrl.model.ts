import typia from "typia";

export default interface WorkspaceUrl {
  /**
   * This id is used as a workspace url. This ensures that the url is unique.
   * @minLength 1
   */
  id: string;
}

export const validateWorkspaceUrl = typia.createValidateEquals<WorkspaceUrl>();
