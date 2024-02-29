import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default function getAllRegisteredTestUsers(): {
  uid: string;
  email: string | null;
  displayName: string;
  emailVerified: boolean;
}[] {
  return MockedFirebaseUser.registeredMockUsers;
}
