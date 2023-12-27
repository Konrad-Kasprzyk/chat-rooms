import GoalHistory from "common/models/history_models/goalHistory.model";
import typia from "typia";
const validateGoalHistory = (input: any): GoalHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is GoalHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && (null === input.previousHistoryId || "string" === typeof input.previousHistoryId && 1 <= input.previousHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && (null === input.lastModifiedGoalId || "string" === typeof input.lastModifiedGoalId && 1 <= input.lastModifiedGoalId.length) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "previousHistoryId", "history", "lastModifiedGoalId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action || "authorId" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.newValue || "string" === typeof input.newValue) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "storyPoints" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "number" === typeof input.oldValue) && (null === input.newValue || "number" === typeof input.newValue) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "objectives" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io5(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io5(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && "boolean" === typeof input.done && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "done"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "notes" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io7(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io7(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && "string" === typeof input.note && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "modificationTime" === input.action || "deadline" === input.action || "placingInBinTime" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io2(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io2(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("creationTime" === input.action || "modificationTime" === input.action || "deadline" === input.action || "placingInBinTime" === input.action)
                return $io8(input, true && _exceptionable);
            else if ("notes" === input.action)
                return $io6(input, true && _exceptionable);
            else if ("objectives" === input.action)
                return $io4(input, true && _exceptionable);
            else if ("storyPoints" === input.action)
                return $io3(input, true && _exceptionable);
            else if ("title" === input.action || "description" === input.action || "authorId" === input.action)
                return $io1(input, true && _exceptionable);
            else
                return false;
        })();
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is GoalHistory => {
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
            })) && (null === input.previousHistoryId || "string" === typeof input.previousHistoryId && (1 <= input.previousHistoryId.length || $guard(_exceptionable, {
                path: _path + ".previousHistoryId",
                expected: "string & MinLength<1>",
                value: input.previousHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".previousHistoryId",
                expected: "((string & MinLength<1>) | null)",
                value: input.previousHistoryId
            })) && ((Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<HistoryAction<\"title\" | \"description\" | \"authorId\", string> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"objectives\", { objective: string; done: boolean; }> | HistoryAction<...> | HistoryAction<...>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"deadline\" | \"placingInBinTime\", Timestamp> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\", string>)",
                value: elem
            })) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"deadline\" | \"placingInBinTime\", Timestamp> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\", string>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<HistoryAction<\"title\" | \"description\" | \"authorId\", string> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"objectives\", { objective: string; done: boolean; }> | HistoryAction<...> | HistoryAction<...>>",
                value: input.history
            })) && (null === input.lastModifiedGoalId || "string" === typeof input.lastModifiedGoalId && (1 <= input.lastModifiedGoalId.length || $guard(_exceptionable, {
                path: _path + ".lastModifiedGoalId",
                expected: "string & MinLength<1>",
                value: input.lastModifiedGoalId
            })) || $guard(_exceptionable, {
                path: _path + ".lastModifiedGoalId",
                expected: "((string & MinLength<1>) | null)",
                value: input.lastModifiedGoalId
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "previousHistoryId", "history", "lastModifiedGoalId"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action || "authorId" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"authorId\" | \"description\" | \"title\")",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string & MinLength<1>",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "(string & MinLength<1>)",
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("storyPoints" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"storyPoints\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string & MinLength<1>",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "(string & MinLength<1>)",
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("objectives" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"objectives\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string & MinLength<1>",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "(string & MinLength<1>)",
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
            })) && $ao5(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null)",
                value: input.oldValue
            })) && (null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type | null)",
                value: input.newValue
            })) && $ao5(input.newValue, _path + ".newValue", true && _exceptionable) || $guard(_exceptionable, {
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective || $guard(_exceptionable, {
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
            const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("notes" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"notes\"",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string & MinLength<1>",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "(string & MinLength<1>)",
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
            })) && $ao7(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o1 | null)",
                value: input.oldValue
            })) && (null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $guard(_exceptionable, {
                path: _path + ".newValue",
                expected: "(__type.o1 | null)",
                value: input.newValue
            })) && $ao7(input.newValue, _path + ".newValue", true && _exceptionable) || $guard(_exceptionable, {
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.userId || $guard(_exceptionable, {
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "modificationTime" === input.action || "deadline" === input.action || "placingInBinTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"creationTime\" | \"deadline\" | \"modificationTime\" | \"placingInBinTime\")",
                value: input.action
            })) && ("string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "string & MinLength<1>",
                value: input.actionMakerId
            })) || $guard(_exceptionable, {
                path: _path + ".actionMakerId",
                expected: "(string & MinLength<1>)",
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
                if ("creationTime" === input.action || "modificationTime" === input.action || "deadline" === input.action || "placingInBinTime" === input.action)
                    return $ao8(input, _path, true && _exceptionable);
                else if ("notes" === input.action)
                    return $ao6(input, _path, true && _exceptionable);
                else if ("objectives" === input.action)
                    return $ao4(input, _path, true && _exceptionable);
                else if ("storyPoints" === input.action)
                    return $ao3(input, _path, true && _exceptionable);
                else if ("title" === input.action || "description" === input.action || "authorId" === input.action)
                    return $ao1(input, _path, true && _exceptionable);
                else
                    return $guard(_exceptionable, {
                        path: _path,
                        expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"deadline\" | \"placingInBinTime\", Timestamp> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\", string>)",
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
export default validateGoalHistory;
