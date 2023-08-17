import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import typia from "typia";
const validateWorkspaceCounter = (input: any): typia.IValidation<WorkspaceCounter> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceCounter => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.nextTaskShortId && 1 <= input.nextTaskShortId.length) && ("number" === typeof input.nextTaskSearchId && parseInt(input.nextTaskSearchId) === input.nextTaskSearchId && 1 <= input.nextTaskSearchId) && ("string" === typeof input.nextLabelId && 1 <= input.nextLabelId.length) && ("string" === typeof input.nextColumnId && 1 <= input.nextColumnId.length) && ("string" === typeof input.nextGoalShortId && 1 <= input.nextGoalShortId.length) && ("number" === typeof input.nextGoalSearchId && parseInt(input.nextGoalSearchId) === input.nextGoalSearchId && 1 <= input.nextGoalSearchId) && ("number" === typeof input.nextNormSearchId && parseInt(input.nextNormSearchId) === input.nextNormSearchId && 1 <= input.nextNormSearchId) && (9 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "nextTaskShortId", "nextTaskSearchId", "nextLabelId", "nextColumnId", "nextGoalShortId", "nextGoalSearchId", "nextNormSearchId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceCounter => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "string (@minLength 1)",
                    value: input.workspaceId
                })) || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "string",
                    value: input.workspaceId
                }), "string" === typeof input.nextTaskShortId && (1 <= input.nextTaskShortId.length || $report(_exceptionable, {
                    path: _path + ".nextTaskShortId",
                    expected: "string (@minLength 1)",
                    value: input.nextTaskShortId
                })) || $report(_exceptionable, {
                    path: _path + ".nextTaskShortId",
                    expected: "string",
                    value: input.nextTaskShortId
                }), "number" === typeof input.nextTaskSearchId && (parseInt(input.nextTaskSearchId) === input.nextTaskSearchId || $report(_exceptionable, {
                    path: _path + ".nextTaskSearchId",
                    expected: "number (@type int)",
                    value: input.nextTaskSearchId
                })) && (1 <= input.nextTaskSearchId || $report(_exceptionable, {
                    path: _path + ".nextTaskSearchId",
                    expected: "number (@minimum 1)",
                    value: input.nextTaskSearchId
                })) || $report(_exceptionable, {
                    path: _path + ".nextTaskSearchId",
                    expected: "number",
                    value: input.nextTaskSearchId
                }), "string" === typeof input.nextLabelId && (1 <= input.nextLabelId.length || $report(_exceptionable, {
                    path: _path + ".nextLabelId",
                    expected: "string (@minLength 1)",
                    value: input.nextLabelId
                })) || $report(_exceptionable, {
                    path: _path + ".nextLabelId",
                    expected: "string",
                    value: input.nextLabelId
                }), "string" === typeof input.nextColumnId && (1 <= input.nextColumnId.length || $report(_exceptionable, {
                    path: _path + ".nextColumnId",
                    expected: "string (@minLength 1)",
                    value: input.nextColumnId
                })) || $report(_exceptionable, {
                    path: _path + ".nextColumnId",
                    expected: "string",
                    value: input.nextColumnId
                }), "string" === typeof input.nextGoalShortId && (1 <= input.nextGoalShortId.length || $report(_exceptionable, {
                    path: _path + ".nextGoalShortId",
                    expected: "string (@minLength 1)",
                    value: input.nextGoalShortId
                })) || $report(_exceptionable, {
                    path: _path + ".nextGoalShortId",
                    expected: "string",
                    value: input.nextGoalShortId
                }), "number" === typeof input.nextGoalSearchId && (parseInt(input.nextGoalSearchId) === input.nextGoalSearchId || $report(_exceptionable, {
                    path: _path + ".nextGoalSearchId",
                    expected: "number (@type int)",
                    value: input.nextGoalSearchId
                })) && (1 <= input.nextGoalSearchId || $report(_exceptionable, {
                    path: _path + ".nextGoalSearchId",
                    expected: "number (@minimum 1)",
                    value: input.nextGoalSearchId
                })) || $report(_exceptionable, {
                    path: _path + ".nextGoalSearchId",
                    expected: "number",
                    value: input.nextGoalSearchId
                }), "number" === typeof input.nextNormSearchId && (parseInt(input.nextNormSearchId) === input.nextNormSearchId || $report(_exceptionable, {
                    path: _path + ".nextNormSearchId",
                    expected: "number (@type int)",
                    value: input.nextNormSearchId
                })) && (1 <= input.nextNormSearchId || $report(_exceptionable, {
                    path: _path + ".nextNormSearchId",
                    expected: "number (@minimum 1)",
                    value: input.nextNormSearchId
                })) || $report(_exceptionable, {
                    path: _path + ".nextNormSearchId",
                    expected: "number",
                    value: input.nextNormSearchId
                }), 9 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "workspaceId", "nextTaskShortId", "nextTaskSearchId", "nextLabelId", "nextColumnId", "nextGoalShortId", "nextGoalSearchId", "nextNormSearchId"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "default",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "default",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};
export default validateWorkspaceCounter;
