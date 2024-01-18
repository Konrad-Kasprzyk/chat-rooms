import COLLECTION_PATHS from "common/constants/collectionPaths.constant";
import Goal from "common/models/goal.model";
import GoalHistory from "common/models/historyModels/goalHistory.model";
import TaskHistory from "common/models/historyModels/taskHistory.model";
import WorkspaceHistory from "common/models/historyModels/workspaceHistory.model";
import Task from "common/models/task.model";
import User from "common/models/user.model";
import UserDetails from "common/models/userDetails.model";
import TestCollections from "common/models/utilsModels/testCollections.model";
import Workspace from "common/models/workspaceModels/workspace.model";
import WorkspaceCounter from "common/models/workspaceModels/workspaceCounter.model";
import WorkspaceSummary from "common/models/workspaceModels/workspaceSummary.model";
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
  where(filter: Filter): TypedQuery<T>;
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
  limit(limit: number): TypedQuery<T>;
  limitToLast(limit: number): TypedQuery<T>;
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

/**
 * If the original syntax for using 'or' and 'and' queries is changed, modified methods must be
 * applied to all subsequent query calls.
 */
function createTypedQuery<T extends object>(actualQuery: Query<T>): TypedQuery<T> {
  const typedQuery = actualQuery as TypedQuery<T>;
  // Store these functions to avoid infinite recursion.
  const whereQuery = actualQuery.where;
  const orderByQuery = actualQuery.orderBy;
  const limitQuery = actualQuery.limit;
  const limitToLastQuery = actualQuery.limitToLast;
  typedQuery.where = (...args: Parameters<typeof whereQuery>) =>
    createTypedQuery(whereQuery.call(actualQuery, ...args));
  typedQuery.orderBy = (...args: Parameters<typeof orderByQuery>) =>
    createTypedQuery(orderByQuery.call(actualQuery, ...args));
  typedQuery.limit = (...args: Parameters<typeof limitQuery>) =>
    createTypedQuery(limitQuery.call(actualQuery, ...args));
  typedQuery.limitToLast = (...args: Parameters<typeof limitToLastQuery>) =>
    createTypedQuery(limitToLastQuery.call(actualQuery, ...args));
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
  extends Omit<CollectionReference<T, T>, "where" | "orderBy">,
    Pick<TypedQuery<T>, "where" | "orderBy" | "and" | "or"> {}

/**
 * Creates a typed collection using withConverter which provides typed creation, updating and
 * retrieving of documents. Adds document type checking when querying with 'where', which is not
 * provided when using only withConverter. Changes the original syntax of the "or" and "and" queries.
 * Instead of using untyped syntax
 * collection.where( Filter.or(
 *     Filter.where('capital', '==', true),
 *     Filter.where('population', '>=', 1000000)
 *   ))
 * New syntax is shorter and provides document type checking
 * collection.or(['capital', '==', true], ['population', '>=', 1000000])
 */
function createTypedCollection<T extends object>(adminDb: Firestore, collectionPath: string) {
  const collection = adminDb.collection(collectionPath).withConverter<T, T>(createConverter<T>());
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
    goals: createTypedCollection<Goal>(adminDb, collectionPaths.goals),
    goalHistories: createTypedCollection<GoalHistory>(adminDb, collectionPaths.goalHistories),
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
