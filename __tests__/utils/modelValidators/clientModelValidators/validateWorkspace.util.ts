import Workspace from "common/clientModels/workspace.model";
import typia from "typia";
const validateWorkspace = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): Workspace => {
    const __is = (input: any, _exceptionable: boolean = true): input is Workspace => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.users) && input.users.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserEmails) && input.invitedUserEmails.every((elem: any, _index3: number) => "string" === typeof elem && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(elem))) && input.modificationTime instanceof Date && input.creationTime instanceof Date && ("string" === typeof input.newestChatHistoryId && 1 <= input.newestChatHistoryId.length) && ("string" === typeof input.newestWorkspaceHistoryId && 1 <= input.newestWorkspaceHistoryId.length) && ("string" === typeof input.newestUsersHistoryId && 1 <= input.newestUsersHistoryId.length) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && (13 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "users", "userIds", "invitedUserEmails", "modificationTime", "creationTime", "newestChatHistoryId", "newestWorkspaceHistoryId", "newestUsersHistoryId", "placingInBinTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index4: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index5: number) => "string" === typeof elem && 1 <= elem.length)) && "boolean" === typeof input.isBotUserDocument && "boolean" === typeof input.isAnonymousAccount && input.modificationTime instanceof Date && (8 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "isAnonymousAccount", "modificationTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is Workspace => {
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
            }, errorFactory)) && ((Array.isArray(input.users) || $guard(_exceptionable, {
                path: _path + ".users",
                expected: "Array<default>",
                value: input.users
            }, errorFactory)) && input.users.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".users[" + _index1 + "]",
                expected: "default.o1",
                value: elem
            }, errorFactory)) && $ao1(elem, _path + ".users[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".users[" + _index1 + "]",
                expected: "default.o1",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".users",
                expected: "Array<default>",
                value: input.users
            }, errorFactory)) && ((Array.isArray(input.userIds) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            }, errorFactory)) && input.userIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            }, errorFactory)) && ((Array.isArray(input.invitedUserEmails) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails",
                expected: "Array<string & Format<\"email\">>",
                value: input.invitedUserEmails
            }, errorFactory)) && input.invitedUserEmails.every((elem: any, _index3: number) => "string" === typeof elem && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(elem) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index3 + "]",
                expected: "string & Format<\"email\">",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index3 + "]",
                expected: "(string & Format<\"email\">)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails",
                expected: "Array<string & Format<\"email\">>",
                value: input.invitedUserEmails
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            }, errorFactory)) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            }, errorFactory)) && ("string" === typeof input.newestChatHistoryId && (1 <= input.newestChatHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestChatHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestChatHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestChatHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestChatHistoryId
            }, errorFactory)) && ("string" === typeof input.newestWorkspaceHistoryId && (1 <= input.newestWorkspaceHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestWorkspaceHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestWorkspaceHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestWorkspaceHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestWorkspaceHistoryId
            }, errorFactory)) && ("string" === typeof input.newestUsersHistoryId && (1 <= input.newestUsersHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestUsersHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestUsersHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestUsersHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestUsersHistoryId
            }, errorFactory)) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            }, errorFactory)) && (13 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "users", "userIds", "invitedUserEmails", "modificationTime", "creationTime", "newestChatHistoryId", "newestWorkspaceHistoryId", "newestUsersHistoryId", "placingInBinTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.email && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(input.email) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string & Format<\"email\">",
                value: input.email
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "(string & Format<\"email\">)",
                value: input.email
            }, errorFactory)) && ("string" === typeof input.username || $guard(_exceptionable, {
                path: _path + ".username",
                expected: "string",
                value: input.username
            }, errorFactory)) && ((Array.isArray(input.workspaceIds) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            }, errorFactory)) && input.workspaceIds.every((elem: any, _index4: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index4 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index4 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            }, errorFactory)) && ((Array.isArray(input.workspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            }, errorFactory)) && input.workspaceInvitationIds.every((elem: any, _index5: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index5 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index5 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            }, errorFactory)) && ("boolean" === typeof input.isBotUserDocument || $guard(_exceptionable, {
                path: _path + ".isBotUserDocument",
                expected: "boolean",
                value: input.isBotUserDocument
            }, errorFactory)) && ("boolean" === typeof input.isAnonymousAccount || $guard(_exceptionable, {
                path: _path + ".isAnonymousAccount",
                expected: "boolean",
                value: input.isAnonymousAccount
            }, errorFactory)) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            }, errorFactory)) && (8 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "isAnonymousAccount", "modificationTime"].some((prop: any) => key === prop))
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
export default validateWorkspace;
