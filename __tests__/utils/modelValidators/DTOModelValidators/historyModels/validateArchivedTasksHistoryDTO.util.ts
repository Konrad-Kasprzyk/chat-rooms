import ArchivedTasksHistoryDTO from "common/DTOModels/historyModels/archivedTasksHistoryDTO.model";
import typia from "typia";
const validateArchivedTasksHistoryDTO = (input: any): ArchivedTasksHistoryDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is ArchivedTasksHistoryDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io2(input.modificationTime, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "history", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "docDeleted" === input.action && (null === input.userId || "string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && ("object" === typeof input.value && null !== input.value && $io3(input.value, true && _exceptionable)) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (null === input.authorUsername || "string" === typeof input.authorUsername) && (null === input.assignedUserUsername || "string" === typeof input.assignedUserUsername) && "string" === typeof input.columnName && (null === input.goalTitle || "string" === typeof input.goalTitle) && (null === input.storyPoints || "number" === typeof input.storyPoints) && (Array.isArray(input.labels) && input.labels.every((elem: any, _index2: number) => "object" === typeof elem && null !== elem && $io4(elem, true && _exceptionable))) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority) && (Array.isArray(input.objectives) && input.objectives.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io5(elem, true && _exceptionable))) && (Array.isArray(input.notes) && input.notes.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io6(elem, true && _exceptionable))) && input.modificationTime instanceof Date && input.columnChangeTime instanceof Date && (null === input.completionTime || input.completionTime instanceof Date) && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (18 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "title", "description", "authorUsername", "assignedUserUsername", "columnName", "goalTitle", "storyPoints", "labels", "priority", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color"].some((prop: any) => key === prop))
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
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => (null === input.userUsername || "string" === typeof input.userUsername) && ("string" === typeof input.note && 1 <= input.note.length) && input.date instanceof Date && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is ArchivedTasksHistoryDTO => {
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
            })) && ((Array.isArray(input.history) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ArchivedDTORecord<\"docDeleted\", ArchivedTask>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "ArchivedDTORecord<\"docDeleted\", ArchivedTask>",
                value: elem
            })) && $ao1(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "ArchivedDTORecord<\"docDeleted\", ArchivedTask>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<ArchivedDTORecord<\"docDeleted\", ArchivedTask>>",
                value: input.history
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            })) && $ao2(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "olderHistoryId", "history", "modificationTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("docDeleted" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"docDeleted\"",
                value: input.action
            })) && (null === input.userId || "string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "((string & MinLength<1>) | null)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && (("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "ArchivedTask",
                value: input.value
            })) && $ao3(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "ArchivedTask",
                value: input.value
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "value"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
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
            })) && (null === input.authorUsername || "string" === typeof input.authorUsername || $guard(_exceptionable, {
                path: _path + ".authorUsername",
                expected: "(null | string)",
                value: input.authorUsername
            })) && (null === input.assignedUserUsername || "string" === typeof input.assignedUserUsername || $guard(_exceptionable, {
                path: _path + ".assignedUserUsername",
                expected: "(null | string)",
                value: input.assignedUserUsername
            })) && ("string" === typeof input.columnName || $guard(_exceptionable, {
                path: _path + ".columnName",
                expected: "string",
                value: input.columnName
            })) && (null === input.goalTitle || "string" === typeof input.goalTitle || $guard(_exceptionable, {
                path: _path + ".goalTitle",
                expected: "(null | string)",
                value: input.goalTitle
            })) && (null === input.storyPoints || "number" === typeof input.storyPoints || $guard(_exceptionable, {
                path: _path + ".storyPoints",
                expected: "(null | number)",
                value: input.storyPoints
            })) && ((Array.isArray(input.labels) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && input.labels.every((elem: any, _index2: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".labels[" + _index2 + "]",
                expected: "Label",
                value: elem
            })) && $ao4(elem, _path + ".labels[" + _index2 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".labels[" + _index2 + "]",
                expected: "Label",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && (null === input.priority || "low" === input.priority || "normal" === input.priority || "high" === input.priority || "urgent" === input.priority || $guard(_exceptionable, {
                path: _path + ".priority",
                expected: "(\"high\" | \"low\" | \"normal\" | \"urgent\" | null)",
                value: input.priority
            })) && ((Array.isArray(input.objectives) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            })) && input.objectives.every((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
                expected: "__type",
                value: elem
            })) && $ao5(elem, _path + ".objectives[" + _index3 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".objectives[" + _index3 + "]",
                expected: "__type",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".objectives",
                expected: "Array<__type>",
                value: input.objectives
            })) && ((Array.isArray(input.notes) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
                value: input.notes
            })) && input.notes.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o1",
                value: elem
            })) && $ao6(elem, _path + ".notes[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".notes[" + _index4 + "]",
                expected: "__type.o1",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".notes",
                expected: "Array<__type>.o1",
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
            })) && (18 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "title", "description", "authorUsername", "assignedUserUsername", "columnName", "goalTitle", "storyPoints", "labels", "priority", "objectives", "notes", "modificationTime", "columnChangeTime", "completionTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
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
            const $ao6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => (null === input.userUsername || "string" === typeof input.userUsername || $guard(_exceptionable, {
                path: _path + ".userUsername",
                expected: "(null | string)",
                value: input.userUsername
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
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["userUsername", "note", "date"].some((prop: any) => key === prop))
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
export default validateArchivedTasksHistoryDTO;
