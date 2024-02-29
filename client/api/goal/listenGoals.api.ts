import Goal from "common/clientModels/goal.model";
import { Observable } from "rxjs";

export default function listenGoals(): Observable<Goal[]> {
  return new Observable<Goal[]>();
}
