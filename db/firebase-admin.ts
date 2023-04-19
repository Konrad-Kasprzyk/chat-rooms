import { initializeApp, cert, getApp, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import DEV_PROJECT_ID from "../global/constants/devProjectId";

const localEmulator: boolean = process.env.REMOTE_SERVER ? false : true;

if (localEmulator) {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8088";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
}

const credential = localEmulator
  ? {
      project_id: DEV_PROJECT_ID,
      private_key:
        // This is fake private key for local emulator
        "-----BEGIN RSA PRIVATE KEY-----MIIBOQIBAAJAYlHBdaDyI+8htA1s57zhGA6oqAYoJ16x1tuqnQBBBclmw3tVUia/A9pZB7iHxgKwh0ElEym2VGHABb3J7aIYMQIDAQABAkBPV9rfqnq+NQTl4M+6U9rzJyFEN3PAEdNCqRMOkF3o5JTzILxZyr9bDYpyGpjFK9jVJNLh+Wpj9uX1UfPp63NhAiEAtb+ry8gVbJMqzpPvfCoAdT0+GPxFpOuj/rQRTxAK6U8CIQCKfI+vXBuALt79MPaR8RmrO8XnJzYaBLZtWK7f9BeGfwIhAJutejIrSG6gAGLCRLhOIeZKdw5fyCfjz600AD+AtlfxAiAs9NDEMZdv3kdfVDTHHciicM4HAxCqE5uRFbf3VcsJSwIgFMshAK1Pd2jmLL8XIIJ5j70/9Zu5l2wV0trdm/BJNJ0=-----END RSA PRIVATE KEY-----",
      client_email: "local_emulator",
    }
  : {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY?.replaceAll("\\n", "\n"),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.PROJECT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    };

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(credential as ServiceAccount),
      })
    : getApp();

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
