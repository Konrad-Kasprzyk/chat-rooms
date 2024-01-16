import Norm from "common/models/norm.model";
import typia from "typia";
const validateNorm = (input: any): Norm => {
    const __is = (input: any, _exceptionable: boolean = true): input is Norm => {
        return true;
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is Norm => {
            return true;
        })(input, "$input", true);
    return input;
};
export default validateNorm;
