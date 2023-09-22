import COLLECTION_PATHS from "common/constants/collectionPaths.constant";
import CompletedTaskStats from "common/models/completedTaskStats.model";
import Goal from "common/models/goal.model";
import GoalHistory from "common/models/history_models/goalHistory.model";
import NormHistory from "common/models/history_models/normHistory.model";
import TaskHistory from "common/models/history_models/taskHistory.model";
import WorkspaceHistory from "common/models/history_models/workspaceHistory.model";
import Norm from "common/models/norm.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import TestCollections from "common/models/utils_models/testCollections.model";
import WorkspaceCounter from "common/models/utils_models/workspaceCounter.model";
import WorkspaceUrl from "common/models/utils_models/workspaceUrl.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import WritableCollections from "common/types/mutableCollections.type";
import {
  CollectionReference,
  Firestore,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
  and,
  collection,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function createConverter<T extends object>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data(),
  };
}

interface TypedQuery<T extends object> extends Query<T> {
  where<K extends keyof T & string>(
    fieldPath: K,
    opStr: Exclude<WhereFilterOp, "array-contains" | "in" | "not-in">,
    value: T[K]
  ): TypedQuery<T>;
  where<K extends keyof T & string>(
    fieldPath: K,
    opStr: Extract<WhereFilterOp, "array-contains">,
    value: T[K] extends Array<any> ? T[K][number] : never
  ): TypedQuery<T>;
  where<K extends keyof T & string>(
    fieldPath: K,
    opStr: Extract<WhereFilterOp, "in" | "not-in">,
    value: T[K][]
  ): TypedQuery<T>;
  orderBy<K extends keyof T & string>(fieldPath: K, directionStr?: OrderByDirection): TypedQuery<T>;
  and<K extends keyof T & string>(
    ...queries: (
      | [K, Exclude<WhereFilterOp, "array-contains" | "in" | "not-in">, T[K]]
      | [
          K,
          Extract<WhereFilterOp, "array-contains">,
          T[K] extends Array<any> ? T[K][number] : never
        ]
      | [K, Extract<WhereFilterOp, "in" | "not-in">, T[K][]]
    )[]
  ): TypedQuery<T>;
  or<K extends keyof T & string>(
    ...queries: (
      | [K, Exclude<WhereFilterOp, "array-contains" | "in" | "not-in">, T[K]]
      | [
          K,
          Extract<WhereFilterOp, "array-contains">,
          T[K] extends Array<any> ? T[K][number] : never
        ]
      | [K, Extract<WhereFilterOp, "in" | "not-in">, T[K][]]
    )[]
  ): TypedQuery<T>;
}

function createTypedQuery<T extends object>(actualQuery: Query<T>): TypedQuery<T> {
  const typedQuery = actualQuery as TypedQuery<T>;
  typedQuery.where = (...args: Parameters<typeof where>) =>
    createTypedQuery(query(actualQuery, where(...args)));
  typedQuery.orderBy = (...args: Parameters<typeof orderBy>) =>
    createTypedQuery(query(actualQuery, orderBy(...args)));
  typedQuery.and = (...queries) => {
    const constraints = queries.map((q: Parameters<typeof where>) => where(...q));
    return createTypedQuery(query(actualQuery, and(...constraints)));
  };
  typedQuery.or = (...queries) => {
    const constraints = queries.map((q: Parameters<typeof where>) => where(...q));
    return createTypedQuery(query(actualQuery, or(...constraints)));
  };
  return typedQuery;
}

interface TypedCollectionReference<T extends object>
  extends CollectionReference<T>,
    Pick<TypedQuery<T>, "where" | "orderBy" | "and" | "or"> {}

function createTypedCollection<T extends object>(db: Firestore, collectionPath: string) {
  const typedCollection = collection(db, collectionPath).withConverter(
    createConverter<T>()
  ) as TypedCollectionReference<T>;
  const typedQuery = createTypedQuery(query(typedCollection));
  typedCollection.where = typedQuery.where;
  typedCollection.orderBy = typedQuery.orderBy;
  typedCollection.and = typedQuery.and;
  typedCollection.and = typedQuery.or;
  return typedCollection;
}

export default function createClientCollections(db: Firestore, testCollectionsId?: string) {
  const collectionPaths: WritableCollections = Object.assign({}, COLLECTION_PATHS);
  if (testCollectionsId) {
    const testCollectionsPrefix = `${COLLECTION_PATHS.testCollections}/${testCollectionsId}/`;
    for (const path of Object.keys(COLLECTION_PATHS) as (keyof typeof COLLECTION_PATHS)[]) {
      if (path === "testCollections") continue;
      collectionPaths[path] = testCollectionsPrefix + COLLECTION_PATHS[path];
    }
  }
  return {
    completedTaskStats: createTypedCollection<CompletedTaskStats>(
      db,
      collectionPaths.completedTaskStats
    ),
    goals: createTypedCollection<Goal>(db, collectionPaths.goals),
    goalHistories: createTypedCollection<GoalHistory>(db, collectionPaths.goalHistories),
    norms: createTypedCollection<Norm>(db, collectionPaths.norms),
    normHistories: createTypedCollection<NormHistory>(db, collectionPaths.normHistories),
    tasks: createTypedCollection<Task>(db, collectionPaths.tasks),
    taskHistories: createTypedCollection<TaskHistory>(db, collectionPaths.taskHistories),
    testCollections: createTypedCollection<TestCollections>(db, collectionPaths.testCollections),
    users: createTypedCollection<User>(db, collectionPaths.users),
    workspaces: createTypedCollection<Workspace>(db, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummary>(
      db,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounter>(
      db,
      collectionPaths.workspaceCounters
    ),
    workspaceUrls: createTypedCollection<WorkspaceUrl>(db, collectionPaths.workspaceUrls),
    workspaceHistories: createTypedCollection<WorkspaceHistory>(
      db,
      collectionPaths.workspaceHistories
    ),
  } as const;
}
