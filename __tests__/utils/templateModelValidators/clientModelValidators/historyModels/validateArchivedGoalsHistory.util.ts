import ArchivedGoalsHistory from "common/clientModels/historyModels/archivedGoalsHistory.model";
import typia from "typia";

const validateArchivedGoalsHistory = typia.createAssertEquals<ArchivedGoalsHistory>();

export default validateArchivedGoalsHistory;
