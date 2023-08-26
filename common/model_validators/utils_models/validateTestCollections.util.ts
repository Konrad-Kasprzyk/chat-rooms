import TestCollections from "common/models/utils_models/testCollections.model";
import typia from "typia";
export const validateTestCollections = (input: any): TestCollections => {
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
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is TestCollections => {
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
            })) && ("string" === typeof input.testsId && (1 <= input.testsId.length || $guard(_exceptionable, {
                path: _path + ".testsId",
                expected: "string (@minLength 1)",
                value: input.testsId
            })) || $guard(_exceptionable, {
                path: _path + ".testsId",
                expected: "string",
                value: input.testsId
            })) && (null === input.signedInTestUserId || "string" === typeof input.signedInTestUserId && (1 <= input.signedInTestUserId.length || $guard(_exceptionable, {
                path: _path + ".signedInTestUserId",
                expected: "string (@minLength 1)",
                value: input.signedInTestUserId
            })) || $guard(_exceptionable, {
                path: _path + ".signedInTestUserId",
                expected: "(null | string)",
                value: input.signedInTestUserId
            })) && ("string" === typeof input.requiredAuthenticatedUserId && (1 <= input.requiredAuthenticatedUserId.length || $guard(_exceptionable, {
                path: _path + ".requiredAuthenticatedUserId",
                expected: "string (@minLength 1)",
                value: input.requiredAuthenticatedUserId
            })) || $guard(_exceptionable, {
                path: _path + ".requiredAuthenticatedUserId",
                expected: "string",
                value: input.requiredAuthenticatedUserId
            })) && (4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "testsId", "signedInTestUserId", "requiredAuthenticatedUserId"].some((prop: any) => key === prop))
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
export default validateTestCollections;
