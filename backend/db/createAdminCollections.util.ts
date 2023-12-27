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
import UserDetails from "common/models/userDetails.model";
import TestCollections from "common/models/utils_models/testCollections.model";
import Workspace from "common/models/workspace_models/workspace.model";
import WorkspaceCounter from "common/models/workspace_models/workspaceCounter.model";
import WorkspaceSummary from "common/models/workspace_models/workspaceSummary.model";
import WritableCollections from "common/types/writableCollections.type";
import {
  CollectionReference,
  Filter,
  Firestore,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
} from "firebase-admin/firestore";

function createConverter<T extends object>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
  };
}

interface TypedQuery<T extends object> extends Query<T> {
  where(filter: Filter): Query<T>;
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
  // Store these functions to avoid infinite recursion.
  const whereQuery = actualQuery.where;
  const orderByQuery = actualQuery.orderBy;
  typedQuery.where = (...args: Parameters<typeof whereQuery>) =>
    createTypedQuery(whereQuery.call(actualQuery, ...args));
  typedQuery.orderBy = (...args: Parameters<typeof orderByQuery>) =>
    createTypedQuery(orderByQuery.call(actualQuery, ...args));
  typedQuery.and = (...queries) => {
    const filters = queries.map((q: [string, WhereFilterOp, any]) => Filter.where(...q));
    return createTypedQuery(actualQuery.where(Filter.and(...filters)));
  };
  typedQuery.or = (...queries) => {
    const filters = queries.map((q: [string, WhereFilterOp, any]) => Filter.where(...q));
    return createTypedQuery(actualQuery.where(Filter.or(...filters)));
  };
  return typedQuery;
}

interface TypedCollectionReference<T extends object>
  extends Omit<CollectionReference<T>, "where" | "orderBy">,
    Pick<TypedQuery<T>, "where" | "orderBy" | "and" | "or"> {}

function createTypedCollection<T extends object>(adminDb: Firestore, collectionPath: string) {
  const collection = adminDb.collection(collectionPath).withConverter(createConverter<T>());
  const typedCollection = collection as TypedCollectionReference<T>;
  // Store these functions to avoid infinite recursion.
  const whereQuery = collection.where;
  const orderByQuery = collection.orderBy;
  typedCollection.where = (...args: Parameters<typeof whereQuery>) =>
    createTypedQuery(whereQuery.call(collection, ...args));
  typedCollection.orderBy = (...args: Parameters<typeof orderByQuery>) =>
    createTypedQuery(orderByQuery.call(collection, ...args));
  typedCollection.and = (...queries) => {
    const filters = queries.map((q: [string, WhereFilterOp, any]) => Filter.where(...q));
    return createTypedQuery(collection.where(Filter.and(...filters)));
  };
  typedCollection.or = (...queries) => {
    const filters = queries.map((q: [string, WhereFilterOp, any]) => Filter.where(...q));
    return createTypedQuery(collection.where(Filter.or(...filters)));
  };
  return typedCollection;
}

export default function createAdminCollections(adminDb: Firestore, testCollectionsId?: string) {
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
      adminDb,
      collectionPaths.completedTaskStats
    ),
    goals: createTypedCollection<Goal>(adminDb, collectionPaths.goals),
    goalHistories: createTypedCollection<GoalHistory>(adminDb, collectionPaths.goalHistories),
    norms: createTypedCollection<Norm>(adminDb, collectionPaths.norms),
    normHistories: createTypedCollection<NormHistory>(adminDb, collectionPaths.normHistories),
    tasks: createTypedCollection<Task>(adminDb, collectionPaths.tasks),
    taskHistories: createTypedCollection<TaskHistory>(adminDb, collectionPaths.taskHistories),
    testCollections: createTypedCollection<TestCollections>(
      adminDb,
      collectionPaths.testCollections
    ),
    users: createTypedCollection<User>(adminDb, collectionPaths.users),
    userDetails: createTypedCollection<UserDetails>(adminDb, collectionPaths.userDetails),
    workspaces: createTypedCollection<Workspace>(adminDb, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummary>(
      adminDb,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounter>(
      adminDb,
      collectionPaths.workspaceCounters
    ),
    workspaceHistories: createTypedCollection<WorkspaceHistory>(
      adminDb,
      collectionPaths.workspaceHistories
    ),
  } as const;
}
