import { db, auth } from "../db/firebase";
import { adminDb, adminAuth } from "../db/firebase-admin";
import { addDoc, collection, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { test, expect } from "@playwright/test";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import path from "path";

let user: UserRecord;
let projectsCollection: string;

test.beforeAll(async ({ browserName }, workerInfo) => {
  const filename = path.parse(__filename).name;
  const dateTime = new Date().toISOString().replaceAll(":", ".");
  const userEmail = `${filename}${dateTime}${browserName}${workerInfo.workerIndex}@normkeeper-testing.e2e`;
  const userPassword = "admin1";
  user = await adminAuth.createUser({
    email: userEmail,
    password: userPassword,
    displayName: "BOT testing",
    uid: userEmail,
  });
  await signInWithEmailAndPassword(auth, userEmail, userPassword).catch((error: any) => {
    console.error(error.code);
    console.error(error.message);
  });
  projectsCollection = user.email + "/uid/projects";
});

test.afterAll(async () => {
  await auth.signOut();
  await adminAuth.deleteUser(user.uid);
  await adminDb.recursiveDelete(adminDb.collection(projectsCollection));
});

test("access nested collection path", async ({ page }) => {
  const docRef = await addDoc(collection(db, projectsCollection), { title: "first project" });
  const projectSnap = await getDoc(docRef);
  const data = projectSnap.data();
  expect(data).toBeDefined();
  expect(data!.title).toBeDefined();
  expect(data!.title).toEqual("first project");
});
