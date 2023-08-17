import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import validateUser from "common/model_validators/validateUser.util";
import User from "common/models/user.model";

export default function checkUser(
  user: User,
  expectedUid: string,
  expectedEmail: string,
  expectedUsername: string,
  matchInitValues: boolean = false
) {
  expect(validateUser(user).success).toBeTrue();

  expect(user.id).toEqual(expectedUid);
  expect(user.email).toEqual(expectedEmail);
  expect(user.username).toEqual(expectedUsername);

  if (matchInitValues) {
    for (const key of Object.keys(USER_INIT_VALUES) as (keyof typeof USER_INIT_VALUES)[]) {
      expect(user[key]).toStrictEqual(USER_INIT_VALUES[key]);
    }
  }
}
