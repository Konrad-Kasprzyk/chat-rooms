import ArchivedGoalsDTO from "common/DTOModels/historyModels/archivedGoalsDTO.model";
import typia from "typia";

const validateArchivedGoalsDTO = typia.createAssertEquals<ArchivedGoalsDTO>();

export default validateArchivedGoalsDTO;
