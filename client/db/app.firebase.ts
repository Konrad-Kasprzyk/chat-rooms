import IS_LOCAL_EMULATOR from "__tests__/constants/isLocalEmulator.constant";
import DEV_PROJECT_ID from "common/constants/devProjectId.constant";
import { initializeApp } from "firebase/app";

const credential = IS_LOCAL_EMULATOR
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

export default app;
