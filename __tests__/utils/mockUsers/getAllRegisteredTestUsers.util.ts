import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default function getAllRegisteredTestUsers(): {
  uid: string;
  email: string;
  displayName: string;
}[] {
  return MockedFirebaseUser.registeredMockUsers;
}
