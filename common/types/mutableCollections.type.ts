import COLLECTIONS from "common/constants/collections.constant";

type MutableCollections = { -readonly [key in keyof typeof COLLECTIONS]: string };

export default MutableCollections;
