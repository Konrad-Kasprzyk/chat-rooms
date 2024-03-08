import ColumnsHistory from "common/clientModels/historyModels/columnsHistory.model";
import typia from "typia";
const validateColumnsHistory = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): ColumnsHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is ColumnsHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && "number" === typeof input.historyRecordsCount && input.modificationTime instanceof Date && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "history", "historyRecordsCount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && ("created" === input.action || "modified" === input.action || "deleted" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io3(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io3(input.value, true && _exceptionable))) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index3: number) => "string" === typeof elem && 1 <= elem.length)) && "boolean" === typeof input.isBotUserDocument && "boolean" === typeof input.isAnonymousAccount && input.modificationTime instanceof Date && (8 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "isAnonymousAccount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.name && "boolean" === typeof input.completedTasksColumn && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["name", "completedTasksColumn"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is ColumnsHistory => {
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
            }, errorFactory)) && ((Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<DocRecord<\"created\" | \"modified\" | \"deleted\", __type>>",
                value: input.history
            }, errorFactory)) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "DocRecord<\"created\" | \"modified\" | \"deleted\", __type>",
                value: elem
            }, errorFactory)) && $ao1(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "DocRecord<\"created\" | \"modified\" | \"deleted\", __type>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<DocRecord<\"created\" | \"modified\" | \"deleted\", __type>>",
                value: input.history
            }, errorFactory)) && ("number" === typeof input.historyRecordsCount || $guard(_exceptionable, {
                path: _path + ".historyRecordsCount",
                expected: "number",
                value: input.historyRecordsCount
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "number",
                value: input.id
            }, errorFactory)) && ("created" === input.action || "modified" === input.action || "deleted" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"created\" | \"deleted\" | \"modified\")",
                value: input.action
            }, errorFactory)) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            }, errorFactory)) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            }, errorFactory)) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            }, errorFactory)) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            }, errorFactory)) && ((undefined !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null | string)",
                value: input.oldValue
            }, errorFactory)) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null | string)",
                value: input.oldValue
            }, errorFactory)) && $ao3(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null | string)",
                value: input.oldValue
            }, errorFactory))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type | null | string)",
                value: input.value
            }, errorFactory)) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type | null | string)",
                value: input.value
            }, errorFactory)) && $ao3(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type | null | string)",
                value: input.value
            }, errorFactory))) && (7 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.email && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string & Format<\"email\">",
                value: input.email
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "(string & Format<\"email\">)",
                value: input.email
            }, errorFactory)) && ("string" === typeof input.username || $guard(_exceptionable, {
                path: _path + ".username",
                expected: "string",
                value: input.username
            }, errorFactory)) && ((Array.isArray(input.workspaceIds) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            }, errorFactory)) && input.workspaceIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            }, errorFactory)) && ((Array.isArray(input.workspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            }, errorFactory)) && input.workspaceInvitationIds.every((elem: any, _index3: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index3 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index3 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            }, errorFactory)) && ("boolean" === typeof input.isBotUserDocument || $guard(_exceptionable, {
                path: _path + ".isBotUserDocument",
                expected: "boolean",
                value: input.isBotUserDocument
            }, errorFactory)) && ("boolean" === typeof input.isAnonymousAccount || $guard(_exceptionable, {
                path: _path + ".isAnonymousAccount",
                expected: "boolean",
                value: input.isAnonymousAccount
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            }, errorFactory)) && (8 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "isAnonymousAccount", "modificationTime"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }, errorFactory)) && ("boolean" === typeof input.completedTasksColumn || $guard(_exceptionable, {
                path: _path + ".completedTasksColumn",
                expected: "boolean",
                value: input.completedTasksColumn
            }, errorFactory)) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["name", "completedTasksColumn"].some((prop: any) => key === prop))
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
export default validateColumnsHistory;
