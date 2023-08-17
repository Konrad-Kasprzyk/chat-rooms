import { getAuth } from "firebase-admin/auth";
import adminApp from "./adminApp.firebase";

const adminAuth = getAuth(adminApp);

export default adminAuth;
