import ArchivedTasksHistoryDTO from "common/DTOModels/historyModels/archivedTasksHistoryDTO.model";
import typia from "typia";

const validateArchivedTasksHistoryDTO = typia.createAssertEquals<ArchivedTasksHistoryDTO>();

export default validateArchivedTasksHistoryDTO;
