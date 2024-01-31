const clientApiUrlPrefix = "api/client";

const userUrlPrefix = `${clientApiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${clientApiUrlPrefix}/workspace` as const;

const CLIENT_API_URLS = {
  user: {
    acceptWorkspaceInvitation: `${userUrlPrefix}/accept-workspace-invitation`,
    changeUserUsername: `${userUrlPrefix}/change-user-username`,
    createUserDocument: `${userUrlPrefix}/create-user-document`,
    hideWorkspaceInvitation: `${userUrlPrefix}/hide-workspace-invitation`,
    markUserDeleted: `${userUrlPrefix}/mark-user-deleted`,
    rejectWorkspaceInvitation: `${userUrlPrefix}/reject-workspace-invitation`,
    uncoverWorkspaceInvitation: `${userUrlPrefix}/uncover-workspace-invitation`,
  },
  workspace: {
    cancelUserInvitationToWorkspace: `${workspaceUrlPrefix}/cancel-user-invitation-to-workspace`,
    changeWorkspaceDescription: `${workspaceUrlPrefix}/change-workspace-description`,
    changeWorkspaceTitle: `${workspaceUrlPrefix}/change-workspace-title`,
    createWorkspace: `${workspaceUrlPrefix}/create-workspace`,
    inviteUserToWorkspace: `${workspaceUrlPrefix}/invite-user-to-workspace`,
    leaveWorkspace: `${workspaceUrlPrefix}/leave-workspace`,
    markWorkspaceDeleted: `${workspaceUrlPrefix}/mark-workspace-deleted`,
    moveWorkspaceToRecycleBin: `${workspaceUrlPrefix}/move-workspace-to-recycle-bin`,
  },
} as const;

export default CLIENT_API_URLS;
