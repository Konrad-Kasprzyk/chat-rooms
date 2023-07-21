import Label from "common/models/workspace_models/label.type";

const labelSkeleton = {
  replacedByLabelId: null,
  inRecycleBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

const LABELS_INIT_VALUES: Label[] = [
  { name: "feature", color: "LimeGreen", id: String.fromCharCode(32), ...labelSkeleton },
  { name: "fix", color: "Maroon", id: String.fromCharCode(33), ...labelSkeleton },
  { name: "docs", color: "Goldenrod", id: String.fromCharCode(34), ...labelSkeleton },
  { name: "refactor", color: "LightCoral", id: String.fromCharCode(35), ...labelSkeleton },
  { name: "test", color: "DodgerBlue", id: String.fromCharCode(36), ...labelSkeleton },
  { name: "other", color: "DarkSlateGrey", id: String.fromCharCode(37), ...labelSkeleton },
];

export default LABELS_INIT_VALUES;
