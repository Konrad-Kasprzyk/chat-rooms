import { adminAuth, adminDb } from "../../../db/firebase-admin";
import {
  deleteRegisteredUsersAndUserDocuments,
  getRandomPassword,
  getUniqueEmail,
  registerUserEmailPassword,
} from "../../../global/utils/admin_utils/emailPasswordUser";
import COLLECTIONS from "../../../global/constants/collections";

const usedEmails: string[] = [];

function getEmail() {
  const email = getUniqueEmail();
  usedEmails.push(email);
  return email;
}

describe("Test admin utils registering a user with email and password", () => {
  afterAll(async () => await deleteRegisteredUsersAndUserDocuments(usedEmails));

  it("Requires proper input to register a user", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";

    await expect(registerUserEmailPassword("", password, username)).rejects.toBeString();
    await expect(registerUserEmailPassword(email, "", username)).rejects.toBeString();
  });

  it("Properly registers a user.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";

    const userId = await registerUserEmailPassword(email, password, username);
    // User registered, but user model document shouldn't be created
    const docRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    const docSnap = await docRef.get();
    expect(docSnap.exists).toBeFalse();

    const user = await adminAuth.getUser(userId);
    expect(user.email).toEqual(email);
    expect(user.emailVerified).toBeFalse();
    expect(user.displayName).toEqual(username);
  });

  it("Registers a user without username.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "";

    const userId = await registerUserEmailPassword(email, password, username);
    // User registered, but user model document shouldn't be created
    const docRef = adminDb.collection(COLLECTIONS.users).doc(userId);
    const docSnap = await docRef.get();
    expect(docSnap.exists).toBeFalse();

    const user = await adminAuth.getUser(userId);
    expect(user.email).toEqual(email);
    expect(user.emailVerified).toBeFalse();
    expect(user.displayName).toEqual(username);
  });

  it("Doesn't register already registered user", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";

    const userId = await registerUserEmailPassword(email, password, username);
    await expect(registerUserEmailPassword(email, password, username)).toReject();

    const user = await adminAuth.getUser(userId);
    expect(user.email).toEqual(email);
    expect(user.emailVerified).toBeFalse();
    expect(user.displayName).toEqual(username);
  });

  it("Properly registers a user when many simultaneous requests are made.", async () => {
    const email = getEmail();
    const password = getRandomPassword();
    const username = "Jeff";
    const promises = [];
    const registrationAttempts = 10;
    let userId = "";
    let rejectedRegistrationAttempts = 0;

    for (let i = 0; i < registrationAttempts; i++)
      promises.push(registerUserEmailPassword(email, password, username));
    const responses = await Promise.allSettled(promises);
    for (const res of responses) {
      if (res.status === "rejected") rejectedRegistrationAttempts++;
      else userId = res.value;
    }

    expect(rejectedRegistrationAttempts).toEqual(registrationAttempts - 1);
    const user = await adminAuth.getUser(userId);
    expect(user.email).toEqual(email);
    expect(user.emailVerified).toBeFalse();
    expect(user.displayName).toEqual(username);
  });
});
