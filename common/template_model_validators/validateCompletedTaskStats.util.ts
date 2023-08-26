import CompletedTaskStats from "common/models/completedTaskStats.model";
import typia from "typia";

const validateCompletedTaskStats = typia.createAssertEquals<CompletedTaskStats>();

export default validateCompletedTaskStats;
