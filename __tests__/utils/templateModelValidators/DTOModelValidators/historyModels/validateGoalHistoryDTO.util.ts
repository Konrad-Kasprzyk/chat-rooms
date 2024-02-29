import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import typia from "typia";

const validateGoalHistoryDTO = typia.createAssertEquals<GoalHistoryDTO>();

export default validateGoalHistoryDTO;
