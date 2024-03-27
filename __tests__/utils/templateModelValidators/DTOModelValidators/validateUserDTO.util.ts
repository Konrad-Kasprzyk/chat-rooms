import UserDTO from "common/DTOModels/userDTO.model";
import typia from "typia";

const validateUserDTO = typia.createAssertEquals<UserDTO>();

export default validateUserDTO;
