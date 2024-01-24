import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import typia from "typia";
const validateUserDetailsDTO = (input: any): UserDetailsDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is UserDetailsDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && (Array.isArray(input.hiddenWorkspaceInvitationIds) && input.hiddenWorkspaceInvitationIds.every((elem: any, _index1: number) => "string" === typeof elem)) && "boolean" === typeof input.isDeleted && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "hiddenWorkspaceInvitationIds", "isDeleted"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is UserDetailsDTO => {
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
            })) && ("boolean" === typeof input.isDeleted || $guard(_exceptionable, {
                path: _path + ".isDeleted",
                expected: "boolean",
                value: input.isDeleted
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "hiddenWorkspaceInvitationIds", "isDeleted"].some((prop: any) => key === prop))
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
export default validateUserDetailsDTO;
