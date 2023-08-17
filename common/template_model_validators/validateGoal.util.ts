import Goal from "common/models/goal.model";
import typia from "typia";

const validateGoal = typia.createValidateEquals<Goal>();

export default validateGoal;
