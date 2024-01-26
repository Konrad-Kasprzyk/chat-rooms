import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";
import typia from "typia";
const validateWorkspaceCounterDTO = (input: any): WorkspaceCounterDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceCounterDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("number" === typeof input.nextTaskUrlNumber && (Math.floor(input.nextTaskUrlNumber) === input.nextTaskUrlNumber && -2147483648 <= input.nextTaskUrlNumber && input.nextTaskUrlNumber <= 2147483647 && 1 <= input.nextTaskUrlNumber)) && ("number" === typeof input.nextGoalUrlNumber && (Math.floor(input.nextGoalUrlNumber) === input.nextGoalUrlNumber && -2147483648 <= input.nextGoalUrlNumber && input.nextGoalUrlNumber <= 2147483647 && 1 <= input.nextGoalUrlNumber)) && (null === input.scriptTimestamp || "object" === typeof input.scriptTimestamp && null !== input.scriptTimestamp && $io1(input.scriptTimestamp, true && _exceptionable)) && (Array.isArray(input.columnsReorganization) && input.columnsReorganization.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && (null === input.goalIndexesReorganizationTime || "object" === typeof input.goalIndexesReorganizationTime && null !== input.goalIndexesReorganizationTime && $io1(input.goalIndexesReorganizationTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "nextTaskUrlNumber", "nextGoalUrlNumber", "scriptTimestamp", "columnsReorganization", "goalIndexesReorganizationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.columnId && (null === input.taskIndexesReorganizationTime || "object" === typeof input.taskIndexesReorganizationTime && null !== input.taskIndexesReorganizationTime && $io1(input.taskIndexesReorganizationTime, true && _exceptionable)) && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["columnId", "taskIndexesReorganizationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceCounterDTO => {
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
            })) && ("number" === typeof input.nextTaskUrlNumber && (Math.floor(input.nextTaskUrlNumber) === input.nextTaskUrlNumber && -2147483648 <= input.nextTaskUrlNumber && input.nextTaskUrlNumber <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextTaskUrlNumber",
                expected: "number & Type<\"int32\">",
                value: input.nextTaskUrlNumber
            })) && (1 <= input.nextTaskUrlNumber || $guard(_exceptionable, {
                path: _path + ".nextTaskUrlNumber",
                expected: "number & Minimum<1>",
                value: input.nextTaskUrlNumber
            })) || $guard(_exceptionable, {
                path: _path + ".nextTaskUrlNumber",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextTaskUrlNumber
            })) && ("number" === typeof input.nextGoalUrlNumber && (Math.floor(input.nextGoalUrlNumber) === input.nextGoalUrlNumber && -2147483648 <= input.nextGoalUrlNumber && input.nextGoalUrlNumber <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".nextGoalUrlNumber",
                expected: "number & Type<\"int32\">",
                value: input.nextGoalUrlNumber
            })) && (1 <= input.nextGoalUrlNumber || $guard(_exceptionable, {
                path: _path + ".nextGoalUrlNumber",
                expected: "number & Minimum<1>",
                value: input.nextGoalUrlNumber
            })) || $guard(_exceptionable, {
                path: _path + ".nextGoalUrlNumber",
                expected: "(number & Type<\"int32\"> & Minimum<1>)",
                value: input.nextGoalUrlNumber
            })) && (null === input.scriptTimestamp || ("object" === typeof input.scriptTimestamp && null !== input.scriptTimestamp || $guard(_exceptionable, {
                path: _path + ".scriptTimestamp",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.scriptTimestamp
            })) && $ao1(input.scriptTimestamp, _path + ".scriptTimestamp", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".scriptTimestamp",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.scriptTimestamp
            })) && ((Array.isArray(input.columnsReorganization) || $guard(_exceptionable, {
                path: _path + ".columnsReorganization",
                expected: "Array<__type>",
                value: input.columnsReorganization
            })) && input.columnsReorganization.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".columnsReorganization[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) && $ao2(elem, _path + ".columnsReorganization[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columnsReorganization[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".columnsReorganization",
                expected: "Array<__type>",
                value: input.columnsReorganization
            })) && (null === input.goalIndexesReorganizationTime || ("object" === typeof input.goalIndexesReorganizationTime && null !== input.goalIndexesReorganizationTime || $guard(_exceptionable, {
                path: _path + ".goalIndexesReorganizationTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.goalIndexesReorganizationTime
            })) && $ao1(input.goalIndexesReorganizationTime, _path + ".goalIndexesReorganizationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".goalIndexesReorganizationTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.goalIndexesReorganizationTime
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "nextTaskUrlNumber", "nextGoalUrlNumber", "scriptTimestamp", "columnsReorganization", "goalIndexesReorganizationTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.columnId || $guard(_exceptionable, {
                path: _path + ".columnId",
                expected: "string",
                value: input.columnId
            })) && (null === input.taskIndexesReorganizationTime || ("object" === typeof input.taskIndexesReorganizationTime && null !== input.taskIndexesReorganizationTime || $guard(_exceptionable, {
                path: _path + ".taskIndexesReorganizationTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.taskIndexesReorganizationTime
            })) && $ao1(input.taskIndexesReorganizationTime, _path + ".taskIndexesReorganizationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".taskIndexesReorganizationTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.taskIndexesReorganizationTime
            })) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["columnId", "taskIndexesReorganizationTime"].some((prop: any) => key === prop))
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
export default validateWorkspaceCounterDTO;
