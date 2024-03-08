import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import app from "./app.firebase";

const db = getFirestore(app);

if (USE_LOCAL_EMULATOR) {
  connectFirestoreEmulator(db, "127.0.0.1", 8088);
}

export default db;
