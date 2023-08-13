import LABEL_COLORS from "common/constants/colors.constant";

export default async function changeLabelColor(
  workspaceId: string,
  labelId: string,
  newColor: (typeof LABEL_COLORS)[number]
): Promise<void> {
  return null;
}
