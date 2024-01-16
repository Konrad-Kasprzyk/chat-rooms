import NormHistory from "common/models/history_models/normHistory.model";
import typia from "typia";
const validateNormHistory = (input: any): NormHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is NormHistory => {
        return true;
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is NormHistory => {
            return true;
        })(input, "$input", true);
    return input;
};
export default validateNormHistory;
