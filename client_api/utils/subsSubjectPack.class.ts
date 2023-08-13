import MAX_REALTIME_CONNECTIONS from "common/constants/maxRealtimeConnections.constant";
import {
  SubjectModels,
  SubsSubjectPackFilters,
  subsSubjectPackKeys,
} from "common/types/subscriptions.types";
import { Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

export default class SubsSubjectPack<K extends subsSubjectPackKeys> {
  constructor(
    private subsSubjectPackKey: K,
    private subscriptionTime: Date,
    private filters: SubsSubjectPackFilters[K],
    private firestoreUnsubscriptions: Unsubscribe[],
    public subject: BehaviorSubject<SubjectModels[K]>
  ) {}

  private static totalFirestoreUnsubscriptionsCount = 0;
  private static subsSubjectPacks: SubsSubjectPack<any>[] = [];

  public remove() {
    this.subject.complete();
    for (const firestoreUnsub of this.firestoreUnsubscriptions) {
      firestoreUnsub();
      SubsSubjectPack.totalFirestoreUnsubscriptionsCount--;
    }
    const index = SubsSubjectPack.subsSubjectPacks.indexOf(this);
    if (index > -1) SubsSubjectPack.subsSubjectPacks.splice(index, 1);
  }

  /**
   * When the total firestore subscriptions count is over established limit
   * it removes the oldest firestore subscriptions with the linked rxjs subject.
   */
  private static removeOldestSubsSubjectPackFromDifferentWorkspace(currentWorkspaceId: string) {
    if (SubsSubjectPack.totalFirestoreUnsubscriptionsCount <= MAX_REALTIME_CONNECTIONS) return;
    let oldestSubscriptionTime = new Date();
    let subsSubjectPackToRemove: SubsSubjectPack<any> | null = null;
    for (const subs of SubsSubjectPack.subsSubjectPacks)
      if (
        subs.filters.workspaceId &&
        subs.filters.workspaceId !== currentWorkspaceId &&
        subs.subscriptionTime < oldestSubscriptionTime
      ) {
        oldestSubscriptionTime = subs.subscriptionTime;
        subsSubjectPackToRemove = subs;
      }
    if (!subsSubjectPackToRemove) return;
    subsSubjectPackToRemove.remove();
  }

  /**
   * @param filters What filters were used to get the documents.
   */
  public static find<K extends subsSubjectPackKeys>(
    subsSubjectPackKey: K,
    filters: SubsSubjectPackFilters[K]
  ): SubsSubjectPack<K> | undefined {
    return SubsSubjectPack.subsSubjectPacks.find(
      (subs) =>
        subs.subsSubjectPackKey === subsSubjectPackKey &&
        JSON.stringify(subs.filters) === JSON.stringify(filters)
    );
  }

  public static removeAllSubsSubjectPacks() {
    for (const subsSubjectPack of SubsSubjectPack.subsSubjectPacks) {
      subsSubjectPack.subject.complete();
      for (const firestoreUnsub of subsSubjectPack.firestoreUnsubscriptions) firestoreUnsub();
    }
    SubsSubjectPack.totalFirestoreUnsubscriptionsCount = 0;
    SubsSubjectPack.subsSubjectPacks = [];
  }

  /**
   * Creates and saves new SubsSubjectPack. If a SubsSubjectPack with the provided
   * filters exists, its RxJS subject is replaced with the provided one,
   * and the provided firestore unsubscriptions are appended to the existing ones.
   */
  public static saveAndAppendSubsSubjectPack<K extends subsSubjectPackKeys>(
    subsSubjectPackKey: K,
    filters: SubsSubjectPackFilters[K],
    firestoreUnsubscriptions: Unsubscribe[],
    subject: BehaviorSubject<SubjectModels[K]>
  ) {
    const subsSubjectPack = SubsSubjectPack.find(subsSubjectPackKey, filters);
    if (subsSubjectPack) {
      subsSubjectPack.subscriptionTime = new Date();
      subsSubjectPack.firestoreUnsubscriptions.push(...firestoreUnsubscriptions);
      subsSubjectPack.subject = subject;
    } else {
      SubsSubjectPack.subsSubjectPacks.push(
        new SubsSubjectPack<K>(
          subsSubjectPackKey,
          new Date(),
          filters,
          firestoreUnsubscriptions,
          subject
        )
      );
    }
    SubsSubjectPack.totalFirestoreUnsubscriptionsCount += firestoreUnsubscriptions.length;
    if ("workspaceId" in filters)
      while (SubsSubjectPack.totalFirestoreUnsubscriptionsCount > MAX_REALTIME_CONNECTIONS)
        SubsSubjectPack.removeOldestSubsSubjectPackFromDifferentWorkspace(filters.workspaceId);
  }
}
