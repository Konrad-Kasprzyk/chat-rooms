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
} from "firebase-admin/firestore";

function createConverter<T extends object>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
  };
}

interface TypedQuery<T extends object> extends Omit<Query<T>, "where" | "orderBy"> {
  readonly query: Query<T>;
  where<K extends keyof T>(
    fieldPath: K,
    opStr: Exclude<WhereFilterOp, "array-contains">,
    value: T[K]
  ): TypedQuery<T>;
  where<K extends keyof T>(
    fieldPath: K,
    opStr: Extract<WhereFilterOp, "array-contains">,
    value: T[K] extends Array<any> ? T[K][number] : never
  ): TypedQuery<T>;
  orderBy<K extends keyof T>(
    fieldPath: K,
    directionStr?: OrderByDirection | undefined
  ): TypedQuery<T>;
}

function createTypedQuery<T extends object>(
  actualQuery: Query<T>,
  whereQuery: (fieldPath: string, opStr: WhereFilterOp, value: any) => Query<T>,
  orderByQuery: (fieldPath: string, directionStr?: OrderByDirection | undefined) => Query<T>
): TypedQuery<T> {
  const typedQuery = actualQuery as any as Omit<TypedQuery<T>, "query"> &
    Partial<Record<"query", Query<T>>>;
  typedQuery.query = actualQuery;
  typedQuery.where = <K extends keyof T>(fieldPath: K, opStr: WhereFilterOp, value: any) => {
    const query = whereQuery.call(actualQuery, fieldPath.toString(), opStr, value);
    return createTypedQuery(query, whereQuery, orderByQuery);
  };
  typedQuery.orderBy = <K extends keyof T>(
    fieldPath: K,
    directionStr?: OrderByDirection | undefined
  ) => {
    const query = orderByQuery.call(actualQuery, fieldPath.toString(), directionStr);
    return createTypedQuery(query, whereQuery, orderByQuery);
  };
  return typedQuery as TypedQuery<T>;
}

interface TypedCollectionReference<T extends object>
  extends Omit<CollectionReference<T>, "where" | "orderBy">,
    Pick<TypedQuery<T>, "where" | "orderBy"> {}

function createTypedCollection<T extends object>(adminDb: Firestore, collectionPath: string) {
  const collection = adminDb.collection(collectionPath).withConverter(createConverter<T>());
  const whereQuery: (fieldPath: string, opStr: WhereFilterOp, value: any) => Query<T> =
    collection.where;
  const orderByQuery = collection.orderBy;
  const typedCollection = collection as any as TypedCollectionReference<T>;
  typedCollection.where = <K extends keyof T>(fieldPath: K, opStr: WhereFilterOp, value: any) => {
    const query = whereQuery.call(typedCollection, fieldPath.toString(), opStr, value);
    return createTypedQuery(query, whereQuery, orderByQuery);
  };
  typedCollection.orderBy = <K extends keyof T>(
    fieldPath: K,
    directionStr?: OrderByDirection | undefined
  ) => {
    const query = orderByQuery.call(typedCollection, fieldPath.toString(), directionStr);
    return createTypedQuery(query, whereQuery, orderByQuery);
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
    workspaces: createTypedCollection<Workspace>(adminDb, collectionPaths.workspaces),
    workspaceSummaries: createTypedCollection<WorkspaceSummary>(
      adminDb,
      collectionPaths.workspaceSummaries
    ),
    workspaceCounters: createTypedCollection<WorkspaceCounter>(
      adminDb,
      collectionPaths.workspaceCounters
    ),
    workspaceUrls: createTypedCollection<WorkspaceUrl>(adminDb, collectionPaths.workspaceUrls),
    workspaceHistories: createTypedCollection<WorkspaceHistory>(
      adminDb,
      collectionPaths.workspaceHistories
    ),
  } as const;
}
