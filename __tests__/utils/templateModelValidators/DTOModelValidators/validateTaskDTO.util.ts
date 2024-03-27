import TaskDTO from "common/DTOModels/taskDTO.model";
import typia from "typia";

const validateTaskDTO = typia.createAssertEquals<TaskDTO>();

export default validateTaskDTO;
