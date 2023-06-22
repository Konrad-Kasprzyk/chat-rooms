import User from "global/models/user.model";

export default function checkUser(
  user: User,
  expectedUid: string,
  expectedEmail: string,
  expectedUsername: string
) {
  expect(user.id).toEqual(expectedUid);
  expect(user.email).toEqual(expectedEmail);
  expect(user.username).toEqual(expectedUsername);
  expect(user.shortId).toBeString();
  expect(user.workspaces).toBeArray();
  expect(user.workspaceIds).toBeArray();
  expect(user.workspaceInvitations).toBeArray();
  expect(user.workspaceInvitationIds).toBeArray();
}
