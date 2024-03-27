import Goal from "common/clientModels/goal.model";
import typia from "typia";

const validateGoal = typia.createAssertEquals<Goal>();

export default validateGoal;
