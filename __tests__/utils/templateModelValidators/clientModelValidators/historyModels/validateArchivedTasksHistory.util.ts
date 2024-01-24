import ArchivedTasksHistory from "common/clientModels/historyModels/archivedTasksHistory.model";
import typia from "typia";

const validateArchivedTasksHistory = typia.createAssertEquals<ArchivedTasksHistory>();

export default validateArchivedTasksHistory;
