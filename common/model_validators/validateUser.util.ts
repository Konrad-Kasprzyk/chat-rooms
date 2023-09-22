import User from "common/models/user.model";
import typia from "typia";
const validateUser = (input: any): User => {
    const __is = (input: any, _exceptionable: boolean = true): input is User => {
        const $is_email = (typia.createAssertEquals as any).is_email;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && $is_email(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io1(input.modificationTime, true && _exceptionable)) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "modificationTime"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is User => {
            const $guard = (typia.createAssertEquals as any).guard;
            const $is_email = (typia.createAssertEquals as any).is_email;
            const $join = (typia.createAssertEquals as any).join;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string (@minLength 1)",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("string" === typeof input.email && ($is_email(input.email) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string (@format email)",
                value: input.email
            })) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string",
                value: input.email
            })) && ("string" === typeof input.username || $guard(_exceptionable, {
                path: _path + ".username",
                expected: "string",
                value: input.username
            })) && ((Array.isArray(input.workspaceIds) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string>",
                value: input.workspaceIds
            })) && input.workspaceIds.every((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index1 + "]",
                expected: "string (@minLength 1)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index1 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string>",
                value: input.workspaceIds
            })) && ((Array.isArray(input.workspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string>",
                value: input.workspaceInvitationIds
            })) && input.workspaceInvitationIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index2 + "]",
                expected: "string (@minLength 1)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index2 + "]",
                expected: "string",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string>",
                value: input.workspaceInvitationIds
            })) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && $ao1(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Timestamp",
                value: input.modificationTime
            })) && (6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "modificationTime"].some((prop: any) => key === prop))
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
export default validateUser;
