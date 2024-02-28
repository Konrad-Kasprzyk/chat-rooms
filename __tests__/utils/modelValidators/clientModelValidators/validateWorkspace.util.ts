import Workspace from "common/clientModels/workspace.model";
import MIN_COLUMN_COUNT from "common/constants/minColumnCount.constant";
import typia from "typia";
/**
 * Assert that hardcoded '@minItems 2' used in columns property of Workspace model is valid.
 * Used number '2' should equal MIN_COLUMN_COUNT constant.
 */
((input: any): { MIN_COLUMN_COUNT: 2 } => {
    const __is = (input: any): input is { MIN_COLUMN_COUNT: 2 } => {
        const $io0 = (input: any): boolean => 2 === input.MIN_COLUMN_COUNT;
        return "object" === typeof input && null !== input && $io0(input);
    };
    if (false === __is(input))
        ((input: any, _path: string, _exceptionable: boolean = true): input is { MIN_COLUMN_COUNT: 2 } => {
            const $guard = (typia.assert as any).guard;
            const $ao0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => 2 === input.MIN_COLUMN_COUNT || $guard(_exceptionable, {
                path: _path + ".MIN_COLUMN_COUNT",
                expected: "2",
                value: input.MIN_COLUMN_COUNT
            });
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            })) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            });
        })(input, "$input", true);
    return input;
})({ MIN_COLUMN_COUNT });
const validateWorkspace = (input: any): Workspace => {
    const __is = (input: any, _exceptionable: boolean = true): input is Workspace => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.users) && input.users.every((elem: any, _index1: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable))) && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index2: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserEmails) && input.invitedUserEmails.every((elem: any, _index3: number) => "string" === typeof elem && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(elem))) && (Array.isArray(input.columns) && (2 <= input.columns.length && input.columns.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable)))) && (Array.isArray(input.labels) && input.labels.every((elem: any, _index5: number) => "object" === typeof elem && null !== elem && $io3(elem, true && _exceptionable))) && input.modificationTime instanceof Date && input.creationTime instanceof Date && ("string" === typeof input.newestWorkspaceHistoryId && 1 <= input.newestWorkspaceHistoryId.length) && ("string" === typeof input.newestUsersHistoryId && 1 <= input.newestUsersHistoryId.length) && ("string" === typeof input.newestColumnsHistoryId && 1 <= input.newestColumnsHistoryId.length) && ("string" === typeof input.newestLabelsHistoryId && 1 <= input.newestLabelsHistoryId.length) && ("string" === typeof input.newestArchivedGoalsId && 1 <= input.newestArchivedGoalsId.length) && ("string" === typeof input.newestArchivedTasksId && 1 <= input.newestArchivedTasksId.length) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date) && input.fetchingFromSeverTime instanceof Date && "boolean" === typeof input.hasOfflineChanges && (20 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "users", "userIds", "invitedUserEmails", "columns", "labels", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "newestColumnsHistoryId", "newestLabelsHistoryId", "newestArchivedGoalsId", "newestArchivedTasksId", "placingInBinTime", "fetchingFromSeverTime", "hasOfflineChanges"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.email && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email)) && "string" === typeof input.username && (Array.isArray(input.workspaceIds) && input.workspaceIds.every((elem: any, _index6: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.workspaceInvitationIds) && input.workspaceInvitationIds.every((elem: any, _index7: number) => "string" === typeof elem && 1 <= elem.length)) && "boolean" === typeof input.isBotUserDocument && input.modificationTime instanceof Date && input.fetchingFromSeverTime instanceof Date && "boolean" === typeof input.hasOfflineChanges && (9 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "modificationTime", "fetchingFromSeverTime", "hasOfflineChanges"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && "boolean" === typeof input.completedTasksColumn && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color"].some((prop: any) => key === prop))
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
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("string" === typeof input.url && (1 <= input.url.length || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "string & MinLength<1>",
                value: input.url
            })) || $guard(_exceptionable, {
                path: _path + ".url",
                expected: "(string & MinLength<1>)",
                value: input.url
            })) && ("string" === typeof input.title && (1 <= input.title.length || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "string & MinLength<1>",
                value: input.title
            })) || $guard(_exceptionable, {
                path: _path + ".title",
                expected: "(string & MinLength<1>)",
                value: input.title
            })) && ("string" === typeof input.description || $guard(_exceptionable, {
                path: _path + ".description",
                expected: "string",
                value: input.description
            })) && ((Array.isArray(input.users) || $guard(_exceptionable, {
                path: _path + ".users",
                expected: "Array<default>",
                value: input.users
            })) && input.users.every((elem: any, _index1: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".users[" + _index1 + "]",
                expected: "default.o1",
                value: elem
            })) && $ao1(elem, _path + ".users[" + _index1 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".users[" + _index1 + "]",
                expected: "default.o1",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".users",
                expected: "Array<default>",
                value: input.users
            })) && ((Array.isArray(input.userIds) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            })) && input.userIds.every((elem: any, _index2: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index2 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".userIds[" + _index2 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".userIds",
                expected: "Array<string & MinLength<1>>",
                value: input.userIds
            })) && ((Array.isArray(input.invitedUserEmails) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails",
                expected: "Array<string & Format<\"email\">>",
                value: input.invitedUserEmails
            })) && input.invitedUserEmails.every((elem: any, _index3: number) => "string" === typeof elem && (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(elem) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index3 + "]",
                expected: "string & Format<\"email\">",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails[" + _index3 + "]",
                expected: "(string & Format<\"email\">)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".invitedUserEmails",
                expected: "Array<string & Format<\"email\">>",
                value: input.invitedUserEmails
            })) && ((Array.isArray(input.columns) || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "(Array<Column> & MinItems<2>)",
                value: input.columns
            })) && ((2 <= input.columns.length || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "Array<> & MinItems<2>",
                value: input.columns
            })) && input.columns.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".columns[" + _index4 + "]",
                expected: "Column",
                value: elem
            })) && $ao2(elem, _path + ".columns[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columns[" + _index4 + "]",
                expected: "Column",
                value: elem
            }))) || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "(Array<Column> & MinItems<2>)",
                value: input.columns
            })) && ((Array.isArray(input.labels) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && input.labels.every((elem: any, _index5: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".labels[" + _index5 + "]",
                expected: "Label",
                value: elem
            })) && $ao3(elem, _path + ".labels[" + _index5 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".labels[" + _index5 + "]",
                expected: "Label",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (input.creationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "Date",
                value: input.creationTime
            })) && ("string" === typeof input.newestWorkspaceHistoryId && (1 <= input.newestWorkspaceHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestWorkspaceHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestWorkspaceHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newestWorkspaceHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestWorkspaceHistoryId
            })) && ("string" === typeof input.newestUsersHistoryId && (1 <= input.newestUsersHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestUsersHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestUsersHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newestUsersHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestUsersHistoryId
            })) && ("string" === typeof input.newestColumnsHistoryId && (1 <= input.newestColumnsHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestColumnsHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestColumnsHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newestColumnsHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestColumnsHistoryId
            })) && ("string" === typeof input.newestLabelsHistoryId && (1 <= input.newestLabelsHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestLabelsHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestLabelsHistoryId
            })) || $guard(_exceptionable, {
                path: _path + ".newestLabelsHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestLabelsHistoryId
            })) && ("string" === typeof input.newestArchivedGoalsId && (1 <= input.newestArchivedGoalsId.length || $guard(_exceptionable, {
                path: _path + ".newestArchivedGoalsId",
                expected: "string & MinLength<1>",
                value: input.newestArchivedGoalsId
            })) || $guard(_exceptionable, {
                path: _path + ".newestArchivedGoalsId",
                expected: "(string & MinLength<1>)",
                value: input.newestArchivedGoalsId
            })) && ("string" === typeof input.newestArchivedTasksId && (1 <= input.newestArchivedTasksId.length || $guard(_exceptionable, {
                path: _path + ".newestArchivedTasksId",
                expected: "string & MinLength<1>",
                value: input.newestArchivedTasksId
            })) || $guard(_exceptionable, {
                path: _path + ".newestArchivedTasksId",
                expected: "(string & MinLength<1>)",
                value: input.newestArchivedTasksId
            })) && (null === input.placingInBinTime || input.placingInBinTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(Date | null)",
                value: input.placingInBinTime
            })) && (input.fetchingFromSeverTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".fetchingFromSeverTime",
                expected: "Date",
                value: input.fetchingFromSeverTime
            })) && ("boolean" === typeof input.hasOfflineChanges || $guard(_exceptionable, {
                path: _path + ".hasOfflineChanges",
                expected: "boolean",
                value: input.hasOfflineChanges
            })) && (20 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "users", "userIds", "invitedUserEmails", "columns", "labels", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "newestColumnsHistoryId", "newestLabelsHistoryId", "newestArchivedGoalsId", "newestArchivedTasksId", "placingInBinTime", "fetchingFromSeverTime", "hasOfflineChanges"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id && (1 <= input.id.length || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string & MinLength<1>",
                value: input.id
            })) || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "(string & MinLength<1>)",
                value: input.id
            })) && ("string" === typeof input.email && (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "string & Format<\"email\">",
                value: input.email
            })) || $guard(_exceptionable, {
                path: _path + ".email",
                expected: "(string & Format<\"email\">)",
                value: input.email
            })) && ("string" === typeof input.username || $guard(_exceptionable, {
                path: _path + ".username",
                expected: "string",
                value: input.username
            })) && ((Array.isArray(input.workspaceIds) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            })) && input.workspaceIds.every((elem: any, _index6: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index6 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds[" + _index6 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceIds
            })) && ((Array.isArray(input.workspaceInvitationIds) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            })) && input.workspaceInvitationIds.every((elem: any, _index7: number) => "string" === typeof elem && (1 <= elem.length || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index7 + "]",
                expected: "string & MinLength<1>",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds[" + _index7 + "]",
                expected: "(string & MinLength<1>)",
                value: elem
            })) || $guard(_exceptionable, {
                path: _path + ".workspaceInvitationIds",
                expected: "Array<string & MinLength<1>>",
                value: input.workspaceInvitationIds
            })) && ("boolean" === typeof input.isBotUserDocument || $guard(_exceptionable, {
                path: _path + ".isBotUserDocument",
                expected: "boolean",
                value: input.isBotUserDocument
            })) && (input.modificationTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "Date",
                value: input.modificationTime
            })) && (input.fetchingFromSeverTime instanceof Date || $guard(_exceptionable, {
                path: _path + ".fetchingFromSeverTime",
                expected: "Date",
                value: input.fetchingFromSeverTime
            })) && ("boolean" === typeof input.hasOfflineChanges || $guard(_exceptionable, {
                path: _path + ".hasOfflineChanges",
                expected: "boolean",
                value: input.hasOfflineChanges
            })) && (9 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "email", "username", "workspaceIds", "workspaceInvitationIds", "isBotUserDocument", "modificationTime", "fetchingFromSeverTime", "hasOfflineChanges"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })) && ("boolean" === typeof input.completedTasksColumn || $guard(_exceptionable, {
                path: _path + ".completedTasksColumn",
                expected: "boolean",
                value: input.completedTasksColumn
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            })) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })) && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color || $guard(_exceptionable, {
                path: _path + ".color",
                expected: "(\"Blue\" | \"BlueViolet\" | \"Brown\" | \"Chocolate\" | \"Coral\" | \"Crimson\" | \"Cyan\" | \"DarkCyan\" | \"DarkGrey\" | \"DarkRed\" | \"DarkSlateGrey\" | \"DeepPink\" | \"DodgerBlue\" | \"Goldenrod\" | \"Green\" | \"GreenYellow\" | \"Grey\" | \"HotPink\" | \"Indigo\" | \"LightCoral\" | \"LightSalmon\" | \"LimeGreen\" | \"Maroon\" | \"OrangeRed\" | \"Purple\" | \"RosyBrown\" | \"SeaGreen\" | \"Snow\" | \"Yellow\")",
                value: input.color
            })) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "color"].some((prop: any) => key === prop))
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
export default validateWorkspace;
