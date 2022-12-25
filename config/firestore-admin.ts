import adminApp from "./firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

export default getFirestore(adminApp);
