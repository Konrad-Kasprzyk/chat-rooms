export default interface User {
  id: string;
  // used in completed tasks stats
  shortId: string;
  email: string;
  username: string;
  workspaces: { id: string; title: string; description: string }[];
  workspaceInvitations: { id: string; title: string; description: string }[];
}
