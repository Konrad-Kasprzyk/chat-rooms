export default interface User {
  id: string;
  // used in completed tasks stats
  shortId: string;
  email: string;
  username: string;
  projectIds: string[];
  projectInvitationIds: string[];
}
