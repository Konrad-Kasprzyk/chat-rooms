export const WORKSPACE_PRIVILEGES: {
  readonly [key in typeof ALL_ROLES[number]]: readonly typeof ALL_PRIVILEGES[number][];
} = {
  guest: [],
  basic: [
    "assign tasks",
    "create tasks/goals",
    "modify and remove self-created goals",
    "modify and remove self-created unassigned by others tasks",
  ],
  standard: [
    "assign tasks",
    "create tasks/goals",
    "modify and remove all tasks/goals",
    "change tasks/goals order",
  ],
  admin: [
    "assign tasks",
    "create tasks/goals",
    "modify and remove all tasks/goals",
    "change tasks/goals order",
    "task columns",
    "task/goal labels",
    "add users",
    "remove users up to standard role",
    "manage user privileges up to standard role",
  ],
  owner: [
    "assign tasks",
    "create tasks/goals",
    "modify and remove all tasks/goals",
    "change tasks/goals order",
    "task columns",
    "task/goal labels",
    "add users",
    "remove any user",
    "manage any user privileges",
    "change project title and description",
    "remove project",
  ],
} as const;

export const ALL_ROLES = ["guest", "basic", "standard", "admin", "owner"] as const;

export const ALL_PRIVILEGES = [
  "assign tasks",
  "create tasks/goals",
  "modify and remove self-created goals",
  "modify and remove self-created unassigned by others tasks",
  "modify and remove all tasks/goals",
  "change tasks/goals order",
  "task columns",
  "task/goal labels",
  "add users",
  "remove users up to standard role",
  "manage user privileges up to standard role",
  "remove any user",
  "manage any user privileges",
  "change project title and description",
  "remove project",
] as const;
