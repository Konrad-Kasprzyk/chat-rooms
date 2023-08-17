import MIN_COLUMN_COUNT from "common/constants/minColumnCount.constant";
import Workspace from "common/models/workspace_models/workspace.model";
import typia from "typia";
/**
 * Assert that hardcoded '@minItems 2' used in columns property of Workspace model is valid.
 * Used number '2' should equal MIN_COLUMN_COUNT constant.
 */
((input: any): { MIN_COLUMN_COUNT: 2 } => {
    const __is = (input: any): input is { MIN_COLUMN_COUNT: 2 } => {
        const $io0 = (input: any): boolean => 2 === input.MIN_COLUMN_COUNT;
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is { MIN_COLUMN_COUNT: 2 } => {
            const $guard = (typia.assert as any).guard;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => 2 === input.MIN_COLUMN_COUNT || $guard(_exceptionable, {
                path: _path + ".MIN_COLUMN_COUNT",
                expected: "2",
                value: input.MIN_COLUMN_COUNT
            });
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            })) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            });
        })(input, "$input", true);
    return input;
})({ MIN_COLUMN_COUNT });
const validateWorkspace = (input: any): typia.IValidation<Workspace> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is Workspace => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserIds) && input.invitedUserIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.columns) && 2 <= input.columns.length && input.columns.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && (Array.isArray(input.labels) && input.labels.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable))) && ("string" === typeof input.counterId && 1 <= input.counterId.length) && "boolean" === typeof input.hasItemsInBin && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io2(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (13 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "userIds", "invitedUserIds", "columns", "labels", "counterId", "hasItemsInBin", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && "boolean" === typeof input.taskFinishColumn && (null === input.replacedByColumnId || "string" === typeof input.replacedByColumnId && 1 <= input.replacedByColumnId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io2(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "taskFinishColumn", "replacedByColumnId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (null === input.replacedByLabelId || "string" === typeof input.replacedByLabelId && 1 <= input.replacedByLabelId.length) && "boolean" === typeof input.inRecycleBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io2(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (7 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color", "replacedByLabelId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is Workspace => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.url && (1 <= input.url.length || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string (@minLength 1)",
                    value: input.url
                })) || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
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
                }), (Array.isArray(input.userIds) || $report(_exceptionable, {
                    path: _path + ".userIds",
                    expected: "Array<string>",
                    value: input.userIds
                })) && input.userIds.map((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".userIds[" + _index1 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".userIds[" + _index1 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".userIds",
                    expected: "Array<string>",
                    value: input.userIds
                }), (Array.isArray(input.invitedUserIds) || $report(_exceptionable, {
                    path: _path + ".invitedUserIds",
                    expected: "Array<string>",
                    value: input.invitedUserIds
                })) && input.invitedUserIds.map((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".invitedUserIds[" + _index2 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".invitedUserIds[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".invitedUserIds",
                    expected: "Array<string>",
                    value: input.invitedUserIds
                }), (Array.isArray(input.columns) && (2 <= input.columns.length || $report(_exceptionable, {
                    path: _path + ".columns",
                    expected: "Array.length (@minItems 2)",
                    value: input.columns
                })) || $report(_exceptionable, {
                    path: _path + ".columns",
                    expected: "Array<default>",
                    value: input.columns
                })) && input.columns.map((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".columns[" + _index3 + "]",
                    expected: "default.o1",
                    value: elem
                })) && $vo1(elem, _path + ".columns[" + _index3 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".columns[" + _index3 + "]",
                    expected: "default.o1",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".columns",
                    expected: "Array<default>",
                    value: input.columns
                }), (Array.isArray(input.labels) || $report(_exceptionable, {
                    path: _path + ".labels",
                    expected: "Array<default>.o1",
                    value: input.labels
                })) && input.labels.map((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".labels[" + _index4 + "]",
                    expected: "default.o2",
                    value: elem
                })) && $vo3(elem, _path + ".labels[" + _index4 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".labels[" + _index4 + "]",
                    expected: "default.o2",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".labels",
                    expected: "Array<default>.o1",
                    value: input.labels
                }), "string" === typeof input.counterId && (1 <= input.counterId.length || $report(_exceptionable, {
                    path: _path + ".counterId",
                    expected: "string (@minLength 1)",
                    value: input.counterId
                })) || $report(_exceptionable, {
                    path: _path + ".counterId",
                    expected: "string",
                    value: input.counterId
                }), "boolean" === typeof input.hasItemsInBin || $report(_exceptionable, {
                    path: _path + ".hasItemsInBin",
                    expected: "boolean",
                    value: input.hasItemsInBin
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo2(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
                }), 13 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "url", "title", "description", "userIds", "invitedUserIds", "columns", "labels", "counterId", "hasItemsInBin", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
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
                })) && $vo2(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["number" === typeof input.seconds || $report(_exceptionable, {
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
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
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
                }), "DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color || $report(_exceptionable, {
                    path: _path + ".color",
                    expected: "(\"Blue\" | \"BlueViolet\" | \"Brown\" | \"Chocolate\" | \"Coral\" | \"Crimson\" | \"Cyan\" | \"DarkCyan\" | \"DarkGrey\" | \"DarkRed\" | \"DarkSlateGrey\" | \"DeepPink\" | \"DodgerBlue\" | \"Goldenrod\" | \"Green\" | \"GreenYellow\" | \"Grey\" | \"HotPink\" | \"Indigo\" | \"LightCoral\" | \"LightSalmon\" | \"LimeGreen\" | \"Maroon\" | \"OrangeRed\" | \"Purple\" | \"RosyBrown\" | \"SeaGreen\" | \"Snow\" | \"Yellow\")",
                    value: input.color
                }), null === input.replacedByLabelId || "string" === typeof input.replacedByLabelId && (1 <= input.replacedByLabelId.length || $report(_exceptionable, {
                    path: _path + ".replacedByLabelId",
                    expected: "string (@minLength 1)",
                    value: input.replacedByLabelId
                })) || $report(_exceptionable, {
                    path: _path + ".replacedByLabelId",
                    expected: "(null | string)",
                    value: input.replacedByLabelId
                }), "boolean" === typeof input.inRecycleBin || $report(_exceptionable, {
                    path: _path + ".inRecycleBin",
                    expected: "boolean",
                    value: input.inRecycleBin
                }), null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $report(_exceptionable, {
                    path: _path + ".placingInBinTime",
                    expected: "(Timestamp | null)",
                    value: input.placingInBinTime
                })) && $vo2(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $report(_exceptionable, {
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
                    if (["id", "name", "color", "replacedByLabelId", "inRecycleBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
export default validateWorkspace;
