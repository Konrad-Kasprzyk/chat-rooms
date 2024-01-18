import TaskHistory from "common/models/historyModels/taskHistory.model";
import typia from "typia";

const validateTaskHistory = typia.createAssertEquals<TaskHistory>();

export default validateTaskHistory;
