import DEV_PROJECT_ID from "common/constants/devProjectId.constant";
import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";
import { getApp, getApps, initializeApp } from "firebase/app";

const credential = USE_LOCAL_EMULATOR
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

const app = getApps().length === 0 ? initializeApp(credential) : getApp();

export default app;
