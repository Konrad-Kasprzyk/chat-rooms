import UserDTO from "common/DTOModels/userDTO.model";
import User from "common/clientModels/user.model";

export default function mapUserDTO(userDTO: UserDTO): User {
  const mappedUser: User & Partial<Omit<UserDTO, keyof User>> = {
    ...userDTO,
    modificationTime: userDTO.modificationTime.toDate(),
  };
  return mappedUser;
}
