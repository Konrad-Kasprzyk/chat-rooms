import GoalHistory from "common/models/history_models/goalHistory.model";
import typia from "typia";

const validateGoalHistory = typia.createValidateEquals<GoalHistory>();

export default validateGoalHistory;
