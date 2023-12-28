const apiUrlPrefix = "api";

const testsUrlPrefix = `${apiUrlPrefix}/tests` as const;
const userUrlPrefix = `${apiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${apiUrlPrefix}/workspace` as const;

const SCRIPT_API_URLS = {
  tests: {
    addUsersToWorkspace: `${testsUrlPrefix}/add-users-to-workspace`,
    createTestCollections: `${testsUrlPrefix}/create-test-collections`,
    deleteTestCollections: `${testsUrlPrefix}/delete-test-collections`,
    deleteTestUserAccount: `${testsUrlPrefix}/delete-test-user-account`,
    removeUsersFromWorkspace: `${testsUrlPrefix}/remove-users-from-workspace`,
  },
  user: {
    deleteUser: `${userUrlPrefix}/delete-user`,
  },
  workspace: {
    deleteWorkspaceAndRelatedDocuments: `${workspaceUrlPrefix}/delete-workspace-and-related-documents`,
    markWorkspaceDeleted: `${workspaceUrlPrefix}/mark-workspace-deleted`,
  },
} as const;

export default SCRIPT_API_URLS;
