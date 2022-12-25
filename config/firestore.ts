import app from "./firebase";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const db = getFirestore(app);

if (process.env.FIRESTORE_EMULATOR_HOST) connectFirestoreEmulator(db, "127.0.0.1", 8088);
export default db;
