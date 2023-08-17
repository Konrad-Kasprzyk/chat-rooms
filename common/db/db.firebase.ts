import isLocalEmulator from "common/test_utils/isLocalEmulator.util";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import app from "./app.firebase";

const db = getFirestore(app);

if (isLocalEmulator) {
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
}

export default db;
