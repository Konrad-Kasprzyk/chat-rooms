import TaskHistory from "common/models/history_models/taskHistory.model";
import typia from "typia";
const validateTaskHistory = (input: any): TaskHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is TaskHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && (null === input.previousHistoryId || "string" === typeof input.previousHistoryId && 1 <= input.previousHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && (null === input.lastModifiedTaskId || "string" === typeof input.lastModifiedTaskId && 1 <= input.lastModifiedTaskId.length) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "previousHistoryId", "history", "lastModifiedTaskId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "storyPoints" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "number" === typeof input.oldValue) && (null === input.newValue || "number" === typeof input.newValue) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.newValue || "string" === typeof input.newValue) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "labelIds" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || Array.isArray(input.oldValue) && input.oldValue.every((elem: any, _index2: number) => "string" === typeof elem)) && (null === input.newValue || Array.isArray(input.newValue) && input.newValue.every((elem: any, _index3: number) => "string" === typeof elem)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "objectives" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io6(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io6(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && "boolean" === typeof input.done && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "done"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => "notes" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io8(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io8(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && "string" === typeof input.note && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io9 = (input: any, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io2(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io2(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action)
                return $io9(input, true && _exceptionable);
            if ("notes" === input.action)
                return $io7(input, true && _exceptionable);
            if ("objectives" === input.action)
                return $io5(input, true && _exceptionable);
            if ("labelIds" === input.action)
                return $io4(input, true && _exceptionable);
            if ("title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action)
                return $io3(input, true && _exceptionable);
            if ("storyPoints" === input.action)
                return $io1(input, true && _exceptionable);
            return false;
        })();
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is TaskHistory => {
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
            })) && (null === input.previousHistoryId || "string" === typeof input.previousHistoryId && (1 <= input.previousHistoryId.length || $guard(_exceptionable, {
                path: _path + ".previousHistoryId",
                expected: "string (@minLength 1)",
                value: input.previousHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".previousHistoryId",
                expected: "(null | string)",
                value: input.previousHistoryId
            })) && ((Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string>)",
                value: elem
            })) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...>>",
                value: input.history
            })) && (null === input.lastModifiedTaskId || "string" === typeof input.lastModifiedTaskId && (1 <= input.lastModifiedTaskId.length || $guard(_exceptionable, {
                path: _path + ".lastModifiedTaskId",
                expected: "string (@minLength 1)",
                value: input.lastModifiedTaskId
            })) || $guard(_exceptionable, {
                path: _path + ".lastModifiedTaskId",
                expected: "(null | string)",
                value: input.lastModifiedTaskId
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "previousHistoryId", "history", "lastModifiedTaskId"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("storyPoints" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"storyPoints\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || "number" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | number)",
                value: input.oldValue
            })) && (null === input.newValue || "number" === typeof input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(null | number)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"assignedUserId\" | \"authorId\" | \"columnId\" | \"description\" | \"goalId\" | \"priority\" | \"title\")",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || "string" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | string)",
                value: input.oldValue
            })) && (null === input.newValue || "string" === typeof input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(null | string)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("labelIds" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"labelIds\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || (Array.isArray(input.oldValue) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Array<string> | null)",
                value: input.oldValue
            })) && input.oldValue.every((elem: any, _index2: number) => "string" === typeof elem || $guard(_exceptionable, {
                path: _path + ".oldValue[" + _index2 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Array<string> | null)",
                value: input.oldValue
            })) && (null === input.newValue || (Array.isArray(input.newValue) || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(Array<string> | null)",
                value: input.newValue
            })) && input.newValue.every((elem: any, _index3: number) => "string" === typeof elem || $guard(_exceptionable, {
                path: _path + ".newValue[" + _index3 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(Array<string> | null)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("objectives" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"objectives\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null)",
                value: input.oldValue
            })) && $ao6(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null)",
                value: input.oldValue
            })) && (null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type | null)",
                value: input.newValue
            })) && $ao6(input.newValue, _path + ".newValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type | null)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "string",
                value: input.objective
            })) && ("boolean" === typeof input.done || $guard(_exceptionable, {
                path: _path + ".done",
                expected: "boolean",
                value: input.done
            })) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["objective", "done"].some((prop: any) => key === prop))
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("notes" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"notes\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o1 | null)",
                value: input.oldValue
            })) && $ao8(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o1 | null)",
                value: input.oldValue
            })) && (null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type.o1 | null)",
                value: input.newValue
            })) && $ao8(input.newValue, _path + ".newValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type.o1 | null)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.userId || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string",
                value: input.userId
            })) && ("string" === typeof input.note || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "string",
                value: input.note
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["userId", "note", "date"].some((prop: any) => key === prop))
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
            const $ao9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"columnChangeTime\" | \"completionTime\" | \"creationTime\" | \"modificationTime\" | \"placingInBinTime\")",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string (@minLength 1)",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string",
                value: input.actionMakerId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Timestamp | null)",
                value: input.oldValue
            })) && $ao2(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Timestamp | null)",
                value: input.oldValue
            })) && (null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(Timestamp | null)",
                value: input.newValue
            })) && $ao2(input.newValue, _path + ".newValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(Timestamp | null)",
                value: input.newValue
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $au0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if ("creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action)
                    return $ao9(input, _path, true && _exceptionable);
                if ("notes" === input.action)
                    return $ao7(input, _path, true && _exceptionable);
                if ("objectives" === input.action)
                    return $ao5(input, _path, true && _exceptionable);
                if ("labelIds" === input.action)
                    return $ao4(input, _path, true && _exceptionable);
                if ("title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action)
                    return $ao3(input, _path, true && _exceptionable);
                if ("storyPoints" === input.action)
                    return $ao1(input, _path, true && _exceptionable);
                return $guard(_exceptionable, {
                    path: _path,
                    expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<\"storyPoints\", number>)",
                    value: input
                });
            })();
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
export default validateTaskHistory;
