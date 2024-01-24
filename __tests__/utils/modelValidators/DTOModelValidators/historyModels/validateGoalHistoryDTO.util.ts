import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import typia from "typia";
const validateGoalHistoryDTO = (input: any): GoalHistoryDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is GoalHistoryDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && (null === input.olderHistoryId || "string" === typeof input.olderHistoryId && 1 <= input.olderHistoryId.length) && (null === input.newerHistoryId || "string" === typeof input.newerHistoryId && 1 <= input.newerHistoryId.length) && (Array.isArray(input.history) && input.history.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $iu0(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io2(input.modificationTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "olderHistoryId", "newerHistoryId", "history", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => ("title" === input.action || "description" === input.action) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "string" === typeof input.oldValue) && (null === input.value || "string" === typeof input.value) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "storyPoints" === input.action && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "number" === typeof input.oldValue) && (null === input.value || "number" === typeof input.value) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => "objectives" === input.action && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io5(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io5(input.value, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "notes" === input.action && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io7(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io7(input.value, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io7 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && ("string" === typeof input.note && 1 <= input.note.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "note", "date"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io8 = (input: any, _exceptionable: boolean = true): boolean => ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action) && ("string" === typeof input.userId && 1 <= input.userId.length) && ("object" === typeof input.date && null !== input.date && $io2(input.date, true && _exceptionable)) && (null === input.oldValue || "object" === typeof input.oldValue && null !== input.oldValue && $io2(input.oldValue, true && _exceptionable)) && (null === input.value || "object" === typeof input.value && null !== input.value && $io2(input.value, true && _exceptionable)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is GoalHistoryDTO => {
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
                expected: "Array<DTOModelRecord<GoalDTO, \"title\" | \"description\", string> | DTOModelRecord<GoalDTO, \"storyPoints\", number> | DTOModelRecord<GoalDTO, \"objectives\", { ...; }> | DTOModelRecord<...> | DTOModelRecord<...>>",
                value: input.history
            })) && input.history.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(DTOModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"notes\", __type> | DTOModelRecord<default, \"objectives\", __type> | DTOModelRecord<default, \"storyPoints\", number> | DTOModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) && $au0(elem, _path + ".history[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".history[" + _index1 + "]",
                expected: "(DTOModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"notes\", __type> | DTOModelRecord<default, \"objectives\", __type> | DTOModelRecord<default, \"storyPoints\", number> | DTOModelRecord<default, \"title\" | \"description\", string>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".history",
                expected: "Array<DTOModelRecord<GoalDTO, \"title\" | \"description\", string> | DTOModelRecord<GoalDTO, \"storyPoints\", number> | DTOModelRecord<GoalDTO, \"objectives\", { ...; }> | DTOModelRecord<...> | DTOModelRecord<...>>",
                value: input.history
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            })) && $ao2(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
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
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && (null === input.oldValue || "string" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | string)",
                value: input.oldValue
            })) && (null === input.value || "string" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | string)",
                value: input.value
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("storyPoints" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "\"storyPoints\"",
                value: input.action
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && (null === input.oldValue || "number" === typeof input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(null | number)",
                value: input.oldValue
            })) && (null === input.value || "number" === typeof input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(null | number)",
                value: input.value
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
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
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
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
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
            const $ao7 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
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
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
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
            const $ao8 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("deadline" === input.action || "creationTime" === input.action || "placingInBinTime" === input.action || $guard(_exceptionable, {
                path: _path + ".action",
                expected: "(\"creationTime\" | \"deadline\" | \"placingInBinTime\")",
                value: input.action
            })) && ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string & MinLength<1>",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "(string & MinLength<1>)",
                value: input.userId
            })) && (("object" === typeof input.date && null !== input.date || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && $ao2(input.date, _path + ".date", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".date",
                expected: "FirebaseFirestore.Timestamp",
                value: input.date
            })) && (null === input.oldValue || ("object" === typeof input.oldValue && null !== input.oldValue || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.oldValue
            })) && $ao2(input.oldValue, _path + ".oldValue", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".oldValue",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.oldValue
            })) && (null === input.value || ("object" === typeof input.value && null !== input.value || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.value
            })) && $ao2(input.value, _path + ".value", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".value",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.value
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["action", "userId", "date", "oldValue", "value"].some((prop: any) => key === prop))
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
                        expected: "(DTOModelRecord<default, \"deadline\" | \"creationTime\" | \"placingInBinTime\", FirebaseFirestore.Timestamp> | DTOModelRecord<default, \"notes\", __type> | DTOModelRecord<default, \"objectives\", __type> | DTOModelRecord<default, \"storyPoints\", number> | DTOModelRecord<default, \"title\" | \"description\", string>)",
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
export default validateGoalHistoryDTO;
