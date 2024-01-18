import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";
import typia from "typia";
const validateWorkspaceCounter = (input: any): WorkspaceCounter => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceCounter => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("number" === typeof input.nextTaskId && (Math.floor(input.nextTaskId) === input.nextTaskId && -2147483648 <= input.nextTaskId && input.nextTaskId <= 2147483647 && 1 <= input.nextTaskId)) && ("number" === typeof input.nextGoalId && (Math.floor(input.nextGoalId) === input.nextGoalId && -2147483648 <= input.nextGoalId && input.nextGoalId <= 2147483647 && 1 <= input.nextGoalId)) && ("number" === typeof input.nextLabelId && (Math.floor(input.nextLabelId) === input.nextLabelId && -2147483648 <= input.nextLabelId && input.nextLabelId <= 2147483647 && 1 <= input.nextLabelId)) && ("number" === typeof input.nextColumnId && (Math.floor(input.nextColumnId) === input.nextColumnId && -2147483648 <= input.nextColumnId && input.nextColumnId <= 2147483647 && 1 <= input.nextColumnId)) && ("number" === typeof input.nextNormId && (Math.floor(input.nextNormId) === input.nextNormId && -2147483648 <= input.nextNormId && input.nextNormId <= 2147483647 && 1 <= input.nextNormId)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("number" === typeof input.nextTaskId && (Math.floor(input.nextTaskId) === input.nextTaskId && -2147483648 <= input.nextTaskId && input.nextTaskId <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "number & Type<\"int32\">",
                value: input.nextTaskId
            })) && (1 <= input.nextTaskId || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "number & Minimum<1>",
                value: input.nextTaskId
            })) || $guard(_exceptionable, {
                path: _path + ".nextTaskId",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextTaskId
            })) && ("number" === typeof input.nextGoalId && (Math.floor(input.nextGoalId) === input.nextGoalId && -2147483648 <= input.nextGoalId && input.nextGoalId <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "number & Type<\"int32\">",
                value: input.nextGoalId
            })) && (1 <= input.nextGoalId || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "number & Minimum<1>",
                value: input.nextGoalId
            })) || $guard(_exceptionable, {
                path: _path + ".nextGoalId",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextGoalId
            })) && ("number" === typeof input.nextLabelId && (Math.floor(input.nextLabelId) === input.nextLabelId && -2147483648 <= input.nextLabelId && input.nextLabelId <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "number & Type<\"int32\">",
                value: input.nextLabelId
            })) && (1 <= input.nextLabelId || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "number & Minimum<1>",
                value: input.nextLabelId
            })) || $guard(_exceptionable, {
                path: _path + ".nextLabelId",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextLabelId
            })) && ("number" === typeof input.nextColumnId && (Math.floor(input.nextColumnId) === input.nextColumnId && -2147483648 <= input.nextColumnId && input.nextColumnId <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "number & Type<\"int32\">",
                value: input.nextColumnId
            })) && (1 <= input.nextColumnId || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "number & Minimum<1>",
                value: input.nextColumnId
            })) || $guard(_exceptionable, {
                path: _path + ".nextColumnId",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextColumnId
            })) && ("number" === typeof input.nextNormId && (Math.floor(input.nextNormId) === input.nextNormId && -2147483648 <= input.nextNormId && input.nextNormId <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "number & Type<\"int32\">",
                value: input.nextNormId
            })) && (1 <= input.nextNormId || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "number & Minimum<1>",
                value: input.nextNormId
            })) || $guard(_exceptionable, {
                path: _path + ".nextNormId",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
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
