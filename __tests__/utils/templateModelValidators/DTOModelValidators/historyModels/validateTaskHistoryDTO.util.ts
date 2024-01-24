import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import typia from "typia";

const validateTaskHistoryDTO = typia.createAssertEquals<TaskHistoryDTO>();

export default validateTaskHistoryDTO;
