import DEV_PROJECT_ID from "common/constants/devProjectId.constant";
import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { AppCheck, ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";

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

let app: FirebaseApp;
let _appCheck: AppCheck | null = null;

if (getApps().length === 0) {
  app = initializeApp(credential);
  // reCAPTCHA requires window to be defined. Tests with local emulator do not use reCAPTCHA.
  if (typeof window !== "undefined" && !USE_LOCAL_EMULATOR) {
    if (process.env.NODE_ENV !== "production") {
      /**
       * Environment variable is set during launching development NextJs server inside next.config.js
       * This private variable is set only when process.env.NODE_ENV !== "production". Production
       * and staging servers do not set this variable.
       */
      // @ts-ignore: This is a valid property to allow local development with firebase app check.
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
    }
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!recaptchaSiteKey) throw new Error("reCAPTCHA site key not found");
    _appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
    });
  }
} else {
  app = getApp();
}

export const appCheck = _appCheck;

export default app;
