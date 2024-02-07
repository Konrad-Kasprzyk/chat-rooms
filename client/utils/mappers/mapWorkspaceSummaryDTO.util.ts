import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";

export default function mapWorkspaceSummaryDTO(
  workspaceSummaryDTO: WorkspaceSummaryDTO
): WorkspaceSummary {
  const mappedWorkspaceSummary: WorkspaceSummary &
    Partial<Omit<WorkspaceSummaryDTO, keyof WorkspaceSummary>> = {
    ...workspaceSummaryDTO,
    modificationTime: workspaceSummaryDTO.modificationTime.toDate(),
    creationTime: workspaceSummaryDTO.creationTime.toDate(),
    placingInBinTime: workspaceSummaryDTO.placingInBinTime
      ? workspaceSummaryDTO.placingInBinTime.toDate()
      : null,
  };
  delete mappedWorkspaceSummary.isInBin;
  delete mappedWorkspaceSummary.isDeleted;
  return mappedWorkspaceSummary;
}
