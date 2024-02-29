import ArchivedTasks from "common/clientModels/historyModels/archivedTasks.model";
import typia from "typia";

const validateArchivedTasks = typia.createAssertEquals<ArchivedTasks>();

export default validateArchivedTasks;
