export function addColumn(
  workspaceId: string,
  name: string,
  index: number,
  taskFinishColumn: boolean = false
): string {
  return "column id";
}

export function removeColumn(
  workspaceId: string,
  removingColumnId: string,
  replacementColumnId: string | null
): void {
  return null;
}

// Works like columns.splice(newIndex, 0, columns[currentIndex]); and removing duplicate
export function moveColumnToNewIndex(
  workspaceId: string,
  columnId: string,
  newIndex: number
): void {
  return null;
}

export function changeColumnName(workspaceId: string, columnId: string, newName: string): void {
  return null;
}

export function markColumnAsTaskFinishColumn(workspaceId: string, columnId: string): void {
  return null;
}
