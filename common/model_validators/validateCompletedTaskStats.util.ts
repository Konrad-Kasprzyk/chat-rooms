import CompletedTaskStats from "common/models/completedTaskStats.model";
import typia from "typia";
const validateCompletedTaskStats = (input: any): CompletedTaskStats => {
    const __is = (input: any, _exceptionable: boolean = true): input is CompletedTaskStats => {
        return true;
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is CompletedTaskStats => {
            return true;
        })(input, "$input", true);
    return input;
};
export default validateCompletedTaskStats;
