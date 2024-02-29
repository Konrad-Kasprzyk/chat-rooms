import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";

type objectStringValues<T> = T extends string ? T : objectStringValues<T[keyof T]>;

type clientApiUrls = objectStringValues<typeof CLIENT_API_URLS>;

export default clientApiUrls;
