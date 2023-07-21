import { Timestamp } from "firebase/firestore";
import typia from "typia";
export default interface Column {
    /**
     * @minLength 1
     */
    id: string;
    name: string;
    taskFinishColumn: boolean;
    /**
     * @minLength 1
     */
    replacedByColumnId: string | null;
    inRecycleBin: boolean;
    placingInBinTime: Timestamp | null;
    /**
     * @minLength 1
     */
    insertedIntoBinByUserId: string | null;
}
export const validateColumn = (input: any): typia.IValidation<Column> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is Column => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && "boolean" === typeof input.taskFinishColumn && (null === input.replacedByColumnId || "string" === typeof input.replacedByColumnId && 1 <= input.replacedByColumnId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "taskFinishColumn", "replacedByColumnId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is Column => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.name || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string",
                    value: input.name
                }), "boolean" === typeof input.taskFinishColumn || $report(_exceptionable, {
                    path: _path + ".taskFinishColumn",
                    expected: "boolean",
                    value: input.taskFinishColumn
                }), null === input.replacedByColumnId || "string" === typeof input.replacedByColumnId && (1 <= input.replacedByColumnId.length || $report(_exceptionable, {
                    path: _path + ".replacedByColumnId",
                    expected: "string (@minLength 1)",
                    value: input.replacedByColumnId
                })) || $report(_exceptionable, {
                    path: _path + ".replacedByColumnId",
                    expected: "(null | string)",
                    value: input.replacedByColumnId
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
                }), 7 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "name", "taskFinishColumn", "replacedByColumnId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
