import TaskDTO from "common/DTOModels/taskDTO.model";
import typia from "typia";
const validateTaskDTO = (input: any): TaskDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is TaskDTO => {
        const $join = (typia.createAssertEquals as any).join;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "number" === typeof input.urlNumber && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && ("string" === typeof input.authorId && 1 <= input.authorId.length) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && 1 <= input.assignedUserId.length) && ("string" === typeof input.columnId && 1 <= input.columnId.length) && "boolean" === typeof input.hasGoal && (null === input.goalId || "string" === typeof input.goalId && 1 <= input.goalId.length) && "boolean" === typeof input.hasStoryPoints && ("number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 && 0 <= input.storyPoints)) && "number" === typeof input.firstIndex && "number" === typeof input.secondIndex && "boolean" === typeof input.hasAnyLabel && ("object" === typeof input.labelIds && null !== input.labelIds && false === Array.isArray(input.labelIds) && $io1(input.labelIds, true && _exceptionable)) && "boolean" === typeof input.hasPriority && ("object" === typeof input.priorities && null !== input.priorities && false === Array.isArray(input.priorities) && $io2(input.priorities, true && _exceptionable)) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index2: number) => "object" === typeof elem && null !== elem && $io4(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io5(input.modificationTime, true && _exceptionable)) && ("object" === typeof input.columnChangeTime && null !== input.columnChangeTime && $io5(input.columnChangeTime, true && _exceptionable)) && (null === input.completionTime || "object" === typeof input.completionTime && null !== input.completionTime && $io5(input.completionTime, true && _exceptionable)) && ("object" === typeof input.creationTime && null !== input.creationTime && $io5(input.creationTime, true && _exceptionable)) && ("string" === typeof input.newestHistoryId && 1 <= input.newestHistoryId.length) && "boolean" === typeof input.isInBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io5(input.placingInBinTime, true && _exceptionable)) && "boolean" === typeof input.isDeleted && (null === input.deletionTime || "object" === typeof input.deletionTime && null !== input.deletionTime && $io5(input.deletionTime, true && _exceptionable)) && (29 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "urlNumber", "workspaceId", "title", "description", "authorId", "assignedUserId", "columnId", "hasGoal", "goalId", "hasStoryPoints", "storyPoints", "firstIndex", "secondIndex", "hasAnyLabel", "labelIds", "hasPriority", "priorities", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "newestHistoryId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
            if (true)
                return undefined === value || "boolean" === typeof value;
            return false;
        });
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.low || "boolean" === typeof input.low) && (undefined === input.normal || "boolean" === typeof input.normal) && (undefined === input.high || "boolean" === typeof input.high) && (undefined === input.urgent || "boolean" === typeof input.urgent) && (0 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["low", "normal", "high", "urgent"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.isDone && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "isDone"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && ("string" === typeof input.note && 1 <= input.note.length) && ("object" === typeof input.date && null !== input.date && $io5(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is TaskDTO => {
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
            })) && ("string" === typeof input.authorId && (1 <= input.authorId.length || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string & MinLength<1>",
                value: input.authorId
            })) || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "(string & MinLength<1>)",
                value: input.authorId
            })) && (null === input.assignedUserId || "string" === typeof input.assignedUserId && (1 <= input.assignedUserId.length || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "string & MinLength<1>",
                value: input.assignedUserId
            })) || $guard(_exceptionable, {
                path: _path + ".assignedUserId",
                expected: "((string & MinLength<1>) | null)",
                value: input.assignedUserId
            })) && ("string" === typeof input.columnId && (1 <= input.columnId.length || $guard(_exceptionable, {
                path: _path + ".columnId",
                expected: "string & MinLength<1>",
                value: input.columnId
            })) || $guard(_exceptionable, {
                path: _path + ".columnId",
                expected: "(string & MinLength<1>)",
                value: input.columnId
            })) && ("boolean" === typeof input.hasGoal || $guard(_exceptionable, {
                path: _path + ".hasGoal",
                expected: "boolean",
                value: input.hasGoal
            })) && (null === input.goalId || "string" === typeof input.goalId && (1 <= input.goalId.length || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "string & MinLength<1>",
                value: input.goalId
            })) || $guard(_exceptionable, {
                path: _path + ".goalId",
                expected: "((string & MinLength<1>) | null)",
                value: input.goalId
            })) && ("boolean" === typeof input.hasStoryPoints || $guard(_exceptionable, {
                path: _path + ".hasStoryPoints",
                expected: "boolean",
                value: input.hasStoryPoints
            })) && ("number" === typeof input.storyPoints && (Math.floor(input.storyPoints) === input.storyPoints && -2147483648 <= input.storyPoints && input.storyPoints <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Type<\"int32\">",
                value: input.storyPoints
            })) && (0 <= input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number & Minimum<0>",
                value: input.storyPoints
            })) || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "(number & Type<\"int32\"> & Minimum<0>)",
                value: input.storyPoints
            })) && ("number" === typeof input.firstIndex || $guard(_exceptionable, {
                path: _path + ".firstIndex",
                expected: "number",
                value: input.firstIndex
            })) && ("number" === typeof input.secondIndex || $guard(_exceptionable, {
                path: _path + ".secondIndex",
                expected: "number",
                value: input.secondIndex
            })) && ("boolean" === typeof input.hasAnyLabel || $guard(_exceptionable, {
                path: _path + ".hasAnyLabel",
                expected: "boolean",
                value: input.hasAnyLabel
            })) && (("object" === typeof input.labelIds && null !== input.labelIds && false === Array.isArray(input.labelIds) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "__type",
                value: input.labelIds
            })) && $ao1(input.labelIds, _path + ".labelIds", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".labelIds",
                expected: "__type",
                value: input.labelIds
            })) && ("boolean" === typeof input.hasPriority || $guard(_exceptionable, {
                path: _path + ".hasPriority",
                expected: "boolean",
                value: input.hasPriority
            })) && (("object" === typeof input.priorities && null !== input.priorities && false === Array.isArray(input.priorities) || $guard(_exceptionable, {
                path: _path + ".priorities",
                expected: "__type.o1",
                value: input.priorities
            })) && $ao2(input.priorities, _path + ".priorities", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".priorities",
                expected: "__type.o1",
                value: input.priorities
            })) && ((Array.isArray(input.objectives) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            })) && input.objectives.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index1 + "]",
                expected: "__type.o2",
                value: elem
            })) && $ao3(elem, _path + ".objectives[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index1 + "]",
                expected: "__type.o2",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            })) && ((Array.isArray(input.notes) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
                value: input.notes
            })) && input.notes.every((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index2 + "]",
                expected: "__type.o3",
                value: elem
            })) && $ao4(elem, _path + ".notes[" + _index2 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index2 + "]",
                expected: "__type.o3",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
                value: input.notes
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            })) && $ao5(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            })) && (("object" === typeof input.columnChangeTime && null !== input.columnChangeTime || $guard(_exceptionable, {
                path: _path + ".columnChangeTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.columnChangeTime
            })) && $ao5(input.columnChangeTime, _path + ".columnChangeTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnChangeTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.columnChangeTime
            })) && (null === input.completionTime || ("object" === typeof input.completionTime && null !== input.completionTime || $guard(_exceptionable, {
                path: _path + ".completionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.completionTime
            })) && $ao5(input.completionTime, _path + ".completionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".completionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.completionTime
            })) && (("object" === typeof input.creationTime && null !== input.creationTime || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.creationTime
            })) && $ao5(input.creationTime, _path + ".creationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.creationTime
            })) && ("string" === typeof input.newestHistoryId && (1 <= input.newestHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newestHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestHistoryId
            })) && ("boolean" === typeof input.isInBin || $guard(_exceptionable, {
                path: _path + ".isInBin",
                expected: "boolean",
                value: input.isInBin
            })) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.placingInBinTime
            })) && $ao5(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.placingInBinTime
            })) && ("boolean" === typeof input.isDeleted || $guard(_exceptionable, {
                path: _path + ".isDeleted",
                expected: "boolean",
                value: input.isDeleted
            })) && (null === input.deletionTime || ("object" === typeof input.deletionTime && null !== input.deletionTime || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.deletionTime
            })) && $ao5(input.deletionTime, _path + ".deletionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.deletionTime
            })) && (29 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "urlNumber", "workspaceId", "title", "description", "authorId", "assignedUserId", "columnId", "hasGoal", "goalId", "hasStoryPoints", "storyPoints", "firstIndex", "secondIndex", "hasAnyLabel", "labelIds", "hasPriority", "priorities", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "newestHistoryId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
                const value = input[key];
                if (undefined === value)
                    return true;
                if (true)
                    return undefined === value || "boolean" === typeof value || $guard(_exceptionable, {
                        path: _path + $join(key),
                        expected: "(boolean | undefined)",
                        value: value
                    });
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                });
            });
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (undefined === input.low || "boolean" === typeof input.low || $guard(_exceptionable, {
                path: _path + ".low",
                expected: "(boolean | undefined)",
                value: input.low
            })) && (undefined === input.normal || "boolean" === typeof input.normal || $guard(_exceptionable, {
                path: _path + ".normal",
                expected: "(boolean | undefined)",
                value: input.normal
            })) && (undefined === input.high || "boolean" === typeof input.high || $guard(_exceptionable, {
                path: _path + ".high",
                expected: "(boolean | undefined)",
                value: input.high
            })) && (undefined === input.urgent || "boolean" === typeof input.urgent || $guard(_exceptionable, {
                path: _path + ".urgent",
                expected: "(boolean | undefined)",
                value: input.urgent
            })) && (0 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["low", "normal", "high", "urgent"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
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
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao5(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
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
            const $ao5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
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
export default validateTaskDTO;
