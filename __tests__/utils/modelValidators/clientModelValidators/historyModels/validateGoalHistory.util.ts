import GoalHistory from "common/clientModels/historyModels/goalHistory.model";
import typia from "typia";
const validateGoalHistory = (input: any): GoalHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is GoalHistory => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (null === input.newerHistoryId || "string" === typeof input.newerHistoryId && 1 <= input.newerHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && input.modificationTime instanceof Date && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "newerHistoryId", "history", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.value || "string" === typeof input.value) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index3: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.linkedUserDocumentIds) && input.linkedUserDocumentIds.every((elem: any, _index4: number) => "string" === typeof elem && 1 <= elem.length)) && "boolean" === typeof input.isBotUserDocument && "boolean" === typeof input.dataFromFirebaseAccount && input.modificationTime instanceof Date && (9 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "linkedUserDocumentIds", "isBotUserDocument", "dataFromFirebaseAccount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "storyPoints" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "number" === typeof input.oldValue) && (null === input.value || "number" === typeof input.value) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "objectives" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io5(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io5(input.value, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "notes" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io7(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io7(input.value, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || input.oldValue instanceof Date) && (null === input.value || input.value instanceof Date) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action)
                return $io8(input, true && _exceptionable);
            else if ("notes" === input.action)
                return $io6(input, true && _exceptionable);
            else if ("objectives" === input.action)
                return $io4(input, true && _exceptionable);
            else if ("storyPoints" === input.action)
                return $io3(input, true && _exceptionable);
            else if ("title" === input.action || "description" === input.action)
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
            })) && ("string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string & MinLength<1>",
                value: input.workspaceId
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "(string & MinLength<1>)",
                value: input.workspaceId
            })) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && (1 <= input.olderHistoryId.length || $guard(_exceptionable, {
                path: _path + ".olderHistoryId",
                expected: "string & MinLength<1>",
                value: input.olderHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".olderHistoryId",
                expected: "((string & MinLength<1>) | null)",
                value: input.olderHistoryId
            })) && (null === input.newerHistoryId || "string" === typeof input.newerHistoryId && (1 <= input.newerHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newerHistoryId",
                expected: "string & MinLength<1>",
                value: input.newerHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newerHistoryId",
                expected: "((string & MinLength<1>) | null)",
                value: input.newerHistoryId
            })) && ((Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ModelRecord<Goal, \"title\" | \"description\", string> | ModelRecord<Goal, \"storyPoints\", number> | ModelRecord<Goal, \"objectives\", { ...; }> | ModelRecord<...> | ModelRecord<...>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ModelRecord<Goal, \"title\" | \"description\", string> | ModelRecord<Goal, \"storyPoints\", number> | ModelRecord<Goal, \"objectives\", { ...; }> | ModelRecord<...> | ModelRecord<...>>",
                value: input.history
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "olderHistoryId", "newerHistoryId", "history", "modificationTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"description\" | \"title\")",
                value: input.action
            })) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (null === input.oldValue || "string" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | string)",
                value: input.oldValue
            })) && (null === input.value || "string" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | string)",
                value: input.value
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("string" === typeof input.email && (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string & Format<\"email\">",
                value: input.email
            })) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "(string & Format<\"email\">)",
                value: input.email
            })) && ("string" === typeof input.username || $guard(_exceptionable, {
                path: _path + ".username",
                expected: "string",
                value: input.username
            })) && ((Array.isArray(input.workspaceIds) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            })) && input.workspaceIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            })) && ((Array.isArray(input.workspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            })) && input.workspaceInvitationIds.every((elem: any, _index3: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index3 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index3 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            })) && ((Array.isArray(input.linkedUserDocumentIds) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds",
                expected: "Array<string & MinLength<1>>",
                value: input.linkedUserDocumentIds
            })) && input.linkedUserDocumentIds.every((elem: any, _index4: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index4 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index4 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds",
                expected: "Array<string & MinLength<1>>",
                value: input.linkedUserDocumentIds
            })) && ("boolean" === typeof input.isBotUserDocument || $guard(_exceptionable, {
                path: _path + ".isBotUserDocument",
                expected: "boolean",
                value: input.isBotUserDocument
            })) && ("boolean" === typeof input.dataFromFirebaseAccount || $guard(_exceptionable, {
                path: _path + ".dataFromFirebaseAccount",
                expected: "boolean",
                value: input.dataFromFirebaseAccount
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (9 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "linkedUserDocumentIds", "isBotUserDocument", "dataFromFirebaseAccount", "modificationTime"].some((prop: any) => key === prop))
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
            })) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (null === input.oldValue || "number" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | number)",
                value: input.oldValue
            })) && (null === input.value || "number" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | number)",
                value: input.value
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            })) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null)",
                value: input.oldValue
            })) && $ao5(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type | null)",
                value: input.oldValue
            })) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type | null)",
                value: input.value
            })) && $ao5(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type | null)",
                value: input.value
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "string & MinLength<1>",
                value: input.objective
            })) || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "(string & MinLength<1>)",
                value: input.objective
            })) && ("boolean" === typeof input.isDone || $guard(_exceptionable, {
                path: _path + ".isDone",
                expected: "boolean",
                value: input.isDone
            })) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["objective", "isDone"].some((prop: any) => key === prop))
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
            })) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o1 | null)",
                value: input.oldValue
            })) && $ao7(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o1 | null)",
                value: input.oldValue
            })) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o1 | null)",
                value: input.value
            })) && $ao7(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o1 | null)",
                value: input.value
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && ("string" === typeof input.note && (1 <= input.note.length || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "string & MinLength<1>",
                value: input.note
            })) || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "(string & MinLength<1>)",
                value: input.note
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"creationTime\" | \"deadline\" | \"placingInBinTime\")",
                value: input.action
            })) && (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao2(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            })) && (null === input.oldValue || input.oldValue instanceof Date || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Date | null)",
                value: input.oldValue
            })) && (null === input.value || input.value instanceof Date || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Date | null)",
                value: input.value
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
                if ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action)
                    return $ao8(input, _path, true && _exceptionable);
                else if ("notes" === input.action)
                    return $ao6(input, _path, true && _exceptionable);
                else if ("objectives" === input.action)
                    return $ao4(input, _path, true && _exceptionable);
                else if ("storyPoints" === input.action)
                    return $ao3(input, _path, true && _exceptionable);
                else if ("title" === input.action || "description" === input.action)
                    return $ao1(input, _path, true && _exceptionable);
                else
                    return $guard(_exceptionable, {
                        path: _path,
                        expected: "(ModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", Date> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"title\" | \"description\", string>)",
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
