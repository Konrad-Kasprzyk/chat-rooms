import Task from "common/models/task.model";
import typia from "typia";
const validateTask = (input: any): typia.IValidation<Task> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is Task => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("number" === typeof input.searchId && parseInt(input.searchId) === input.searchId && 1 <= input.searchId) && ("string" === typeof input.shortId && 1 <= input.shortId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.labelIds) && input.labelIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (null === input.goalId || "string" === typeof input.goalId && 1 <= input.goalId.length) && (Array.isArray(input.searchKeys) && input.searchKeys.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && ("string" === typeof input.columnId && 1 <= input.columnId.length) && "number" === typeof input.index && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && "boolean" === typeof input.isAssigned && (null === input.assignedUserId || "string" === typeof input.assignedUserId && 1 <= input.assignedUserId.length) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("object" === typeof input.creationTime && null !== input.creationTime && $io3(input.creationTime, true && _exceptionable)) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io3(input.modificationTime, true && _exceptionable)) && ("object" === typeof input.columnChangeTime && null !== input.columnChangeTime && $io3(input.columnChangeTime, true && _exceptionable)) && (null === input.completionTime || "object" === typeof input.completionTime && null !== input.completionTime && $io3(input.completionTime, true && _exceptionable)) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io3(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (25 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "searchId", "shortId", "title", "description", "labelIds", "goalId", "searchKeys", "columnId", "index", "storyPoints", "authorId", "isAssigned", "assignedUserId", "priority", "objectives", "notes", "creationTime", "modificationTime", "columnChangeTime", "completionTime", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.objective && 1 <= input.objective.length && "boolean" === typeof input.done && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["objective", "done"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && ("string" === typeof input.note && 1 <= input.note.length) && ("object" === typeof input.date && null !== input.date && $io3(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
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
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Task => {
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
                }), (Array.isArray(input.labelIds) || $report(_exceptionable, {
                    path: _path + ".labelIds",
                    expected: "Array<string>",
                    value: input.labelIds
                })) && input.labelIds.map((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".labelIds[" + _index1 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".labelIds[" + _index1 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".labelIds",
                    expected: "Array<string>",
                    value: input.labelIds
                }), null === input.goalId || "string" === typeof input.goalId && (1 <= input.goalId.length || $report(_exceptionable, {
                    path: _path + ".goalId",
                    expected: "string (@minLength 1)",
                    value: input.goalId
                })) || $report(_exceptionable, {
                    path: _path + ".goalId",
                    expected: "(null | string)",
                    value: input.goalId
                }), (Array.isArray(input.searchKeys) || $report(_exceptionable, {
                    path: _path + ".searchKeys",
                    expected: "Array<string>",
                    value: input.searchKeys
                })) && input.searchKeys.map((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".searchKeys[" + _index2 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".searchKeys[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".searchKeys",
                    expected: "Array<string>",
                    value: input.searchKeys
                }), "string" === typeof input.columnId && (1 <= input.columnId.length || $report(_exceptionable, {
                    path: _path + ".columnId",
                    expected: "string (@minLength 1)",
                    value: input.columnId
                })) || $report(_exceptionable, {
                    path: _path + ".columnId",
                    expected: "string",
                    value: input.columnId
                }), "number" === typeof input.index || $report(_exceptionable, {
                    path: _path + ".index",
                    expected: "number",
                    value: input.index
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
                }), "string" === typeof input.authorId && (1 <= input.authorId.length || $report(_exceptionable, {
                    path: _path + ".authorId",
                    expected: "string (@minLength 1)",
                    value: input.authorId
                })) || $report(_exceptionable, {
                    path: _path + ".authorId",
                    expected: "string",
                    value: input.authorId
                }), "boolean" === typeof input.isAssigned || $report(_exceptionable, {
                    path: _path + ".isAssigned",
                    expected: "boolean",
                    value: input.isAssigned
                }), null === input.assignedUserId || "string" === typeof input.assignedUserId && (1 <= input.assignedUserId.length || $report(_exceptionable, {
                    path: _path + ".assignedUserId",
                    expected: "string (@minLength 1)",
                    value: input.assignedUserId
                })) || $report(_exceptionable, {
                    path: _path + ".assignedUserId",
                    expected: "(null | string)",
                    value: input.assignedUserId
                }), null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority || $report(_exceptionable, {
                    path: _path + ".priority",
                    expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
                    value: input.priority
                }), (Array.isArray(input.objectives) || $report(_exceptionable, {
                    path: _path + ".objectives",
                    expected: "Array<__type>",
                    value: input.objectives
                })) && input.objectives.map((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".objectives[" + _index3 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo1(elem, _path + ".objectives[" + _index3 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".objectives[" + _index3 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".objectives",
                    expected: "Array<__type>",
                    value: input.objectives
                }), (Array.isArray(input.notes) || $report(_exceptionable, {
                    path: _path + ".notes",
                    expected: "Array<__type>.o1",
                    value: input.notes
                })) && input.notes.map((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".notes[" + _index4 + "]",
                    expected: "__type.o1",
                    value: elem
                })) && $vo2(elem, _path + ".notes[" + _index4 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".notes[" + _index4 + "]",
                    expected: "__type.o1",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".notes",
                    expected: "Array<__type>.o1",
                    value: input.notes
                }), ("object" === typeof input.creationTime && null !== input.creationTime || $report(_exceptionable, {
                    path: _path + ".creationTime",
                    expected: "Timestamp",
                    value: input.creationTime
                })) && $vo3(input.creationTime, _path + ".creationTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".creationTime",
                    expected: "Timestamp",
                    value: input.creationTime
                }), ("object" === typeof input.modificationTime && null !== input.modificationTime || $report(_exceptionable, {
                    path: _path + ".modificationTime",
                    expected: "Timestamp",
                    value: input.modificationTime
                })) && $vo3(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".modificationTime",
                    expected: "Timestamp",
                    value: input.modificationTime
                }), ("object" === typeof input.columnChangeTime && null !== input.columnChangeTime || $report(_exceptionable, {
                    path: _path + ".columnChangeTime",
                    expected: "Timestamp",
                    value: input.columnChangeTime
                })) && $vo3(input.columnChangeTime, _path + ".columnChangeTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".columnChangeTime",
                    expected: "Timestamp",
                    value: input.columnChangeTime
                }), null === input.completionTime || ("object" === typeof input.completionTime && null !== input.completionTime || $report(_exceptionable, {
                    path: _path + ".completionTime",
                    expected: "(Timestamp | null)",
                    value: input.completionTime
                })) && $vo3(input.completionTime, _path + ".completionTime", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".completionTime",
                    expected: "(Timestamp | null)",
                    value: input.completionTime
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo3(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
                }), 25 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "workspaceId", "searchId", "shortId", "title", "description", "labelIds", "goalId", "searchKeys", "columnId", "index", "storyPoints", "authorId", "isAssigned", "assignedUserId", "priority", "objectives", "notes", "creationTime", "modificationTime", "columnChangeTime", "completionTime", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.objective && (1 <= input.objective.length || $report(_exceptionable, {
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.userId && (1 <= input.userId.length || $report(_exceptionable, {
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
                })) && $vo3(input.date, _path + ".date", true && _exceptionable) || $report(_exceptionable, {
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
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
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
export default validateTask;
