import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import MIN_COLUMN_COUNT from "common/constants/minColumnCount.constant";
import typia from "typia";
/**
 * Assert that hardcoded '@minItems 2' used in columns property of Workspace model is valid.
 * Used number '2' should equal MIN_COLUMN_COUNT constant.
 */
((input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): { MIN_COLUMN_COUNT: 2 } => {
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
            }, errorFactory);
            return ("object" === typeof input && null !== input || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            }, errorFactory)) && $ao0(input, _path + "", true) || $guard(true, {
                path: _path + "",
                expected: "__type",
                value: input
            }, errorFactory);
        })(input, "$input", true);
    return input;
})({ MIN_COLUMN_COUNT });
const validateWorkspaceDTO = (input: any, errorFactory?: (p: import("typia").TypeGuardError.IProps) => Error): WorkspaceDTO => {
    const __is = (input: any, _exceptionable: boolean = true): input is WorkspaceDTO => {
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && 1 <= input.id.length && ("string" === typeof input.url && 1 <= input.url.length) && ("string" === typeof input.title && 1 <= input.title.length) && "string" === typeof input.description && (Array.isArray(input.userIds) && input.userIds.every((elem: any, _index1: number) => "string" === typeof elem && 1 <= elem.length)) && (Array.isArray(input.invitedUserEmails) && input.invitedUserEmails.every((elem: any, _index2: number) => "string" === typeof elem && /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(elem))) && (Array.isArray(input.columns) && (2 <= input.columns.length && input.columns.every((elem: any, _index3: number) => "object" === typeof elem && null !== elem && $io1(elem, true && _exceptionable)))) && (Array.isArray(input.labels) && input.labels.every((elem: any, _index4: number) => "object" === typeof elem && null !== elem && $io2(elem, true && _exceptionable))) && ("object" === typeof input.modificationTime && null !== input.modificationTime && $io3(input.modificationTime, true && _exceptionable)) && ("object" === typeof input.creationTime && null !== input.creationTime && $io3(input.creationTime, true && _exceptionable)) && ("string" === typeof input.newestWorkspaceHistoryId && 1 <= input.newestWorkspaceHistoryId.length) && ("string" === typeof input.newestUsersHistoryId && 1 <= input.newestUsersHistoryId.length) && ("string" === typeof input.newestColumnsHistoryId && 1 <= input.newestColumnsHistoryId.length) && ("string" === typeof input.newestLabelsHistoryId && 1 <= input.newestLabelsHistoryId.length) && ("string" === typeof input.newestArchivedGoalsId && 1 <= input.newestArchivedGoalsId.length) && ("string" === typeof input.newestArchivedTasksId && 1 <= input.newestArchivedTasksId.length) && "boolean" === typeof input.isInBin && (null === input.placingInBinTime || "object" === typeof input.placingInBinTime && null !== input.placingInBinTime && $io3(input.placingInBinTime, true && _exceptionable)) && "boolean" === typeof input.isDeleted && (null === input.deletionTime || "object" === typeof input.deletionTime && null !== input.deletionTime && $io3(input.deletionTime, true && _exceptionable)) && (20 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "url", "title", "description", "userIds", "invitedUserEmails", "columns", "labels", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "newestColumnsHistoryId", "newestLabelsHistoryId", "newestArchivedGoalsId", "newestArchivedTasksId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && "boolean" === typeof input.completedTasksColumn && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.id && "string" === typeof input.name && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["id", "name", "color"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => "number" === typeof input.seconds && "number" === typeof input.nanoseconds && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
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
            }, errorFactory)) && ((Array.isArray(input.columns) || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "(Array<Column> & MinItems<2>)",
                value: input.columns
            }, errorFactory)) && ((2 <= input.columns.length || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "Array<> & MinItems<2>",
                value: input.columns
            }, errorFactory)) && input.columns.every((elem: any, _index3: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".columns[" + _index3 + "]",
                expected: "Column",
                value: elem
            }, errorFactory)) && $ao1(elem, _path + ".columns[" + _index3 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".columns[" + _index3 + "]",
                expected: "Column",
                value: elem
            }, errorFactory))) || $guard(_exceptionable, {
                path: _path + ".columns",
                expected: "(Array<Column> & MinItems<2>)",
                value: input.columns
            }, errorFactory)) && ((Array.isArray(input.labels) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            }, errorFactory)) && input.labels.every((elem: any, _index4: number) => ("object" === typeof elem && null !== elem || $guard(_exceptionable, {
                path: _path + ".labels[" + _index4 + "]",
                expected: "Label",
                value: elem
            }, errorFactory)) && $ao2(elem, _path + ".labels[" + _index4 + "]", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".labels[" + _index4 + "]",
                expected: "Label",
                value: elem
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".labels",
                expected: "Array<Label>",
                value: input.labels
            }, errorFactory)) && (("object" === typeof input.modificationTime && null !== input.modificationTime || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && $ao3(input.modificationTime, _path + ".modificationTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".modificationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.modificationTime
            }, errorFactory)) && (("object" === typeof input.creationTime && null !== input.creationTime || $guard(_exceptionable, {
                path: _path + ".creationTime",
                expected: "FirebaseFirestore.Timestamp",
                value: input.creationTime
            }, errorFactory)) && $ao3(input.creationTime, _path + ".creationTime", true && _exceptionable) || $guard(_exceptionable, {
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
            }, errorFactory)) && ("string" === typeof input.newestColumnsHistoryId && (1 <= input.newestColumnsHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestColumnsHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestColumnsHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestColumnsHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestColumnsHistoryId
            }, errorFactory)) && ("string" === typeof input.newestLabelsHistoryId && (1 <= input.newestLabelsHistoryId.length || $guard(_exceptionable, {
                path: _path + ".newestLabelsHistoryId",
                expected: "string & MinLength<1>",
                value: input.newestLabelsHistoryId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestLabelsHistoryId",
                expected: "(string & MinLength<1>)",
                value: input.newestLabelsHistoryId
            }, errorFactory)) && ("string" === typeof input.newestArchivedGoalsId && (1 <= input.newestArchivedGoalsId.length || $guard(_exceptionable, {
                path: _path + ".newestArchivedGoalsId",
                expected: "string & MinLength<1>",
                value: input.newestArchivedGoalsId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestArchivedGoalsId",
                expected: "(string & MinLength<1>)",
                value: input.newestArchivedGoalsId
            }, errorFactory)) && ("string" === typeof input.newestArchivedTasksId && (1 <= input.newestArchivedTasksId.length || $guard(_exceptionable, {
                path: _path + ".newestArchivedTasksId",
                expected: "string & MinLength<1>",
                value: input.newestArchivedTasksId
            }, errorFactory)) || $guard(_exceptionable, {
                path: _path + ".newestArchivedTasksId",
                expected: "(string & MinLength<1>)",
                value: input.newestArchivedTasksId
            }, errorFactory)) && ("boolean" === typeof input.isInBin || $guard(_exceptionable, {
                path: _path + ".isInBin",
                expected: "boolean",
                value: input.isInBin
            }, errorFactory)) && (null === input.placingInBinTime || ("object" === typeof input.placingInBinTime && null !== input.placingInBinTime || $guard(_exceptionable, {
                path: _path + ".placingInBinTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.placingInBinTime
            }, errorFactory)) && $ao3(input.placingInBinTime, _path + ".placingInBinTime", true && _exceptionable) || $guard(_exceptionable, {
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
            }, errorFactory)) && $ao3(input.deletionTime, _path + ".deletionTime", true && _exceptionable) || $guard(_exceptionable, {
                path: _path + ".deletionTime",
                expected: "(FirebaseFirestore.Timestamp | null)",
                value: input.deletionTime
            }, errorFactory)) && (20 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "url", "title", "description", "userIds", "invitedUserEmails", "columns", "labels", "modificationTime", "creationTime", "newestWorkspaceHistoryId", "newestUsersHistoryId", "newestColumnsHistoryId", "newestLabelsHistoryId", "newestArchivedGoalsId", "newestArchivedTasksId", "isInBin", "placingInBinTime", "isDeleted", "deletionTime"].some((prop: any) => key === prop))
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
            const $ao1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }, errorFactory)) && ("boolean" === typeof input.completedTasksColumn || $guard(_exceptionable, {
                path: _path + ".completedTasksColumn",
                expected: "boolean",
                value: input.completedTasksColumn
            }, errorFactory)) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "completedTasksColumn"].some((prop: any) => key === prop))
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
            const $ao2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("string" === typeof input.id || $guard(_exceptionable, {
                path: _path + ".id",
                expected: "string",
                value: input.id
            }, errorFactory)) && ("string" === typeof input.name || $guard(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }, errorFactory)) && ("DarkRed" === input.color || "Crimson" === input.color || "LightCoral" === input.color || "LightSalmon" === input.color || "DeepPink" === input.color || "HotPink" === input.color || "Coral" === input.color || "OrangeRed" === input.color || "Yellow" === input.color || "BlueViolet" === input.color || "Purple" === input.color || "Indigo" === input.color || "RosyBrown" === input.color || "GreenYellow" === input.color || "LimeGreen" === input.color || "SeaGreen" === input.color || "Green" === input.color || "DarkCyan" === input.color || "Cyan" === input.color || "DodgerBlue" === input.color || "Blue" === input.color || "Snow" === input.color || "DarkGrey" === input.color || "Grey" === input.color || "DarkSlateGrey" === input.color || "Goldenrod" === input.color || "Chocolate" === input.color || "Brown" === input.color || "Maroon" === input.color || $guard(_exceptionable, {
                path: _path + ".color",
                expected: "(\"Blue\" | \"BlueViolet\" | \"Brown\" | \"Chocolate\" | \"Coral\" | \"Crimson\" | \"Cyan\" | \"DarkCyan\" | \"DarkGrey\" | \"DarkRed\" | \"DarkSlateGrey\" | \"DeepPink\" | \"DodgerBlue\" | \"Goldenrod\" | \"Green\" | \"GreenYellow\" | \"Grey\" | \"HotPink\" | \"Indigo\" | \"LightCoral\" | \"LightSalmon\" | \"LimeGreen\" | \"Maroon\" | \"OrangeRed\" | \"Purple\" | \"RosyBrown\" | \"SeaGreen\" | \"Snow\" | \"Yellow\")",
                value: input.color
            }, errorFactory)) && (3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).every((key: any) => {
                if (["id", "name", "color"].some((prop: any) => key === prop))
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
            const $ao3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ("number" === typeof input.seconds || $guard(_exceptionable, {
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
