import app from "./firebase";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const auth = getAuth(app);

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) connectAuthEmulator(auth, "http://127.0.0.1:9099");
export default auth;
