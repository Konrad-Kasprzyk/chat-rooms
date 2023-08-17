import Task from "common/models/task.model";
import typia from "typia";

const validateTask = typia.createValidateEquals<Task>();

export default validateTask;
