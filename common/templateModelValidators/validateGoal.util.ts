import Goal from "common/models/goal.model";
import typia from "typia";

const validateGoal = typia.createAssertEquals<Goal>();

export default validateGoal;
