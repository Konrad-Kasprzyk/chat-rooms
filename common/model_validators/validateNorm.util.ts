import Norm from "common/models/norm.model";
import typia from "typia";
const validateNorm = (input: any): Norm => {
    const __is = (input: any, _exceptionable: boolean = true): input is Norm => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && "string" === typeof input.description && ("object" === typeof input.startDay && null !== input.startDay && $io1(input.startDay, true && _exceptionable)) && ("object" === typeof input.endDay && null !== input.endDay && $io1(input.endDay, true && _exceptionable)) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && (Array.isArray(input.usersNorm) && input.usersNorm.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io1(input.modificationTime, true && _exceptionable)) && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (11 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "description", "startDay", "endDay", "authorId", "storyPoints", "usersNorm", "modificationTime", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && "boolean" === typeof input.included && ("number" === typeof input.capacityPercentage && parseInt(input.capacityPercentage) === input.capacityPercentage && 0 <= input.capacityPercentage) && "string" === typeof input.capacityExplanation && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "included", "capacityPercentage", "capacityExplanation"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is Norm => {
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
            })) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            })) && (("object" === typeof input.startDay && null !== input.startDay || $guard(_exceptionable, {
                path: _path + ".startDay",
                expected: "Timestamp",
                value: input.startDay
            })) && $ao1(input.startDay, _path + ".startDay", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".startDay",
                expected: "Timestamp",
                value: input.startDay
            })) && (("object" === typeof input.endDay && null !== input.endDay || $guard(_exceptionable, {
                path: _path + ".endDay",
                expected: "Timestamp",
                value: input.endDay
            })) && $ao1(input.endDay, _path + ".endDay", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".endDay",
                expected: "Timestamp",
                value: input.endDay
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
            })) && ((Array.isArray(input.usersNorm) || $guard(_exceptionable, {
                path: _path + ".usersNorm",
                expected: "Array<__type>",
                value: input.usersNorm
            })) && input.usersNorm.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".usersNorm[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) && $ao2(elem, _path + ".usersNorm[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".usersNorm[" + _index1 + "]",
                expected: "__type",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".usersNorm",
                expected: "Array<__type>",
                value: input.usersNorm
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && $ao1(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Timestamp | null)",
                value: input.placingInBinTime
            })) && $ao1(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
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
            })) && (11 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "workspaceId", "description", "startDay", "endDay", "authorId", "storyPoints", "usersNorm", "modificationTime", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.userId && (1 <= input.userId.length || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string (@minLength 1)",
                value: input.userId
            })) || $guard(_exceptionable, {
                path: _path + ".userId",
                expected: "string",
                value: input.userId
            })) && ("boolean" === typeof input.included || $guard(_exceptionable, {
                path: _path + ".included",
                expected: "boolean",
                value: input.included
            })) && ("number" === typeof input.capacityPercentage && (parseInt(input.capacityPercentage) === input.capacityPercentage || $guard(_exceptionable, {
                path: _path + ".capacityPercentage",
                expected: "number (@type int)",
                value: input.capacityPercentage
            })) && (0 <= input.capacityPercentage || $guard(_exceptionable, {
                path: _path + ".capacityPercentage",
                expected: "number (@minimum 0)",
                value: input.capacityPercentage
            })) || $guard(_exceptionable, {
                path: _path + ".capacityPercentage",
                expected: "number",
                value: input.capacityPercentage
            })) && ("string" === typeof input.capacityExplanation || $guard(_exceptionable, {
                path: _path + ".capacityExplanation",
                expected: "string",
                value: input.capacityExplanation
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["userId", "included", "capacityPercentage", "capacityExplanation"].some((prop: any) => key === prop))
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
export default validateNorm;
