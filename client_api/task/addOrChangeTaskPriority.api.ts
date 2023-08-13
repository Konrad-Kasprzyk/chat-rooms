import PRIORITIES from "common/constants/priorities.constant";

export default async function addOrChangeTaskPriority(
  taskId: string,
  newPriority: (typeof PRIORITIES)[number]
): Promise<void> {
  return null;
}
