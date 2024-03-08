import WorkspaceHistory from "common/clientModels/historyModels/workspaceHistory.model";
import typia from "typia";
const validateWorkspaceHistory = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): WorkspaceHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && "number" === typeof input.historyRecordsCount && input.modificationTime instanceof Date && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "history", "historyRecordsCount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && ("title" === input.action || "description" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.value || "string" === typeof input.value) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && ("creationTime" === input.action || "placingInBinTime" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || input.oldValue instanceof Date)) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || input.value instanceof Date)) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("creationTime" === input.action || "placingInBinTime" === input.action)
                return $io3(input, true && _exceptionable);
            else if ("title" === input.action || "description" === input.action)
                return $io1(input, true && _exceptionable);
            else
                return false;
        })();
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceHistory => {
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
                expected: "Array<ModelRecord<Workspace, \"title\" | \"description\", string> | ModelRecord<Workspace, \"creationTime\" | \"placingInBinTime\", Date>>",
                value: input.history
            }, errorFactory)) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            }, errorFactory)) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ModelRecord<Workspace, \"title\" | \"description\", string> | ModelRecord<Workspace, \"creationTime\" | \"placingInBinTime\", Date>>",
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
            }, errorFactory)) && ("title" === input.action || "description" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"description\" | \"title\")",
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
            }, errorFactory)) && (null === input.oldValue || "string" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | string)",
                value: input.oldValue
            }, errorFactory)) && (null === input.value || "string" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | string)",
                value: input.value
            }, errorFactory)) && (7 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "number",
                value: input.id
            }, errorFactory)) && ("creationTime" === input.action || "placingInBinTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"creationTime\" | \"placingInBinTime\")",
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
                expected: "(Date | null | string)",
                value: input.oldValue
            }, errorFactory)) && (null === input.oldValue || "string" === typeof input.oldValue || input.oldValue instanceof Date || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Date | null | string)",
                value: input.oldValue
            }, errorFactory))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Date | null | string)",
                value: input.value
            }, errorFactory)) && (null === input.value || "string" === typeof input.value || input.value instanceof Date || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Date | null | string)",
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
            const $au0 = (input: any, _path: string, _exceptionable: boolean = true): any => (() => {
                if ("creationTime" === input.action || "placingInBinTime" === input.action)
                    return $ao3(input, _path, true && _exceptionable);
                else if ("title" === input.action || "description" === input.action)
                    return $ao1(input, _path, true && _exceptionable);
                else
                    return $guard(_exceptionable, {
                        path: _path,
                        expected: "(ModelRecord<default, \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"title\" | \"description\", string>)",
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
export default validateWorkspaceHistory;
