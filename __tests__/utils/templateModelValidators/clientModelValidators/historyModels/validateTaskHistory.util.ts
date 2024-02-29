import TaskHistory from "common/clientModels/historyModels/taskHistory.model";
import typia from "typia";

const validateTaskHistory = typia.createAssertEquals<TaskHistory>();

export default validateTaskHistory;
