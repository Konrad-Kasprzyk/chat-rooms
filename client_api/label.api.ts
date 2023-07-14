import LABEL_COLORS from "common/constants/colors.constant";

export function addLabel(
  workspaceId: string,
  name: string,
  color: (typeof LABEL_COLORS)[number],
  index: number
): string {
  return "label id";
}

export function removeLabel(
  workspaceId: string,
  removingLabelId: string,
  replacementLabelId: string | null
): void {
  return null;
}

export function moveLabelToNewIndex(workspaceId: string, labelId: string, newIndex: number): void {
  return null;
}

export function changeLabelName(workspaceId: string, labelId: string, newName: string): void {
  return null;
}

export function changeLabelColor(
  workspaceId: string,
  labelId: string,
  newColor: (typeof LABEL_COLORS)[number]
): void {
  return null;
}
