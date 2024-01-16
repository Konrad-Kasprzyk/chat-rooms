const apiUrlPrefix = "api";

const testsUrlPrefix = `${apiUrlPrefix}/tests` as const;
const userUrlPrefix = `${apiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${apiUrlPrefix}/workspace` as const;

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
    createEmptyWorkspace: `${workspaceUrlPrefix}/create-empty-workspace`,
    inviteUserToWorkspace: `${workspaceUrlPrefix}/invite-user-to-workspace`,
    moveWorkspaceToRecycleBin: `${workspaceUrlPrefix}/move-workspace-to-recycle-bin`,
    userMarksWorkspaceDeleted: `${workspaceUrlPrefix}/user-marks-workspace-deleted`,
  },
} as const;

export default CLIENT_API_URLS;
