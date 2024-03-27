import ArchivedGoals from "common/clientModels/historyModels/archivedGoals.model";
import typia from "typia";
const validateArchivedGoals = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): ArchivedGoals => {
    const __is = (input: any, _exceptionable: boolean = true): input is ArchivedGoals => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && "number" === typeof input.historyRecordsCount && input.modificationTime instanceof Date && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "history", "historyRecordsCount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.id && "docDeleted" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io3(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io3(input.value, true && _exceptionable))) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (null === input.authorUsername || "string" === typeof input.authorUsername) && (null === input.storyPoints || "number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 && 0 <= input.storyPoints)) && ("number" === typeof input.allTasksCount && (Math.floor(input.allTasksCount) === input.allTasksCount && -2147483648 <= input.allTasksCount && input.allTasksCount <= 2147483647 && 0 <= input.allTasksCount)) && ("number" === typeof input.allTasksStoryPoints && (Math.floor(input.allTasksStoryPoints) === input.allTasksStoryPoints && -2147483648 <= input.allTasksStoryPoints && input.allTasksStoryPoints <= 2147483647 && 0 <= input.allTasksStoryPoints)) && ("number" === typeof input.completedTasksCount && (Math.floor(input.completedTasksCount) === input.completedTasksCount && -2147483648 <= input.completedTasksCount && input.completedTasksCount <= 2147483647 && 0 <= input.completedTasksCount)) && ("number" === typeof input.completedTasksStoryPoints && (Math.floor(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && -2147483648 <= input.completedTasksStoryPoints && input.completedTasksStoryPoints <= 2147483647 && 0 <= input.completedTasksStoryPoints)) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io4(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index5: number) => "object" === typeof elem && null !== elem && $io5(elem, true && _exceptionable))) && (null === input.deadline || input.deadline instanceof Date) && input.modificationTime instanceof Date && (null === input.lastTaskAssignmentTime || input.lastTaskAssignmentTime instanceof Date) && (null === input.lastTaskCompletionTime || input.lastTaskCompletionTime instanceof Date) && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (18 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "title", "description", "authorUsername", "storyPoints", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => (null === input.userUsername || "string" === typeof input.userUsername) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userUsername", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is ArchivedGoals => {
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
                expected: "Array<DocRecord<\"docDeleted\", ArchivedGoal>>",
                value: input.history
            }, errorFactory)) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "DocRecord<\"docDeleted\", ArchivedGoal>",
                value: elem
            }, errorFactory)) && $ao1(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "DocRecord<\"docDeleted\", ArchivedGoal>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<DocRecord<\"docDeleted\", ArchivedGoal>>",
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
            }, errorFactory)) && ("docDeleted" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"docDeleted\"",
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
                expected: "(ArchivedGoal | null | string)",
                value: input.oldValue
            }, errorFactory)) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(ArchivedGoal | null | string)",
                value: input.oldValue
            }, errorFactory)) && $ao3(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(ArchivedGoal | null | string)",
                value: input.oldValue
            }, errorFactory))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(ArchivedGoal | null | string)",
                value: input.value
            }, errorFactory)) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(ArchivedGoal | null | string)",
                value: input.value
            }, errorFactory)) && $ao3(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(ArchivedGoal | null | string)",
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
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
            }, errorFactory)) && ("string" === typeof input.title && (1 <= input.title.length || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string & MinLength<1>",
                value: input.title
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "(string & MinLength<1>)",
                value: input.title
            }, errorFactory)) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            }, errorFactory)) && (null === input.authorUsername || "string" === typeof input.authorUsername || $guard(_exceptionable, {
                path: _path + ".authorUsername",
                expected: "(null | string)",
                value: input.authorUsername
            }, errorFactory)) && (null === input.storyPoints || "number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Type<\"int32\">",
                value: input.storyPoints
            }, errorFactory)) && (0 <= input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Minimum<0>",
                value: input.storyPoints
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "((number & Type<\"int32\"> & Minimum<0>) | null)",
                value: input.storyPoints
            }, errorFactory)) && ("number" === typeof input.allTasksCount && (Math.floor(input.allTasksCount) === input.allTasksCount && -2147483648 <= input.allTasksCount && input.allTasksCount <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "number & Type<\"int32\">",
                value: input.allTasksCount
            }, errorFactory)) && (0 <= input.allTasksCount || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "number & Minimum<0>",
                value: input.allTasksCount
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.allTasksCount
            }, errorFactory)) && ("number" === typeof input.allTasksStoryPoints && (Math.floor(input.allTasksStoryPoints) === input.allTasksStoryPoints && -2147483648 <= input.allTasksStoryPoints && input.allTasksStoryPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "number & Type<\"int32\">",
                value: input.allTasksStoryPoints
            }, errorFactory)) && (0 <= input.allTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "number & Minimum<0>",
                value: input.allTasksStoryPoints
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.allTasksStoryPoints
            }, errorFactory)) && ("number" === typeof input.completedTasksCount && (Math.floor(input.completedTasksCount) === input.completedTasksCount && -2147483648 <= input.completedTasksCount && input.completedTasksCount <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number & Type<\"int32\">",
                value: input.completedTasksCount
            }, errorFactory)) && (0 <= input.completedTasksCount || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number & Minimum<0>",
                value: input.completedTasksCount
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.completedTasksCount
            }, errorFactory)) && ("number" === typeof input.completedTasksStoryPoints && (Math.floor(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && -2147483648 <= input.completedTasksStoryPoints && input.completedTasksStoryPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number & Type<\"int32\">",
                value: input.completedTasksStoryPoints
            }, errorFactory)) && (0 <= input.completedTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number & Minimum<0>",
                value: input.completedTasksStoryPoints
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.completedTasksStoryPoints
            }, errorFactory)) && ((Array.isArray(input.objectives) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            }, errorFactory)) && input.objectives.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index4 + "]",
                expected: "__type",
                value: elem
            }, errorFactory)) && $ao4(elem, _path + ".objectives[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index4 + "]",
                expected: "__type",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            }, errorFactory)) && ((Array.isArray(input.notes) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
                value: input.notes
            }, errorFactory)) && input.notes.every((elem: any, _index5: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index5 + "]",
                expected: "__type.o1",
                value: elem
            }, errorFactory)) && $ao5(elem, _path + ".notes[" + _index5 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index5 + "]",
                expected: "__type.o1",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
                value: input.notes
            }, errorFactory)) && (null === input.deadline || input.deadline instanceof Date || $guard(_exceptionable, {
                path: _path + ".deadline",
                expected: "(Date | null)",
                value: input.deadline
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            }, errorFactory)) && (null === input.lastTaskAssignmentTime || input.lastTaskAssignmentTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".lastTaskAssignmentTime",
                expected: "(Date | null)",
                value: input.lastTaskAssignmentTime
            }, errorFactory)) && (null === input.lastTaskCompletionTime || input.lastTaskCompletionTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".lastTaskCompletionTime",
                expected: "(Date | null)",
                value: input.lastTaskCompletionTime
            }, errorFactory)) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            }, errorFactory)) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            }, errorFactory)) && (18 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "title", "description", "authorUsername", "storyPoints", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "string & MinLength<1>",
                value: input.objective
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "(string & MinLength<1>)",
                value: input.objective
            }, errorFactory)) && ("boolean" === typeof input.isDone || $guard(_exceptionable, {
                path: _path + ".isDone",
                expected: "boolean",
                value: input.isDone
            }, errorFactory)) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["objective", "isDone"].some((prop: any) => key === prop))
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.userUsername || "string" === typeof input.userUsername || $guard(_exceptionable, {
                path: _path + ".userUsername",
                expected: "(null | string)",
                value: input.userUsername
            }, errorFactory)) && ("string" === typeof input.note && (1 <= input.note.length || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "string & MinLength<1>",
                value: input.note
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "(string & MinLength<1>)",
                value: input.note
            }, errorFactory)) && (input.date instanceof Date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Date",
                value: input.date
            }, errorFactory)) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["userUsername", "note", "date"].some((prop: any) => key === prop))
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
export default validateArchivedGoals;
