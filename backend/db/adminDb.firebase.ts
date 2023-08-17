import { getFirestore } from "firebase-admin/firestore";
import adminApp from "./adminApp.firebase";

const adminDb = getFirestore(adminApp);

export default adminDb;
