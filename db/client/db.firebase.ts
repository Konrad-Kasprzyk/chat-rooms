import _isLocalEmulator from "db/_isLocalEmulator.util";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import app from "./app.firebase";

const db = getFirestore(app);

if (_isLocalEmulator) {
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
}

export default db;
