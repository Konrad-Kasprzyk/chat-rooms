import IS_LOCAL_EMULATOR from "__tests__/constants/isLocalEmulator.constant";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import app from "./app.firebase";

const db = getFirestore(app);

if (IS_LOCAL_EMULATOR) {
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
}

export default db;
