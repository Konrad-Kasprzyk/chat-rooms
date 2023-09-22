import Label from "common/models/workspace_models/label.type";

const labelSkeleton = {
  replacedByLabelId: null,
  isInBin: false,
  placingInBinTime: null,
  insertedIntoBinByUserId: null,
};

const LABELS_INIT_VALUES: Label[] = [
  { id: "1", name: "feature", color: "LimeGreen", ...labelSkeleton },
  { id: "2", name: "fix", color: "Maroon", ...labelSkeleton },
  { id: "3", name: "docs", color: "Goldenrod", ...labelSkeleton },
  { id: "4", name: "refactor", color: "LightCoral", ...labelSkeleton },
  { id: "5", name: "test", color: "DodgerBlue", ...labelSkeleton },
  { id: "6", name: "other", color: "DarkSlateGrey", ...labelSkeleton },
];

export default LABELS_INIT_VALUES;
