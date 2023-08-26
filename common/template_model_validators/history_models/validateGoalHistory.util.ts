import GoalHistory from "common/models/history_models/goalHistory.model";
import typia from "typia";

const validateGoalHistory = typia.createAssertEquals<GoalHistory>();

export default validateGoalHistory;
