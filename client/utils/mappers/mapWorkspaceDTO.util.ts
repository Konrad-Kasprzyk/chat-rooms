import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import Workspace from "common/clientModels/workspace.model";

export default function mapWorkspaceDTO(workspaceDTO: WorkspaceDTO): Workspace {
  const mappedWorkspace: Workspace & Partial<Omit<WorkspaceDTO, keyof Workspace>> = {
    ...workspaceDTO,
    users: [],
    modificationTime: workspaceDTO.modificationTime.toDate(),
    creationTime: workspaceDTO.creationTime.toDate(),
    placingInBinTime: workspaceDTO.placingInBinTime ? workspaceDTO.placingInBinTime.toDate() : null,
  };
  delete mappedWorkspace.isInBin;
  delete mappedWorkspace.isDeleted;
  delete mappedWorkspace.deletionTime;
  return mappedWorkspace;
}
