import User from "common/models/user.model";
import typia from "typia";

const validateUser = typia.createAssertEquals<User>();

export default validateUser;
