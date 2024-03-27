import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
import typia from "typia";

const validateUsersHistoryDTO = typia.createAssertEquals<UsersHistoryDTO>();

export default validateUsersHistoryDTO;
