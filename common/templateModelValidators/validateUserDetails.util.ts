import UserDetails from "common/models/userDetails.model";
import typia from "typia";

const validateUserDetails = typia.createAssertEquals<UserDetails>();

export default validateUserDetails;
