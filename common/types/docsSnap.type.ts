import DOCS_UPDATE_TYPES from "common/constants/docsUpdateTypes.constant";

type docsSnap<T extends object> = {
  docs: T[];
  updates: { type: (typeof DOCS_UPDATE_TYPES)[number]; doc: T }[];
};

export default docsSnap;
