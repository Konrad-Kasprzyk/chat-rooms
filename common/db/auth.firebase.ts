import IS_LOCAL_EMULATOR from "__tests__/constants/isLocalEmulator.constant";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import app from "./app.firebase";

const auth = getAuth(app);

if (IS_LOCAL_EMULATOR) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export default auth;
