import { Timestamp } from "firebase/firestore";
import typia from "typia";
export default interface Norm {
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
    startDay: Timestamp;
    endDay: Timestamp;
    description: string;
    usersNorm: {
        /**
         * @minLength 1
         */
        userId: string;
        /**
         * @type int
         * @minimum 0
         */
        capacityPercentage: number;
        capacityExplanation: string;
        included: boolean;
    }[];
    /**
     * @minLength 1
     */
    authorId: string;
    /**
     * @type int
     * @minimum 0
     */
    storyPoints: number;
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
export const validateNorm = (input: any): typia.IValidation<Norm> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is Norm => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.workspaceId && 1 <= input.workspaceId.length) && ("number" === typeof input.searchId && parseInt(input.searchId) === input.searchId && 1 <= input.searchId) && ("object" === typeof input.startDay && null !== input.startDay && $io1(input.startDay, true && _exceptionable)) && ("object" === typeof input.endDay && null !== input.endDay && $io1(input.endDay, true && _exceptionable)) && "string" === typeof input.description && (Array.isArray(input.usersNorm) && input.usersNorm.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("string" === typeof input.authorId && 1 <= input.authorId.length) && ("number" === typeof input.storyPoints && parseInt(input.storyPoints) === input.storyPoints && 0 <= input.storyPoints) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (12 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "workspaceId", "searchId", "startDay", "endDay", "description", "usersNorm", "authorId", "storyPoints", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.userId && 1 <= input.userId.length && ("number" === typeof input.capacityPercentage && parseInt(input.capacityPercentage) === input.capacityPercentage && 0 <= input.capacityPercentage) && "string" === typeof input.capacityExplanation && "boolean" === typeof input.included && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["userId", "capacityPercentage", "capacityExplanation", "included"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is Norm => {
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
                }), ("object" === typeof input.startDay && null !== input.startDay || $report(_exceptionable, {
                    path: _path + ".startDay",
                    expected: "Timestamp",
                    value: input.startDay
                })) && $vo1(input.startDay, _path + ".startDay", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".startDay",
                    expected: "Timestamp",
                    value: input.startDay
                }), ("object" === typeof input.endDay && null !== input.endDay || $report(_exceptionable, {
                    path: _path + ".endDay",
                    expected: "Timestamp",
                    value: input.endDay
                })) && $vo1(input.endDay, _path + ".endDay", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".endDay",
                    expected: "Timestamp",
                    value: input.endDay
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), (Array.isArray(input.usersNorm) || $report(_exceptionable, {
                    path: _path + ".usersNorm",
                    expected: "Array<__type>",
                    value: input.usersNorm
                })) && input.usersNorm.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".usersNorm[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo2(elem, _path + ".usersNorm[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".usersNorm[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".usersNorm",
                    expected: "Array<__type>",
                    value: input.usersNorm
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
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo1(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
                }), 12 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "workspaceId", "searchId", "startDay", "endDay", "description", "usersNorm", "authorId", "storyPoints", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.userId && (1 <= input.userId.length || $report(_exceptionable, {
                    path: _path + ".userId",
                    expected: "string (@minLength 1)",
                    value: input.userId
                })) || $report(_exceptionable, {
                    path: _path + ".userId",
                    expected: "string",
                    value: input.userId
                }), "number" === typeof input.capacityPercentage && (parseInt(input.capacityPercentage) === input.capacityPercentage || $report(_exceptionable, {
                    path: _path + ".capacityPercentage",
                    expected: "number (@type int)",
                    value: input.capacityPercentage
                })) && (0 <= input.capacityPercentage || $report(_exceptionable, {
                    path: _path + ".capacityPercentage",
                    expected: "number (@minimum 0)",
                    value: input.capacityPercentage
                })) || $report(_exceptionable, {
                    path: _path + ".capacityPercentage",
                    expected: "number",
                    value: input.capacityPercentage
                }), "string" === typeof input.capacityExplanation || $report(_exceptionable, {
                    path: _path + ".capacityExplanation",
                    expected: "string",
                    value: input.capacityExplanation
                }), "boolean" === typeof input.included || $report(_exceptionable, {
                    path: _path + ".included",
                    expected: "boolean",
                    value: input.included
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["userId", "capacityPercentage", "capacityExplanation", "included"].some((prop: any) => key === prop))
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
