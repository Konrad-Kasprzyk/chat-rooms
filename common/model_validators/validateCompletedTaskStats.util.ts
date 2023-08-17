import CompletedTaskStats from "common/models/completedTaskStats.model";
import typia from "typia";
const validateCompletedTaskStats = (input: any): typia.IValidation<CompletedTaskStats> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is CompletedTaskStats => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("object" === typeof input.earliestTaskCompleteDate && null !== input.earliestTaskCompleteDate && $io1(input.earliestTaskCompleteDate, true && _exceptionable)) && ("object" === typeof input.latestTaskCompleteDate && null !== input.latestTaskCompleteDate && $io1(input.latestTaskCompleteDate, true && _exceptionable)) && (Array.isArray(input.taskStats) && input.taskStats.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("string" === typeof input.lastModifiedTaskId && 1 <= input.lastModifiedTaskId.length) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "earliestTaskCompleteDate", "latestTaskCompleteDate", "taskStats", "lastModifiedTaskId"].some((prop: any) => key === prop))
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
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.i && 1 <= input.i.length && ("object" === typeof input.f && null !== input.f && $io1(input.f, true && _exceptionable)) && (Array.isArray(input.l) && input.l.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (null === input.g || "string" === typeof input.g && 1 <= input.g.length) && (null === input.c || "string" === typeof input.c && 1 <= input.c.length) && (null === input.a || "string" === typeof input.a && 1 <= input.a.length) && ("number" === typeof input.s && parseInt(input.s) === input.s && 0 <= input.s) && (null === input.p || "l" === input.p || "n" === input.p || "h" === input.p || "u" === input.p) && (8 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["i", "f", "l", "g", "c", "a", "s", "p"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is CompletedTaskStats => {
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
                }), ("object" === typeof input.earliestTaskCompleteDate && null !== input.earliestTaskCompleteDate || $report(_exceptionable, {
                    path: _path + ".earliestTaskCompleteDate",
                    expected: "Timestamp",
                    value: input.earliestTaskCompleteDate
                })) && $vo1(input.earliestTaskCompleteDate, _path + ".earliestTaskCompleteDate", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".earliestTaskCompleteDate",
                    expected: "Timestamp",
                    value: input.earliestTaskCompleteDate
                }), ("object" === typeof input.latestTaskCompleteDate && null !== input.latestTaskCompleteDate || $report(_exceptionable, {
                    path: _path + ".latestTaskCompleteDate",
                    expected: "Timestamp",
                    value: input.latestTaskCompleteDate
                })) && $vo1(input.latestTaskCompleteDate, _path + ".latestTaskCompleteDate", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".latestTaskCompleteDate",
                    expected: "Timestamp",
                    value: input.latestTaskCompleteDate
                }), (Array.isArray(input.taskStats) || $report(_exceptionable, {
                    path: _path + ".taskStats",
                    expected: "Array<__type>",
                    value: input.taskStats
                })) && input.taskStats.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".taskStats[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo2(elem, _path + ".taskStats[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".taskStats[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".taskStats",
                    expected: "Array<__type>",
                    value: input.taskStats
                }), "string" === typeof input.lastModifiedTaskId && (1 <= input.lastModifiedTaskId.length || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "string (@minLength 1)",
                    value: input.lastModifiedTaskId
                })) || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "string",
                    value: input.lastModifiedTaskId
                }), 6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "workspaceId", "earliestTaskCompleteDate", "latestTaskCompleteDate", "taskStats", "lastModifiedTaskId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
                    path: _path + ".seconds",
                    expected: "number",
                    value: input.seconds
                }), "number" === typeof input.nanoseconds || $report(_exceptionable, {
                    path: _path + ".nanoseconds",
                    expected: "number",
                    value: input.nanoseconds
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.i && (1 <= input.i.length || $report(_exceptionable, {
                    path: _path + ".i",
                    expected: "string (@minLength 1)",
                    value: input.i
                })) || $report(_exceptionable, {
                    path: _path + ".i",
                    expected: "string",
                    value: input.i
                }), ("object" === typeof input.f && null !== input.f || $report(_exceptionable, {
                    path: _path + ".f",
                    expected: "Timestamp",
                    value: input.f
                })) && $vo1(input.f, _path + ".f", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".f",
                    expected: "Timestamp",
                    value: input.f
                }), (Array.isArray(input.l) || $report(_exceptionable, {
                    path: _path + ".l",
                    expected: "Array<string>",
                    value: input.l
                })) && input.l.map((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".l[" + _index2 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".l[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".l",
                    expected: "Array<string>",
                    value: input.l
                }), null === input.g || "string" === typeof input.g && (1 <= input.g.length || $report(_exceptionable, {
                    path: _path + ".g",
                    expected: "string (@minLength 1)",
                    value: input.g
                })) || $report(_exceptionable, {
                    path: _path + ".g",
                    expected: "(null | string)",
                    value: input.g
                }), null === input.c || "string" === typeof input.c && (1 <= input.c.length || $report(_exceptionable, {
                    path: _path + ".c",
                    expected: "string (@minLength 1)",
                    value: input.c
                })) || $report(_exceptionable, {
                    path: _path + ".c",
                    expected: "(null | string)",
                    value: input.c
                }), null === input.a || "string" === typeof input.a && (1 <= input.a.length || $report(_exceptionable, {
                    path: _path + ".a",
                    expected: "string (@minLength 1)",
                    value: input.a
                })) || $report(_exceptionable, {
                    path: _path + ".a",
                    expected: "(null | string)",
                    value: input.a
                }), "number" === typeof input.s && (parseInt(input.s) === input.s || $report(_exceptionable, {
                    path: _path + ".s",
                    expected: "number (@type int)",
                    value: input.s
                })) && (0 <= input.s || $report(_exceptionable, {
                    path: _path + ".s",
                    expected: "number (@minimum 0)",
                    value: input.s
                })) || $report(_exceptionable, {
                    path: _path + ".s",
                    expected: "number",
                    value: input.s
                }), null === input.p || "l" === input.p || "n" === input.p || "h" === input.p || "u" === input.p || $report(_exceptionable, {
                    path: _path + ".p",
                    expected: "(\"h\" | \"l\" | \"n\" | \"u\" | null)",
                    value: input.p
                }), 8 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["i", "f", "l", "g", "c", "a", "s", "p"].some((prop: any) => key === prop))
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
export default validateCompletedTaskStats;
