import Goal from "common/models/goal.model";
import typia from "typia";
const validateGoal = (input: any): Goal => {
    const __is = (input: any, _exceptionable: boolean = true): input is Goal => {
        const $join = (typia.createAssertEquals as any).join;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && ("string" === typeof input.authorId && 1 <= input.authorId.length) && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && "number" === typeof input.index && ("number" === typeof input.completedTasksCount && parseInt(input.completedTasksCount) === input.completedTasksCount && 0 <= input.completedTasksCount) && ("number" === typeof input.completedTasksStoryPoints && parseInt(input.completedTasksStoryPoints) === input.completedTasksStoryPoints && 0 <= input.completedTasksStoryPoints) && (Array.isArray(input.columnTasksCount) && input.columnTasksCount.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io1(elem, true && _exceptionable))) && (Array.isArray(input.columnTasksStoryPoints) && input.columnTasksStoryPoints.every((elem: any, _index2: number) => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && $io2(elem, true && _exceptionable))) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io4(elem, true && _exceptionable))) && (null === input.deadline || "object" === typeof input.deadline && null !== input.deadline && $io5(input.deadline, true && _exceptionable)) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io5(input.modificationTime, true && _exceptionable)) && (null === input.lastTaskCompletionTime || "object" === typeof input.lastTaskCompletionTime && null !== input.lastTaskCompletionTime && $io5(input.lastTaskCompletionTime, true && _exceptionable)) && (null === input.lastTaskAssignmentTime || "object" === typeof input.lastTaskAssignmentTime && null !== input.lastTaskAssignmentTime && $io5(input.lastTaskAssignmentTime, true && _exceptionable)) && ("object" === typeof input.creationTime && null !== input.creationTime && $io5(input.creationTime, true && _exceptionable)) && "boolean" === typeof input.isInBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io5(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && "boolean" === typeof input.isDeleted && (null === input.deletionTime || "object" === typeof input.deletionTime && null !== input.deletionTime && $io5(input.deletionTime, true && _exceptionable)) && (23 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "title", "description", "authorId", "storyPoints", "index", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskCompletionTime", "lastTaskAssignmentTime", "creationTime", "isInBin", "placingInBinTime", "insertedIntoBinByUserId", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
            if (RegExp(/(.*)/).test(key))
                return undefined === value || "number" === typeof value;
            return false;
        });
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if (RegExp(/(.*)/).test(key))
                return undefined === value || "number" === typeof value;
            return false;
        });
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is Goal => {
            const $guard = (typia.createAssertEquals as any).guard;
            const $join = (typia.createAssertEquals as any).join;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string (@minLength 1)",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string (@minLength 1)",
                value: input.workspaceId
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceId",
                expected: "string",
                value: input.workspaceId
            })) && ("string" === typeof input.title && (1 <= input.title.length || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string (@minLength 1)",
                value: input.title
            })) || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string",
                value: input.title
            })) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            })) && ("string" === typeof input.authorId && (1 <= input.authorId.length || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string (@minLength 1)",
                value: input.authorId
            })) || $guard(_exceptionable, {
                path: _path + ".authorId",
                expected: "string",
                value: input.authorId
            })) && ("number" === typeof input.storyPoints && (parseInt(input.storyPoints) === input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number (@type int)",
                value: input.storyPoints
            })) && (0 <= input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number (@minimum 0)",
                value: input.storyPoints
            })) || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "number",
                value: input.storyPoints
            })) && ("number" === typeof input.index || $guard(_exceptionable, {
                path: _path + ".index",
                expected: "number",
                value: input.index
            })) && ("number" === typeof input.completedTasksCount && (parseInt(input.completedTasksCount) === input.completedTasksCount || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number (@type int)",
                value: input.completedTasksCount
            })) && (0 <= input.completedTasksCount || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number (@minimum 0)",
                value: input.completedTasksCount
            })) || $guard(_exceptionable, {
                path: _path + ".completedTasksCount",
                expected: "number",
                value: input.completedTasksCount
            })) && ("number" === typeof input.completedTasksStoryPoints && (parseInt(input.completedTasksStoryPoints) === input.completedTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number (@type int)",
                value: input.completedTasksStoryPoints
            })) && (0 <= input.completedTasksStoryPoints || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number (@minimum 0)",
                value: input.completedTasksStoryPoints
            })) || $guard(_exceptionable, {
                path: _path + ".completedTasksStoryPoints",
                expected: "number",
                value: input.completedTasksStoryPoints
            })) && ((Array.isArray(input.columnTasksCount) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount",
                expected: "Array<__type>",
                value: input.columnTasksCount
            })) && input.columnTasksCount.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) && $ao1(elem, _path + ".columnTasksCount[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksCount[" + _index1 + "]",
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
            })) && input.columnTasksStoryPoints.every((elem: any, _index2: number) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index2 + "]",
                expected: "__type.o1",
                value: elem
            })) && $ao2(elem, _path + ".columnTasksStoryPoints[" + _index2 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnTasksStoryPoints[" + _index2 + "]",
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
            })) && input.objectives.every((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
                expected: "__type.o2",
                value: elem
            })) && $ao3(elem, _path + ".objectives[" + _index3 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
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
            })) && input.notes.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o3",
                value: elem
            })) && $ao4(elem, _path + ".notes[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o3",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o3",
                value: input.notes
            })) && (null === input.deadline || ("object" === typeof input.deadline && null !== input.deadline || $guard(_exceptionable, {
                path: _path + ".deadline",
                expected: "(Timestamp | null)",
                value: input.deadline
            })) && $ao5(input.deadline, _path + ".deadline", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".deadline",
                expected: "(Timestamp | null)",
                value: input.deadline
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && $ao5(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && (null === input.lastTaskCompletionTime || ("object" === typeof input.lastTaskCompletionTime && null !== input.lastTaskCompletionTime || $guard(_exceptionable, {
                path: _path + ".lastTaskCompletionTime",
                expected: "(Timestamp | null)",
                value: input.lastTaskCompletionTime
            })) && $ao5(input.lastTaskCompletionTime, _path + ".lastTaskCompletionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".lastTaskCompletionTime",
                expected: "(Timestamp | null)",
                value: input.lastTaskCompletionTime
            })) && (null === input.lastTaskAssignmentTime || ("object" === typeof input.lastTaskAssignmentTime && null !== input.lastTaskAssignmentTime || $guard(_exceptionable, {
                path: _path + ".lastTaskAssignmentTime",
                expected: "(Timestamp | null)",
                value: input.lastTaskAssignmentTime
            })) && $ao5(input.lastTaskAssignmentTime, _path + ".lastTaskAssignmentTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".lastTaskAssignmentTime",
                expected: "(Timestamp | null)",
                value: input.lastTaskAssignmentTime
            })) && (("object" === typeof input.creationTime && null !== input.creationTime || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Timestamp",
                value: input.creationTime
            })) && $ao5(input.creationTime, _path + ".creationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Timestamp",
                value: input.creationTime
            })) && ("boolean" === typeof input.isInBin || $guard(_exceptionable, {
                path: _path + ".isInBin",
                expected: "boolean",
                value: input.isInBin
            })) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Timestamp | null)",
                value: input.placingInBinTime
            })) && $ao5(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Timestamp | null)",
                value: input.placingInBinTime
            })) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && (1 <= input.insertedIntoBinByUserId.length || $guard(_exceptionable, {
                path: _path + ".insertedIntoBinByUserId",
                expected: "string (@minLength 1)",
                value: input.insertedIntoBinByUserId
            })) || $guard(_exceptionable, {
                path: _path + ".insertedIntoBinByUserId",
                expected: "(null | string)",
                value: input.insertedIntoBinByUserId
            })) && ("boolean" === typeof input.isDeleted || $guard(_exceptionable, {
                path: _path + ".isDeleted",
                expected: "boolean",
                value: input.isDeleted
            })) && (null === input.deletionTime || ("object" === typeof input.deletionTime && null !== input.deletionTime || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(Timestamp | null)",
                value: input.deletionTime
            })) && $ao5(input.deletionTime, _path + ".deletionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(Timestamp | null)",
                value: input.deletionTime
            })) && (23 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "title", "description", "authorId", "storyPoints", "index", "completedTasksCount", "completedTasksStoryPoints", "columnTasksCount", "columnTasksStoryPoints", "objectives", "notes", "deadline", "modificationTime", "lastTaskCompletionTime", "lastTaskAssignmentTime", "creationTime", "isInBin", "placingInBinTime", "insertedIntoBinByUserId", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
                if (RegExp(/(.*)/).test(key))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => false === _exceptionable || Object.keys(input).every((key: any) => {
                const value = input[key];
                if (undefined === value)
                    return true;
                if (RegExp(/(.*)/).test(key))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.objective && (1 <= input.objective.length || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "string (@minLength 1)",
                value: input.objective
            })) || $guard(_exceptionable, {
                path: _path + ".objective",
                expected: "string",
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
                expected: "string (@minLength 1)",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string",
                value: input.userId
            })) && ("string" === typeof input.note && (1 <= input.note.length || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "string (@minLength 1)",
                value: input.note
            })) || $guard(_exceptionable, {
                path: _path + ".note",
                expected: "string",
                value: input.note
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
                value: input.date
            })) && $ao5(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "Timestamp",
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
export default validateGoal;
