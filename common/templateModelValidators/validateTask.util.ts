import Task from "common/models/task.model";
import typia from "typia";

const validateTask = typia.createAssertEquals<Task>();

export default validateTask;
