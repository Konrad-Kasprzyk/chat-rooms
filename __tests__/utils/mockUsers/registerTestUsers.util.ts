import { v4 as uuidv4 } from "uuid";
import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default function registerTestUsers(howMany: number): {
  uid: string;
  email: string;
  displayName: string;
}[] {
  const newRegisteredTestUsers = [];
  for (let i = 0; i < howMany; i++) {
    const uid = uuidv4();
    const email = uid + "@normkeeper-testing.api";
    const displayName = `Testing user ${i}`;
    newRegisteredTestUsers.push(new MockedFirebaseUser(uid, email, displayName));
  }
  MockedFirebaseUser.registeredMockUsers.push(...newRegisteredTestUsers);
  return newRegisteredTestUsers;
}
