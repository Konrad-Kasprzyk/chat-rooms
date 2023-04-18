export default interface User {
  id: string;
  // used in completed tasks stats
  shortId: string;
  email: string;
  username: string;
  projectIds: { id: string; title: string; description: string }[];
  projectInvitations: { id: string; title: string; description: string }[];
}
