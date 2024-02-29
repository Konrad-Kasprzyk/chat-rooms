import SCRIPT_API_URLS from "common/constants/scriptApiUrls.constant";

type objectStringValues<T> = T extends string ? T : objectStringValues<T[keyof T]>;

type scriptApiUrls = objectStringValues<typeof SCRIPT_API_URLS>;

export default scriptApiUrls;
