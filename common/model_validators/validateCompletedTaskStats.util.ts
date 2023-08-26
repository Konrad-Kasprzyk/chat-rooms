import CompletedTaskStats from "common/models/completedTaskStats.model";
import typia from "typia";
const validateCompletedTaskStats = (input: any): CompletedTaskStats => {
    const __is = (input: any, _exceptionable: boolean = true): input is CompletedTaskStats => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("object" === typeof input.earliestTaskCompleteTime && null !== input.earliestTaskCompleteTime && $io1(input.earliestTaskCompleteTime, true && _exceptionable)) && ("object" === typeof input.latestTaskCompleteTime && null !== input.latestTaskCompleteTime && $io1(input.latestTaskCompleteTime, true && _exceptionable)) && (Array.isArray(input.stats) && input.stats.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io1(input.modificationTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "earliestTaskCompleteTime", "latestTaskCompleteTime", "stats", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.taskId && 1 <= input.taskId.length && ("string" === typeof input.authorId && 1 <= input.authorId.length) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && 1 <= input.assignedUserId.length) && (null === input.goalId || "string" === typeof input.goalId && 1 <= input.goalId.length) && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && (Array.isArray(input.labelIds) && input.labelIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority) && ("object" === typeof input.completionTime && null !== input.completionTime && $io1(input.completionTime, true && _exceptionable)) && (8 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["taskId", "authorId", "assignedUserId", "goalId", "storyPoints", "labelIds", "priority", "completionTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is CompletedTaskStats => {
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
            })) && ("string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string (@minLength 1)",
                value: input.workspaceId
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string",
                value: input.workspaceId
            })) && (("object" === typeof input.earliestTaskCompleteTime && null !== input.earliestTaskCompleteTime || $guard(_exceptionable, {
                path: _path + ".earliestTaskCompleteTime",
                expected: "Timestamp",
                value: input.earliestTaskCompleteTime
            })) && $ao1(input.earliestTaskCompleteTime, _path + ".earliestTaskCompleteTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".earliestTaskCompleteTime",
                expected: "Timestamp",
                value: input.earliestTaskCompleteTime
            })) && (("object" === typeof input.latestTaskCompleteTime && null !== input.latestTaskCompleteTime || $guard(_exceptionable, {
                path: _path + ".latestTaskCompleteTime",
                expected: "Timestamp",
                value: input.latestTaskCompleteTime
            })) && $ao1(input.latestTaskCompleteTime, _path + ".latestTaskCompleteTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".latestTaskCompleteTime",
                expected: "Timestamp",
                value: input.latestTaskCompleteTime
            })) && ((Array.isArray(input.stats) || $guard(_exceptionable, {
                path: _path + ".stats",
                expected: "Array<__type>",
                value: input.stats
            })) && input.stats.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".stats[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) && $ao2(elem, _path + ".stats[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".stats[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".stats",
                expected: "Array<__type>",
                value: input.stats
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && $ao1(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "earliestTaskCompleteTime", "latestTaskCompleteTime", "stats", "modificationTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
                path: _path + ".seconds",
                expected: "number",
                value: input.seconds
            })) && ("number" === typeof input.nanoseconds || $guard(_exceptionable, {
                path: _path + ".nanoseconds",
                expected: "number",
                value: input.nanoseconds
            })) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.taskId && (1 <= input.taskId.length || $guard(_exceptionable, {
                path: _path + ".taskId",
                expected: "string (@minLength 1)",
                value: input.taskId
            })) || $guard(_exceptionable, {
                path: _path + ".taskId",
                expected: "string",
                value: input.taskId
            })) && ("string" === typeof input.authorId && (1 <= input.authorId.length || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string (@minLength 1)",
                value: input.authorId
            })) || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string",
                value: input.authorId
            })) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && (1 <= input.assignedUserId.length || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "string (@minLength 1)",
                value: input.assignedUserId
            })) || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "(null | string)",
                value: input.assignedUserId
            })) && (null === input.goalId || "string" === typeof input.goalId && (1 <= input.goalId.length || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "string (@minLength 1)",
                value: input.goalId
            })) || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "(null | string)",
                value: input.goalId
            })) && ("number" === typeof input.storyPoints && (parseInt(input.storyPoints) === input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number (@type int)",
                value: input.storyPoints
            })) && (0 <= input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number (@minimum 0)",
                value: input.storyPoints
            })) || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number",
                value: input.storyPoints
            })) && ((Array.isArray(input.labelIds) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "Array<string>",
                value: input.labelIds
            })) && input.labelIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".labelIds[" + _index2 + "]",
                expected: "string (@minLength 1)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labelIds[" + _index2 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "Array<string>",
                value: input.labelIds
            })) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority || $guard(_exceptionable, {
                path: _path + ".priority",
                expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
                value: input.priority
            })) && (("object" === typeof input.completionTime && null !== input.completionTime || $guard(_exceptionable, {
                path: _path + ".completionTime",
                expected: "Timestamp",
                value: input.completionTime
            })) && $ao1(input.completionTime, _path + ".completionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".completionTime",
                expected: "Timestamp",
                value: input.completionTime
            })) && (8 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["taskId", "authorId", "assignedUserId", "goalId", "storyPoints", "labelIds", "priority", "completionTime"].some((prop: any) => key === prop))
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
export default validateCompletedTaskStats;
