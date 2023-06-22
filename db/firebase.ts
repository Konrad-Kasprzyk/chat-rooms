import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import DEV_PROJECT_ID from "global/constants/devProjectId";

const localEmulator: boolean = process.env.REMOTE_SERVER ? false : true;

const credential = localEmulator
  ? { apiKey: "local_emulator", projectId: DEV_PROJECT_ID }
  : {
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    };

const app = initializeApp(credential);
const db = getFirestore(app);
const auth = getAuth(app);

if (localEmulator) {
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export { app, auth, db };
