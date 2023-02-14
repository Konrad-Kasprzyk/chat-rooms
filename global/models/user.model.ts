/**
 * @nickname must be unique
 * @hidden from searching and inviting to projects
 */
export default interface User {
  id: string;
  name: string;
  surname: string;
  nameAndSurnameVisible: boolean;
  nameAndSurnameVisibleInProjects: boolean;
  nickname: string;
  projectIds: string[];
  projectInvitationIds: string[];
  hidden: boolean;
  hiddenFromIds: string[];
  visibleOnlyToIds: string[];
}
