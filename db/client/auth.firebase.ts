import _isLocalEmulator from "db/_isLocalEmulator.util";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import app from "./app.firebase";

const auth = getAuth(app);

if (_isLocalEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export default auth;
