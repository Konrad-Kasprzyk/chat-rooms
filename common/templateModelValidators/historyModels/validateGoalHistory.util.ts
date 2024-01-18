import GoalHistory from "common/models/historyModels/goalHistory.model";
import typia from "typia";

const validateGoalHistory = typia.createAssertEquals<GoalHistory>();

export default validateGoalHistory;
