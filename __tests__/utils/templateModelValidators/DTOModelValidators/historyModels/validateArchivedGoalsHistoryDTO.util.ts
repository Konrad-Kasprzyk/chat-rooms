import ArchivedGoalsHistoryDTO from "common/DTOModels/historyModels/archivedGoalsHistoryDTO.model";
import typia from "typia";

const validateArchivedGoalsHistoryDTO = typia.createAssertEquals<ArchivedGoalsHistoryDTO>();

export default validateArchivedGoalsHistoryDTO;
