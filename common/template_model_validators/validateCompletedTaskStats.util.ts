import CompletedTaskStats from "common/models/completedTaskStats.model";
import typia from "typia";

const validateCompletedTaskStats = typia.createValidateEquals<CompletedTaskStats>();

export default validateCompletedTaskStats;
