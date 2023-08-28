import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import typia from "typia";
const validateWorkspaceSummary = (input: any): WorkspaceSummary => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceSummary => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && ("object" === typeof input.summaryModificationTime && null !== input.summaryModificationTime && $io1(input.summaryModificationTime, true && _exceptionable)) && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "summaryModificationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
            })) && (("object" === typeof input.summaryModificationTime && null !== input.summaryModificationTime || $guard(_exceptionable, {
                path: _path + ".summaryModificationTime",
                expected: "Timestamp",
                value: input.summaryModificationTime
            })) && $ao1(input.summaryModificationTime, _path + ".summaryModificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".summaryModificationTime",
                expected: "Timestamp",
                value: input.summaryModificationTime
            })) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Timestamp | null)",
                value: input.placingInBinTime
            })) && $ao1(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Timestamp | null)",
                value: input.placingInBinTime
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "summaryModificationTime", "placingInBinTime"].some((prop: any) => key === prop))
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
