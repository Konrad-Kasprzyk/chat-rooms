import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import typia from "typia";
const validateWorkspaceSummary = (input: any): WorkspaceSummary => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceSummary => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserIds) && input.invitedUserIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io1(input.modificationTime, true && _exceptionable)) && ("object" === typeof input.creationTime && null !== input.creationTime && $io1(input.creationTime, true && _exceptionable)) && "boolean" === typeof input.isInBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && (null === input.insertedIntoBinByUserId || "string" === typeof input.insertedIntoBinByUserId && 1 <= input.insertedIntoBinByUserId.length) && (11 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "userIds", "invitedUserIds", "modificationTime", "creationTime", "isInBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceSummary => {
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
            })) && ("string" === typeof input.url && (1 <= input.url.length || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "string (@minLength 1)",
                value: input.url
            })) || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "string",
                value: input.url
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
            })) && ((Array.isArray(input.userIds) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string>",
                value: input.userIds
            })) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
                expected: "string (@minLength 1)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string>",
                value: input.userIds
            })) && ((Array.isArray(input.invitedUserIds) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds",
                expected: "Array<string>",
                value: input.invitedUserIds
            })) && input.invitedUserIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".invitedUserIds[" + _index2 + "]",
                expected: "string (@minLength 1)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds[" + _index2 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds",
                expected: "Array<string>",
                value: input.invitedUserIds
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && $ao1(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && (("object" === typeof input.creationTime && null !== input.creationTime || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Timestamp",
                value: input.creationTime
            })) && $ao1(input.creationTime, _path + ".creationTime", true && _exceptionable) || $guard(_exceptionable, {
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
                if (["id", "url", "title", "description", "userIds", "invitedUserIds", "modificationTime", "creationTime", "isInBin", "placingInBinTime", "insertedIntoBinByUserId"].some((prop: any) => key === prop))
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
export default validateWorkspaceSummary;
