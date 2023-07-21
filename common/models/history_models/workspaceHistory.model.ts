import Column from "common/models/workspace_models/column.type";
import Label from "common/models/workspace_models/label.type";
import HistoryAction from "common/types/historyAction.type";
import { Timestamp } from "firebase/firestore";
import typia from "typia";
export default interface WorkspaceHistory {
    /**
     * @minLength 1
     */
    id: string;
    /**
     * @minLength 1
     */
    previousHistoryId: string | null;
    history: (HistoryAction<"title" | "description", string> | HistoryAction<"userIds" | "invitedUserIds", string[]> | HistoryAction<"columns", Column> | HistoryAction<"labels", Label> | HistoryAction<"placingInBinTime", Timestamp>)[];
    /**
     * @minLength 1
     */
    workspaceId: string | null;
}
export const validateWorkspaceHistory = (input: any): typia.IValidation<WorkspaceHistory> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && (null === input.previousHistoryId || "string" === typeof input.previousHistoryId && 1 <= input.previousHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && (null === input.workspaceId || "string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "previousHistoryId", "history", "workspaceId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.newValue || "string" === typeof input.newValue) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => ("userIds" === input.action || "invitedUserIds" === input.action) && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || Array.isArray(input.oldValue) && input.oldValue.every((elem: any, _index2: number) => "string" === typeof elem)) && (null === input.newValue || Array.isArray(input.newValue) && input.newValue.every((elem: any, _index3: number) => "string" === typeof elem)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "columns" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io5(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io5(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && "boolean" === typeof input.taskFinishColumn && (null === input.replacedByColumnId || "string" === typeof input.replacedByColumnId && 1 <= input.replacedByColumnId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io2(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "taskFinishColumn", "replacedByColumnId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "labels" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io7(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io7(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (null === input.replacedByLabelId || "string" === typeof input.replacedByLabelId && 1 <= input.replacedByLabelId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io2(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color", "replacedByLabelId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => "placingInBinTime" === input.action && ("string" === typeof input.actionMakerId && 1 <= input.actionMakerId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io2(input.oldValue, true && _exceptionable)) && (null === input.newValue || "object" === typeof input.newValue && null !== input.newValue && $io2(input.newValue, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "actionMakerId", "date", "oldValue", "newValue"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("placingInBinTime" === input.action)
                return $io8(input, true && _exceptionable);
            if ("labels" === input.action)
                return $io6(input, true && _exceptionable);
            if ("columns" === input.action)
                return $io4(input, true && _exceptionable);
            if ("userIds" === input.action || "invitedUserIds" === input.action)
                return $io3(input, true && _exceptionable);
            if ("title" === input.action || "description" === input.action)
                return $io1(input, true && _exceptionable);
            return false;
        })();
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceHistory => {
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
                    expected: "Array<HistoryAction<\"title\" | \"description\", string> | HistoryAction<\"userIds\" | \"invitedUserIds\", string[]> | HistoryAction<\"columns\", Column> | HistoryAction<...> | HistoryAction<...>>",
                    value: input.history
                })) && input.history.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".history[" + _index1 + "]",
                    expected: "(HistoryAction<\"columns\", default> | HistoryAction<\"labels\", default> | HistoryAction<\"placingInBinTime\", Timestamp> | HistoryAction<\"title\" | \"description\", string> | HistoryAction<\"userIds\" | \"invitedUserIds\", Array<string>>)",
                    value: elem
                })) && $vu0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".history[" + _index1 + "]",
                    expected: "(HistoryAction<\"columns\", default> | HistoryAction<\"labels\", default> | HistoryAction<\"placingInBinTime\", Timestamp> | HistoryAction<\"title\" | \"description\", string> | HistoryAction<\"userIds\" | \"invitedUserIds\", Array<string>>)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".history",
                    expected: "Array<HistoryAction<\"title\" | \"description\", string> | HistoryAction<\"userIds\" | \"invitedUserIds\", string[]> | HistoryAction<\"columns\", Column> | HistoryAction<...> | HistoryAction<...>>",
                    value: input.history
                }), null === input.workspaceId || "string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "string (@minLength 1)",
                    value: input.workspaceId
                })) || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "(null | string)",
                    value: input.workspaceId
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "previousHistoryId", "history", "workspaceId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["title" === input.action || "description" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "(\"description\" | \"title\")",
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
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["userIds" === input.action || "invitedUserIds" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "(\"invitedUserIds\" | \"userIds\")",
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
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["columns" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"columns\"",
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
                    expected: "(default.o1 | null)",
                    value: input.oldValue
                })) && $vo5(input.oldValue, _path + ".oldValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(default.o1 | null)",
                    value: input.oldValue
                }), null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(default.o1 | null)",
                    value: input.newValue
                })) && $vo5(input.newValue, _path + ".newValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(default.o1 | null)",
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
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "boolean" === typeof input.taskFinishColumn || $report(_exceptionable, {
                    path: _path + ".taskFinishColumn",
                    expected: "boolean",
                    value: input.taskFinishColumn
                }), null === input.replacedByColumnId || "string" === typeof input.replacedByColumnId && (1 <= input.replacedByColumnId.length || $report(_exceptionable, {
                    path: _path + ".replacedByColumnId",
                    expected: "string (@minLength 1)",
                    value: input.replacedByColumnId
                })) || $report(_exceptionable, {
                    path: _path + ".replacedByColumnId",
                    expected: "(null | string)",
                    value: input.replacedByColumnId
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo2(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                }), null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && (1 <= input.insertedIntoBinByUserId.length || $report(_exceptionable, {
                    path: _path + ".insertedIntoBinByUserId",
                    expected: "string (@minLength 1)",
                    value: input.insertedIntoBinByUserId
                })) || $report(_exceptionable, {
                    path: _path + ".insertedIntoBinByUserId",
                    expected: "(null | string)",
                    value: input.insertedIntoBinByUserId
                }), 7 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "name", "taskFinishColumn", "replacedByColumnId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["labels" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"labels\"",
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
                    expected: "(default.o2 | null)",
                    value: input.oldValue
                })) && $vo7(input.oldValue, _path + ".oldValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".oldValue",
                    expected: "(default.o2 | null)",
                    value: input.oldValue
                }), null === input.newValue || ("object" === typeof input.newValue && null !== input.newValue || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(default.o2 | null)",
                    value: input.newValue
                })) && $vo7(input.newValue, _path + ".newValue", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".newValue",
                    expected: "(default.o2 | null)",
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
            const $vo7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color || $report(_exceptionable, {
                    path: _path + ".color",
                    expected: "(\"Blue\" | \"BlueViolet\" | \"Brown\" | \"Chocolate\" | \"Coral\" | \"Crimson\" | \"Cyan\" | \"DarkCyan\" | \"DarkGrey\" | \"DarkRed\" | \"DarkSlateGrey\" | \"DeepPink\" | \"DodgerBlue\" | \"Goldenrod\" | \"Green\" | \"GreenYellow\" | \"Grey\" | \"HotPink\" | \"Indigo\" | \"LightCoral\" | \"LightSalmon\" | \"LimeGreen\" | \"Maroon\" | \"OrangeRed\" | \"Purple\" | \"RosyBrown\" | \"SeaGreen\" | \"Snow\" | \"Yellow\")",
                    value: input.color
                }), null === input.replacedByLabelId || "string" === typeof input.replacedByLabelId && (1 <= input.replacedByLabelId.length || $report(_exceptionable, {
                    path: _path + ".replacedByLabelId",
                    expected: "string (@minLength 1)",
                    value: input.replacedByLabelId
                })) || $report(_exceptionable, {
                    path: _path + ".replacedByLabelId",
                    expected: "(null | string)",
                    value: input.replacedByLabelId
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo2(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                }), null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && (1 <= input.insertedIntoBinByUserId.length || $report(_exceptionable, {
                    path: _path + ".insertedIntoBinByUserId",
                    expected: "string (@minLength 1)",
                    value: input.insertedIntoBinByUserId
                })) || $report(_exceptionable, {
                    path: _path + ".insertedIntoBinByUserId",
                    expected: "(null | string)",
                    value: input.insertedIntoBinByUserId
                }), 7 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "name", "color", "replacedByLabelId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["placingInBinTime" === input.action || $report(_exceptionable, {
                    path: _path + ".action",
                    expected: "\"placingInBinTime\"",
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
                if ("placingInBinTime" === input.action)
                    return $vo8(input, _path, true && _exceptionable);
                if ("labels" === input.action)
                    return $vo6(input, _path, true && _exceptionable);
                if ("columns" === input.action)
                    return $vo4(input, _path, true && _exceptionable);
                if ("userIds" === input.action || "invitedUserIds" === input.action)
                    return $vo3(input, _path, true && _exceptionable);
                if ("title" === input.action || "description" === input.action)
                    return $vo1(input, _path, true && _exceptionable);
                return $report(_exceptionable, {
                    path: _path,
                    expected: "(HistoryAction<\"placingInBinTime\", Timestamp> | HistoryAction<\"labels\", default> | HistoryAction<\"columns\", default> | HistoryAction<\"userIds\" | \"invitedUserIds\", Array<string>> | HistoryAction<\"title\" | \"description\", string>)",
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
