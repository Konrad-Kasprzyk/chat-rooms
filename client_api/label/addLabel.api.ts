import LABEL_COLORS from "common/constants/colors.constant";

export default async function addLabel(
  workspaceId: string,
  name: string,
  color: (typeof LABEL_COLORS)[number],
  index: number
): Promise<string> {
  return "label id";
}