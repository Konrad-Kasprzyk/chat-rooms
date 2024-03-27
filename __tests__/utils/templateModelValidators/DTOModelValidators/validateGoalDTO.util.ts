import GoalDTO from "common/DTOModels/goalDTO.model";
import typia from "typia";

const validateGoalDTO = typia.createAssertEquals<GoalDTO>();

export default validateGoalDTO;
