import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import typia from "typia";

const validateUserDetailsDTO = typia.createAssertEquals<UserDetailsDTO>();

export default validateUserDetailsDTO;
