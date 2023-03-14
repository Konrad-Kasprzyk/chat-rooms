export default interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  projectIds: string[];
  projectInvitationIds: string[];
}
