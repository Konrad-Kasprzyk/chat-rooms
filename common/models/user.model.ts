export default interface User {
  id: string;
  // used in completed tasks stats
  shortId: string;
  email: string;
  username: string;
  // TODO check if updated all repo code after adding 'url: string;'
  workspaces: { id: string; url: string; title: string; description: string }[];
  workspaceIds: string[];
  // TODO check if updated all repo code after adding 'url: string;'
  workspaceInvitations: { id: string; url: string; title: string; description: string }[];
  workspaceInvitationIds: string[];
}
