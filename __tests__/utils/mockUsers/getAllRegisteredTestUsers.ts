import MockedFirebaseUser from "./mockedFirebaseUser";

export default function getAllRegisteredTestUsers(): {
  uid: string;
  email: string;
  displayName: string;
}[] {
  return MockedFirebaseUser.registeredMockUsers;
}
