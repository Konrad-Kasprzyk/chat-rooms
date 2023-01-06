import COLLECTIONS from "../constants/collections";

type mutableCollections = { -readonly [key in keyof typeof COLLECTIONS]: string };

export default mutableCollections;
