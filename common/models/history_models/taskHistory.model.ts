import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";
export default interface TaskHistory {
    /**
     * @minLength 1
     */
    id: string;
    /**
     * @minLength 1
     */
    previousHistoryId: string | null;
    history: (HistoryAction<"title" | "description" | "columnId" | "authorId" | "assignedUserId" | "priority" | "goalId", string> | HistoryAction<"storyPoints", number> | HistoryAction<"labelIds", string[]> | HistoryAction<"objectives", {
        objective: string;
        done: boolean;
    }> | HistoryAction<"notes", {
        userId: string;
        note: string;
        date: Timestamp;
    }> | HistoryAction<"creationTime" | "modificationTime" | "columnChangeTime" | "completionTime" | "placingInBinTime", Timestamp>)[];
    /**
     * @minLength 1
     */
    lastModifiedTaskId: string | null;
}
export const validateTaskHistory = (input: any): typia.IValidation<TaskHistory> => {
    const errors = [] as any[];
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
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is TaskHistory => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), null === input.previousHistoryId || "string" === typeof input.previousHistoryId && (1 <= input.previousHistoryId.length || $report(_exceptionable, {
                    path: _path + ".previousHistoryId",
                    expected: "string (@minLength 1)",
                    value: input.previousHistoryId
                })) || $report(_exceptionable, {
                    path: _path + ".previousHistoryId",
                    expected: "(null | string)",
                    value: input.previousHistoryId
                }), (Array.isArray(input.history) || $report(_exceptionable, {
                    path: _path + ".history",
                    expected: "Array<HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...>>",
                    value: input.history
                })) && input.history.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".history[" + _index1 + "]",
                    expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string>)",
                    value: elem
                })) && $vu0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".history[" + _index1 + "]",
                    expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string>)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".history",
                    expected: "Array<HistoryAction<\"storyPoints\", number> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...> | HistoryAction<...>>",
                    value: input.history
                }), null === input.lastModifiedTaskId || "string" === typeof input.lastModifiedTaskId && (1 <= input.lastModifiedTaskId.length || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "string (@minLength 1)",
                    value: input.lastModifiedTaskId
                })) || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "(null | string)",
                    value: input.lastModifiedTaskId
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "previousHistoryId", "history", "lastModifiedTaskId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["storyPoints" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"storyPoints\"",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || "number" === typeof input.oldValue || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(null | number)",
                    value: input.oldValue
                }), null === input.newValue || "number" === typeof input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(null | number)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
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
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "(\"assignedUserId\" | \"authorId\" | \"columnId\" | \"description\" | \"goalId\" | \"priority\" | \"title\")",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || "string" === typeof input.oldValue || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(null | string)",
                    value: input.oldValue
                }), null === input.newValue || "string" === typeof input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(null | string)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["labelIds" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"labelIds\"",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || (Array.isArray(input.oldValue) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(Array<string> | null)",
                    value: input.oldValue
                })) && input.oldValue.map((elem: any, _index2: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".oldValue[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(Array<string> | null)",
                    value: input.oldValue
                }), null === input.newValue || (Array.isArray(input.newValue) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(Array<string> | null)",
                    value: input.newValue
                })) && input.newValue.map((elem: any, _index3: number) => "string" === typeof elem || $report(_exceptionable, {
                    path: _path + ".newValue[" + _index3 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(Array<string> | null)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["objectives" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"objectives\"",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(__type | null)",
                    value: input.oldValue
                })) && $vo6(input.oldValue, _path + ".oldValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(__type | null)",
                    value: input.oldValue
                }), null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(__type | null)",
                    value: input.newValue
                })) && $vo6(input.newValue, _path + ".newValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(__type | null)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vo6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.objective || $report(_exceptionable, {
                    path: _path + ".objective",
                    expected: "string",
                    value: input.objective
                }), "boolean" === typeof input.done || $report(_exceptionable, {
                    path: _path + ".done",
                    expected: "boolean",
                    value: input.done
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["objective", "done"].some((prop: any) => key === prop))
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
            const $vo7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["notes" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"notes\"",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(__type.o1 | null)",
                    value: input.oldValue
                })) && $vo8(input.oldValue, _path + ".oldValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(__type.o1 | null)",
                    value: input.oldValue
                }), null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(__type.o1 | null)",
                    value: input.newValue
                })) && $vo8(input.newValue, _path + ".newValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(__type.o1 | null)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vo8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.userId || $report(_exceptionable, {
                    path: _path + ".userId",
                    expected: "string",
                    value: input.userId
                }), "string" === typeof input.note || $report(_exceptionable, {
                    path: _path + ".note",
                    expected: "string",
                    value: input.note
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), 3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["userId", "note", "date"].some((prop: any) => key === prop))
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
            const $vo9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "(\"columnChangeTime\" | \"completionTime\" | \"creationTime\" | \"modificationTime\" | \"placingInBinTime\")",
                    value: input.action
                }), "string" === typeof input.actionMakerId && (1 <= input.actionMakerId.length || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string (@minLength 1)",
                    value: input.actionMakerId
                })) || $report(_exceptionable, {
                    path: _path + ".actionMakerId",
                    expected: "string",
                    value: input.actionMakerId
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo2(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(Timestamp | null)",
                    value: input.oldValue
                })) && $vo2(input.oldValue, _path + ".oldValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(Timestamp | null)",
                    value: input.oldValue
                }), null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(Timestamp | null)",
                    value: input.newValue
                })) && $vo2(input.newValue, _path + ".newValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(Timestamp | null)",
                    value: input.newValue
                }), 5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
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
            const $vu0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if ("creationTime" === input.action || "modificationTime" === input.action || "placingInBinTime" === input.action || "columnChangeTime" === input.action || "completionTime" === input.action)
                    return $vo9(input, _path, true && _exceptionable);
                if ("notes" === input.action)
                    return $vo7(input, _path, true && _exceptionable);
                if ("objectives" === input.action)
                    return $vo5(input, _path, true && _exceptionable);
                if ("labelIds" === input.action)
                    return $vo4(input, _path, true && _exceptionable);
                if ("title" === input.action || "description" === input.action || "authorId" === input.action || "columnId" === input.action || "assignedUserId" === input.action || "priority" === input.action || "goalId" === input.action)
                    return $vo3(input, _path, true && _exceptionable);
                if ("storyPoints" === input.action)
                    return $vo1(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(HistoryAction<\"creationTime\" | \"modificationTime\" | \"placingInBinTime\" | \"columnChangeTime\" | \"completionTime\", Timestamp> | HistoryAction<\"notes\", __type> | HistoryAction<\"objectives\", __type> | HistoryAction<\"labelIds\", Array<string>> | HistoryAction<\"title\" | \"description\" | \"authorId\" | \"columnId\" | \"assignedUserId\" | \"priority\" | \"goalId\", string> | HistoryAction<\"storyPoints\", number>)",
                    value: input
                });
            })();
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
