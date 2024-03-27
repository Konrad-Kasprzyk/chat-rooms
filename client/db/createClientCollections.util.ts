import GoalDTO from "common/DTOModels/goalDTO.model";
import ArchivedGoalsDTO from "common/DTOModels/historyModels/archivedGoalsDTO.model";
import ArchivedTasksDTO from "common/DTOModels/historyModels/archivedTasksDTO.model";
import ColumnsHistoryDTO from "common/DTOModels/historyModels/columnsHistoryDTO.model";
import GoalHistoryDTO from "common/DTOModels/historyModels/goalHistoryDTO.model";
import LabelsHistoryDTO from "common/DTOModels/historyModels/labelsHistoryDTO.model";
import TaskHistoryDTO from "common/DTOModels/historyModels/taskHistoryDTO.model";
import UsersHistoryDTO from "common/DTOModels/historyModels/usersHistoryDTO.model";
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
  DocumentSnapshot,
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
  startAfter,
  startAt,
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
  startAt(snapshot: DocumentSnapshot<T, T>): TypedQuery<T>;
  startAfter(snapshot: DocumentSnapshot<T, T>): TypedQuery<T>;
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
  typedQuery.startAt = (...args: Parameters<typeof startAt>) =>
    createTypedQuery(query(actualQuery, startAt(...args)));
  typedQuery.startAfter = (...args: Parameters<typeof startAfter>) =>
    createTypedQuery(query(actualQuery, startAfter(...args)));
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
    Pick<
      TypedQuery<T>,
      "where" | "orderBy" | "limit" | "limitToLast" | "startAt" | "startAfter" | "and" | "or"
    > {}

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
  typedCollection.limit = typedQuery.limit;
  typedCollection.limitToLast = typedQuery.limitToLast;
  typedCollection.startAt = typedQuery.startAt;
  typedCollection.startAfter = typedQuery.startAfter;
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
    goalArchives: createTypedCollection<ArchivedGoalsDTO>(db, collectionPaths.goalArchives),
    taskArchives: createTypedCollection<ArchivedTasksDTO>(db, collectionPaths.taskArchives),
    columnHistories: createTypedCollection<ColumnsHistoryDTO>(db, collectionPaths.columnHistories),
    goalHistories: createTypedCollection<GoalHistoryDTO>(db, collectionPaths.goalHistories),
    labelHistories: createTypedCollection<LabelsHistoryDTO>(db, collectionPaths.labelHistories),
    taskHistories: createTypedCollection<TaskHistoryDTO>(db, collectionPaths.taskHistories),
    userHistories: createTypedCollection<UsersHistoryDTO>(db, collectionPaths.userHistories),
    workspaceHistories: createTypedCollection<WorkspaceHistoryDTO>(
      db,
      collectionPaths.workspaceHistories
    ),
    goals: createTypedCollection<GoalDTO>(db, collectionPaths.goals),
    tasks: createTypedCollection<TaskDTO>(db, collectionPaths.tasks),
    testCollections: createTypedCollection<TestCollectionsDTO>(db, collectionPaths.testCollections),
    users: createTypedCollection<UserDTO>(db, collectionPaths.users),
    userDetails: createTypedCollection<UserDetailsDTO>(db, collectionPaths.userDetails),
    workspaces: createTypedCollection<WorkspaceDTO>(db, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummaryDTO>(
      db,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounterDTO>(
      db,
      collectionPaths.workspaceCounters
    ),
  } as const;
}
