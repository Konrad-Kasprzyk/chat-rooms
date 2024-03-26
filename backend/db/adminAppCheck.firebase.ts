import { getAppCheck } from "firebase-admin/app-check";
import adminApp from "./adminApp.firebase";

const adminAppCheck = getAppCheck(adminApp);

export default adminAppCheck;
