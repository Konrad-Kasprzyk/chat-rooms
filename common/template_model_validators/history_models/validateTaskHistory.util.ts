import TaskHistory from "common/models/history_models/taskHistory.model";
import typia from "typia";

const validateTaskHistory = typia.createAssertEquals<TaskHistory>();

export default validateTaskHistory;
