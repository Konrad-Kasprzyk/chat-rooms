import Norm from "common/models/norm.model";
import typia from "typia";

const validateNorm = typia.createValidateEquals<Norm>();

export default validateNorm;
