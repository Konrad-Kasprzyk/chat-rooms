import { Unsubscribe } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";
import MAX_REALTIME_CONNECTIONS from "../../global/constants/maxRealtimeConnections";
import {
  subscriptionFilters,
  subscriptionKeys,
  subscriptionModels,
} from "../../global/types/subscriptions";

// window.addEventListener("beforeunload", () => {
//   for (const unsubscribe of unsubscribes) {
//     unsubscribe();
//   }
// });

let totalFirestoreSubscriptionsCount = 0;
const subscriptions: Subscription<any>[] = [];
class Subscription<K extends (typeof subscriptionKeys)[number]> {
  constructor(
    public subscriptionTime: Date,
    public filters: subscriptionFilters[K],
    public firestoreSubscriptions: Unsubscribe[],
    public subject: BehaviorSubject<subscriptionModels[K] | null>
  ) {}
}

/**
 * When total firestore subscriptions count is over established limit
 * it removes oldest subscriptions with particular filters.
 */
function checkAndRemoveOldestFirestoreSubscriptions() {
  if (totalFirestoreSubscriptionsCount <= MAX_REALTIME_CONNECTIONS) return;
  let oldestSubscriptionTime = new Date();
  let subscriptionToRemove: Subscription<any> | null = null;
  for (const sub of subscriptions)
    if (sub.subscriptionTime < oldestSubscriptionTime) {
      oldestSubscriptionTime = sub.subscriptionTime;
      subscriptionToRemove = sub;
    }
  if (!subscriptionToRemove) return;
  subscriptionToRemove.subject.complete();
  for (const firestoreSub of subscriptionToRemove.firestoreSubscriptions) {
    firestoreSub();
    totalFirestoreSubscriptionsCount--;
  }
  const index = subscriptions.indexOf(subscriptionToRemove);
  subscriptions.splice(index, 1);
}

/**
 * Saves new firestore subscriptions. RxJS subject is replaced.
 * @param filters What filters were used to get the documents.
 */
export function storeSubscriptions<K extends (typeof subscriptionKeys)[number]>(
  filters: subscriptionFilters[K],
  firestoreSubscriptions: Unsubscribe[],
  subject: BehaviorSubject<subscriptionModels[K] | null>
) {
  const sub = subscriptions.find(
    (sub) =>
      sub instanceof Subscription<K> && JSON.stringify(sub.filters) === JSON.stringify(filters)
  );
  if (sub) {
    sub.subscriptionTime = new Date();
    sub.firestoreSubscriptions.push(...firestoreSubscriptions);
    sub.subject = subject;
  } else {
    subscriptions.push(new Subscription<K>(new Date(), filters, firestoreSubscriptions, subject));
  }
  totalFirestoreSubscriptionsCount += firestoreSubscriptions.length;
  while (totalFirestoreSubscriptionsCount > MAX_REALTIME_CONNECTIONS)
    checkAndRemoveOldestFirestoreSubscriptions();
}

/**
 *
 * @param filters What filters were used to get the documents.
 * @returns BehaviorSubject with all documents from firestore subscriptions.
 */
export function getSubject<K extends (typeof subscriptionKeys)[number]>(
  filters: subscriptionFilters[K]
): BehaviorSubject<subscriptionModels[K] | null> | null {
  const sub = subscriptions.find(
    (sub) =>
      sub instanceof Subscription<K> && JSON.stringify(sub.filters) === JSON.stringify(filters)
  );
  if (sub) return sub.subject;
  else return null;
}
