import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import typia from "typia";
const validateWorkspaceSummary = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): WorkspaceSummary => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceSummary => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserIds) && input.invitedUserIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && input.modificationTime instanceof Date && input.creationTime instanceof Date && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (9 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "userIds", "invitedUserIds", "modificationTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
                expected: "string & MinLength<1>",
                value: input.id
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.url && (1 <= input.url.length || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "string & MinLength<1>",
                value: input.url
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "(string & MinLength<1>)",
                value: input.url
            }, errorFactory)) && ("string" === typeof input.title && (1 <= input.title.length || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string & MinLength<1>",
                value: input.title
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "(string & MinLength<1>)",
                value: input.title
            }, errorFactory)) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            }, errorFactory)) && ((Array.isArray(input.userIds) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            }, errorFactory)) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            }, errorFactory)) && ((Array.isArray(input.invitedUserIds) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds",
                expected: "Array<string & MinLength<1>>",
                value: input.invitedUserIds
            }, errorFactory)) && input.invitedUserIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".invitedUserIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserIds",
                expected: "Array<string & MinLength<1>>",
                value: input.invitedUserIds
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            }, errorFactory)) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            }, errorFactory)) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            }, errorFactory)) && (9 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "userIds", "invitedUserIds", "modificationTime", "creationTime", "placingInBinTime"].some((prop: any) => key === prop))
                    return true;
                const value = input[key];
                if (undefined === value)
                    return true;
                return $guard(_exceptionable, {
                    path: _path + $join(key),
                    expected: "undefined",
                    value: value
                }, errorFactory);
            })));
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "default",
                value: input
            }, errorFactory);
        })(input, "$input", true);
    return input;
};
export default validateWorkspaceSummary;
