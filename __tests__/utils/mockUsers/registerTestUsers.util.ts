import EMAIL_SUFFIX from "common/constants/emailSuffix.constant";
import { v4 as uuidv4 } from "uuid";
import MockedFirebaseUser from "./mockedFirebaseUser.class";

/**
 * Registers new mocked users.
 * @param anonymousUser - if true, the user will not have an email and emailVerified will be false.
 * @returns an array of new users data from registration.
 */
export default function registerTestUsers<IsAnonymousUser extends boolean = false>(
  howMany: number,
  anonymousUser?: IsAnonymousUser
): IsAnonymousUser extends true
  ? {
      uid: string;
      email: null;
      displayName: string;
      emailVerified: false;
    }[]
  : {
      uid: string;
      email: string;
      displayName: string;
      emailVerified: true;
    }[] {
  const newRegisteredTestUsers = [];
  for (let i = 0; i < howMany; i++) {
    const uid = uuidv4();
    const email = anonymousUser ? null : `${uid}${EMAIL_SUFFIX}`;
    const displayName = `Testing user ${i}`;
    newRegisteredTestUsers.push(
      new MockedFirebaseUser(uid, email, displayName, anonymousUser ? false : true)
    );
  }
  MockedFirebaseUser.registeredMockUsers.push(...newRegisteredTestUsers);
  return newRegisteredTestUsers as any;
}
