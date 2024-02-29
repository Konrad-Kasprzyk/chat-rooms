import Task from "common/clientModels/task.model";
import typia from "typia";

const validateTask = typia.createAssertEquals<Task>();

export default validateTask;
