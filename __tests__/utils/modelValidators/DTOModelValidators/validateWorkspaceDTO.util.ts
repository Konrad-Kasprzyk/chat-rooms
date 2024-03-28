import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import typia from "typia";
const validateWorkspaceDTO = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): WorkspaceDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserEmails) && input.invitedUserEmails.every((elem: any, _index2: number) => "string" === typeof elem && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(elem))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io1(input.modificationTime, true && _exceptionable)) && ("object" === typeof input.creationTime && null !== input.creationTime && $io1(input.creationTime, true && _exceptionable)) && ("string" === typeof input.newestWorkspaceHistoryId && 1 <= input.newestWorkspaceHistoryId.length) && ("string" === typeof input.newestUsersHistoryId && 1 <= input.newestUsersHistoryId.length) && "boolean" === typeof input.isInBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io1(input.placingInBinTime, true && _exceptionable)) && "boolean" === typeof input.isDeleted && (null === input.deletionTime || "object" === typeof input.deletionTime && null !== input.deletionTime && $io1(input.deletionTime, true && _exceptionable)) && (14 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "userIds", "invitedUserEmails", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
        ((input: any, _path: string, _exceptionable: boolean = true): input is WorkspaceDTO => {
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
            }, errorFactory)) && ((Array.isArray(input.userIds) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            }, errorFactory)) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
                expected: "string & MinLength<1>",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index1 + "]",
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
            }, errorFactory)) && input.invitedUserEmails.every((elem: any, _index2: number) => "string" === typeof elem && (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(elem) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index2 + "]",
                expected: "string & Format<\"email\">",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index2 + "]",
                expected: "(string & Format<\"email\">)",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails",
                expected: "Array<string & Format<\"email\">>",
                value: input.invitedUserEmails
            }, errorFactory)) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && $ao1(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && (("object" === typeof input.creationTime && null !== input.creationTime || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.creationTime
            }, errorFactory)) && $ao1(input.creationTime, _path + ".creationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.creationTime
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
            }, errorFactory)) && ("boolean" === typeof input.isInBin || $guard(_exceptionable, {
                path: _path + ".isInBin",
                expected: "boolean",
                value: input.isInBin
            }, errorFactory)) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.placingInBinTime
            }, errorFactory)) && $ao1(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.placingInBinTime
            }, errorFactory)) && ("boolean" === typeof input.isDeleted || $guard(_exceptionable, {
                path: _path + ".isDeleted",
                expected: "boolean",
                value: input.isDeleted
            }, errorFactory)) && (null === input.deletionTime || ("object" === typeof input.deletionTime && null !== input.deletionTime || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.deletionTime
            }, errorFactory)) && $ao1(input.deletionTime, _path + ".deletionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.deletionTime
            }, errorFactory)) && (14 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "userIds", "invitedUserEmails", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
                path: _path + ".seconds",
                expected: "number",
                value: input.seconds
            }, errorFactory)) && ("number" === typeof input.nanoseconds || $guard(_exceptionable, {
                path: _path + ".nanoseconds",
                expected: "number",
                value: input.nanoseconds
            }, errorFactory)) && (2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["seconds", "nanoseconds"].some((prop: any) => key === prop))
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
export default validateWorkspaceDTO;
