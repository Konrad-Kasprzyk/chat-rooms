import type { tags } from "typia";

/**
 * Use this model to get the basic info about workspaces to show on user's profile.
 */
export default interface WorkspaceSummary {
  /**
   * Same as corresponding workspace id.
   * @minLength 1
   */
  id: string;
  /**
   * In addition to being an url, it is also an id of WorkspaceUrl.
   * @minLength 1
   */
  url: string;
  /**
   * @minLength 1
   */
  title: string;
  description: string;
  userIds: Array<string & tags.MinLength<1>>;
  invitedUserIds: Array<string & tags.MinLength<1>>;
  modificationTime: Date;
  creationTime: Date;
  placingInBinTime: Date | null;
}
