import GlobalCounter from "common/models/globalCounter.model";

const GLOBAL_COUNTER_INIT_VALUES: Omit<GlobalCounter, "id"> = {
  nextUserShortId: String.fromCharCode(32),
};

export default GLOBAL_COUNTER_INIT_VALUES;
