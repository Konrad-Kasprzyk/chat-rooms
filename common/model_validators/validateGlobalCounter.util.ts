import GlobalCounter from "common/models/globalCounter.model";
import typia from "typia";
const validateGlobalCounter = (input: any): typia.IValidation<GlobalCounter> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is GlobalCounter => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.nextUserShortId && 1 <= input.nextUserShortId.length) && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "nextUserShortId"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is GlobalCounter => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.nextUserShortId && (1 <= input.nextUserShortId.length || $report(_exceptionable, {
                    path: _path + ".nextUserShortId",
                    expected: "string (@minLength 1)",
                    value: input.nextUserShortId
                })) || $report(_exceptionable, {
                    path: _path + ".nextUserShortId",
                    expected: "string",
                    value: input.nextUserShortId
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "nextUserShortId"].some((prop: any) => key === prop))
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
export default validateGlobalCounter;
