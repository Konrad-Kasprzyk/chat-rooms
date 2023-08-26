import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import typia from "typia";
const validateWorkspaceCounter = (input: any): WorkspaceCounter => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceCounter => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("number" === typeof input.nextTaskId && parseInt(input.nextTaskId) === input.nextTaskId && 1 <= input.nextTaskId) && ("number" === typeof input.nextGoalId && parseInt(input.nextGoalId) === input.nextGoalId && 1 <= input.nextGoalId) && ("number" === typeof input.nextLabelId && parseInt(input.nextLabelId) === input.nextLabelId && 1 <= input.nextLabelId) && ("number" === typeof input.nextColumnId && parseInt(input.nextColumnId) === input.nextColumnId && 1 <= input.nextColumnId) && ("number" === typeof input.nextNormId && parseInt(input.nextNormId) === input.nextNormId && 1 <= input.nextNormId) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "nextTaskId", "nextGoalId", "nextLabelId", "nextColumnId", "nextNormId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceCounter => {
            const $guard = (typia.createAssertEquals as any).guard;
            const $join = (typia.createAssertEquals as any).join;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string (@minLength 1)",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("number" === typeof input.nextTaskId && (parseInt(input.nextTaskId) === input.nextTaskId || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "number (@type int)",
                value: input.nextTaskId
            })) && (1 <= input.nextTaskId || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "number (@minimum 1)",
                value: input.nextTaskId
            })) || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "number",
                value: input.nextTaskId
            })) && ("number" === typeof input.nextGoalId && (parseInt(input.nextGoalId) === input.nextGoalId || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "number (@type int)",
                value: input.nextGoalId
            })) && (1 <= input.nextGoalId || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "number (@minimum 1)",
                value: input.nextGoalId
            })) || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "number",
                value: input.nextGoalId
            })) && ("number" === typeof input.nextLabelId && (parseInt(input.nextLabelId) === input.nextLabelId || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "number (@type int)",
                value: input.nextLabelId
            })) && (1 <= input.nextLabelId || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "number (@minimum 1)",
                value: input.nextLabelId
            })) || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "number",
                value: input.nextLabelId
            })) && ("number" === typeof input.nextColumnId && (parseInt(input.nextColumnId) === input.nextColumnId || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "number (@type int)",
                value: input.nextColumnId
            })) && (1 <= input.nextColumnId || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "number (@minimum 1)",
                value: input.nextColumnId
            })) || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "number",
                value: input.nextColumnId
            })) && ("number" === typeof input.nextNormId && (parseInt(input.nextNormId) === input.nextNormId || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "number (@type int)",
                value: input.nextNormId
            })) && (1 <= input.nextNormId || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "number (@minimum 1)",
                value: input.nextNormId
            })) || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "number",
                value: input.nextNormId
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "nextTaskId", "nextGoalId", "nextLabelId", "nextColumnId", "nextNormId"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                });
            })));
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            })) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            });
        })(input, "$input", true);
    return input;
};
export default validateWorkspaceCounter;
