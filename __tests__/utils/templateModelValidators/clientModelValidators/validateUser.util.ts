import User from "common/clientModels/user.model";
import typia from "typia";

const validateUser = typia.createAssertEquals<User>();

export default validateUser;
