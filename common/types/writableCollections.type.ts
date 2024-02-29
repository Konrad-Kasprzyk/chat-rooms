import COLLECTION_PATHS from "common/constants/collectionPaths.constant";

type WritableCollections = { -readonly [key in keyof typeof COLLECTION_PATHS]: string };

export default WritableCollections;
