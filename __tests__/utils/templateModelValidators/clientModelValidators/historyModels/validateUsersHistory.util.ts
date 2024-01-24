import UsersHistory from "common/clientModels/historyModels/usersHistory.model";
import typia from "typia";

const validateUsersHistory = typia.createAssertEquals<UsersHistory>();

export default validateUsersHistory;
