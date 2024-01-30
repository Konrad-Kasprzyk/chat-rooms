import Task from "common/clientModels/task.model";
import typia from "typia";
const validateTask = (input: any): Task => {
    const __is = (input: any, _exceptionable: boolean = true): input is Task => {
        const $join = (typia.createAssertEquals as any).join;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "number" === typeof input.urlNumber && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (null === input.author || "object" === typeof input.author && null !== input.author && $io1(input.author, true && _exceptionable)) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && (null === input.assignedUser || "object" === typeof input.assignedUser && null !== input.assignedUser && $io1(input.assignedUser, true && _exceptionable)) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && 1 <= input.assignedUserId.length) && (null === input.column || "object" === typeof input.column && null !== input.column && $io2(input.column, true && _exceptionable)) && ("string" === typeof input.columnId && 1 <= input.columnId.length) && (null === input.goal || "object" === typeof input.goal && null !== input.goal && $io3(input.goal, true && _exceptionable)) && (null === input.goalId || "string" === typeof input.goalId && 1 <= input.goalId.length) && "boolean" === typeof input.isLoadingGoal && (null === input.storyPoints || "number" === typeof input.storyPoints) && "number" === typeof input.firstIndex && "number" === typeof input.secondIndex && (Array.isArray(input.labels) && input.labels.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io8(elem, true && _exceptionable))) && (Array.isArray(input.labelIds) && input.labelIds.every((elem: any, _index2: number) => "string" === typeof elem)) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io9(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io10(elem, true && _exceptionable))) && input.modificationTime instanceof Date && input.columnChangeTime instanceof Date && (null === input.completionTime || input.completionTime instanceof Date) && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (27 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "urlNumber", "workspaceId", "title", "description", "author", "authorId", "assignedUser", "assignedUserId", "column", "columnId", "goal", "goalId", "isLoadingGoal", "storyPoints", "firstIndex", "secondIndex", "labels", "labelIds", "priority", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index5: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index6: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.linkedUserDocumentIds) && input.linkedUserDocumentIds.every((elem: any, _index7: number) => "string" === typeof elem && 1 <= elem.length)) && "boolean" === typeof input.isBotUserDocument && "boolean" === typeof input.dataFromFirebaseAccount && input.modificationTime instanceof Date && (9 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "linkedUserDocumentIds", "isBotUserDocument", "dataFromFirebaseAccount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && "boolean" === typeof input.completedTasksColumn && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "number" === typeof input.urlNumber && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (null === input.author || "object" === typeof input.author && null !== input.author && $io1(input.author, true && _exceptionable)) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && (null === input.storyPoints || "number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 && 0 <= input.storyPoints)) && "number" === typeof input.firstIndex && "number" === typeof input.secondIndex && ("number" === typeof input.allTasksCount && (Math.floor(input.allTasksCount) === input.allTasksCount && -2147483648 <= input.allTasksCount && input.allTasksCount <= 2147483647 && 0 <= input.allTasksCount)) && ("number" === typeof input.allTasksStoryPoints && (Math.floor(input.allTasksStoryPoints) === input.allTasksStoryPoints && -2147483648 <= input.allTasksStoryPoints && input.allTasksStoryPoints <= 2147483647 && 0 <= input.allTasksStoryPoints)) && ("number" === typeof input.completedTasksCount && (Math.floor(input.completedTasksCount) === input.completedTasksCount && -2147483648 <= input.completedTasksCount && input.completedTasksCount <= 2147483647 && 0 <= input.completedTasksCount)) && ("number" === typeof input.completedTasksStoryPoints && (Math.floor(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && -2147483648 <= input.completedTasksStoryPoints && input.completedTasksStoryPoints <= 2147483647 && 0 <= input.completedTasksStoryPoints)) && (Array.isArray(input.columnTasksCount) && input.columnTasksCount.every((elem: any, _index8: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io4(elem, true && _exceptionable))) && (Array.isArray(input.columnTasksStoryPoints) && input.columnTasksStoryPoints.every((elem: any, _index9: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io5(elem, true && _exceptionable))) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index10: number) => "object" === typeof elem && null !== elem && $io6(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index11: number) => "object" === typeof elem && null !== elem && $io7(elem, true && _exceptionable))) && (null === input.deadline || input.deadline instanceof Date) && input.modificationTime instanceof Date && (null === input.lastTaskAssignmentTime || input.lastTaskAssignmentTime instanceof Date) && (null === input.lastTaskCompletionTime || input.lastTaskCompletionTime instanceof Date) && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (24 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "urlNumber", "workspaceId", "title", "description", "author", "authorId", "storyPoints", "firstIndex", "secondIndex", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "number" === typeof value;
            return false;
        });
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (true)
                return undefined === value || "number" === typeof value;
            return false;
        });
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => (null === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io9 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io10 = (input: any, _exceptionable: boolean = true): boolean => (null === input.user || "object" === typeof input.user && null !== input.user && $io1(input.user, true && _exceptionable)) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["user", "userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is Task => {
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
            })) && ("number" === typeof input.urlNumber || $guard(_exceptionable, {
                path: _path + ".urlNumber",
                expected: "number",
                value: input.urlNumber
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
            })) && $ao1(input.author, _path + ".author", true && _exceptionable) || $guard(_exceptionable, {
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
            })) && (null === input.assignedUser || ("object" === typeof input.assignedUser && null !== input.assignedUser || $guard(_exceptionable, {
                path: _path + ".assignedUser",
                expected: "(default.o1 | null)",
                value: input.assignedUser
            })) && $ao1(input.assignedUser, _path + ".assignedUser", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".assignedUser",
                expected: "(default.o1 | null)",
                value: input.assignedUser
            })) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && (1 <= input.assignedUserId.length || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "string & MinLength<1>",
                value: input.assignedUserId
            })) || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "((string & MinLength<1>) | null)",
                value: input.assignedUserId
            })) && (null === input.column || ("object" === typeof input.column && null !== input.column || $guard(_exceptionable, {
                path: _path + ".column",
                expected: "(Column | null)",
                value: input.column
            })) && $ao2(input.column, _path + ".column", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".column",
                expected: "(Column | null)",
                value: input.column
            })) && ("string" === typeof input.columnId && (1 <= input.columnId.length || $guard(_exceptionable, {
                path: _path + ".columnId",
                expected: "string & MinLength<1>",
                value: input.columnId
            })) || $guard(_exceptionable, {
                path: _path + ".columnId",
                expected: "(string & MinLength<1>)",
                value: input.columnId
            })) && (null === input.goal || ("object" === typeof input.goal && null !== input.goal || $guard(_exceptionable, {
                path: _path + ".goal",
                expected: "(default.o2 | null)",
                value: input.goal
            })) && $ao3(input.goal, _path + ".goal", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".goal",
                expected: "(default.o2 | null)",
                value: input.goal
            })) && (null === input.goalId || "string" === typeof input.goalId && (1 <= input.goalId.length || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "string & MinLength<1>",
                value: input.goalId
            })) || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "((string & MinLength<1>) | null)",
                value: input.goalId
            })) && ("boolean" === typeof input.isLoadingGoal || $guard(_exceptionable, {
                path: _path + ".isLoadingGoal",
                expected: "boolean",
                value: input.isLoadingGoal
            })) && (null === input.storyPoints || "number" === typeof input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "(null | number)",
                value: input.storyPoints
            })) && ("number" === typeof input.firstIndex || $guard(_exceptionable, {
                path: _path + ".firstIndex",
                expected: "number",
                value: input.firstIndex
            })) && ("number" === typeof input.secondIndex || $guard(_exceptionable, {
                path: _path + ".secondIndex",
                expected: "number",
                value: input.secondIndex
            })) && ((Array.isArray(input.labels) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && input.labels.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".labels[" + _index1 + "]",
                expected: "Label",
                value: elem
            })) && $ao8(elem, _path + ".labels[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".labels[" + _index1 + "]",
                expected: "Label",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && ((Array.isArray(input.labelIds) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "Array<string>",
                value: input.labelIds
            })) && input.labelIds.every((elem: any, _index2: number) => "string" === typeof elem || $guard(_exceptionable, {
                path: _path + ".labelIds[" + _index2 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "Array<string>",
                value: input.labelIds
            })) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority || $guard(_exceptionable, {
                path: _path + ".priority",
                expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
                value: input.priority
            })) && ((Array.isArray(input.objectives) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>.o4",
                value: input.objectives
            })) && input.objectives.every((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
                expected: "__type.o4",
                value: elem
            })) && $ao9(elem, _path + ".objectives[" + _index3 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
                expected: "__type.o4",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>.o4",
                value: input.objectives
            })) && ((Array.isArray(input.notes) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o5",
                value: input.notes
            })) && input.notes.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o5",
                value: elem
            })) && $ao10(elem, _path + ".notes[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o5",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o5",
                value: input.notes
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (input.columnChangeTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".columnChangeTime",
                expected: "Date",
                value: input.columnChangeTime
            })) && (null === input.completionTime || input.completionTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".completionTime",
                expected: "(Date | null)",
                value: input.completionTime
            })) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            })) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            })) && (27 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "urlNumber", "workspaceId", "title", "description", "author", "authorId", "assignedUser", "assignedUserId", "column", "columnId", "goal", "goalId", "isLoadingGoal", "storyPoints", "firstIndex", "secondIndex", "labels", "labelIds", "priority", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
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
            })) && input.workspaceIds.every((elem: any, _index5: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index5 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index5 + "]",
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
            })) && input.workspaceInvitationIds.every((elem: any, _index6: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index6 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index6 + "]",
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
            })) && input.linkedUserDocumentIds.every((elem: any, _index7: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index7 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index7 + "]",
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })) && ("boolean" === typeof input.completedTasksColumn || $guard(_exceptionable, {
                path: _path + ".completedTasksColumn",
                expected: "boolean",
                value: input.completedTasksColumn
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("number" === typeof input.urlNumber || $guard(_exceptionable, {
                path: _path + ".urlNumber",
                expected: "number",
                value: input.urlNumber
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
            })) && $ao1(input.author, _path + ".author", true && _exceptionable) || $guard(_exceptionable, {
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
            })) && ("number" === typeof input.firstIndex || $guard(_exceptionable, {
                path: _path + ".firstIndex",
                expected: "number",
                value: input.firstIndex
            })) && ("number" === typeof input.secondIndex || $guard(_exceptionable, {
                path: _path + ".secondIndex",
                expected: "number",
                value: input.secondIndex
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
            })) && input.columnTasksCount.every((elem: any, _index8: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index8 + "]",
                expected: "__type",
                value: elem
            })) && $ao4(elem, _path + ".columnTasksCount[" + _index8 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index8 + "]",
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
            })) && input.columnTasksStoryPoints.every((elem: any, _index9: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index9 + "]",
                expected: "__type.o1",
                value: elem
            })) && $ao5(elem, _path + ".columnTasksStoryPoints[" + _index9 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index9 + "]",
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
            })) && input.objectives.every((elem: any, _index10: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index10 + "]",
                expected: "__type.o2",
                value: elem
            })) && $ao6(elem, _path + ".objectives[" + _index10 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index10 + "]",
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
            })) && input.notes.every((elem: any, _index11: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index11 + "]",
                expected: "__type.o3",
                value: elem
            })) && $ao7(elem, _path + ".notes[" + _index11 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index11 + "]",
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
            })) && (24 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "urlNumber", "workspaceId", "title", "description", "author", "authorId", "storyPoints", "firstIndex", "secondIndex", "allTasksCount", "allTasksStoryPoints", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
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
            const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao1(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
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
            const $ao9 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
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
            const $ao10 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.user || ("object" === typeof input.user && null !== input.user || $guard(_exceptionable, {
                path: _path + ".user",
                expected: "(default.o1 | null)",
                value: input.user
            })) && $ao1(input.user, _path + ".user", true && _exceptionable) || $guard(_exceptionable, {
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
export default validateTask;
