import UserDetails from "common/clientModels/userDetails.model";
import typia from "typia";
const validateUserDetails = (input: any): UserDetails => {
    const __is = (input: any, _exceptionable: boolean = true): input is UserDetails => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && (Array.isArray(input.hiddenWorkspaceInvitationIds) && input.hiddenWorkspaceInvitationIds.every((elem: any, _index1: number) => "string" === typeof elem)) && (Array.isArray(input.linkedUserDocumentIds) && input.linkedUserDocumentIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && ("string" === typeof input.mainUserId && 1 <= input.mainUserId.length) && (null === input.botNumber || "number" === typeof input.botNumber && (Math.floor(input.botNumber) === input.botNumber && -2147483648 <= input.botNumber && input.botNumber <= 2147483647 && 0 <= input.botNumber)) && (5 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "hiddenWorkspaceInvitationIds", "linkedUserDocumentIds", "mainUserId", "botNumber"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is UserDetails => {
            const $guard = (typia.createAssertEquals as any).guard;
            const $join = (typia.createAssertEquals as any).join;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ((Array.isArray(input.hiddenWorkspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".hiddenWorkspaceInvitationIds",
                expected: "Array<string>",
                value: input.hiddenWorkspaceInvitationIds
            })) && input.hiddenWorkspaceInvitationIds.every((elem: any, _index1: number) => "string" === typeof elem || $guard(_exceptionable, {
                path: _path + ".hiddenWorkspaceInvitationIds[" + _index1 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".hiddenWorkspaceInvitationIds",
                expected: "Array<string>",
                value: input.hiddenWorkspaceInvitationIds
            })) && ((Array.isArray(input.linkedUserDocumentIds) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds",
                expected: "Array<string & MinLength<1>>",
                value: input.linkedUserDocumentIds
            })) && input.linkedUserDocumentIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".linkedUserDocumentIds",
                expected: "Array<string & MinLength<1>>",
                value: input.linkedUserDocumentIds
            })) && ("string" === typeof input.mainUserId && (1 <= input.mainUserId.length || $guard(_exceptionable, {
                path: _path + ".mainUserId",
                expected: "string & MinLength<1>",
                value: input.mainUserId
            })) || $guard(_exceptionable, {
                path: _path + ".mainUserId",
                expected: "(string & MinLength<1>)",
                value: input.mainUserId
            })) && (null === input.botNumber || "number" === typeof input.botNumber && (Math.floor(input.botNumber) === input.botNumber && -2147483648 <= input.botNumber && input.botNumber <= 2147483647 || $guard(_exceptionable, {
                path: _path + ".botNumber",
                expected: "number & Type<\"int32\">",
                value: input.botNumber
            })) && (0 <= input.botNumber || $guard(_exceptionable, {
                path: _path + ".botNumber",
                expected: "number & Minimum<0>",
                value: input.botNumber
            })) || $guard(_exceptionable, {
                path: _path + ".botNumber",
                expected: "((number & Type<\"int32\"> & Minimum<0>) | null)",
                value: input.botNumber
            })) && (5 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "hiddenWorkspaceInvitationIds", "linkedUserDocumentIds", "mainUserId", "botNumber"].some((prop: any) => key === prop))
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
export default validateUserDetails;
