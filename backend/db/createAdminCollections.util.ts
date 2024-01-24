import GoalDTO from "common/DTOModels/goalDTO.model";
import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import WorkspaceHistoryDTO from "common/DTOModels/historyModels/workspaceHistoryDTO.model";
import TaskDTO from "common/DTOModels/taskDTO.model";
import UserDTO from "common/DTOModels/userDTO.model";
import UserDetailsDTO from "common/DTOModels/userDetailsDTO.model";
import TestCollectionsDTO from "common/DTOModels/utilsModels/testCollectionsDTO.model";
import WorkspaceCounterDTO from "common/DTOModels/utilsModels/workspaceCounterDTO.model";
import WorkspaceDTO from "common/DTOModels/workspaceDTO.model";
import WorkspaceSummaryDTO from "common/DTOModels/workspaceSummaryDTO.model";
import COLLECTION_PATHS from "common/constants/collectionPaths.constant";
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
    goals: createTypedCollection<GoalDTO>(adminDb, collectionPaths.goals),
    goalHistories: createTypedCollection<GoalHistoryDTO>(adminDb, collectionPaths.goalHistories),
    tasks: createTypedCollection<TaskDTO>(adminDb, collectionPaths.tasks),
    taskHistories: createTypedCollection<TaskHistoryDTO>(adminDb, collectionPaths.taskHistories),
    testCollections: createTypedCollection<TestCollectionsDTO>(
      adminDb,
      collectionPaths.testCollections
    ),
    users: createTypedCollection<UserDTO>(adminDb, collectionPaths.users),
    userDetails: createTypedCollection<UserDetailsDTO>(adminDb, collectionPaths.userDetails),
    workspaces: createTypedCollection<WorkspaceDTO>(adminDb, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummaryDTO>(
      adminDb,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounterDTO>(
      adminDb,
      collectionPaths.workspaceCounters
    ),
    workspaceHistories: createTypedCollection<WorkspaceHistoryDTO>(
      adminDb,
      collectionPaths.workspaceHistories
    ),
  } as const;
}
