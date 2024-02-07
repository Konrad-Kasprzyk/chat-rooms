import createClientCollections from "./createClientCollections.util";
import db from "./db.firebase";

const collections = createClientCollections(db);

export default collections;
