import ArchivedTasksDTO from "common/DTOModels/historyModels/archivedTasksDTO.model";
import typia from "typia";

const validateArchivedTasksDTO = typia.createAssertEquals<ArchivedTasksDTO>();

export default validateArchivedTasksDTO;
