import TaskHistory from "common/models/history_models/taskHistory.model";
import typia from "typia";

const validateTaskHistory = typia.createValidateEquals<TaskHistory>();

export default validateTaskHistory;
