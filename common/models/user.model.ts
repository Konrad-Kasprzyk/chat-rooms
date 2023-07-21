import typia from "typia";
export default interface User {
    /**
     * @minLength 1
     */
    id: string;
    /**
     * Used in completed tasks stats.
     * @minLength 1
     */
    shortId: string;
    /**
     * @format email
     */
    email: string;
    username: string;
    workspaces: {
        /**
         * @minLength 1
         */
        id: string;
        /**
         * @minLength 1
         */
        url: string;
        /**
         * @minLength 1
         */
        title: string;
        description: string;
    }[];
    /**
     * @minLength 1
     */
    workspaceIds: string[];
    workspaceInvitations: {
        /**
         * @minLength 1
         */
        id: string;
        /**
         * @minLength 1
         */
        url: string;
        /**
         * @minLength 1
         */
        title: string;
        description: string;
    }[];
    /**
     * @minLength 1
     */
    workspaceInvitationIds: string[];
}
export const validateUser = (input: any): typia.IValidation<User> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is User => {
        const $is_email = (typia.createValidateEquals as any).is_email;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.shortId && 1 <= input.shortId.length) && ("string" === typeof input.email && $is_email(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaces) && input.workspaces.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitations) && input.workspaceInvitations.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index4: number) => "string" === typeof elem && 1 <= elem.length)) && (8 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "shortId", "email", "username", "workspaces", "workspaceIds", "workspaceInvitations", "workspaceInvitationIds"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (4 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is User => {
            const $is_email = (typia.createValidateEquals as any).is_email;
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.shortId && (1 <= input.shortId.length || $report(_exceptionable, {
                    path: _path + ".shortId",
                    expected: "string (@minLength 1)",
                    value: input.shortId
                })) || $report(_exceptionable, {
                    path: _path + ".shortId",
                    expected: "string",
                    value: input.shortId
                }), "string" === typeof input.email && ($is_email(input.email) || $report(_exceptionable, {
                    path: _path + ".email",
                    expected: "string (@format email)",
                    value: input.email
                })) || $report(_exceptionable, {
                    path: _path + ".email",
                    expected: "string",
                    value: input.email
                }), "string" === typeof input.username || $report(_exceptionable, {
                    path: _path + ".username",
                    expected: "string",
                    value: input.username
                }), (Array.isArray(input.workspaces) || $report(_exceptionable, {
                    path: _path + ".workspaces",
                    expected: "Array<__type>",
                    value: input.workspaces
                })) && input.workspaces.map((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".workspaces[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })) && $vo1(elem, _path + ".workspaces[" + _index1 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".workspaces[" + _index1 + "]",
                    expected: "__type",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".workspaces",
                    expected: "Array<__type>",
                    value: input.workspaces
                }), (Array.isArray(input.workspaceIds) || $report(_exceptionable, {
                    path: _path + ".workspaceIds",
                    expected: "Array<string>",
                    value: input.workspaceIds
                })) && input.workspaceIds.map((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".workspaceIds[" + _index2 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".workspaceIds[" + _index2 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".workspaceIds",
                    expected: "Array<string>",
                    value: input.workspaceIds
                }), (Array.isArray(input.workspaceInvitations) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitations",
                    expected: "Array<__type>.o1",
                    value: input.workspaceInvitations
                })) && input.workspaceInvitations.map((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $report(_exceptionable, {
                    path: _path + ".workspaceInvitations[" + _index3 + "]",
                    expected: "__type.o1",
                    value: elem
                })) && $vo2(elem, _path + ".workspaceInvitations[" + _index3 + "]", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitations[" + _index3 + "]",
                    expected: "__type.o1",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitations",
                    expected: "Array<__type>.o1",
                    value: input.workspaceInvitations
                }), (Array.isArray(input.workspaceInvitationIds) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitationIds",
                    expected: "Array<string>",
                    value: input.workspaceInvitationIds
                })) && input.workspaceInvitationIds.map((elem: any, _index4: number) => "string" === typeof elem && (1 <= elem.length || $report(_exceptionable, {
                    path: _path + ".workspaceInvitationIds[" + _index4 + "]",
                    expected: "string (@minLength 1)",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitationIds[" + _index4 + "]",
                    expected: "string",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".workspaceInvitationIds",
                    expected: "Array<string>",
                    value: input.workspaceInvitationIds
                }), 8 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "shortId", "email", "username", "workspaces", "workspaceIds", "workspaceInvitations", "workspaceInvitationIds"].some((prop: any) => key === prop))
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
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.url && (1 <= input.url.length || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string (@minLength 1)",
                    value: input.url
                })) || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), "string" === typeof input.title && (1 <= input.title.length || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string (@minLength 1)",
                    value: input.title
                })) || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string",
                    value: input.title
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "url", "title", "description"].some((prop: any) => key === prop))
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
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.id && (1 <= input.id.length || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string (@minLength 1)",
                    value: input.id
                })) || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "string",
                    value: input.id
                }), "string" === typeof input.url && (1 <= input.url.length || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string (@minLength 1)",
                    value: input.url
                })) || $report(_exceptionable, {
                    path: _path + ".url",
                    expected: "string",
                    value: input.url
                }), "string" === typeof input.title && (1 <= input.title.length || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string (@minLength 1)",
                    value: input.title
                })) || $report(_exceptionable, {
                    path: _path + ".title",
                    expected: "string",
                    value: input.title
                }), "string" === typeof input.description || $report(_exceptionable, {
                    path: _path + ".description",
                    expected: "string",
                    value: input.description
                }), 4 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["id", "url", "title", "description"].some((prop: any) => key === prop))
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
