import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";
import typia from "typia";

const validateArchivedGoals = typia.createAssertEquals<ArchivedGoals>();

export default validateArchivedGoals;
