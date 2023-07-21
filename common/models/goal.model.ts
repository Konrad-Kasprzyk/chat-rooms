import { Timestamp } from "firebase/firestore";
import typia from "typia";
export default interface Goal {
    /**
     * @minLength 1
     */
    id: string;
    /**
     * @minLength 1
     */
    workspaceId: string;
    /**
     * Used in url.
     * @type int
     * @minimum 1
     */
    searchId: number;
    /**
     * Used in completed tasks stats.
     * @minLength 1
     */
    shortId: string;
    /**
     * @minLength 1
     */
    title: string;
    description: string;
    index: number;
    /**
     * @minLength 1
     */
    authorId: string;
    /**
     * @type int
     * @minimum 0
     */
    storyPoints: number;
    taskStats: {
        /**
         * @type int
         * @minimum 0
         */
        activeCount: number;
        /**
         * @type int
         * @minimum 0
         */
        totalCount: number;
        /**
         * @type int
         * @minimum 0
         */
        activeStoryPointsSum: number;
        /**
         * @type int
         * @minimum 0
         */
        totalStoryPointsSum: number;
    };
    objectives: {
        /**
         * @minLength 1
         */
        objective: string;
        done: boolean;
    }[];
    notes: {
        /**
         * @minLength 1
         */
        userId: string;
        /**
         * @minLength 1
         */
        note: string;
        date: Timestamp;
    }[];
    creationTime: Timestamp;
    modificationTime: Timestamp;
    lastTaskAssignmentTime: Timestamp | null;
    lastTaskCompletionTime: Timestamp | null;
    deadline: Timestamp | null;
    /**
     * @minLength 1
     */
    lastModifiedTaskId: string | null;
    // /**
    //  * @minLength 1
    //  */
    // historyId: string;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    /**
     * @minLength 1
     */
    insertedIntoBinByUserId: string | null;
}
export const validateGoal = (input: any): typia.IValidation<Goal> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is Goal => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("number" === typeof input.searchId && parseInt(input.searchId) === input.searchId && 1 <= input.searchId) && ("string" === typeof input.shortId && 1 <= input.shortId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && "number" === typeof input.index && ("string" === typeof input.authorId && 1 <= input.authorId.length) && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && ("object" === typeof input.taskStats && null !== input.taskStats && $io1(input.taskStats, true && _exceptionable)) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index2: number) => "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable))) && ("object" === typeof input.creationTime && null !== input.creationTime && $io4(input.creationTime, true && _exceptionable)) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io4(input.modificationTime, true && _exceptionable)) && (null === input.lastTaskAssignmentTime || "object" === typeof input.lastTaskAssignmentTime && null !== input.lastTaskAssignmentTime && $io4(input.lastTaskAssignmentTime, true && _exceptionable)) && (null === input.lastTaskCompletionTime || "object" === typeof input.lastTaskCompletionTime && null !== input.lastTaskCompletionTime && $io4(input.lastTaskCompletionTime, true && _exceptionable)) && (null === input.deadline || "object" === typeof input.deadline && null !== input.deadline && $io4(input.deadline, true && _exceptionable)) && (null === input.lastModifiedTaskId || "string" === typeof input.lastModifiedTaskId && 1 <= input.lastModifiedTaskId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io4(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (21 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "searchId", "shortId", "title", "description", "index", "authorId", "storyPoints", "taskStats", "objectives", "notes", "creationTime", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "deadline", "lastModifiedTaskId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.activeCount && parseInt(input.activeCount) === input.activeCount && 0 <= input.activeCount && ("number" === typeof input.totalCount && parseInt(input.totalCount) === input.totalCount && 0 <= input.totalCount) && ("number" === typeof input.activeStoryPointsSum && parseInt(input.activeStoryPointsSum) === input.activeStoryPointsSum && 0 <= input.activeStoryPointsSum) && ("number" === typeof input.totalStoryPointsSum && parseInt(input.totalStoryPointsSum) === input.totalStoryPointsSum && 0 <= input.totalStoryPointsSum) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["activeCount", "totalCount", "activeStoryPointsSum", "totalStoryPointsSum"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.done && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "done"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && ("string" === typeof input.note && 1 <= input.note.length) && ("object" === typeof input.date && null !== input.date && $io4(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Goal => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.workspaceId && (1 <= input.workspaceId.length || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "string (@minLength 1)",
                    value: input.workspaceId
                })) || $report(_exceptionable, {
                    path: _path + ".workspaceId",
                    expected: "string",
                    value: input.workspaceId
                }), "number" === typeof input.searchId && (parseInt(input.searchId) === input.searchId || $report(_exceptionable, {
                    path: _path + ".searchId",
                    expected: "number (@type int)",
                    value: input.searchId
                })) && (1 <= input.searchId || $report(_exceptionable, {
                    path: _path + ".searchId",
                    expected: "number (@minimum 1)",
                    value: input.searchId
                })) || $report(_exceptionable, {
                    path: _path + ".searchId",
                    expected: "number",
                    value: input.searchId
                }), "string" === typeof input.shortId && (1 <= input.shortId.length || $report(_exceptionable, {
                    path: _path + ".shortId",
                    expected: "string (@minLength 1)",
                    value: input.shortId
                })) || $report(_exceptionable, {
                    path: _path + ".shortId",
                    expected: "string",
                    value: input.shortId
                }), "string" === typeof input.title && (1 <= input.title.length || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string (@minLength 1)",
                    value: input.title
                })) || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string",
                    value: input.title
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), "number" === typeof input.index || $report(_exceptionable, {
                    path: _path + ".index",
                    expected: "number",
                    value: input.index
                }), "string" === typeof input.authorId && (1 <= input.authorId.length || $report(_exceptionable, {
                    path: _path + ".authorId",
                    expected: "string (@minLength 1)",
                    value: input.authorId
                })) || $report(_exceptionable, {
                    path: _path + ".authorId",
                    expected: "string",
                    value: input.authorId
                }), "number" === typeof input.storyPoints && (parseInt(input.storyPoints) === input.storyPoints || $report(_exceptionable, {
                    path: _path + ".storyPoints",
                    expected: "number (@type int)",
                    value: input.storyPoints
                })) && (0 <= input.storyPoints || $report(_exceptionable, {
                    path: _path + ".storyPoints",
                    expected: "number (@minimum 0)",
                    value: input.storyPoints
                })) || $report(_exceptionable, {
                    path: _path + ".storyPoints",
                    expected: "number",
                    value: input.storyPoints
                }), ("object" === typeof input.taskStats && null !== input.taskStats || $report(_exceptionable, {
                    path: _path + ".taskStats",
                    expected: "__type",
                    value: input.taskStats
                })) && $vo1(input.taskStats, _path + ".taskStats", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".taskStats",
                    expected: "__type",
                    value: input.taskStats
                }), (Array.isArray(input.objectives) || $report(_exceptionable, {
                    path: _path + ".objectives",
                    expected: "Array<__type>",
                    value: input.objectives
                })) && input.objectives.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".objectives[" + _index1 + "]",
                    expected: "__type.o1",
                    value: elem
                })) && $vo2(elem, _path + ".objectives[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".objectives[" + _index1 + "]",
                    expected: "__type.o1",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".objectives",
                    expected: "Array<__type>",
                    value: input.objectives
                }), (Array.isArray(input.notes) || $report(_exceptionable, {
                    path: _path + ".notes",
                    expected: "Array<__type>.o1",
                    value: input.notes
                })) && input.notes.map((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".notes[" + _index2 + "]",
                    expected: "__type.o2",
                    value: elem
                })) && $vo3(elem, _path + ".notes[" + _index2 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".notes[" + _index2 + "]",
                    expected: "__type.o2",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".notes",
                    expected: "Array<__type>.o1",
                    value: input.notes
                }), ("object" === typeof input.creationTime && null !== input.creationTime || $report(_exceptionable, {
                    path: _path + ".creationTime",
                    expected: "Timestamp",
                    value: input.creationTime
                })) && $vo4(input.creationTime, _path + ".creationTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".creationTime",
                    expected: "Timestamp",
                    value: input.creationTime
                }), ("object" === typeof input.modificationTime && null !== input.modificationTime || $report(_exceptionable, {
                    path: _path + ".modificationTime",
                    expected: "Timestamp",
                    value: input.modificationTime
                })) && $vo4(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".modificationTime",
                    expected: "Timestamp",
                    value: input.modificationTime
                }), null === input.lastTaskAssignmentTime || ("object" === typeof input.lastTaskAssignmentTime && null !== input.lastTaskAssignmentTime || $report(_exceptionable, {
                    path: _path + ".lastTaskAssignmentTime",
                    expected: "(Timestamp | null)",
                    value: input.lastTaskAssignmentTime
                })) && $vo4(input.lastTaskAssignmentTime, _path + ".lastTaskAssignmentTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".lastTaskAssignmentTime",
                    expected: "(Timestamp | null)",
                    value: input.lastTaskAssignmentTime
                }), null === input.lastTaskCompletionTime || ("object" === typeof input.lastTaskCompletionTime && null !== input.lastTaskCompletionTime || $report(_exceptionable, {
                    path: _path + ".lastTaskCompletionTime",
                    expected: "(Timestamp | null)",
                    value: input.lastTaskCompletionTime
                })) && $vo4(input.lastTaskCompletionTime, _path + ".lastTaskCompletionTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".lastTaskCompletionTime",
                    expected: "(Timestamp | null)",
                    value: input.lastTaskCompletionTime
                }), null === input.deadline || ("object" === typeof input.deadline && null !== input.deadline || $report(_exceptionable, {
                    path: _path + ".deadline",
                    expected: "(Timestamp | null)",
                    value: input.deadline
                })) && $vo4(input.deadline, _path + ".deadline", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".deadline",
                    expected: "(Timestamp | null)",
                    value: input.deadline
                }), null === input.lastModifiedTaskId || "string" === typeof input.lastModifiedTaskId && (1 <= input.lastModifiedTaskId.length || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "string (@minLength 1)",
                    value: input.lastModifiedTaskId
                })) || $report(_exceptionable, {
                    path: _path + ".lastModifiedTaskId",
                    expected: "(null | string)",
                    value: input.lastModifiedTaskId
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo4(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
                }), 21 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "workspaceId", "searchId", "shortId", "title", "description", "index", "authorId", "storyPoints", "taskStats", "objectives", "notes", "creationTime", "modificationTime", "lastTaskAssignmentTime", "lastTaskCompletionTime", "deadline", "lastModifiedTaskId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.activeCount && (parseInt(input.activeCount) === input.activeCount || $report(_exceptionable, {
                    path: _path + ".activeCount",
                    expected: "number (@type int)",
                    value: input.activeCount
                })) && (0 <= input.activeCount || $report(_exceptionable, {
                    path: _path + ".activeCount",
                    expected: "number (@minimum 0)",
                    value: input.activeCount
                })) || $report(_exceptionable, {
                    path: _path + ".activeCount",
                    expected: "number",
                    value: input.activeCount
                }), "number" === typeof input.totalCount && (parseInt(input.totalCount) === input.totalCount || $report(_exceptionable, {
                    path: _path + ".totalCount",
                    expected: "number (@type int)",
                    value: input.totalCount
                })) && (0 <= input.totalCount || $report(_exceptionable, {
                    path: _path + ".totalCount",
                    expected: "number (@minimum 0)",
                    value: input.totalCount
                })) || $report(_exceptionable, {
                    path: _path + ".totalCount",
                    expected: "number",
                    value: input.totalCount
                }), "number" === typeof input.activeStoryPointsSum && (parseInt(input.activeStoryPointsSum) === input.activeStoryPointsSum || $report(_exceptionable, {
                    path: _path + ".activeStoryPointsSum",
                    expected: "number (@type int)",
                    value: input.activeStoryPointsSum
                })) && (0 <= input.activeStoryPointsSum || $report(_exceptionable, {
                    path: _path + ".activeStoryPointsSum",
                    expected: "number (@minimum 0)",
                    value: input.activeStoryPointsSum
                })) || $report(_exceptionable, {
                    path: _path + ".activeStoryPointsSum",
                    expected: "number",
                    value: input.activeStoryPointsSum
                }), "number" === typeof input.totalStoryPointsSum && (parseInt(input.totalStoryPointsSum) === input.totalStoryPointsSum || $report(_exceptionable, {
                    path: _path + ".totalStoryPointsSum",
                    expected: "number (@type int)",
                    value: input.totalStoryPointsSum
                })) && (0 <= input.totalStoryPointsSum || $report(_exceptionable, {
                    path: _path + ".totalStoryPointsSum",
                    expected: "number (@minimum 0)",
                    value: input.totalStoryPointsSum
                })) || $report(_exceptionable, {
                    path: _path + ".totalStoryPointsSum",
                    expected: "number",
                    value: input.totalStoryPointsSum
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["activeCount", "totalCount", "activeStoryPointsSum", "totalStoryPointsSum"].some((prop: any) => key === prop))
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.objective && (1 <= input.objective.length || $report(_exceptionable, {
                    path: _path + ".objective",
                    expected: "string (@minLength 1)",
                    value: input.objective
                })) || $report(_exceptionable, {
                    path: _path + ".objective",
                    expected: "string",
                    value: input.objective
                }), "boolean" === typeof input.done || $report(_exceptionable, {
                    path: _path + ".done",
                    expected: "boolean",
                    value: input.done
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["objective", "done"].some((prop: any) => key === prop))
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
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.userId && (1 <= input.userId.length || $report(_exceptionable, {
                    path: _path + ".userId",
                    expected: "string (@minLength 1)",
                    value: input.userId
                })) || $report(_exceptionable, {
                    path: _path + ".userId",
                    expected: "string",
                    value: input.userId
                }), "string" === typeof input.note && (1 <= input.note.length || $report(_exceptionable, {
                    path: _path + ".note",
                    expected: "string (@minLength 1)",
                    value: input.note
                })) || $report(_exceptionable, {
                    path: _path + ".note",
                    expected: "string",
                    value: input.note
                }), ("object" === typeof input.date && null !== input.date || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                })) && $vo4(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".date",
                    expected: "Timestamp",
                    value: input.date
                }), 3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["userId", "note", "date"].some((prop: any) => key === prop))
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
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
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
