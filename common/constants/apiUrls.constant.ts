const apiUrlPrefix = "api";

const testsUrlPrefix = `${apiUrlPrefix}/tests` as const;
const userUrlPrefix = `${apiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${apiUrlPrefix}/workspace` as const;

const API_URLS = {
  tests: {
    addUsersToWorkspace: `${testsUrlPrefix}/add-users-to-workspace`,
    createTestCollections: `${testsUrlPrefix}/create-test-collections`,
    deleteTestCollections: `${testsUrlPrefix}/delete-test-collections`,
    deleteTestUserAccount: `${testsUrlPrefix}/delete-test-user-account`,
    deleteTestUserDocument: `${testsUrlPrefix}/delete-test-user-document`,
    registerUserEmailPassword: `${testsUrlPrefix}/register-user-email-password`,
    removeUsersFromWorkspace: `${testsUrlPrefix}/remove-users-from-workspace`,
  },
  user: {
    changeUserUsername: `${userUrlPrefix}/change-user-username`,
    createUserDocuments: `${userUrlPrefix}/create-user-documents`,
    deleteUser: `${userUrlPrefix}/delete-user`,
  },
  workspace: {
    acceptWorkspaceInvitation: `${workspaceUrlPrefix}/accept-workspace-invitation`,
    cancelUserInvitationToWorkspace: `${workspaceUrlPrefix}/cancel-user-invitation-to-workspace`,
    changeWorkspaceDescription: `${workspaceUrlPrefix}/change-workspace-description`,
    changeWorkspaceTitle: `${workspaceUrlPrefix}/change-workspace-title`,
    createDemoWorkspace: `${workspaceUrlPrefix}/create-demo-workspace`,
    createEmptyWorkspace: `${workspaceUrlPrefix}/create-empty-workspace`,
    deleteWorkspace: `${workspaceUrlPrefix}/delete-workspace`,
    inviteUserToWorkspace: `${workspaceUrlPrefix}/invite-user-to-workspace`,
    leaveWorkspace: `${workspaceUrlPrefix}/leave-workspace`,
    rejectWorkspaceInvitation: `${workspaceUrlPrefix}/reject-workspace-invitation`,
    removeUserFromWorkspace: `${workspaceUrlPrefix}/remove-user-from-workspace`,
  },
} as const;

export default API_URLS;
