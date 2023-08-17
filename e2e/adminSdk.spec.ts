import { expect, test } from "@playwright/test";
import adminAuth from "backend/db/adminAuth.firebase";
import adminDb from "backend/db/adminDb.firebase";
import auth from "common/db/auth.firebase";
import db from "common/db/db.firebase";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getDoc } from "firebase/firestore";
import path from "path";

let user: UserRecord;
let projectsCollection: string;

test.beforeAll(async ({ browserName }, workerInfo) => {
  const filename = path.parse(__filename).name;
  const dateTime = new Date().toISOString().split(":").join(".");
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
