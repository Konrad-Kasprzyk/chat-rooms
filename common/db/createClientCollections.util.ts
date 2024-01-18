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
  Firestore,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
  WhereFilterOp,
  and,
  collection,
  limit,
  limitToLast,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function createConverter<T extends object>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
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
 * If the original client query syntax is changed, modified methods must be applied to all
 * subsequent query calls.
 */
function createTypedQuery<T extends object>(actualQuery: Query<T>): TypedQuery<T> {
  const typedQuery = actualQuery as TypedQuery<T>;
  typedQuery.where = (...args: Parameters<typeof where>) =>
    createTypedQuery(query(actualQuery, where(...args)));
  typedQuery.orderBy = (...args: Parameters<typeof orderBy>) =>
    createTypedQuery(query(actualQuery, orderBy(...args)));
  typedQuery.limit = (...args: Parameters<typeof limit>) =>
    createTypedQuery(query(actualQuery, limit(...args)));
  typedQuery.limitToLast = (...args: Parameters<typeof limitToLast>) =>
    createTypedQuery(query(actualQuery, limitToLast(...args)));
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
  extends CollectionReference<T, T>,
    Pick<TypedQuery<T>, "where" | "orderBy" | "and" | "or"> {}

/**
 * Creates a typed collection using withConverter which provides typed creation, updating and
 * retrieving of documents. Adds document type checking when querying with 'where', which is not
 * provided when using only withConverter. Changes the original client query syntax to be the same
 * as NodeJs and provide document type checking.
 * Instead of using untyped syntax
 * query(collectionRef,
 *   or(where('capital', '==', true),
 *      where('population', '>=', 1000000)
 *   ))
 * New syntax provides document type checking
 * collectionRef.or(['capital', '==', true], ['population', '>=', 1000000])
 */
function createTypedCollection<T extends object>(db: Firestore, collectionPath: string) {
  const typedCollection = collection(db, collectionPath).withConverter<T, T>(
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
    goals: createTypedCollection<Goal>(db, collectionPaths.goals),
    goalHistories: createTypedCollection<GoalHistory>(db, collectionPaths.goalHistories),
    tasks: createTypedCollection<Task>(db, collectionPaths.tasks),
    taskHistories: createTypedCollection<TaskHistory>(db, collectionPaths.taskHistories),
    testCollections: createTypedCollection<TestCollections>(db, collectionPaths.testCollections),
    users: createTypedCollection<User>(db, collectionPaths.users),
    userDetails: createTypedCollection<UserDetails>(db, collectionPaths.userDetails),
    workspaces: createTypedCollection<Workspace>(db, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummary>(
      db,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounter>(
      db,
      collectionPaths.workspaceCounters
    ),
    workspaceHistories: createTypedCollection<WorkspaceHistory>(
      db,
      collectionPaths.workspaceHistories
    ),
  } as const;
}
