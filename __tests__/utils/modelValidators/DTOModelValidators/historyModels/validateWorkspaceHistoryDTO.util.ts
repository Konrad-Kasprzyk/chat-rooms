import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import typia from "typia";
const validateWorkspaceHistoryDTO = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): WorkspaceHistoryDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceHistoryDTO => {
        const $join = (typia.createAssertEquals as any).join;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && ("object" === typeof input.history && null !== input.history && false === Array.isArray(input.history) && $io1(input.history, true && _exceptionable)) && "number" === typeof input.historyRecordsCount && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io3(input.modificationTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "history", "historyRecordsCount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            return "object" === typeof value && null !== value && $iu0(value, true && _exceptionable);
        });
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && ("title" === input.action || "description" === input.action) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io3(input.date, true && _exceptionable)) && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.value || "string" === typeof input.value) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && ("creationTime" === input.action || "placingInBinTime" === input.action) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io3(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io3(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io3(input.value, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("creationTime" === input.action || "placingInBinTime" === input.action)
                return $io4(input, true && _exceptionable);
            else if ("title" === input.action || "description" === input.action)
                return $io2(input, true && _exceptionable);
            else
                return false;
        })();
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceHistoryDTO => {
            const $guard = (typia.createAssertEquals as any).guard;
            const $join = (typia.createAssertEquals as any).join;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string & MinLength<1>",
                value: input.workspaceId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "(string & MinLength<1>)",
                value: input.workspaceId
            }, errorFactory)) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && (1 <= input.olderHistoryId.length || $guard(_exceptionable, {
                path: _path + ".olderHistoryId",
                expected: "string & MinLength<1>",
                value: input.olderHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".olderHistoryId",
                expected: "((string & MinLength<1>) | null)",
                value: input.olderHistoryId
            }, errorFactory)) && (("object" === typeof input.history && null !== input.history && false === Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "__type",
                value: input.history
            }, errorFactory)) && $ao1(input.history, _path + ".history", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "__type",
                value: input.history
            }, errorFactory)) && ("number" === typeof input.historyRecordsCount || $guard(_exceptionable, {
                path: _path + ".historyRecordsCount",
                expected: "number",
                value: input.historyRecordsCount
            }, errorFactory)) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && $ao3(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "olderHistoryId", "history", "historyRecordsCount", "modificationTime"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                }, errorFactory);
            })));
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return ("object" === typeof value && null !== value || $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "(DTOModelRecord<default, \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"title\" | \"description\", string>)",
                    value: value
                }, errorFactory)) && $au0(value, _path + $join(key), true && _exceptionable) || $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "(DTOModelRecord<default, \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"title\" | \"description\", string>)",
                    value: value
                }, errorFactory);
            });
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "number",
                value: input.id
            }, errorFactory)) && ("title" === input.action || "description" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"description\" | \"title\")",
                value: input.action
            }, errorFactory)) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            }, errorFactory)) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            }, errorFactory)) && $ao3(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            }, errorFactory)) && (null === input.oldValue || "string" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | string)",
                value: input.oldValue
            }, errorFactory)) && (null === input.value || "string" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | string)",
                value: input.value
            }, errorFactory)) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                }, errorFactory);
            })));
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
                path: _path + ".seconds",
                expected: "number",
                value: input.seconds
            }, errorFactory)) && ("number" === typeof input.nanoseconds || $guard(_exceptionable, {
                path: _path + ".nanoseconds",
                expected: "number",
                value: input.nanoseconds
            }, errorFactory)) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                }, errorFactory);
            })));
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "number",
                value: input.id
            }, errorFactory)) && ("creationTime" === input.action || "placingInBinTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"creationTime\" | \"placingInBinTime\")",
                value: input.action
            }, errorFactory)) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            }, errorFactory)) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            }, errorFactory)) && $ao3(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            }, errorFactory)) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.oldValue
            }, errorFactory)) && $ao3(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.oldValue
            }, errorFactory)) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.value
            }, errorFactory)) && $ao3(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.value
            }, errorFactory)) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                }, errorFactory);
            })));
            const $au0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if ("creationTime" === input.action || "placingInBinTime" === input.action)
                    return $ao4(input, _path, true && _exceptionable);
                else if ("title" === input.action || "description" === input.action)
                    return $ao2(input, _path, true && _exceptionable);
                else
                    return $guard(_exceptionable, {
                        path: _path,
                        expected: "(DTOModelRecord<default, \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"title\" | \"description\", string>)",
                        value: input
                    }, errorFactory);
            })();
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            }, errorFactory);
        })(input, "$input", true);
    return input;
};
export default validateWorkspaceHistoryDTO;
