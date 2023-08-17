import adminDb from "./adminDb.firebase";
import createAdminCollections from "./createAdminCollections.util";

const adminCollections = createAdminCollections(adminDb);

export default adminCollections;
