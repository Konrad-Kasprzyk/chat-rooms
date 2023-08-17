import TestCollections from "common/models/utils_models/testCollections.model";
import typia from "typia";
export const validateTestCollections = (input: any): typia.IValidation<TestCollections> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is TestCollections => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.testsId && 1 <= input.testsId.length) && (null === input.signedInTestUserId || "string" === typeof input.signedInTestUserId && 1 <= input.signedInTestUserId.length) && ("string" === typeof input.requiredAuthenticatedUserId && 1 <= input.requiredAuthenticatedUserId.length) && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "testsId", "signedInTestUserId", "requiredAuthenticatedUserId"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is TestCollections => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.testsId && (1 <= input.testsId.length || $report(_exceptionable, {
                    path: _path + ".testsId",
                    expected: "string (@minLength 1)",
                    value: input.testsId
                })) || $report(_exceptionable, {
                    path: _path + ".testsId",
                    expected: "string",
                    value: input.testsId
                }), null === input.signedInTestUserId || "string" === typeof input.signedInTestUserId && (1 <= input.signedInTestUserId.length || $report(_exceptionable, {
                    path: _path + ".signedInTestUserId",
                    expected: "string (@minLength 1)",
                    value: input.signedInTestUserId
                })) || $report(_exceptionable, {
                    path: _path + ".signedInTestUserId",
                    expected: "(null | string)",
                    value: input.signedInTestUserId
                }), "string" === typeof input.requiredAuthenticatedUserId && (1 <= input.requiredAuthenticatedUserId.length || $report(_exceptionable, {
                    path: _path + ".requiredAuthenticatedUserId",
                    expected: "string (@minLength 1)",
                    value: input.requiredAuthenticatedUserId
                })) || $report(_exceptionable, {
                    path: _path + ".requiredAuthenticatedUserId",
                    expected: "string",
                    value: input.requiredAuthenticatedUserId
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "testsId", "signedInTestUserId", "requiredAuthenticatedUserId"].some((prop: any) => key === prop))
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
export default validateTestCollections;
