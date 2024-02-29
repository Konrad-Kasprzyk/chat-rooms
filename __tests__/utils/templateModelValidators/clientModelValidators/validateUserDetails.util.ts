import UserDetails from "common/clientModels/userDetails.model";
import typia from "typia";

const validateUserDetails = typia.createAssertEquals<UserDetails>();

export default validateUserDetails;
