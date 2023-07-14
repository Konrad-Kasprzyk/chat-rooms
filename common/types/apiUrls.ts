import API_URLS from "common/constants/apiUrls";

type objectStringValues<T> = T extends string ? T : objectStringValues<T[keyof T]>;

type apiUrls = objectStringValues<typeof API_URLS>;

export default apiUrls;
