import User from "common/models/user.model";
import typia from "typia";

const validateUser = typia.createValidateEquals<User>();

export default validateUser;
