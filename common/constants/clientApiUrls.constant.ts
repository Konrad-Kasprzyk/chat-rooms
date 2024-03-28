const clientApiUrlPrefix = "api/client";

const userUrlPrefix = `${clientApiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${clientApiUrlPrefix}/workspace` as const;

const CLIENT_API_URLS = {
  user: {
    acceptWorkspaceInvitation: `${userUrlPrefix}/accept-workspace-invitation`,
    changeUserUsername: `${userUrlPrefix}/change-user-username`,
    createUserDocuments: `${userUrlPrefix}/create-user-documents`,
    hideWorkspaceInvitation: `${userUrlPrefix}/hide-workspace-invitation`,
    deleteUserDocumentsAndAccount: `${userUrlPrefix}/delete-user-documents-and-account`,
    rejectWorkspaceInvitation: `${userUrlPrefix}/reject-workspace-invitation`,
    uncoverWorkspaceInvitation: `${userUrlPrefix}/uncover-workspace-invitation`,
  },
  workspace: {
    addBotToWorkspace: `${workspaceUrlPrefix}/add-bot-to-workspace`,
    cancelUserInvitationToWorkspace: `${workspaceUrlPrefix}/cancel-user-invitation-to-workspace`,
    changeWorkspaceDescription: `${workspaceUrlPrefix}/change-workspace-description`,
    changeWorkspaceTitle: `${workspaceUrlPrefix}/change-workspace-title`,
    createWorkspace: `${workspaceUrlPrefix}/create-workspace`,
    inviteUserToWorkspace: `${workspaceUrlPrefix}/invite-user-to-workspace`,
    leaveWorkspace: `${workspaceUrlPrefix}/leave-workspace`,
    markWorkspaceDeleted: `${workspaceUrlPrefix}/mark-workspace-deleted`,
    moveWorkspaceToRecycleBin: `${workspaceUrlPrefix}/move-workspace-to-recycle-bin`,
    removeUserFromWorkspace: `${workspaceUrlPrefix}/remove-user-from-workspace`,
    retrieveWorkspaceFromRecycleBin: `${workspaceUrlPrefix}/retrieve-workspace-from-recycle-bin`,
    sendMessage: `${workspaceUrlPrefix}/send-message`,
  },
} as const;

export default CLIENT_API_URLS;
