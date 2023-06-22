import COLLECTIONS from "global/constants/collections";

type MutableCollections = { -readonly [key in keyof typeof COLLECTIONS]: string };

export default MutableCollections;
