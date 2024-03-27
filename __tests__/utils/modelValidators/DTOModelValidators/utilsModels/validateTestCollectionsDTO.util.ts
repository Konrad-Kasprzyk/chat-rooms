import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";
import typia from "typia";
export const validateTestCollectionsDTO = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): TestCollectionsDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is TestCollectionsDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.testsId && 1 <= input.testsId.length) && (null === input.signedInTestUserId || "string" === typeof input.signedInTestUserId && 1 <= input.signedInTestUserId.length) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "testsId", "signedInTestUserId"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is TestCollectionsDTO => {
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
            }, errorFactory)) && ("string" === typeof input.testsId && (1 <= input.testsId.length || $guard(_exceptionable, {
                path: _path + ".testsId",
                expected: "string & MinLength<1>",
                value: input.testsId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".testsId",
                expected: "(string & MinLength<1>)",
                value: input.testsId
            }, errorFactory)) && (null === input.signedInTestUserId || "string" === typeof input.signedInTestUserId && (1 <= input.signedInTestUserId.length || $guard(_exceptionable, {
                path: _path + ".signedInTestUserId",
                expected: "string & MinLength<1>",
                value: input.signedInTestUserId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".signedInTestUserId",
                expected: "((string & MinLength<1>) | null)",
                value: input.signedInTestUserId
            }, errorFactory)) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "testsId", "signedInTestUserId"].some((prop: any) => key === prop))
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
export default validateTestCollectionsDTO;
