import TaskHistory from "common/clientModels/historyModels/taskHistory.model";
import typia from "typia";
const validateTaskHistory = (input: any): TaskHistory => {
    const __is = (input: any, _exceptionable: boolean = true): input is TaskHistory => {
        const $join = (typia.createAssertEquals as any).join;
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "assignedUser" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io2(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io2(input.value, true && _exceptionable))) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "column" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io5(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io5(input.value, true && _exceptionable))) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && "boolean" === typeof input.completedTasksColumn && (Array.isArray(input.replacedColumnIds) && input.replacedColumnIds.every((elem: any, _index5: number) => "string" === typeof elem)) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "completedTasksColumn", "replacedColumnIds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "goal" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io7(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io7(input.value, true && _exceptionable))) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (null === input.author || "object" === typeof input.author && null !== input.author && $io2(input.author, true && _exceptionable)) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && (null === input.storyPoints || "number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 && 0 <= input.storyPoints)) && "number" === typeof input.index && ("number" === typeof input.allTasksCount && (Math.floor(input.allTasksCount) === input.allTasksCount && -2147483648 <= input.allTasksCount && input.allTasksCount <= 2147483647 && 0 <= input.allTasksCount)) && ("number" === typeof input.allTasksStoryPoints && (Math.floor(input.allTasksStoryPoints) === input.allTasksStoryPoints && -2147483648 <= input.allTasksStoryPoints && input.allTasksStoryPoints <= 2147483647 && 0 <= input.allTasksStoryPoints)) && ("number" === typeof input.completedTasksCount && (Math.floor(input.completedTasksCount) === input.completedTasksCount && -2147483648 <= input.completedTasksCount && input.completedTasksCount <= 2147483647 && 0 <= input.completedTasksCount)) && ("number" === typeof input.completedTasksStoryPoints && (Math.floor(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && -2147483648 <= input.completedTasksStoryPoints && input.completedTasksStoryPoints <= 2147483647 && 0 <= input.completedTasksStoryPoints)) && (Array.isArray(input.columnTasksCount) && input.columnTasksCount.every((elem: any, _index6: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io8(elem, true && _exceptionable))) && (Array.isArray(input.columnTasksStoryPoints) && input.columnTasksStoryPoints.every((elem: any, _index7: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io9(elem, true && _exceptionable))) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index8: number) => "object" === typeof elem && null !== elem && $io10(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index9: number) => "object" === typeof elem && null !== elem && $io11(elem, true && _exceptionable))) && (null === input.deadline || input.deadline instanceof Date) && input.modificationTime instanceof Date && (null === input.lastTaskAssignmentTime || input.lastTaskAssignmentTime instanceof Date) && (null === input.lastTaskCompletionTime || input.lastTaskCompletionTime instanceof Date) && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (22 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "title", "description", "author", "authorId", "storyPoints", "index", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "number" === typeof value;
            return false;
        });
        const $io9 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "number" === typeof value;
            return false;
        });
        const $io10 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io11 = (input: any, _exceptionable: boolean = true): boolean => (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io12 = (input: any, _exceptionable: boolean = true): boolean => "storyPoints" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "number" === typeof input.oldValue) && (null === input.value || "number" === typeof input.value) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io13 = (input: any, _exceptionable: boolean = true): boolean => "labels" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (undefined !== input.oldValue && (null === input.oldValue || "string" === typeof input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io14(input.oldValue, true && _exceptionable))) && (undefined !== input.value && (null === input.value || "string" === typeof input.value || "object" === typeof input.value && null !== input.value && $io14(input.value, true && _exceptionable))) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io14 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io15 = (input: any, _exceptionable: boolean = true): boolean => "priority" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "low" === input.oldValue || "normal" === input.oldValue || "high" === input.oldValue || "urgent" === input.oldValue) && (null === input.value || "low" === input.value || "normal" === input.value || "high" === input.value || "urgent" === input.value) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io16 = (input: any, _exceptionable: boolean = true): boolean => "objectives" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io17(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io17(input.value, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io17 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io18 = (input: any, _exceptionable: boolean = true): boolean => "notes" === input.action && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io19(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io19(input.value, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io19 = (input: any, _exceptionable: boolean = true): boolean => (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io20 = (input: any, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "placingInBinTime" === input.action || "completionTime" === input.action) && (null === input.user || "object" === typeof input.user && null !== input.user && $io2(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && input.date instanceof Date && (null === input.oldValue || input.oldValue instanceof Date) && (null === input.value || input.value instanceof Date) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "user", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $iu0 = (input: any, _exceptionable: boolean = true): any => (() => {
            if ("creationTime" === input.action || "placingInBinTime" === input.action || "completionTime" === input.action)
                return $io20(input, true && _exceptionable);
            else if ("notes" === input.action)
                return $io18(input, true && _exceptionable);
            else if ("objectives" === input.action)
                return $io16(input, true && _exceptionable);
            else if ("priority" === input.action)
                return $io15(input, true && _exceptionable);
            else if ("labels" === input.action)
                return $io13(input, true && _exceptionable);
            else if ("storyPoints" === input.action)
                return $io12(input, true && _exceptionable);
            else if ("goal" === input.action)
                return $io6(input, true && _exceptionable);
            else if ("column" === input.action)
                return $io4(input, true && _exceptionable);
            else if ("assignedUser" === input.action)
                return $io3(input, true && _exceptionable);
            else if ("title" === input.action || "description" === input.action)
                return $io1(input, true && _exceptionable);
            else
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
                expected: "Array<ModelRecord<Task, \"title\" | \"description\", string> | ModelRecord<Task, \"assignedUser\", User> | ModelRecord<Task, \"column\", Column> | ... 6 more ... | ModelRecord<...>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"assignedUser\", default> | ModelRecord<default, \"column\", Column> | ModelRecord<default, \"creationTime\" | \"placingInBinTime\" | \"completionTime\", Date> | ModelRecord<default, \"goal\", default> | ModelRecord<default, \"labels\", Label> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"priority\", \"low\" | \"normal\" | \"high\" | \"urgent\"> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(ModelRecord<default, \"assignedUser\", default> | ModelRecord<default, \"column\", Column> | ModelRecord<default, \"creationTime\" | \"placingInBinTime\" | \"completionTime\", Date> | ModelRecord<default, \"goal\", default> | ModelRecord<default, \"labels\", Label> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"priority\", \"low\" | \"normal\" | \"high\" | \"urgent\"> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ModelRecord<Task, \"title\" | \"description\", string> | ModelRecord<Task, \"assignedUser\", User> | ModelRecord<Task, \"column\", Column> | ... 6 more ... | ModelRecord<...>>",
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("assignedUser" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"assignedUser\"",
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
            })) && ((undefined !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o1 | null | string)",
                value: input.oldValue
            })) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o1 | null | string)",
                value: input.oldValue
            })) && $ao2(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o1 | null | string)",
                value: input.oldValue
            }))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o1 | null | string)",
                value: input.value
            })) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o1 | null | string)",
                value: input.value
            })) && $ao2(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o1 | null | string)",
                value: input.value
            }))) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("column" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"column\"",
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
            })) && ((undefined !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Column | null | string)",
                value: input.oldValue
            })) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Column | null | string)",
                value: input.oldValue
            })) && $ao5(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Column | null | string)",
                value: input.oldValue
            }))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Column | null | string)",
                value: input.value
            })) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Column | null | string)",
                value: input.value
            })) && $ao5(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Column | null | string)",
                value: input.value
            }))) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })) && ("boolean" === typeof input.completedTasksColumn || $guard(_exceptionable, {
                path: _path + ".completedTasksColumn",
                expected: "boolean",
                value: input.completedTasksColumn
            })) && ((Array.isArray(input.replacedColumnIds) || $guard(_exceptionable, {
                path: _path + ".replacedColumnIds",
                expected: "Array<string>",
                value: input.replacedColumnIds
            })) && input.replacedColumnIds.every((elem: any, _index5: number) => "string" === typeof elem || $guard(_exceptionable, {
                path: _path + ".replacedColumnIds[" + _index5 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".replacedColumnIds",
                expected: "Array<string>",
                value: input.replacedColumnIds
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "completedTasksColumn", "replacedColumnIds"].some((prop: any) => key === prop))
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
            const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("goal" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"goal\"",
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
            })) && ((undefined !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o2 | null | string)",
                value: input.oldValue
            })) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o2 | null | string)",
                value: input.oldValue
            })) && $ao7(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(default.o2 | null | string)",
                value: input.oldValue
            }))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o2 | null | string)",
                value: input.value
            })) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o2 | null | string)",
                value: input.value
            })) && $ao7(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(default.o2 | null | string)",
                value: input.value
            }))) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
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
            })) && ("string" === typeof input.title && (1 <= input.title.length || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string & MinLength<1>",
                value: input.title
            })) || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "(string & MinLength<1>)",
                value: input.title
            })) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            })) && (null === input.author || ("object" === typeof input.author && null !== input.author || $guard(_exceptionable, {
                path: _path + ".author",
                expected: "(default.o1 | null)",
                value: input.author
            })) && $ao2(input.author, _path + ".author", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".author",
                expected: "(default.o1 | null)",
                value: input.author
            })) && ("string" === typeof input.authorId && (1 <= input.authorId.length || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string & MinLength<1>",
                value: input.authorId
            })) || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "(string & MinLength<1>)",
                value: input.authorId
            })) && (null === input.storyPoints || "number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Type<\"int32\">",
                value: input.storyPoints
            })) && (0 <= input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Minimum<0>",
                value: input.storyPoints
            })) || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "((number & Type<\"int32\"> & Minimum<0>) | null)",
                value: input.storyPoints
            })) && ("number" === typeof input.index || $guard(_exceptionable, {
                path: _path + ".index",
                expected: "number",
                value: input.index
            })) && ("number" === typeof input.allTasksCount && (Math.floor(input.allTasksCount) === input.allTasksCount && -2147483648 <= input.allTasksCount && input.allTasksCount <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "number & Type<\"int32\">",
                value: input.allTasksCount
            })) && (0 <= input.allTasksCount || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "number & Minimum<0>",
                value: input.allTasksCount
            })) || $guard(_exceptionable, {
                path: _path + ".allTasksCount",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.allTasksCount
            })) && ("number" === typeof input.allTasksStoryPoints && (Math.floor(input.allTasksStoryPoints) === input.allTasksStoryPoints && -2147483648 <= input.allTasksStoryPoints && input.allTasksStoryPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "number & Type<\"int32\">",
                value: input.allTasksStoryPoints
            })) && (0 <= input.allTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "number & Minimum<0>",
                value: input.allTasksStoryPoints
            })) || $guard(_exceptionable, {
                path: _path + ".allTasksStoryPoints",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.allTasksStoryPoints
            })) && ("number" === typeof input.completedTasksCount && (Math.floor(input.completedTasksCount) === input.completedTasksCount && -2147483648 <= input.completedTasksCount && input.completedTasksCount <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number & Type<\"int32\">",
                value: input.completedTasksCount
            })) && (0 <= input.completedTasksCount || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number & Minimum<0>",
                value: input.completedTasksCount
            })) || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.completedTasksCount
            })) && ("number" === typeof input.completedTasksStoryPoints && (Math.floor(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && -2147483648 <= input.completedTasksStoryPoints && input.completedTasksStoryPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number & Type<\"int32\">",
                value: input.completedTasksStoryPoints
            })) && (0 <= input.completedTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number & Minimum<0>",
                value: input.completedTasksStoryPoints
            })) || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.completedTasksStoryPoints
            })) && ((Array.isArray(input.columnTasksCount) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount",
                expected: "Array<__type>",
                value: input.columnTasksCount
            })) && input.columnTasksCount.every((elem: any, _index6: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index6 + "]",
                expected: "__type",
                value: elem
            })) && $ao8(elem, _path + ".columnTasksCount[" + _index6 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index6 + "]",
                expected: "__type",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount",
                expected: "Array<__type>",
                value: input.columnTasksCount
            })) && ((Array.isArray(input.columnTasksStoryPoints) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints",
                expected: "Array<__type>.o1",
                value: input.columnTasksStoryPoints
            })) && input.columnTasksStoryPoints.every((elem: any, _index7: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index7 + "]",
                expected: "__type.o1",
                value: elem
            })) && $ao9(elem, _path + ".columnTasksStoryPoints[" + _index7 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index7 + "]",
                expected: "__type.o1",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints",
                expected: "Array<__type>.o1",
                value: input.columnTasksStoryPoints
            })) && ((Array.isArray(input.objectives) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>.o2",
                value: input.objectives
            })) && input.objectives.every((elem: any, _index8: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index8 + "]",
                expected: "__type.o2",
                value: elem
            })) && $ao10(elem, _path + ".objectives[" + _index8 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index8 + "]",
                expected: "__type.o2",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>.o2",
                value: input.objectives
            })) && ((Array.isArray(input.notes) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o3",
                value: input.notes
            })) && input.notes.every((elem: any, _index9: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index9 + "]",
                expected: "__type.o3",
                value: elem
            })) && $ao11(elem, _path + ".notes[" + _index9 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index9 + "]",
                expected: "__type.o3",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o3",
                value: input.notes
            })) && (null === input.deadline || input.deadline instanceof Date || $guard(_exceptionable, {
                path: _path + ".deadline",
                expected: "(Date | null)",
                value: input.deadline
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (null === input.lastTaskAssignmentTime || input.lastTaskAssignmentTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".lastTaskAssignmentTime",
                expected: "(Date | null)",
                value: input.lastTaskAssignmentTime
            })) && (null === input.lastTaskCompletionTime || input.lastTaskCompletionTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".lastTaskCompletionTime",
                expected: "(Date | null)",
                value: input.lastTaskCompletionTime
            })) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            })) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            })) && (22 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "title", "description", "author", "authorId", "storyPoints", "index", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
                const value = input[key];
                if (undefined === value)
                    return true;
                if (true)
                    return undefined === value || "number" === typeof value || $guard(_exceptionable, {
                        path: _path + $join(key),
                        expected: "(number | undefined)",
                        value: value
                    });
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                });
            });
            const $ao9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
                const value = input[key];
                if (undefined === value)
                    return true;
                if (true)
                    return undefined === value || "number" === typeof value || $guard(_exceptionable, {
                        path: _path + $join(key),
                        expected: "(number | undefined)",
                        value: value
                    });
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                });
            });
            const $ao10 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
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
            const $ao11 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
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
            const $ao12 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("storyPoints" === input.action || $guard(_exceptionable, {
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
            const $ao13 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("labels" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"labels\"",
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
            })) && ((undefined !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Label | null | string)",
                value: input.oldValue
            })) && (null === input.oldValue || "string" === typeof input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Label | null | string)",
                value: input.oldValue
            })) && $ao14(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(Label | null | string)",
                value: input.oldValue
            }))) && ((undefined !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Label | null | string)",
                value: input.value
            })) && (null === input.value || "string" === typeof input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Label | null | string)",
                value: input.value
            })) && $ao14(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(Label | null | string)",
                value: input.value
            }))) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao14 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })) && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color || $guard(_exceptionable, {
                path: _path + ".color",
                expected: "(\"Blue\" | \"BlueViolet\" | \"Brown\" | \"Chocolate\" | \"Coral\" | \"Crimson\" | \"Cyan\" | \"DarkCyan\" | \"DarkGrey\" | \"DarkRed\" | \"DarkSlateGrey\" | \"DeepPink\" | \"DodgerBlue\" | \"Goldenrod\" | \"Green\" | \"GreenYellow\" | \"Grey\" | \"HotPink\" | \"Indigo\" | \"LightCoral\" | \"LightSalmon\" | \"LimeGreen\" | \"Maroon\" | \"OrangeRed\" | \"Purple\" | \"RosyBrown\" | \"SeaGreen\" | \"Snow\" | \"Yellow\")",
                value: input.color
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "color"].some((prop: any) => key === prop))
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
            const $ao15 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("priority" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"priority\"",
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
            })) && (null === input.oldValue || "low" === input.oldValue || "normal" === input.oldValue || "high" === input.oldValue || "urgent" === input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
                value: input.oldValue
            })) && (null === input.value || "low" === input.value || "normal" === input.value || "high" === input.value || "urgent" === input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
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
            const $ao16 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("objectives" === input.action || $guard(_exceptionable, {
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
                expected: "(__type.o4 | null)",
                value: input.oldValue
            })) && $ao17(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o4 | null)",
                value: input.oldValue
            })) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o4 | null)",
                value: input.value
            })) && $ao17(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o4 | null)",
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
            const $ao17 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
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
            const $ao18 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("notes" === input.action || $guard(_exceptionable, {
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
                expected: "(__type.o5 | null)",
                value: input.oldValue
            })) && $ao19(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(__type.o5 | null)",
                value: input.oldValue
            })) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o5 | null)",
                value: input.value
            })) && $ao19(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(__type.o5 | null)",
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
            const $ao19 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
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
            const $ao20 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("creationTime" === input.action || "placingInBinTime" === input.action || "completionTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"completionTime\" | \"creationTime\" | \"placingInBinTime\")",
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
                if ("creationTime" === input.action || "placingInBinTime" === input.action || "completionTime" === input.action)
                    return $ao20(input, _path, true && _exceptionable);
                else if ("notes" === input.action)
                    return $ao18(input, _path, true && _exceptionable);
                else if ("objectives" === input.action)
                    return $ao16(input, _path, true && _exceptionable);
                else if ("priority" === input.action)
                    return $ao15(input, _path, true && _exceptionable);
                else if ("labels" === input.action)
                    return $ao13(input, _path, true && _exceptionable);
                else if ("storyPoints" === input.action)
                    return $ao12(input, _path, true && _exceptionable);
                else if ("goal" === input.action)
                    return $ao6(input, _path, true && _exceptionable);
                else if ("column" === input.action)
                    return $ao4(input, _path, true && _exceptionable);
                else if ("assignedUser" === input.action)
                    return $ao3(input, _path, true && _exceptionable);
                else if ("title" === input.action || "description" === input.action)
                    return $ao1(input, _path, true && _exceptionable);
                else
                    return $guard(_exceptionable, {
                        path: _path,
                        expected: "(ModelRecord<default, \"creationTime\" | \"placingInBinTime\" | \"completionTime\", Date> | ModelRecord<default, \"notes\", __type> | ModelRecord<default, \"objectives\", __type> | ModelRecord<default, \"priority\", \"low\" | \"normal\" | \"high\" | \"urgent\"> | ModelRecord<default, \"labels\", Label> | ModelRecord<default, \"storyPoints\", number> | ModelRecord<default, \"goal\", default> | ModelRecord<default, \"column\", Column> | ModelRecord<default, \"assignedUser\", default> | ModelRecord<default, \"title\" | \"description\", string>)",
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
