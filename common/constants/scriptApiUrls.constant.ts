const scriptApiUrlPrefix = "api/script";

const testsUrlPrefix = `${scriptApiUrlPrefix}/tests` as const;
const userUrlPrefix = `${scriptApiUrlPrefix}/user` as const;
const workspaceUrlPrefix = `${scriptApiUrlPrefix}/workspace` as const;

const SCRIPT_API_URLS = {
  tests: {
    addUsersToWorkspace: `${testsUrlPrefix}/add-users-to-workspace`,
    createTestCollections: `${testsUrlPrefix}/create-test-collections`,
    deleteTestCollections: `${testsUrlPrefix}/delete-test-collections`,
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
